---
title: UI/UX Pattern for Decentralized Apps
description: A pattern for contracts to provide their own DApp and launch it from decentralized storage
author: idm (@0xidm)
discussions-to: <URL>
status: Draft
type: Standards Track
category: ERC
created: 2024-04-27
requires: 7572 20
---

## Abstract

For an application to be decentralized, its operation cannot depend upon centralized infrastructure like DNS, SSL, and IP addresses.
This EIP presents an ergonomic UI/UX for launching fully-decentralized DApps described by the contracts, themselves.
This EIP provides a Solidity interface and a web3 pattern for building decentralized applications without legacy internet layers.
A reference "viewer" capable of launching decentralized applications, currently available from `dappviewer.eth`, is described.

## Motivation

Decentralized applications are fragile due to different interpretations of several fundamental web3 concepts across the ecosystem.
If we examine web3-enabled browsers, we find inconsistent handling of URI schemas, various proxy strategies for distributed filesystems, and security requirements like CORS and strict-HTTPS causing UI/UX friction.
By demonstrating a Minimum Viable Platform for decentralized applications, we hope to generate commentary towards a reasonable web3 implementation of these ideas.
This EIP seeks alignment between web3 components so DApps can be launched in a predictable manner.

## Specification

<!--
  The Specification section should describe the syntax and semantics of any new feature. The specification should be detailed enough to allow competing, interoperable implementations for any of the current Ethereum platforms (besu, erigon, ethereumjs, go-ethereum, nethermind, or others).

  It is recommended to follow RFC 2119 and RFC 8170. Do not remove the key word definitions if RFC 2119 and RFC 8170 are followed.

  TODO: Remove this comment before submitting
-->

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

## Rationale

<!--
  The rationale fleshes out the specification by describing what motivated the design and why particular design decisions were made. It should describe alternate designs that were considered and related work, e.g. how the feature is supported in other languages.

  The current placeholder is acceptable for a draft.

  TODO: Remove this comment before submitting
-->

TBD

## Reference Implementation

<!--
  This section is optional.

  The Reference Implementation section should include a minimal implementation that assists in understanding or implementing this specification. It should not include project build files. The reference implementation is not a replacement for the Specification section, and the proposal should still be understandable without it.
  If the reference implementation is too large to reasonably be included inline, then consider adding it as one or more files in `../assets/eip-####/`. External links will not be allowed.

  TODO: Remove this comment before submitting
-->

### Example launcher

A minimum viable DApp launcher is being developed at the following location:

[ipns://dappviewer.eth](ipns://dappviewer.eth)

The launcher and all other code is available from https://github.com/0xidm/erc-XXXX

### Interface

```solidity
pragma solidity ^0.8.20;

import {IERC7572} from "./IERC7572.sol";

interface IERC9000 is IERC7572 {
    function setContractURI(string memory) external;
    function lockContractURI() external;
    function isContractURILocked() external view returns (bool);

    event ContractURILocked();
}
```

### Contract

```solidity
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
```

## Security Considerations

A substantial web browser security framework has been built upon hostnames, including the treatment of cookies, SSL certificates, HTTP authentication information, cross-site scripting, and more.
Web3 wallets commonly use hostnames as the basis for "connecting" with a DApp hosted via web2 infrastructure.
When a "launcher" such as `dappviewer.eth` is used to bootstrap a Decentralized Application, hostnames can no longer be used to provide many browser security guarantees.
New vectors and security threats become possible when different DApp authors obtain access to overlapping browser storage and execution due to shared hostnames.

## Copyright

Copyright and related rights waived via [CC0](../LICENSE.md).
