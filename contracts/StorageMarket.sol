pragma solidity ^0.6.0;


/**
 * @title ERC20 interface
 * @dev see https://eips.ethereum.org/EIPS/eip-20
 */
interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);

    function approve(address spender, uint256 value) external returns (bool);

    function transferFrom(address from, address to, uint256 value) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address who) external view returns (uint256);

    function allowance(address owner, address spender) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract StorageMarketPlace {

    struct File {
        address seller;
        address paymentAsset;
        string metadataHash; // unique metadataHash
        uint price;
        uint numRetrievals;
        mapping(address => bool) buyers;
    }
    
    mapping(uint => File) public Files;
    mapping(string => bool) public hashExists;

    uint public priceLimit;
    uint public fileCount;

    event Buy(uint indexed fileId, address indexed buyer);
    event Sell(uint indexed fileId, address indexed seller);

    modifier isNewFile(string memory _hash) {
        require(!hashExists[_hash], "Cannot upload existing file");
        _;
    }

    modifier isValidPrice(uint _price) {
        require(_price < priceLimit, "Price must be less than priceLimit");
        _;
    }

    modifier isValidBuy(uint _fileId) {
        File storage file = Files[_fileId];
        require(msg.sender != file.seller, "Seller cannot buy their own file");
        require(file.buyers[msg.sender] == false, "Buyer cannot buy file again");
        _;
    }

    constructor(uint _priceLimit) public {
        require(_priceLimit > 0, "Price Limit cannot be 0");
        priceLimit = _priceLimit;
    }
   
    function sell(address _paymentAsset, uint _price, string calldata _metadataHash) isNewFile(_metadataHash) isValidPrice(_price) external returns(uint) {
        Files[fileCount] = File(msg.sender, _paymentAsset, _metadataHash, _price, 0);
        uint currentFile = fileCount;
        hashExists[_metadataHash] = true;
        fileCount ++;
        emit Sell(currentFile, msg.sender);
        return currentFile;
    }

    function buy(uint _fileId) isValidBuy(_fileId) external returns(bool) {
        File storage file = Files[_fileId];

        IERC20(file.paymentAsset).transferFrom(msg.sender, file.seller, file.price);
        file.numRetrievals ++;
        file.buyers[msg.sender] = true;
        emit Buy(_fileId, msg.sender);
        return true;
    }

    function isBuyer(uint _fileId, address buyer) public view returns (bool) {
        File storage file = Files[_fileId];
        return file.buyers[buyer];
    }
}
