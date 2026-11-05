#!/usr/bin/env bash
# media.sh [YYYY-MM-DD] -> download that day's proof media (and text proofs) to ./media/<date>/
cd "$(dirname "$0")"; source ./server.env; TOKEN=$(cat /home/box/.config/lifequest/token); BASE="https://${IP//./-}.sslip.io/lifequest/api"
D=${1:-$(date +%F)}; [[ $D =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]] || { echo "日期格式应为 YYYY-MM-DD" >&2; exit 1; }
T=$(mktemp); trap 'rm -f $T' EXIT
code=$(curl -s -m 30 -H "X-Sync-Token: $TOKEN" -o "$T" -w '%{http_code}' "$BASE/state") || { echo "无法连接服务器（$BASE）" >&2; exit 1; }
case $code in 200) ;; 401) echo "口令错误 (401)" >&2; exit 1;; 429) echo "尝试过多被锁定 (429)，15 分钟后再试" >&2; exit 1;; *) echo "服务器返回 HTTP $code" >&2; exit 1;; esac
OUT="media/$D"; mkdir -p "$OUT"
LIST=$(python3 - "$T" "$D" "$OUT" <<'PY'
import json,sys
try: S=(json.load(open(sys.argv[1])).get('state') or {})
except Exception: print("ERR"); sys.exit(0)
D,O=sys.argv[2],sys.argv[3]
for p in S.get('proofs',[]):
  if p.get('date')!=D: continue
  if p.get('file'): print(p['file'], f"{p['habit']}_{p['type']}_{p['id']}.{p['file'].rsplit('.',1)[-1]}")
  elif p.get('type')=='text': open(f"{O}/{p['habit']}_text_{p['id']}.txt",'w').write(p.get('text',''))
PY
)
[ "$LIST" = ERR ] && { echo "服务器返回的不是有效 JSON" >&2; exit 1; }
n=0; fail=0
while read -r f name; do [ -z "$f" ] && continue
  c=$(curl -s -m 600 -H "X-Sync-Token: $TOKEN" -o "$OUT/$name" -w '%{http_code}' "$BASE/media/$f")
  if [ "$c" = 200 ]; then echo "↓ $OUT/$name"; n=$((n+1)); else rm -f "$OUT/$name"; echo "✗ $f (HTTP $c)" >&2; fail=$((fail+1)); fi
done <<< "$LIST"
echo "$D：下载 $n 个文件，失败 $fail；文字证明 $(ls "$OUT"/*_text_*.txt 2>/dev/null | wc -l) 条 → $OUT/"
rmdir "$OUT" 2>/dev/null; [ $fail = 0 ]
