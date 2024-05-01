#!/bin/bash

IPFS_KHASH=k51qzi5uqu5dkpi2yyfjw5zik5mi5t1dbqvy7w8876knslf2jyjbgs43z1h7o0

function prefetch() {
    echo "Prefetching $1"
    curl -v -o /dev/null $1
}

prefetch https://ipfs.io/ipns/${IPFS_KHASH}/
prefetch https://${IPFS_KHASH}.ipns.dweb.link/
prefetch https://${IPFS_KHASH}.ipfs2.eth.limo/
sleep 5

prefetch https://ipfs.io/ipns/dappviewer.eth/
prefetch https://dappviewer-eth.ipns.dweb.link/
prefetch https://dappviewer.eth.limo/
sleep 5

prefetch https://ipfs.io/ipns/dappviewer.eth/dappz.bin
prefetch https://dappviewer-eth.ipns.dweb.link/dappz.bin
prefetch https://dappviewer.eth.limo/dappz.bin
sleep 5

prefetch https://ipfs.io/ipns/dappviewer.eth/tiny
prefetch https://dappviewer-eth.ipns.dweb.link/tiny
prefetch https://dappviewer.eth.limo/tiny
sleep 5
