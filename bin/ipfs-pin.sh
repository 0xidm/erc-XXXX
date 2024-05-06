#!/bin/bash

ENS=dappviewer.eth
IPNS_KHASH=k51qzi5uqu5dkpi2yyfjw5zik5mi5t1dbqvy7w8876knslf2jyjbgs43z1h7o0
PIN_CMD="echo starting..."

function append_resolve() {
    PIN_CMD="${PIN_CMD}; ipfs name resolve --nocache $1"
}

function append_pin() {
    PIN_CMD="${PIN_CMD}; ipfs pin add $1"
}

function ipfs_pin() {
    ssh -t "$1" "docker exec -it ipfs /bin/sh -c '${PIN_CMD}'"
}

append_resolve /ipns/${IPNS_KHASH}
append_resolve /ipns/${ENS}

append_pin /ipns/${IPNS_KHASH}
append_pin /ipns/${IPNS_KHASH}/index.html
append_pin /ipns/${IPNS_KHASH}/tiny
append_pin /ipns/${IPNS_KHASH}/dappz.bin

ipfs_pin $1
