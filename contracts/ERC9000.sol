pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import {IERC9000} from "interfaces/IERC9000.sol";


abstract contract ERC9000 is IERC9000, Ownable {
    string _contractURI;
    bool _contractURILocked = false;

    constructor(string memory newURI) {
        setContractURI(newURI);
    }

    function contractURI() external view returns (string memory) {
        return _contractURI;
    }

    function setContractURI(string memory newURI) public onlyOwner {
        require (!_contractURILocked, "Contract URI is locked");
        _contractURI = newURI;
        emit ContractURIUpdated();
    }

    function lockContractURI() public onlyOwner {
        _contractURILocked = true;
        emit ContractURILocked();
    }

    function isContractURILocked() external view returns (bool) {
        return _contractURILocked;
    }
}
