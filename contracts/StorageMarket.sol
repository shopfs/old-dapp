pragma solidity 0.5.11;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./sablier/Sablier.sol";

contract StorageMarketPlace is Sablier {
    using SafeMath for uint256;

    event Buy(uint256 indexed fileId, address indexed buyer);
    event Sell(uint256 indexed fileId, address indexed seller);

    // Struct for recording File metadata
    struct File {
        address seller;
        address paymentAsset;
        string metadataHash; // unique metadataHash
        uint256 price;
        uint256 numRetrievals;
        mapping(address => bool) buyers;
    }

    // Struct to record the no of of subscriptions the user is involved in   
    struct StreamInfo {
        bool status;
        // extra field cannot keep just an array in struct get this error TypeError: Internal or recursive type is not allowed for public state variables.
        uint[]  subscribed;
        uint[]  mySubscriptions;
    }
    
    // Tracking the files with file id
    mapping(uint256 => File) public Files;

    // Tracking the subscriptions for a particular user
    mapping(address => StreamInfo) public subscriptions;

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
            _price,
            0
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
        file.numRetrievals++;
        file.buyers[msg.sender] = true;
        emit Buy(_fileId, msg.sender);
    }

   /**
   * @dev Creates a Subscription for future content for that particular seller during a specific duration
   * @param _deposit - Subscription amount
   * @param _token - payment asset address
   * @param _startTime - epoch start time of the duration
   * @param _stopTime - epoch end time of the duration
   * @param reciever - seller address whose subscription is being brought
   */
    function createSubscription(
        uint256 _deposit,
        address _token,
        uint256 _startTime,
        uint256 _stopTime,
        address reciever
    ) external {
        require(reciever != address(0x00), "cannot stream to the zero address");
        require(
            reciever != address(this),
            "cannot stream to the contract itself"
        );
        require(reciever != msg.sender, "cannot stream to yourself");
        require(_deposit > 0, "deposit is zero");
        require(
            _startTime > block.timestamp,
            "start time should be after block.timestamp"
        );
        require(_stopTime > _startTime, "start time has to be before stoptime");
        uint256 delta = _stopTime.sub(_startTime);
        require(
            _deposit > delta,
            "Deposit should be more than delta as specified by EIP-1620"
        );
        // THE Official implementation of the eip-1620 specifies that the deposit shopuld be a multiple of the delta just for the payament rate, the difference is negligible to be calculated efficiently specified in eip-1620 docs
        // Check EIP-1620 for more details
        uint256 remainder = _deposit.mod(delta);
        uint256 actualDepositAmount = _deposit.sub(remainder);
        uint256 streamId = createStream(
            reciever,
            actualDepositAmount,
            _token,
            _startTime,
            _stopTime
        );
        
        subscriptions[msg.sender].subscribed.push(streamId);
        subscriptions[reciever].mySubscriptions.push(streamId);
    }

   /**
   * @dev Check if the particular address is the buyer of that file
   * @param _fileId - file id
   * @param buyer - buyer address
   */
    function isBuyer(uint256 _fileId, address buyer)
        public
        view
        returns (bool)
    {
        File storage file = Files[_fileId];
        return file.buyers[buyer];
    }

    // function isSubscriber(address seller) public view returns (bool) {
    //         BuyerSubscription[] storage buyerSubscriptions
    //      = sellerToBuyer[seller];
    // }

}
