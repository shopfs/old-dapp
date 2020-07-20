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
   
    modifier isUploaded(string memory _hash) {
        require(!hashExists[_hash], "Cannot upload existing file");
        _;
    }
   

    struct File {
        address seller;
        address paymentAsset;
        string fileHash; // unique fileHash
        string metadataHash; // unique metadataHash
        uint price;
        uint numRetriveals;
    }
    
    mapping(uint => File) public Files;
    mapping(string => bool) public hashExists;

    // for tracking buyer and the files he brought
    mapping(address => uint[]) public buyerInfo;

    uint public priceLimit;
    uint public fileCount;


    constructor(uint _priceLimit) public {
        priceLimit = _priceLimit;
    }
   
    function sell(address _paymentAsset, uint _price, string calldata _fileHash, string calldata _metadataHash) isUploaded(_fileHash) external returns(bool) {
        require(_price < priceLimit, "Price has to be less than a set price limit");
        Files[fileCount] = File(msg.sender, _paymentAsset, _fileHash, _metadataHash, _price, 0);
        hashExists[_fileHash] = true;
        fileCount ++;
        return true;
    }
   
    function buy(uint _id) external returns(bool) {
        File storage file = Files[_id];
        IERC20(file.paymentAsset).transferFrom(msg.sender, file.seller, file.price);
        file.numRetriveals ++;
        uint[] storage buyerIds = buyerInfo[msg.sender];
        // checking if the particular buyer exists or not
        if (buyerIds.length > 0) {
            buyerIds.push(_id);
        } else {
            // Initializing the the mapping with first id if buyer is buying 1st time
            buyerInfo[msg.sender] = [_id];
        }
        return true;
    }
   
   
}
