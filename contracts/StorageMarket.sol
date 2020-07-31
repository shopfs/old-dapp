pragma solidity 0.5.11;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./sablier/Sablier.sol";

contract StorageMarketPlace is Sablier {
    using SafeMath for uint256;

    event Buy(uint256 indexed fileId, address indexed buyer);
    event Sell(uint256 indexed fileId, address indexed seller);

    struct File {
        address seller;
        address paymentAsset;
        string metadataHash; // unique metadataHash
        uint256 price;
        uint256 numRetrievals;
        mapping(address => bool) buyers;
    }

    struct BuyerSubscription {
        address buyer;
        uint256 amount;
        uint256 streamId;
        bool isActive;
    }

    struct SellerSubscription {
        address seller;
        uint256 amount;
        uint256 streamId;
        bool isActive;
    }

    mapping(uint256 => File) public Files;

    // to track the subscriptions for a seller
    mapping(address => BuyerSubscription[]) public sellerToBuyer;

    // to track the subscriptions for a buyer
    mapping(address => SellerSubscription[]) public buyerToSeller;


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
        // Once stream is created update both mappings so that the subscription can be tracked easily from both sides


            BuyerSubscription[] storage buyerSubscriptions
         = sellerToBuyer[reciever];
        buyerSubscriptions.push(
            BuyerSubscription(msg.sender, _deposit, streamId, true)
        );
        SellerSubscription[] storage sellerSubscriptions = buyerToSeller[msg
            .sender];
        sellerSubscriptions.push(
            SellerSubscription(reciever, _deposit, streamId, true)
        );
    }

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

    function withdraw(
        uint256 _streamId,
        address buyer,
        uint256 _amount
    ) public {
        require(_amount > 0, "Cannot pass 0 as amount");
        (, , , , , uint256 stopTime, , ) = getStream(_streamId);
        // get stop time of the stream if stop time is <= now then stream has ended so mark false in is active to filter on ui and transfer the amount requested by seller if stream still active then onlt trnsfer
        if (stopTime >= now) {
            BuyerSubscription[] storage buyerSubscriptions = sellerToBuyer[msg
                .sender];


                SellerSubscription[] storage sellerSubscriptions
             = buyerToSeller[buyer];
            for (uint256 i = 0; i < buyerSubscriptions.length; i++) {
                if (buyerSubscriptions[i].buyer == buyer) {
                    buyerSubscriptions[i].isActive = false;
                }
            }
            for (uint256 i = 0; i < sellerSubscriptions.length; i++) {
                if (sellerSubscriptions[i].seller == msg.sender) {
                    sellerSubscriptions[i].isActive = false;
                }
            }
        }
        withdrawFromStream(_streamId, _amount);
    }

    function cancelSubscription(uint256 _streamId, address seller) public {
        // first making the isActive property false in order to filter on UI
        BuyerSubscription[] storage buyerSubscriptions = sellerToBuyer[seller];
        SellerSubscription[] storage sellerSubscriptions = buyerToSeller[msg
            .sender];
        for (uint256 i = 0; i < buyerSubscriptions.length; i++) {
            if (buyerSubscriptions[i].buyer == msg.sender) {
                buyerSubscriptions[i].isActive = false;
            }
        }
        for (uint256 i = 0; i < sellerSubscriptions.length; i++) {
            if (sellerSubscriptions[i].seller == seller) {
                sellerSubscriptions[i].isActive = false;
            }
        }
        cancelStream(_streamId);
    }
}
