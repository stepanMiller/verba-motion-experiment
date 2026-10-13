#!/usr/bin/env python3
"""Loopback-only server for the owned static prototype; no external API."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os

ROOT = Path(__file__).resolve().parent
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def end_headers(self):
        if self.path.split('?', 1)[0] == '/standalone.html':
            policy = "default-src data: blob:; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; font-src data:; connect-src blob:; form-action 'none'; frame-ancestors 'none'; base-uri 'none'; object-src 'none'"
        else:
            policy = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src blob:; form-action 'none'; frame-ancestors 'none'; base-uri 'none'; object-src 'none'"
        self.send_header('Content-Security-Policy', policy)
        self.send_header('Referrer-Policy', 'no-referrer')
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()
    def do_GET(self):
        path = self.path.split('?', 1)[0]
        if path not in ('/', '/index.html', '/standalone.html', '/styles.css', '/app.js') and not path.startswith('/assets/'):
            self.send_error(404)
            return
        super().do_GET()
    def do_HEAD(self):
        super().do_HEAD()

if __name__ == '__main__':
    port = int(os.environ.get('GSTACK_LAB_PORT', '4173'))
    print(f'GSTACK-LAB preview: http://127.0.0.1:{port}', flush=True)
    ThreadingHTTPServer(('127.0.0.1', port), Handler).serve_forever()
