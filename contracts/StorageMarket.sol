pragma solidity 0.5.11;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./sablier/Sablier.sol";

contract StorageMarketPlace is Sablier {
    using SafeMath for uint256;

    event Buy(uint256 indexed fileId, address indexed buyer);
    event Sell(uint256 indexed fileId, address indexed seller);
    event SubscriptionInfoUpdated(
        address indexed seller,
        bool indexed isEnabled
    );
    event SubscriptionCreated(
        address indexed buyer,
        address indexed seller,
        uint256 indexed streamId
    );
    event SubscriptionWithdrawal(
        address indexed seller,
        uint256 indexed streamId,
        uint256 amount
    );
    event SubscriptionCancelled(
        address indexed buyer,
        address indexed seller,
        uint256 indexed streamId
    );

    // Struct for recording File metadata
    struct File {
        address seller;
        address paymentAsset;
        string metadataHash; // unique metadataHash
        uint256 price;
        mapping(address => bool) buyers;
    }

    // Struct to record the subscription price for each user
    struct SubscriptionInfo {
        bool isEnabled;
        uint256 minDurationInDays;
        uint256 amountPerDay;
        address tokenAddress;
        mapping(address => uint256) streams;
    }

    // Tracking the files with file id
    mapping(uint256 => File) public Files;

    // Tracking the subscriptions amounts for a particular seller
    mapping(address => SubscriptionInfo) public subscriptions;

    uint256 public priceLimit;
    uint256 public fileCount;

    modifier isValidPrice(uint256 _price) {
        require(_price < priceLimit, "Price must be less than priceLimit");
        _;
    }

    modifier isValidBuy(uint256 _fileId) {
        File storage file = Files[_fileId];
        require(msg.sender != file.seller, "Seller cannot buy their own file");
        require(
            file.buyers[msg.sender] == false,
            "Buyer cannot buy file again"
        );
        _;
    }

    constructor(uint256 _priceLimit) public Sablier(msg.sender) {
        require(_priceLimit > 0, "Price Limit cannot be 0");
        priceLimit = _priceLimit;
    }

    /**
     * @dev Makes a file available for selling
     * @param _paymentAsset - asset to be used for payment (currently DAI)
     * @param _price - price of the Files
     * @param _metadataHash - ipfs hash of the file metadata
     */
    function sell(
        address _paymentAsset,
        uint256 _price,
        string calldata _metadataHash
    ) external isValidPrice(_price) returns (uint256) {
        Files[fileCount] = File(
            msg.sender,
            _paymentAsset,
            _metadataHash,
            _price
        );
        uint256 currentFile = fileCount;
        fileCount++;
        emit Sell(currentFile, msg.sender);
        return currentFile;
    }

    /**
     * @dev Payment Function through which user pays the payment for the particular file and get's provate access to the exclusive content
     * @param _fileId - file Id of the particular File
     */
    function buy(uint256 _fileId) external isValidBuy(_fileId) returns (bool) {
        File storage file = Files[_fileId];
        require(msg.sender != file.seller, "Seller cannot buy his own file");
        IERC20(file.paymentAsset).transferFrom(
            msg.sender,
            file.seller,
            file.price
        );
        file.buyers[msg.sender] = true;
        emit Buy(_fileId, msg.sender);
    }

    function updateSubscriptionInfo(
        uint256 _amountPerDay,
        uint256 _minDurationInDays,
        address _tokenAddress
    ) external {
        require(
            _amountPerDay > 1 days,
            "amount value cannot be less than value of 1 day"
        );
        require(_minDurationInDays >= 1, "minDuration should be atleast 1 day");
        SubscriptionInfo storage subscription = subscriptions[msg.sender];
        subscription.isEnabled = true;
        subscription.minDurationInDays = _minDurationInDays;
        subscription.amountPerDay = _amountPerDay;
        subscription.tokenAddress = _tokenAddress;
        emit SubscriptionInfoUpdated(msg.sender, true);
    }

    function disableSubscriptionInfo() external {
        SubscriptionInfo storage subscription = subscriptions[msg.sender];
        subscription.isEnabled = false;
        emit SubscriptionInfoUpdated(msg.sender, false);
    }

    /**
     * @dev Creates a Subscription for future content for that particular seller during a specific duration
     * @param _deposit - Subscription amount
     * @param _token - payment asset address
     * @param _numDays - number of days of subscription
     * @param _seller - seller address whose subscription is being brought
     */
    function createSubscription(
        uint256 _deposit,
        address _token,
        uint256 _numDays,
        address _seller
    ) external {
        SubscriptionInfo storage subscription = subscriptions[_seller];
        uint256 _oldStreamId = subscription.streams[msg.sender];
        require(subscription.isEnabled, "Seller has not enabled subscriptions");
        require(!isValid(_oldStreamId), "Buyer already holders a subscription");
        require(
            _deposit == _numDays.mul(subscription.amountPerDay),
            "Deposit amount incorrect"
        );
        uint256 _startTime = block.timestamp;
        uint256 _stopTime = _startTime.add(_numDays.mul(1 days));
        uint256 _streamId = createStream(
            _seller,
            _deposit,
            _token,
            _startTime,
            _stopTime
        );
        subscription.streams[msg.sender] = _streamId;
        emit SubscriptionCreated(msg.sender, _seller, _streamId);
    }

    function withdrawFromSubscription(uint256 _streamId, uint256 _amount)
        external
    {
        require(isValid(_streamId), "Invalid Subscription");
        withdrawFromStream(_streamId, _amount);
        emit SubscriptionWithdrawal(msg.sender, _streamId, _amount);
    }

    function cancelSubscription(address _seller) external {
        SubscriptionInfo storage subscription = subscriptions[_seller];
        uint256 _streamId = subscription.streams[msg.sender];
        require(isValid(_streamId), "Buyer doesn't hold a valid subscription");
        cancelStream(_streamId);
        emit SubscriptionCancelled(msg.sender, _seller, _streamId);
    }

    function isBuyer(uint256 _fileId, address buyer)
        public
        view
        returns (bool)
    {
        File storage file = Files[_fileId];
        return file.buyers[buyer];
    }

    function isSubscriber(address _seller, address _buyer)
        public
        view
        returns (bool)
    {
        SubscriptionInfo storage subscription = subscriptions[_seller];
        return isValid(subscription.streams[_buyer]);
    }
}
