# IPFS

## Create IPNS key for publishing

```bash
export IPFS_API=...
ipfs --api=${IPFS_API} key gen dappviewer
ipfs --api=${IPFS_API} key list -l
```

## IPNS KHASH corresponding to dappviewer

- `/ipns/k51qzi5uqu5dkpi2yyfjw5zik5mi5t1dbqvy7w8876knslf2jyjbgs43z1h7o0`
- `/ipns/12D3KooWN38KHZMo4eFAQxrZWWj2VzR1yAPGqMtudNyYTQXWgTP5`

## ENS

Configure ENS (`dappviewer.eth`) so `contenthash` points to IPNS.

## Add content to IPFS and update IPNS so it points to content

```bash
bin/add-ipfs.sh -k dappviewer -f var/www/index.html
bin/add-ipfs.sh -k dappviewer -p
```

## Check name resolution

```bash
ipfs name resolve --nocache /ipns/k51qzi5uqu5dkpi2yyfjw5zik5mi5t1dbqvy7w8876knslf2jyjbgs43z1h7o0
ipfs name resolve --nocache /ipns/dappviewer.eth
```

## Check file availability

```bash
curl https://ipfs.io/ipns/dappviewer.eth/
```

## Debugging

- https://docs.ipfs.tech/reference/diagnostic-tools/
- https://check.ipfs.network/