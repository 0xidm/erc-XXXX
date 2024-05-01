import http.server
import socketserver
import ssl
import os


def get_ssl_context(certfile, keyfile):
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(certfile, keyfile)
    context.set_ciphers("@SECLEVEL=1:ALL")
    return context

class CORSHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        http.server.SimpleHTTPRequestHandler.end_headers(self)

class SSLHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers["Content-Length"])
        post_data = self.rfile.read(content_length)
        print(post_data.decode("utf-8"))

class SSLCORSHandler(CORSHandler, SSLHandler):
    pass


def main():
    certfile = "../../var/cert.pem"
    keyfile = "../../var/key.pem"
    context = get_ssl_context(certfile, keyfile)

    httpd = http.server.HTTPServer(("0.0.0.0", 8443), SSLCORSHandler)
    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
    httpd.serve_forever()


if __name__ == "__main__":
    main()
