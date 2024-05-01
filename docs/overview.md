# ERC-9000

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

