pragma solidity ^0.8.20;

import {IERC7572} from "./IERC7572.sol";


interface IERC9000 is IERC7572 {
    function setContractURI(string memory) external;
    function lockContractURI() external;
    function isContractURILocked() external view returns (bool);

    event ContractURILocked();
}
