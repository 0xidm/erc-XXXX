# erc9000 research

ipns://dappviewer.eth/#0x012345...@11155111

That will obtain the URI using the following contract call, then "launch it":

ethereum:0x012345...@11155111/contractURI

## Motivation

- the main motivation is to launch a contract and corresponding dapp without requiring publibly-routed IP, DNS, HTTP, or ENS - i.e. using just IPFS and an Ethereum RPC, both of which could be local.
- I am describing a way to bundle a dApp so it can be executed with this simple WEB3/HTML/JS bootloader.
- this might be a new file format - `dappz` - proposed as part of the spec.
- The .dappz should contain a valid html document that has been gzipped. currently it's just the body  but debug.html actually has it all
- there is some method, ideally extending existing ERC work, for calling and obtaining the URI of the .dappz
- erc-7572 is a good lead: contractURI() returns name=blah ... but could also provide dappz_link
- This EIP proposes a spec for the `.dappz` format, which is a self-contained HTML+CSS+JS+everything else that provides the contract UI without external dependencies ... unless you mess it up
- if the .dappz matches the spec, then it can be loaded using the reference HTML+JS provided in this EIP
- a compatible `.dappz` can be bootstrapped with HTML+JS via IPFS, IPFS+ENS, or an HTTP gateway; IPFS hash and public utility via ENS are provided.
- a compatible bootloader just has to meet a spec: obtain a web3 library, issue a contractURI() call to the specified contract, fetch the .dappz, inject it into the DOM, and invoke the entrypoint().
- the URI can become immutable by setting a flag; it should also be pausable as a kill-switch
- try to use web3-eth or ethereumjs-tx or something stand-alone (https://github.com/web3/web3.js/blob/4.x/packages/web3-eth/src/index.ts)
- consider embedding ipfs; https://github.com/silentcicero/ipfs-mini

## Review existing EIPs

### [ERC-67: URI Scheme with Metadata, Value and Bytecode](https://eips.ethereum.org/EIPS/eip-67)

> Format for encoding transactions into a URI

### [ERC-165: Standard Interface Detection](https://eips.ethereum.org/EIPS/eip-165)

> Creates a standard method to publish and detect what interfaces a smart contract implements.

Perhaps supporting ERC-165 will enable ERC9000 contracts to make it obvious they have a dApp URI.

### [ERC-634: Storage of text records in ENS](https://eips.ethereum.org/EIPS/eip-634)

> This EIP defines a resolver profile for ENS that permits the lookup of arbitrary key-value text data. This allows ENS name holders to associate e-mail addresses, URLs and other informational data with a ENS name.

Is it possible for a contract to take care of its metadata like this? It requires using ENS - so maybe not.

### [ERC-721: Non-Fungible Token Standard](https://eips.ethereum.org/EIPS/eip-721)

> A standard interface for non-fungible tokens, also known as deeds.

### [ERC-831: URI Format for Ethereum](https://eips.ethereum.org/EIPS/eip-831)

> A way of creating Ethereum URIs for various use-cases.

### [ERC-1129: Standardised DAPP announcements](https://eips.ethereum.org/EIPS/eip-1129)

> Standardisation of announcements in DAPPs and services on Ethereum network. This ERC provides proposed mechanics to increase the quality of service provided by DAPP developers and service providers, by setting a framework for announcements. Be it transitioning to a new smart contract or just freezing the service for some reason.

This might be a useful way to indicate when the URI is updated.

### [ERC-4804: ERC-4804: Web3 URL to EVM Call Message Translation](https://eips.ethereum.org/EIPS/eip-4804)

> A translation of an HTTP-style Web3 URL to an EVM call message

This is a URI scheme that maps onto address/name and method call. The semantics or syntax could be reusable.

### [ERC-5094: URL Format for Ethereum Network Switching](https://eips.ethereum.org/EIPS/eip-5094)

> This standard includes all needed information for adding a network to a wallet via URL, by including parameters such as chainId, rpc_url, chain_name and others, such that the network configuration is provided through the URL itself.

Since contracts will be native to different chains, this might be useful for specifying that in the URL.

### [ERC-6785: ERC-721 Utilities Information Extension](https://eips.ethereum.org/EIPS/eip-6785)

> This specification defines standard functions and an extension of the metadata schema that outlines what a token’s utility entails and how the utility may be used and/or accessed. This specification is an optional extension of ERC-721.

A dApp might be a utility - and perhaps this is a standard way of letting people know about that utility.

### [ERC-6821: Support ENS Name for Web3 URL](https://eips.ethereum.org/EIPS/eip-6821)

> This standard defines the mapping from an Ethereum name service (ENS) name to an Ethereum address for ERC-4804.
>
> ERC-4804 defines a web3://-scheme RFC 2396 URI to call a smart contract either by its address or a name from name service. If a name is specified, the standard specifies a way to resolve the contract address from the name.

I am making a single call to a contract to get its dApp URI - and it's possible this is the way to represent that as a URL.

### [ERC-6860: Web3 URL to EVM Call Message Translation](https://eips.ethereum.org/EIPS/eip-6860)

> This standard translates an RFC 3986 URI like web3://uniswap.eth/ to an EVM message such as:

```solidity
EVMMessage {
   To: 0xaabbccddee.... // where uniswap.eth's address registered at ENS
   Calldata: 0x
   ...
}
```

As with 6821, perhaps this is a standard way to represent the call for dappURI().

### [ERC-7572: Contract-level metadata via `contractURI()`](https://eips.ethereum.org/EIPS/eip-7572)

> This specification standardizes contractURI() to return contract-level metadata. This is useful for dapps and offchain indexers to show rich information about a contract, such as its name, description and image, without specifying it manually or individually for each dapp.

This might provide a standard interface I could use to provide the dApp url.

### [ERC-7087: MIME type for Web3 URL in Auto Mode](https://eips.ethereum.org/EIPS/eip-7087)

> This standard extends the ERC-6860 web3:// standard: in smart contracts not designed for web3:// (thus using auto mode), the MIME type of the returned data is either implicit (not advertised by the smart contract) or included within the returned data (RFC 2397 data URLs). This standard defines additional query parameters so that a MIME type can be returned when fetching a web3:// URL in these scenarios.

This might be a standard interface for encoding some of the base functionality I'm after, here.

## Digging into eip-7572

https://eips.ethereum.org/EIPS/eip-7572

```solidity
interface IERC7572 {
  function contractURI() external view returns (string memory);

  event ContractURIUpdated();
}

contract MyCollectible is ERC721, IERCXXXX {
    string _contractURI = "ipfs://QmTNgv3jx2HHfBjQX9RnKtxj2xv2xQDtbVXoRi5rJ3a46e"
    // or e.g. "https://external-link-url.com/my-contract-metadata.json";

    function contractURI() external view returns (string memory) {
        return _contractURI;
        // or e.g. for onchain:
        string memory json = '{"name": "Creatures","description":"..."}';
        return string.concat("data:application/json;utf8,", json);
    }

    /// @dev Suggested setter, not explicitly specified as part of this ERC
    function setContractURI(string memory newURI) external onlyOwner {
        _contractURI = newURI;
        emit ContractURIUpdated();
    }
}
```

## Objectives

- the main motivation is to launch a contract and corresponding dapp without requiring publibly-routed IP, DNS, HTTP, or ENS - i.e. using just IPFS and an Ethereum RPC, both of which could be local.
- I am describing a way to bundle a dApp so it can be executed with this simple WEB3/HTML/JS bootloader.
- This EIP proposes a spec for the `.dappz` format, which is a self-contained HTML+CSS+JS+everything else that provides the contract UI without external dependencies ...
- if the .dappz matches the spec, then it can be loaded using the reference HTML+JS provided in this EIP
- a compatible bootloader just has to meet a spec: obtain a web3 library, issue a contractURI() call to the specified contract, fetch the .dappz, inject it into the DOM, and invoke the entrypoint().
- the URI can become immutable by setting a flag; it should also be pausable as a kill-switch

## Components

### Contract interface

### .dappz file format

### Decentralized .dappz viewer

#### Reference implementation: `dappviewer.eth`

## ENS, IPNS, and IPFS

## Previous work

### ERC-681: URL Format for Transaction Requests

This ERC specifies a syntax for URIs built upon the `ethereum:` schema.
ERC-681 syntax allows an address and chain to be specified in a standard manner.

### ERC-831: URI Format for Ethereum

> A way of creating Ethereum URIs for various use-cases.

A URI like `eth:dappz-0xABC00@11155111` could be unpacked in a specific manner...  It could use a single p.  I don't know.

The `eth:dappz-` part can be transparently replaced with `ipns://dappviewer.eth/#` and it would work.

### ERC-7572: Contract-level metadata via `contractURI()`

