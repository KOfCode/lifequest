#!/usr/bin/env python3
"""LifeQuest sync API: GET/PUT /state with X-Sync-Token. Listens on 127.0.0.1 only."""
import hmac, json, os, time, glob, threading, re, secrets, shutil, mimetypes
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
DATA = os.environ.get('LQ_DATA', '/var/lib/lifequest')
TOKEN = open(os.environ.get('LQ_TOKEN_FILE', '/etc/lifequest/token')).read().strip().encode()
IP_MAX, IP_WIN, LOCK = 5, 600, 900          # 5 fails / 10 min per IP -> lock 15 min
G_MAX, G_WIN = 30, 600                      # 30 fails / 10 min globally -> all failures 429 for 15 min
LK = threading.Lock(); FAILS = {}; LOCKED = {}; GFAILS = []; GLOCK = [0]
MAX = 5 * 1024 * 1024
MEDIA_MAX = 110 * 1024 * 1024
MEDIA = os.path.join(DATA, 'media'); SUMS = os.path.join(DATA, 'summaries.json')
EXT = {'jpg','jpeg','png','gif','webp','heic','mp3','m4a','aac','wav','ogg','oga','webm','mp4','mov','m4v','pdf','txt','md','zip','doc','docx','xls','xlsx','ppt','pptx','csv','json','bin'}
DRE = re.compile(r'^\d{4}-\d{2}-\d{2}$'); FRE = re.compile(r'^[A-Za-z0-9_-]{6,40}\.[a-z0-9]{1,5}$')
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
    def _sums(self):
        return json.load(open(SUMS)) if os.path.exists(SUMS) else {}
    def _mpath(self):
        parts = self.path.split('?')[0].strip('/').split('/')
        if len(parts) == 3 and parts[0] == 'media' and DRE.match(parts[1]) and FRE.match(parts[2]): return os.path.join(MEDIA, parts[1], parts[2])
    def do_POST(self):
        if not self._auth(): return
        from urllib.parse import urlparse, parse_qs
        u = urlparse(self.path); q = parse_qs(u.query)
        if u.path.rstrip('/') != '/media': return self._send(404, {'error': 'not found'})
        date = (q.get('date') or [''])[0]; ext = (q.get('ext') or ['bin'])[0].lower()
        if not DRE.match(date) or ext not in EXT: return self._send(400, {'error': 'bad date/ext'})
        n = int(self.headers.get('Content-Length') or 0)
        if n <= 0 or n > MEDIA_MAX: return self._send(413, {'error': 'too large or empty'})
        if shutil.disk_usage(DATA).free < n + 500 * 1024 * 1024: return self._send(507, {'error': 'server disk full'})
        d = os.path.join(MEDIA, date); os.makedirs(d, exist_ok=True)
        name = secrets.token_urlsafe(12) + '.' + ext; path = os.path.join(d, name); left = n
        with open(path + '.part', 'wb') as f:
            while left > 0:
                b = self.rfile.read(min(left, 1 << 20))
                if not b: break
                f.write(b); left -= len(b)
        if left: os.remove(path + '.part'); return self._send(400, {'error': 'incomplete'})
        os.replace(path + '.part', path)
        self._send(200, {'ok': True, 'file': f'{date}/{name}', 'size': n})
    def do_DELETE(self):
        if not self._auth(): return
        p = self._mpath()
        if not p: return self._send(404, {'error': 'not found'})
        if os.path.exists(p): os.remove(p)
        self._send(200, {'ok': True})
    def do_GET(self):
        if self.path.rstrip('/') in ('', '/health'): return self._send(200, {'ok': True})
        if not self._auth(): return
        if self.path.startswith('/media/'):
            p = self._mpath()
            if not p or not os.path.exists(p): return self._send(404, {'error': 'not found'})
            sz = os.path.getsize(p); ct = mimetypes.guess_type(p)[0] or 'application/octet-stream'
            self.send_response(200); self.send_header('Content-Type', ct); self.send_header('Content-Length', str(sz)); self.send_header('Cache-Control', 'private, max-age=86400'); self.end_headers()
            with open(p, 'rb') as f: shutil.copyfileobj(f, self.wfile, 1 << 20)
            return
        if self.path.startswith('/media'):
            out = []
            for f in sorted(glob.glob(os.path.join(MEDIA, '*', '*'))):
                if not f.endswith('.part'): out.append({'file': os.path.relpath(f, MEDIA), 'size': os.path.getsize(f)})
            u = shutil.disk_usage(DATA); return self._send(200, {'files': out, 'disk_free': u.free, 'disk_total': u.total})
        if self.path.startswith('/summaries'): return self._send(200, self._sums())
        if self.path.startswith('/state'):
            if not os.path.exists(STATE): return self._send(200, {'updatedAt': 0, 'state': None})
            return self._send(200, json.load(open(STATE)))
        self._send(404, {'error': 'not found'})
    def do_PUT(self):
        if not self._auth(): return
        m = re.match(r'^/summaries/(\d{4}-\d{2}-\d{2})$', self.path)
        if m:
            n = int(self.headers.get('Content-Length') or 0)
            if n <= 0 or n > 200000: return self._send(413, {'error': 'bad size'})
            try: text = json.loads(self.rfile.read(n))['text']; assert isinstance(text, str)
            except Exception: return self._send(400, {'error': 'bad json'})
            sm = self._sums()
            if text.strip(): sm[m.group(1)] = {'text': text, 'createdAt': int(time.time() * 1000)}
            else: sm.pop(m.group(1), None)
            tmp = SUMS + '.tmp'; json.dump(sm, open(tmp, 'w'), ensure_ascii=False); os.replace(tmp, SUMS)
            return self._send(200, {'ok': True})
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
    os.makedirs(os.path.join(DATA, 'versions'), exist_ok=True); os.makedirs(MEDIA, exist_ok=True)
    ThreadingHTTPServer(('127.0.0.1', int(os.environ.get('LQ_PORT', 3100))), H).serve_forever()
