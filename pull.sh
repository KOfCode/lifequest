#!/usr/bin/env bash
# Print a summary of 老大's LifeQuest state. Reads IP from server.env; tries HTTPS (sslip.io), then HTTP, then ssh.
cd "$(dirname "$0")"; source ./server.env; TOKEN=$(cat /home/box/.config/lifequest/token)
DOM="${IP//./-}.sslip.io"; J=/tmp/lq-state.$$.json; trap 'rm -f $J' EXIT
ok(){ python3 -c "import json,sys;d=json.load(open('$J'));sys.exit(0 if 'state' in d else 1)" 2>/dev/null; }
curl -sf -m 10 -H "X-Sync-Token: $TOKEN" "https://$DOM/lifequest/api/state" -o $J && ok || \
curl -sf -m 10 -H "X-Sync-Token: $TOKEN" "http://$IP/lifequest/api/state" -o $J && ok || \
ssh -i "${SSH_KEY:-/home/box/.ssh/oci_lf}" -o ConnectTimeout=10 ubuntu@$IP "curl -sf -H 'X-Sync-Token: $TOKEN' http://127.0.0.1:3100/state" > $J && ok || { echo "无法获取数据（检查 server.env 里的 IP）" >&2; exit 1; }
python3 - "$J" <<'PY'
import json,sys,datetime as dt
r=json.load(open(sys.argv[1]));S=r.get('state')
if not S: print('服务器上还没有数据'); sys.exit()
CAP=160;H={h['id']:h for h in S['habits']}
raw=lambda d:sum((d.get('done') or {}).values())
lvxp=sum(min(CAP,raw(d)) for d in S['days'].values());lv=1;x=lvxp
while x>=300+100*(lv-1): x-=300+100*(lv-1);lv+=1
nm=lambda i:'副本'+i[6:] if i.startswith('train_') else H.get(i,{}).get('name',i)
td=dt.date.today();k=td.isoformat();d=S['days'].get(k,{'done':{},'notes':{},'water':0})
up=dt.datetime.fromtimestamp(r['updatedAt']/1000).strftime('%m-%d %H:%M')
print(f"LifeQuest · Lv.{lv}（{x}/{300+100*(lv-1)} XP，累计 {lvxp}）· 服务器更新 {up}（UTC+8）")
print(f"\n【今天 {k}】{min(CAP,raw(d))} XP · 饮水 {d.get('water',0)}ml")
for m in ('breakfast','lunch','dinner'):
  print(f"  {H[m]['name']}：{'✓ '+(d.get('notes') or {}).get(m,'') if m in d['done'] else '—'}")
b=d['done'].get('bed');print(f"  睡觉：{'—' if b is None else ('23:00 前 ✓' if b else '晚于 23:00')}")
other=[nm(i) for i in d['done'] if i not in('breakfast','lunch','dinner','bed','water')]
print('  其它完成：'+('、'.join(other) or '—'))
mon=td-dt.timedelta(days=td.weekday());wk=[(mon+dt.timedelta(days=i)).isoformat() for i in range(7)]
print(f"\n【本周 {wk[0]} ~ {wk[-1]}】")
tr=[(nm(i),kk[5:]) for kk in wk for i in S['days'].get(kk,{}).get('done',{}) if i.startswith('train_')]
print(f"  训练：{len(tr)}/3 " + ' '.join(f'{a}({b})' for a,b in tr))
print('  每日XP：'+' '.join(f"{kk[5:]}:{min(CAP,raw(S['days'][kk]))}" for kk in wk if kk in S['days']))
cnt={}
for kk in wk:
  for i in S['days'].get(kk,{}).get('done',{}):
    if not i.startswith('train_'): cnt[i]=cnt.get(i,0)+1
for h in S['habits']:
  if h['on'] and h['freq']=='week': print(f"  {h['name']}：{cnt.get(h['id'],0)}/{h['target']}")
print('  每日习惯完成天数：'+'、'.join(f"{H[i]['name']}{c}" for i,c in cnt.items() if i in H and H[i]['freq']=='day'))
PY
