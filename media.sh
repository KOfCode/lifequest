#!/usr/bin/env bash
# media.sh <YYYY-MM-DD> -> download that day's proof media to ./media/<date>/ (named by habit + type + caption)
cd "$(dirname "$0")"; source ./server.env; TOKEN=$(cat /home/box/.config/lifequest/token); BASE="https://${IP//./-}.sslip.io/lifequest/api"
D=${1:-$(date +%F)}; OUT="media/$D"; mkdir -p "$OUT"
curl -sf -m 15 -H "X-Sync-Token: $TOKEN" "$BASE/state" | python3 -c "
import json,sys
S=json.load(sys.stdin).get('state') or {}
for p in S.get('proofs',[]):
  if p.get('date')=='$D' and p.get('file'): print(p['file'], p['habit']+'_'+p['type']+'_'+p['id']+'.'+p['file'].rsplit('.',1)[-1])
  elif p.get('date')=='$D' and p['type']=='text': open('$OUT/'+p['habit']+'_text_'+p['id']+'.txt','w').write(p.get('text',''))
" | while read f name; do curl -sf -m 600 -H "X-Sync-Token: $TOKEN" "$BASE/media/$f" -o "$OUT/$name" && echo "↓ $OUT/$name"; done
ls -la "$OUT"
