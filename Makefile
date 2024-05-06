-include .settings.mk

watch:
	.python/bin/watchmedo shell-command \
		--patterns="*.html;*.css;*.js;*.yaml;*.j2;*.json" \
		--recursive \
		--command='make bundle' \
		--interval 3 \
		--wait \
		html

bundle:
	.python/bin/python3 ./scripts/bundle.py

compile:
	.python/bin/ape compile
	cat .build/erc9000.json | jq ".abi" > var/erc9000.json

server:
	cd var/www && ../../.python/bin/python3 ../../scripts/server.py

ipfs: bundle ipfs-add ipfs-pin ipfs-cache-warmup
	@echo ok

ipfs-add:
	IPFS_API=$(IPFS_API) bin/add-ipfs.sh -k $(IPFS_KEY) -f var/www/index.html
	IPFS_API=$(IPFS_API) bin/add-ipfs.sh -k $(IPFS_KEY) -f var/www/tiny
	IPFS_API=$(IPFS_API) bin/add-ipfs.sh -k $(IPFS_KEY) -f var/www/dappz.bin
	IPFS_API=$(IPFS_API) bin/add-ipfs.sh -k $(IPFS_KEY) -p

ipfs-pin:
	./bin/ipfs-pin.sh $(IPFS_HOST_1)
	./bin/ipfs-pin.sh $(IPFS_HOST_2)
	./bin/ipfs-pin.sh $(IPFS_HOST_3)

ipfs-cache-warmup:
	./bin/ipfs-cache-warmup.sh

install:
	mkdir -p var/www
	python3.10 -m venv .python
	.python/bin/pip install -r requirements.txt
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout var/key.pem -out var/cert.pem
