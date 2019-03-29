pragma solidity 0.4.15;

contract Keyterpillar {
    
    /**
    * Modifiers
    **/
    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }
    modifier costs(uint price) {
        require(msg.value == price);
        _;
    }
    
    /**
    * Models
    **/
    struct Type {
        uint id;
        string name;
    }
    struct DataItem {
        uint keyType;
        string key;
    }
    
    /**
    * Storage
    **/
    address private owner;
    uint public keyTypeCount = 0;
    uint public keyCount = 0;
    uint private addKeyCost = 1000000000000000000;
    uint private addKeyTypeCost = 1000000000000000000;
    mapping(string=>DataItem[]) private UserData;
    mapping(uint=>Type) private KeyTypes;
    
    /**
    * Public contract methods (setters)
    **/
    function Keyterpillar() public payable{
        owner = msg.sender;
        
        addKeyType("AION");
        addKeyType("BTC");
        addKeyType("ETH");
    }
    function withdraw() public isOwner {
        owner.transfer(this.balance);
    }
    function addKeyType(string keyName) public payable costs(addKeyTypeCost) {
        KeyTypes[keyTypeCount]=Type(keyTypeCount, keyName);
        keyTypeCount++;
    }
    function addKey(string userName, string key, uint keyType) public payable costs(addKeyCost) {
        UserData[userName].push(DataItem(keyType, key));
        keyCount++;
    }
    function setFees(uint addKeyFee, uint addKeyTypeFee) public isOwner() {
        addKeyCost = addKeyFee;
        addKeyTypeCost = addKeyTypeFee;
    }
    
    /**
    * Public contract methods (getters)
    **/
    
    function getKeyIndexes(string userName) public constant returns(uint[]) {
        DataItem[] memory data = UserData[userName];
        
        uint[] memory outData = new uint[](data.length);
        for(uint j=0; j<data.length; j++) {
            outData[j] = j;
        }
        return outData;
    }
    
    function getKeyIndexesWithType(string userName, uint keyType) public constant returns(uint[]) {
        DataItem[] memory data = UserData[userName];
        uint count = 0;
        for(uint i=0; i<data.length; i++) {
            if(data[i].keyType == keyType) {
                count++;
            }
        }
        uint[] memory outData = new uint[](keyCount);
        for(uint j=0; j<data.length; j++) {
            if(data[j].keyType == keyType) {
                outData[j] = j;
            }
        }
        return outData;
    }
    
    function getKey(string userName, uint keyIndex) public constant returns(string, string) {
        DataItem[] memory data = UserData[userName];
        return (data[keyIndex].key, getKeyTypeName(data[keyIndex].keyType));
    }
    
    function getKeyTypeName(uint keyType) public constant returns(string) {
        return KeyTypes[keyType].name;
    }
}