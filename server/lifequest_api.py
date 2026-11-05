#!/usr/bin/env python3
"""LifeQuest sync API: GET/PUT /state with X-Sync-Token. Listens on 127.0.0.1 only."""
import hmac, json, os, time, glob, threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
DATA = os.environ.get('LQ_DATA', '/var/lib/lifequest')
TOKEN = open(os.environ.get('LQ_TOKEN_FILE', '/etc/lifequest/token')).read().strip().encode()
IP_MAX, IP_WIN, LOCK = 5, 600, 900          # 5 fails / 10 min per IP -> lock 15 min
G_MAX, G_WIN = 30, 600                      # 30 fails / 10 min globally -> all failures 429 for 15 min
LK = threading.Lock(); FAILS = {}; LOCKED = {}; GFAILS = []; GLOCK = [0]
MAX = 2 * 1024 * 1024
STATE = os.path.join(DATA, 'state.json')
class H(BaseHTTPRequestHandler):
    def _send(self, code, obj):
        b = json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(code); self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store'); self.send_header('Content-Length', str(len(b))); self.end_headers(); self.wfile.write(b)
    def _ip(self):
        if self.client_address[0] == '127.0.0.1':
            return (self.headers.get('X-Real-IP') or self.headers.get('X-Forwarded-For', '').split(',')[0]).strip() or '127.0.0.1'
        return self.client_address[0]
    def _auth(self):
        ip, now = self._ip(), time.time()
        with LK:
            if LOCKED.get(ip, 0) > now: self._send(429, {'error': 'too many attempts'}); return False
        t = self.headers.get('X-Sync-Token', '').strip().encode()
        good = bool(t) and hmac.compare_digest(t, TOKEN)
        if good: return True
        with LK:
            pre = GLOCK[0] > now
            f = [x for x in FAILS.get(ip, []) if x > now - IP_WIN] + [now]; FAILS[ip] = f
            GFAILS[:] = [x for x in GFAILS if x > now - G_WIN] + [now]
            if len(f) >= IP_MAX: LOCKED[ip] = now + LOCK; FAILS.pop(ip, None)
            if len(GFAILS) >= G_MAX: GLOCK[0] = now + LOCK
            if len(FAILS) > 10000: FAILS.clear()
            blocked = pre
        self._send(429 if blocked else 401, {'error': 'too many attempts' if blocked else 'unauthorized'}); return False
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
