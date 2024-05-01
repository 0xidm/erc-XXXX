#!/bin/bash

function ipfs_pin() {
    ssh -t "$1" "docker exec -it ipfs /bin/sh -c 'ipfs name resolve --nocache /ipns/k51qzi5uqu5dkpi2yyfjw5zik5mi5t1dbqvy7w8876knslf2jyjbgs43z1h7o0; ipfs name resolve --nocache /ipns/dappviewer.eth; ipfs pin add /ipns/dappviewer.eth; ipfs pin add /ipns/dappviewer.eth/index.html; ipfs pin add /ipns/dappviewer.eth/tiny; ipfs pin add /ipns/dappviewer.eth/dappz.bin'"
}

ipfs_pin $1
ipfs_pin $2
ipfs_pin $3
