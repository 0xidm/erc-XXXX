fetch('dappz.bin')
    .then(response => {
        let ds = new DecompressionStream("gzip");
        let decompressedStream = response.body.pipeThrough(ds);
        return new Response(decompressedStream).blob();
    })
    .then(decompressed => decompressed.text())
    .then(raw_script => {
        const script = document.createElement('script');
        script.text = raw_script;
        document.getElementsByTagName('head')[0].appendChild(script);
    })
    .catch(error => console.error(error));
