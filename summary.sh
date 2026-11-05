#!/usr/bin/env bash
# summary.sh get [YYYY-MM-DD]        -> detailed dump of that day (default today, UTC+8 box time)
# summary.sh put <YYYY-MM-DD> <file> -> upload Veronica's summary text for that day (empty file deletes it)
cd "$(dirname "$0")"; source ./server.env; TOKEN=$(cat /home/box/.config/lifequest/token); BASE="https://${IP//./-}.sslip.io/lifequest/api"
H=(-H "X-Sync-Token: $TOKEN"); cmd=$1; D=${2:-$(date +%F)}
case "$cmd" in
get)
  T=$(mktemp -d); trap 'rm -rf $T' EXIT
  curl -sf -m 30 "${H[@]}" "$BASE/state" -o $T/s || { echo "获取失败" >&2; exit 1; }
  curl -sf -m 15 "${H[@]}" "$BASE/summaries" -o $T/m || echo '{}' > $T/m
  python3 - "$D" "$T/s" "$T/m" <<'PY'
import json,sys,datetime as dt
D=sys.argv[1];r=json.load(open(sys.argv[2]));sm=json.load(open(sys.argv[3]));S=r.get('state') or {}
H={h['id']:h for h in S.get('habits',[])};DN={'fit':'健身','learn':'学习','music':'音乐','inv':'投资','side':'副业'}
d=S.get('days',{}).get(D,{'done':{},'notes':{},'water':0});ps=[p for p in S.get('proofs',[]) if p.get('date')==D]
nm=lambda i:'副本'+i[6:] if i.startswith('train_') else H.get(i,{}).get('name',i)
t=lambda ms:dt.datetime.fromtimestamp(ms/1000).strftime('%H:%M')
print(f"=== {D} ===  XP {min(160,sum(d['done'].values()))}（原始 {sum(d['done'].values())}）· 饮水 {d.get('water',0)}ml · 证明 {len(ps)} 条")
by={}
for i in d['done']:
  if i.startswith('proof_'):continue
  dom='fit' if i.startswith('train_') else H.get(i,{}).get('dom','?');by.setdefault(dom,[]).append(i)
for dom,ids in by.items():
  print(f"\n[{DN.get(dom,dom)}]")
  for i in ids:
    extra=(' · 备注：'+d['notes'][i]) if (d.get('notes') or {}).get(i) else ''
    print(f"  ✓ {nm(i)} +{d['done'][i]}{' (+2 证明)' if 'proof_'+i in d['done'] else ''}{extra}")
    for p in ps:
      if p['habit']==i or (i.startswith('train_') and p['habit']=='train'):
        c=(' — '+p['caption']) if p.get('caption') else ''
        body=p.get('text') if p['type']=='text' else f"{p.get('name') or ''} {p.get('size',0)//1024}KB file={p.get('file') or '(未上传)'}"
        print(f"      · [{p['type']}] {t(p['createdAt'])} {body}{c}")
orph=[p for p in ps if p['habit'] not in d['done'] and not (p['habit']=='train' and any(k.startswith('train_') for k in d['done']))]
for p in orph: print(f"  (未打卡但有证明) {nm(p['habit'])} [{p['type']}] {p.get('text') or p.get('file')}")
print(f"\n计数：完成 {len([i for i in d['done'] if not i.startswith('proof_')])} 项；证明 " + '、'.join(f"{k}{sum(1 for p in ps if p['type']==k)}" for k in ('text','image','audio','video','file') if any(p['type']==k for p in ps)) or '0')
if D in sm: print(f"\n[已有 Veronica 总结 {dt.datetime.fromtimestamp(sm[D]['createdAt']/1000):%m-%d %H:%M}]\n{sm[D]['text']}")
print("\n--- JSON ---");print(json.dumps({'date':D,'day':d,'proofs':ps,'summary':sm.get(D)},ensure_ascii=False))
PY
;;
put)
  [ -f "$3" ] || { echo "用法: summary.sh put <date> <file>" >&2; exit 1; }
  python3 -c "import json,sys;print(json.dumps({'text':open(sys.argv[1]).read()}))" "$3" | curl -sf -m 15 "${H[@]}" -H 'Content-Type: application/json' -X PUT --data-binary @- "$BASE/summaries/$D" && echo ;;
*) echo "用法: summary.sh get [date] | put <date> <file>"; exit 1;;
esac
