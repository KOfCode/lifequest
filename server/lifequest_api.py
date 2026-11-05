#!/usr/bin/env python3
"""LifeQuest sync API: GET/PUT /state with X-Sync-Token. Listens on 127.0.0.1 only."""
import hmac, json, os, time, glob
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
DATA = os.environ.get('LQ_DATA', '/var/lib/lifequest')
TOKEN = open(os.environ.get('LQ_TOKEN_FILE', '/etc/lifequest/token')).read().strip()
MAX = 2 * 1024 * 1024
STATE = os.path.join(DATA, 'state.json')
class H(BaseHTTPRequestHandler):
    def _send(self, code, obj):
        b = json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(code); self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store'); self.send_header('Content-Length', str(len(b))); self.end_headers(); self.wfile.write(b)
    def _auth(self):
        t = self.headers.get('X-Sync-Token', '')
        if not t or not hmac.compare_digest(t, TOKEN): self._send(401, {'error': 'unauthorized'}); return False
        return True
    def do_GET(self):
        if self.path.rstrip('/') in ('', '/health'): return self._send(200, {'ok': True})
        if not self._auth(): return
        if self.path.startswith('/state'):
            if not os.path.exists(STATE): return self._send(200, {'updatedAt': 0, 'state': None})
            return self._send(200, json.load(open(STATE)))
        self._send(404, {'error': 'not found'})
    def do_PUT(self):
        if not self._auth(): return
        if not self.path.startswith('/state'): return self._send(404, {'error': 'not found'})
        n = int(self.headers.get('Content-Length') or 0)
        if n <= 0 or n > MAX: return self._send(413, {'error': 'too large or empty'})
        try:
            body = json.loads(self.rfile.read(n)); st = body['state']; assert isinstance(st, dict) and 'days' in st
        except Exception: return self._send(400, {'error': 'bad json'})
        now = int(time.time() * 1000)
        rec = {'updatedAt': now, 'clientUpdatedAt': body.get('updatedAt'), 'state': st}
        if os.path.exists(STATE):
            os.replace(STATE, os.path.join(DATA, 'versions', f'{now}.json'))
            for old in sorted(glob.glob(os.path.join(DATA, 'versions', '*.json')))[:-30]: os.remove(old)
        tmp = STATE + '.tmp'; json.dump(rec, open(tmp, 'w'), ensure_ascii=False); os.replace(tmp, STATE)
        self._send(200, {'ok': True, 'updatedAt': now})
    def log_message(self, *a): pass
if __name__ == '__main__':
    os.makedirs(os.path.join(DATA, 'versions'), exist_ok=True)
    ThreadingHTTPServer(('127.0.0.1', int(os.environ.get('LQ_PORT', 3100))), H).serve_forever()
