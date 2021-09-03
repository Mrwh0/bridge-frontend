pragma solidity 0.6.12;

abstract contract IHomeErc20ToNativeBridge {
    function numMessagesSigned(bytes32 _message) public view virtual returns (uint256);
    function isAlreadyProcessed(uint256 _number) public pure virtual returns (bool);
    function message(bytes32 _hash) external view virtual returns (bytes memory);
    function signature(bytes32 _hash, uint256 _index) external view virtual returns (bytes memory);
}

contract Helper {
    function unpackSignature(bytes memory _signature) internal pure returns (bytes32, bytes32, bytes1)
    {
        require(_signature.length == 65);
        bytes32 r;
        bytes32 s;
        bytes1 v;

        assembly {
            r := mload(add(_signature, 0x20))
            s := mload(add(_signature, 0x40))
            v := mload(add(_signature, 0x60))
        }
        return (r, s, v);
    }
}

contract Erc20ToNativeBridgeHelper is Helper {
    address payable owner;
    IHomeErc20ToNativeBridge public bridge;
    address foreignBridge;
    
    constructor (address _homeBridge, address _foreignBridge) public {
        owner = msg.sender;
        bridge = IHomeErc20ToNativeBridge(_homeBridge);
        foreignBridge = _foreignBridge;
    }
    
    function getMessage(bytes32 _msgHash) public view returns(bytes memory result) {
        result = bridge.message(_msgHash);
    }

    function getMessageHash(address _recipient, uint256 _value, bytes32 _origTxHash) public view returns(bytes32) {
        bytes32 result = keccak256(abi.encodePacked(_recipient, _value, _origTxHash, foreignBridge));
        return result;
    }
    
    function getSignatures(bytes32 _msgHash) public view returns(bytes memory) {
        uint256 signed = bridge.numMessagesSigned(_msgHash);

        require(bridge.isAlreadyProcessed(signed), "message hasn't been confirmed");
        
        // recover number of confirmations sent by oracles
        signed = signed & 0x8fffffffffffffffffffffffffffffffffffffffffff;
        
        // !!!WARNING!!!
        // This particular helper works only with 1 signature collected on the Home bridge
        // If the configuration of the bridge is changed, another helper must be prepared
        require(signed == 1, "1 confirmations expected");
        
        bytes32 r0;
        bytes32 s0;
        bytes1 v0;
        
        bytes memory sig = bridge.signature(_msgHash, 0);
        (r0, s0, v0) = unpackSignature(sig);
               
        return(abi.encodePacked(uint8(1), v0, r0, s0));
    }

    function clean() external {
        require(msg.sender == owner, "not an owner");
        selfdestruct(owner);
    }
}
