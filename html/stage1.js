var buffer = "";

contractURI_abi = [
    {
        "inputs": [],
        "name": "contractURI",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

AbortSignal.timeout ??= function timeout(ms) {
    const ctrl = new AbortController()
    setTimeout(() => ctrl.abort(), ms)
    return ctrl.signal
}

  function _js(raw_script) {
    const script = document.createElement('script');
    script.text = raw_script;
    document.getElementsByTagName('head')[0].appendChild(script);
}

function _body(html) {
    const parser = new DOMParser();
    const newDocument = parser.parseFromString(html, 'text/html');
    const scripts = newDocument.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        _js(scripts[i].innerText);
    }
    document.documentElement.replaceChild(newDocument.body, document.body);
}

function _print(header, value) {
    buffer += `<h4>${header}</h4> ${value}\n`;
    _body(`<html><body style='background: black; color: white;'><div style='font-family: monospace; word-wrap: break-word;'>${buffer}</div></body></html>`);
}

async function _uri(dapp_address) {
    if (dapp_address == '') {
        _usage();
    }

    _print("ERC-XXXX", "UI/UX Pattern for Decentralized Apps");
    _print("Standardized Launcher URL", `<a style="color: gray;" href="ipns://dappviewer.eth/#${dapp_address}">ipns://dappviewer.eth/#${dapp_address}</a>`);
    _print("About", "This is the reference launcher for DApps compatible with ERC-XXXX.");
    _print("Disclaimer", "This launcher has no relationship with the DApp being launched.");
    _print("Use at own risk", "This launcher is experimental and may not work as expected.");

    var chain_id = dapp_address.split('@')[1];
    if (chain_id == undefined) {
        chain_id = 1;
    }

    _print("Chain ID", chain_id);

    var address = dapp_address.split('@')[0];
    // if address is too short, show usage
    if (address.length < 42) {
        _usage();
    }

    _print("Contract address", address);

    window.web3 = new Web3(window.ethereum);

    const current_chain = await window.web3.eth.getChainId();
    if (current_chain != chain_id) {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${Number(chain_id).toString(16)}` }],
         })
    }

    var token = new window.web3.eth.Contract(contractURI_abi, address=address);
    var uri = await token.methods.contractURI().call();

    return uri;
}

async function _uz(response) {
    let ds = new DecompressionStream("gzip");
    let decompressedStream = response.body.pipeThrough(ds);
    return await new Response(decompressedStream).blob();
}

async function _fetch(uri) {
    var uri_rewrite;
    var uri_gateway;

    try {
        _print("Fetch URI method #1: direct", uri);
        var result = await fetch(uri, { signal: AbortSignal.timeout(10000) });
        return result;
    } catch (error) { 
    }

    if (uri.includes('ipfs://')) {
        uri_rewrite = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    else if (uri.includes('ipns://')) {
        uri_rewrite = uri.replace('ipns://', 'https://ipfs.io/ipns/');
    }

    if (uri_rewrite != undefined) {
        try {
            _print("Fetch URI method #2: rewrite IPFS/IPNS", uri_rewrite);
            var result = await fetch(uri_rewrite, { signal: AbortSignal.timeout(5000) });
            return result;
        } catch (error) {
        }
    }
   
    if (uri.includes('ipfs://')) {
        var cid = uri.replace('ipfs://', '');
        uri_gateway = `https://${cid}.ipfs2.eth.limo/`;
    }
    else if (uri.includes('ipns://')) {
        // uri can match ipns://CID/file.html or ipns://CID
        // we need to extract the CID either way
        var cid = uri.replace('ipns://', '').split('/')[0];
        var filename = uri.replace(`ipns://${cid}`, '');
        uri_gateway = `https://${cid}.ipfs2.eth.limo${filename}`;
    }

    if (uri_gateway != undefined) {
        try {
            _print("Fetch URI method #3: try another gateway", uri_gateway);
            var result = await fetch(uri_gateway, { signal: AbortSignal.timeout(30000) })
            return result;
        } catch (error) {
        }
    }

    _print("Fetch error", "Unable to fetch contractURI. Try reloading the page.");
    throw new Error("Unable to fetch DApp from contractURI.")
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function _launch(html) {
    _print("Launch", "Fetch was successful. Launching DApp...");
    sleep(1000)
        .then(() => _body(html))
        .then(() => entrypoint());
}

function _usage() {
    console.log("Usage: dappviewer.eth/#0xADDRESS...@CHAIN_ID")
    _body("<div style='font-family: monospace'>Usage: <span style='color:rgb(150,150,0)'>dappviewer.eth</span>/#<span style='color:rgb(150,0,150)'>0xADDRESS...</span>@<span style='color:rgb(0,150,150)'>CHAIN_ID</span></div>");
    throw new Error("Unable to load DApp so showing usage instead.");
}

_uri(window.location.hash.substring(1))
    .then(uri => _fetch(uri))
    .then(response => _uz(response))
    .then(decompressed => decompressed.text())
    .then(html => _launch(html))
    .catch(error => console.error(error));
