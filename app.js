'use strict';
const KEY='bojiv1',CAP=160;
/* ---------- pixel icons (8×8) ---------- */
const PAL={k:'#06060f',m:'#ff2bd6',c:'#22f0ff',y:'#ffe14a',w:'#e8ecff',g:'#4dff9a',r:'#e0222f',s:'#9aa1c8',b:'#3c5aff',o:'#ff8a2a',p:'#b57bff',n:'#8a5a32'};
const ICONS={
home:['...yy...','..yyyy..','.yyyyyy.','yyyyyyyy','.cccccc.','.cc..cc.','.cc..cc.','.cccccc.'],
sword:['......ww','.....wsw','....wsw.','m..wsw..','.mwsw...','..mw....','.mkmm...','m...m...'],
shirt:['.mm..mm.','mmmmmmmm','mmmmmmmm','.mmmmmm.','..mccm..','..mmmm..','..mmmm..','..mmmm..'],
chart:['.......y','......yy','..c..y..','.ccc.y..','cc.cy...','c...y...','........','wwwwwwww'],
trophy:['yyyyyyyy','yywyyyyy','.yyyyyy.','..yyyy..','...yy...','...yy...','..yyyy..','.oooooo.'],
gear:['...ss...','.s.ss.s.','..ssss..','ssskksss','ssskksss','..ssss..','.s.ss.s.','...ss...'],
drop:['...c....','...c....','..ccc...','..cwcc..','.ccwccc.','.cccccc.','.cccccc.','..cccc..'],
scroll:['.yyyyyy.','y.wwww.y','.wkkkkw.','.wwwwww.','.wkkkw..','.wwwwww.','y.wwww.y','.yyyyyy.'],
shield:['.cccccc.','cmmmmmmc','cmwwwwmc','cmwmmwmc','cmwmmwmc','.cmwwmc.','..cmmc..','...cc...'],
cal:['.m....m.','mmmmmmmm','wwwwwwww','wkwkwkww','wwwwwwww','wkwkwkww','wwwwwwww','wwwwwwww'],
disk:['bbbbbbb.','bwwwwwbb','bwwwwwbb','bbbbbbbb','bbsssbbb','bbskkbbb','bbssbbbb','bbbbbbbb'],
fit:['........','r.....r.','rr...rr.','rrsssrr.','rr...rr.','r.....r.','........','........'],
learn:['........','.cc.cc..','cwwcwwc.','cwwcwwc.','cwwcwwc.','cwwcwwc.','.cc.cc..','........'],
music:['....mmm.','....m.m.','....m.m.','....m...','.mmmm...','mmmmm...','mmmm....','.mm.....'],
inv:['.......g','......gg','.....g.g','g...g...','gg.g....','.gg.....','........','yyyyyyyy'],
side:['...ww...','..wccw..','..wccw..','..wwww..','.mwwwwm.','.m.ww.m.','...yy...','...o....'],
fire:['...o....','..oo.o..','..oyoo..','.oyyoo..','.oyyyoo.','oyywyyo.','oyywwyo.','.oyyyo..'],
coin:['..yyyy..','.yywwyy.','yyw.yyyy','yyw.yyoy','yyw.yyoy','yyyyyyoy','.yyyyoy.','..oooo..'],
bolt:['....yy..','...yy...','..yy....','.yyyyy..','....yy..','...yy...','..yy....','.y......'],
star:['...yy...','...yy...','yyyyyyyy','.yyyyyy.','..yyyy..','.yy..yy.','yy....yy','........'],
egg:['..www...','.wwwww..','wwyyyww.','wwyyyww.','wwwwwww.','.wwwww..','........','........'],
bucket:['.ssssss.','s......s','.cccccc.','.cccccc.','.cwcccc.','.cccccc.','..cccc..','..ssss..'],
moon:['..yyy...','.yy.....','yy......','yy......','yy......','.yy...y.','..yyyy..','........'],
bento:['rrrrrrrr','rwwryygr','rwwryygr','rrrrrrrr','rggroo.r','rggroo.r','rrrrrrrr','........'],
book:['.mmmmmm.','mwwwwwwm','mwkkkkwm','mwwwwwwm','mwkkkwwm','mwwwwwwm','mmmmmmmm','.m....m.'],
guitar:['......nk','.....nn.','....nn..','.mmmn...','mmkmm...','mmmmm...','.mmm....','........'],
lock:['..ssss..','.s....s.','.s....s.','yyyyyyyy','yyykkyyy','yyykkyyy','yyyyyyyy','........'],
rainbow:['..mmmm..','.myyyym.','mycccc ym'.slice(0,8),'myc..cym','myc..cym','........','........','........'],
dna:['c....m..','.c..m...','..cm....','..mc....','.m..c...','m....c..','.m..c...','..mc....'],
armor:['.rrrrrr.','rryyyyrr','ryccyccr','ryyyyyyr','rryyyyrr','.rrrrrr.','..rcrr..','...rr...'],
hundred:['k.kkk.kk','k.k.k.kk','k.k.k.kk','k.kkk.kk','........','yyyyyyyy','.oooooo.','..oooo..']};
function pi(name,cls){const a=ICONS[name];if(!a)return'';let o='';a.forEach((row,y)=>{for(let x=0;x<8;x++){const c=PAL[row[x]];if(c)o+=`<rect x="${x}" y="${y}" width="1" height="1" fill="${c}"/>`}});return `<svg class="pi ${cls||''}" viewBox="0 0 8 8" shape-rendering="crispEdges">${o}</svg>`}
const DOMS=[
{id:'fit',name:'健身',attr:'体魄',ic:pi('fit','s'),col:'#ff3b47',by:'Veronica'},
{id:'learn',name:'学习',attr:'智识',ic:pi('learn','s'),col:'#3fd7ff',by:'Edith'},
{id:'music',name:'音乐',attr:'乐感',ic:pi('music','s'),col:'#b57bff',by:''},
{id:'inv',name:'投资',attr:'财商',ic:pi('inv','s'),col:'#ffc24a',by:'Friday'},
{id:'side',name:'副业',attr:'创造',ic:pi('side','s'),col:'#3ee08f',by:'Forge'}];
const H=(id,dom,name,desc,freq,target,xp,on=true,extra={})=>({id,dom,name,desc,freq,target,xp,on,...extra});
const DEF_H=[
H('breakfast','fit','早餐','拍照或记一下吃了什么','day',1,15),H('lunch','fit','午餐','一份蛋白质＋半盘蔬菜','day',1,15),H('dinner','fit','晚餐','一份蛋白质＋半盘蔬菜','day',1,15),
H('water','fit','饮水 2000ml','用上方 +250ml 记录','day',1,20,true,{auto:1}),H('train','fit','训练副本','A/B/C，每周 3 次','week',3,50,true,{auto:1}),H('bed','fit','23:00 前上床','睡够 7–8 小时','day',1,20),
H('read','learn','主线阅读','读满 20 分钟（当前书：纳瓦尔宝典）','day',1,15),H('lit','learn','文学日课','读 10 分钟文学并记 1 句好句或意象','day',1,10),
H('note','learn','读书笔记','写一条本周读书心得（3 句以上）','week',1,35),H('usvid','learn','美股片单','看完 1 条视频并写 1 句收获','week',3,30),H('lrev','learn','学习周复盘','15 分钟回顾本周概念','week',1,35),
H('sing','music','唱歌练习','15 分钟','week',4,30),H('guitar','music','电吉他','20 分钟（节拍器基本功＋乐句）','week',4,30),H('drum','music','架子鼓','20 分钟','week',2,35),
H('theory','music','乐理或 Ableton','1 个知识点或 8 小节 loop','week',2,35),H('song','music','写歌素材','一段歌词／旋律动机／和弦','week',1,40),
H('invread','inv','读投资推送','','day',1,10),H('disc','inv','守纪律','没碰期权、孖展、TQQQ，没临时改 70/30','day',1,15),
H('dca','inv','按期定投','VOO 和 QQQM 两笔都下单','month',1,50,false,{dcaDay:1}),H('dcalog','inv','定投后记账','持仓截图发 Friday','month',1,30,false),
H('acct','inv','账户巡检','看一眼持仓和现金，不临时加减仓','week',1,30),H('ratio','inv','比例核对','核对是否偏离 70/30','month',1,50),H('rebal','inv','再平衡检查','','quarter',1,50),
H('pain','side','需求挖掘','记 1 条真实痛点（附链接）','day',1,15),H('mvp','side','产品推进','至少 30 分钟推进 MVP','day',1,20),H('post','side','公开发布','发 1 条进展帖','week',3,30),
H('data','side','数据复盘','晚上看当天数据写一句结论','day',1,10),H('reach','side','用户触达','回复或私信 1 位潜在用户','week',2,35),H('srev','side','副业周复盘','周日：本周收入、有效动作、下周唯一重点','week',1,40)];
const PLANS={A:{name:'推拉',boss:'驼背魔像',ex:[['俯卧撑',3,'8–12 次',60],['弹力带划船',3,'12 次',60],['弹力带肩外展',2,'15 次',45],['平板支撑',3,'30–45 秒',45]]},
B:{name:'下肢核心',boss:'久坐巨兽',ex:[['深蹲',3,'12 次',60],['臀桥',3,'12 次',45],['弓步蹲',2,'每腿 10 次',60],['死虫 / 侧平板',2,'练满',45]]},
C:{name:'全身收紧',boss:'脂肪领主',ex:[['俯卧撑变式',3,'力竭前 2 次',60],['弹力带划船',3,'12–15 次',60],['深蹲或臀桥',3,'12–15 次',45],['核心选一',1,'练满',0]]}};
const STAGES=[[1,'普通身材','新手村民'],[3,'运动觉醒','晨练少年'],[5,'肩臂显线','薄肌学徒'],[8,'腹肌轮廓','腹肌显影者'],[12,'明显薄肌','薄肌战士'],[16,'银红战甲','赛博战士']];
const need=n=>300+100*(n-1);
const pad=n=>String(n).padStart(2,'0'),dk=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const pd=s=>{const[a,b,c]=s.split('-').map(Number);return new Date(a,b-1,c)};
const today=()=>dk(new Date());
let S=load();
function load(){let s;try{s=JSON.parse(localStorage.getItem(KEY))}catch(e){}
 if(!s){s={v:1,days:{},habits:DEF_H.map(h=>({...h})),hidden:{},open:{fit:1},lastLv:1,badges:{},raids:0};
  s.days['2026-11-05']={done:{breakfast:15},notes:{breakfast:'茶叶蛋2个、小米粥半碗、肉包1个'},water:0};}
 // merge new default habits
 DEF_H.forEach(h=>{if(!s.habits.find(x=>x.id===h.id))s.habits.push({...h})});return s}
function save(){localStorage.setItem(KEY,JSON.stringify(S))}
function day(k=today()){return S.days[k]||(S.days[k]={done:{},notes:{},water:0})}
const hab=id=>S.habits.find(h=>h.id===id);
function rawXP(d){return Object.values(d.done||{}).reduce((a,b)=>a+b,0)}
function totals(){let lvXP=0,dom={};DOMS.forEach(x=>dom[x.id]=0);
 for(const k in S.days){const d=S.days[k];lvXP+=Math.min(CAP,rawXP(d));for(const id in d.done){const h=hab(id.replace(/^train_.*/,'train'));if(h)dom[h.dom]+=d.done[id]}}
 let lv=1,x=lvXP;while(x>=need(lv)){x-=need(lv);lv++}return{lvXP,lv,cur:x,nx:need(lv),dom}}
const stageOf=lv=>{let i=0;STAGES.forEach((s,j)=>{if(lv>=s[0])i=j});return i};
function periodKeys(freq,ref=new Date()){const r=new Date(ref.getFullYear(),ref.getMonth(),ref.getDate());let s,e;
 if(freq==='day'){s=e=r}else if(freq==='week'){const w=(r.getDay()+6)%7;s=new Date(r);s.setDate(r.getDate()-w);e=new Date(s);e.setDate(s.getDate()+6)}
 else if(freq==='month'){s=new Date(r.getFullYear(),r.getMonth(),1);e=new Date(r.getFullYear(),r.getMonth()+1,0)}
 else{const q=Math.floor(r.getMonth()/3)*3;s=new Date(r.getFullYear(),q,1);e=new Date(r.getFullYear(),q+3,0)}
 const ks=[];for(let d=new Date(s);d<=e;d.setDate(d.getDate()+1))ks.push(dk(d));return ks}
function countIn(h){return periodKeys(h.freq).reduce((a,k)=>{const d=S.days[k];if(!d)return a;
 if(h.id==='train')return a+Object.keys(d.done).filter(x=>x.startsWith('train_')).length;return a+(d.done[h.id]?1:0)},0)}
const FL={day:'今日',week:'本周',month:'本月',quarter:'本季'};
function streak(){let n=0,d=new Date();const ok=k=>S.days[k]&&Object.keys(S.days[k].done).length>=3;
 if(!ok(dk(d)))d.setDate(d.getDate()-1);while(ok(dk(d))){n++;d.setDate(d.getDate()-1)}return n}

/* ---------- character (layered) ---------- */
const SLOTS=[['bg','背景'],['hair','发型'],['top','上衣'],['bottom','下装'],['shoes','鞋'],['head','头饰'],['acc','配饰']];
// unlock: lv / badge(index) / streak / coin
const ITEMS=[
['bg','bedroom','卧室','🛏️',{}],['bg','gym','健身房','🏋️',{lv:3}],['bg','roof','天台夜景','🌃',{coin:80}],['bg','stage','舞台','🎤',{badge:9}],['bg','lab','钢铁实验室','🧪',{lv:16}],
['hair','side','侧分','💇',{}],['hair','buzz','短寸','🧑',{lv:5}],['hair','slick','背头','😎',{coin:60}],['hair','dread','脏辫','🌀',{coin:120}],
['top','greyT','灰T','👕',{}],['top','sportT','运动T','🎽',{lv:3}],['top','tank','运动背心','🦾',{lv:5}],['top','hoodie','连帽卫衣','🧥',{coin:60}],['top','compress','压缩衣','🖤',{lv:12}],
['top','pingpong','乒乓球衫','🏓',{coin:90}],['top','leather','皮夹克','🧥',{streak:7}],['top','suit','西装','🤵',{coin:200}],['top','none','赤膊','💪',{lv:8}],['top','armor','战甲胸甲','🛡️',{lv:16}],
['bottom','jeans','牛仔裤','👖',{}],['bottom','jogger','慢跑裤','🩳',{lv:3}],['bottom','shorts','运动短裤','🩳',{lv:8}],['bottom','armorleg','战甲腿甲','🦿',{lv:16}],
['shoes','canvas','帆布鞋','👟',{}],['shoes','runner','跑鞋','👟',{lv:3}],['shoes','hightop','高帮篮球鞋','👠',{coin:100}],['shoes','armorboot','战甲靴','🥾',{lv:16}],
['head','nohead','无','⭕',{}],['head','band','头带','🎗️',{lv:8}],['head','cap','棒球帽','🧢',{coin:50}],['head','phones','耳机','🎧',{badge:9}],['head','helmet','战甲头盔','⛑️',{lv:16}],
['acc','noacc','无','⭕',{}],['acc','towel','毛巾','🧺',{badge:1}],['acc','bottle','水壶','🧴',{badge:2}],['acc','book','书本','📕',{badge:8}],['acc','paddle','乒乓球拍','🏓',{coin:70}],['acc','guitar','吉他','🎸',{coin:150}]
].map(([slot,id,name,ic,u])=>({slot,id,name,ic,u}));
const STAGE_FIT=[{bg:'bedroom',hair:'side',top:'greyT',bottom:'jeans',shoes:'canvas',head:'nohead',acc:'noacc'},
{bg:'gym',hair:'side',top:'sportT',bottom:'jogger',shoes:'runner',head:'nohead',acc:'noacc'},
{bg:'gym',hair:'buzz',top:'tank',bottom:'jogger',shoes:'runner',head:'nohead',acc:'noacc'},
{bg:'gym',hair:'buzz',top:'none',bottom:'shorts',shoes:'runner',head:'band',acc:'noacc'},
{bg:'roof',hair:'slick',top:'compress',bottom:'jogger',shoes:'runner',head:'band',acc:'noacc'},
{bg:'lab',hair:'slick',top:'armor',bottom:'armorleg',shoes:'armorboot',head:'helmet',acc:'noacc'}];
/* ---------- pixel sprite engine (32×48) ---------- */
const W=32,HH=48,OUT='#06060f';
function PB(){return new Array(W*HH).fill(null)}
function PR(P,x,y,w,h,c){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(i>=0&&i<W&&j>=0&&j<HH)P[j*W+i]=c}
function D(P,x,y,c){PR(P,x,y,1,1,c)}
const SK=['#f2c29a','#d99a73','#b9785a'];// skin light/mid/shadow
function torsoRows(st){const rows=[];const sh=st>=2?1:0,bel=st===0;
 for(let y=18;y<=29;y++){let x0=11,x1=20;if(y<=20){x0-=sh;x1+=sh}else if(st>=3&&y>=24){x0=12;x1=19}
  if(bel&&y>=23&&y<=28){x0=10;x1=21}rows.push([y,x0,x1])}return rows}
function armX(st){const sh=st>=2?1:0;return[[9-sh,10-sh],[21+sh,22+sh]]}
function body(P,st){const[a,b,c]=SK;
 torsoRows(st).forEach(([y,x0,x1])=>{PR(P,x0,y,x1-x0+1,1,a);D(P,x1,y,b)});
 armX(st).forEach(([x0,x1],k)=>{PR(P,x0,18,x1-x0+1,11,a);D(P,k?x1:x0,18,b);PR(P,k?x1:x0,19,1,10,b);PR(P,x0,29,2,2,a)});
 if(st>=2)armX(st).forEach(([x0,x1],k)=>{D(P,k?x0:x1,20,'#ffe0c4');PR(P,k?x0-0:x1,21,1,2,c)});
 PR(P,12,30,8,3,a);PR(P,12,33,3,9,a);PR(P,17,33,3,9,a);PR(P,14,33,1,9,b);PR(P,19,33,1,9,b);
 // chest/abs
 if(st>=2){PR(P,12,21,3,1,c);PR(P,17,21,3,1,c)}
 if(st>=3){for(let i=0;i<3;i++){D(P,14,23+i*2,c);D(P,17,23+i*2,c)}PR(P,15,22,2,1,b);PR(P,15,24,2,1,b);PR(P,15,26,2,1,b)}
 if(st>=4){D(P,15,28,c);D(P,16,28,c)}
 // head
 PR(P,11,7,10,11,a);PR(P,20,8,1,9,b);PR(P,10,11,1,3,a);PR(P,21,11,1,3,b);// ears
 PR(P,12,17,8,1,b);}
function face(P,st){D(P,13,12,'#fff');D(P,14,12,'#1b1430');D(P,17,12,'#1b1430');D(P,18,12,'#fff');D(P,13,13,'#fff');D(P,14,13,'#1b1430');D(P,17,13,'#1b1430');D(P,18,13,'#fff');
 if(st>=2){PR(P,13,11,2,1,'#3a2a20');PR(P,17,11,2,1,'#3a2a20')}
 PR(P,15,15,2,1,st?'#a5513a':'#c2705a');if(st>=1){D(P,14,15,'#a5513a')}
 if(st===0){D(P,12,14,'#ff8f9a');D(P,19,14,'#ff8f9a')}}
function fillTorso(P,st,c,shade,from=18,to=29){torsoRows(st).forEach(([y,x0,x1])=>{if(y>=from&&y<=to){PR(P,x0,y,x1-x0+1,1,c);D(P,x1,y,shade);D(P,x0,y,shade)}})}
function sleeves(P,st,c,shade,long){armX(st).forEach(([x0,x1],k)=>{const h=long?11:4;PR(P,x0,18,x1-x0+1,h,c);PR(P,k?x1:x0,18,1,h,shade)})}
const TOPS={
 greyT:(P,st)=>{fillTorso(P,st,'#8a90a8','#666c85');sleeves(P,st,'#8a90a8','#666c85');PR(P,14,18,4,1,SK[0]);PR(P,14,21,4,3,'#a4aac4');PR(P,15,22,2,1,'#ff2bd6')},
 sportT:(P,st)=>{fillTorso(P,st,'#2f6fe0','#1f4fb0');sleeves(P,st,'#2f6fe0','#1f4fb0');PR(P,14,18,4,1,SK[0]);torsoRows(st).forEach(([y,x0,x1])=>{D(P,x0+1,y,'#fff');D(P,x1-1,y,'#fff')})},
 tank:(P,st)=>{fillTorso(P,st,'#1c1f33','#121426',19);PR(P,13,18,2,1,'#1c1f33');PR(P,18,18,2,1,'#1c1f33');PR(P,14,23,4,2,'#ff2bd6');D(P,15,25,'#22f0ff');D(P,16,25,'#22f0ff')},
 hoodie:(P,st)=>{fillTorso(P,st,'#3b2f6b','#2a2150');sleeves(P,st,'#3b2f6b','#2a2150',1);PR(P,13,26,6,3,'#2a2150');D(P,14,19,'#ffe14a');D(P,17,19,'#ffe14a');D(P,14,20,'#ffe14a');D(P,17,20,'#ffe14a');PR(P,12,16,8,2,'#4a3c82');PR(P,11,17,1,2,'#4a3c82');PR(P,20,17,1,2,'#4a3c82')},
 compress:(P,st)=>{fillTorso(P,st,'#121220','#0a0a14');sleeves(P,st,'#121220','#0a0a14',1);torsoRows(st).forEach(([y,x0,x1])=>{if(y<22){D(P,x0+1+(y-18),y,'#ff2bd6');D(P,x1-1-(y-18),y,'#ff2bd6')}});PR(P,15,22,2,8,'#1a6a80');armX(st).forEach(([x0],k)=>PR(P,x0+(k?1:0),19,1,9,'#ff2bd6'))},
 pingpong:(P,st)=>{fillTorso(P,st,'#e0222f','#a8141f');sleeves(P,st,'#e0222f','#a8141f');PR(P,13,18,6,1,'#fff');D(P,15,19,'#fff');D(P,16,19,'#fff');torsoRows(st).forEach(([y,x0])=>D(P,x0+1,y,'#ffe14a'));D(P,18,21,'#ffe14a')},
 leather:(P,st)=>{fillTorso(P,st,'#17171d','#0c0c10');sleeves(P,st,'#17171d','#0c0c10',1);PR(P,15,18,2,12,'#e8e8f0');PR(P,17,19,1,10,'#22f0ff');PR(P,13,18,2,3,'#2a2a33');PR(P,17,18,2,1,'#2a2a33')},
 suit:(P,st)=>{fillTorso(P,st,'#232a4a','#161b33');sleeves(P,st,'#232a4a','#161b33',1);PR(P,14,18,4,1,'#fff');PR(P,15,19,2,3,'#fff');PR(P,15,19,2,1,'#e0222f');PR(P,15,20,2,4,'#e0222f');D(P,15,24,'#e0222f');D(P,16,26,'#ffe14a');D(P,16,28,'#ffe14a');armX(st).forEach(([x0])=>PR(P,x0,28,2,1,'#fff'))},
 armor:(P,st)=>{fillTorso(P,st,'#cfd5e2','#9aa1b6');sleeves(P,st,'#cfd5e2','#9aa1b6',1);armX(st).forEach(([x0])=>{PR(P,x0-1,18,4,3,'#e0222f');PR(P,x0,25,2,2,'#e0222f')});PR(P,12,18,8,2,'#e0222f');PR(P,13,26,6,1,'#e0222f');PR(P,12,29,8,1,'#e0222f');PR(P,14,21,4,4,'#0b2a3a');PR(P,15,22,2,2,'#22f0ff')},
 none:()=>{}};
const BOTS={
 jeans:(P)=>{PR(P,12,30,8,3,'#3c5a9a');PR(P,12,33,3,9,'#3c5a9a');PR(P,17,33,3,9,'#3c5a9a');PR(P,14,33,1,9,'#2a4070');PR(P,19,33,1,9,'#2a4070');PR(P,12,30,8,1,'#2a2a33');D(P,15,30,'#ffe14a')},
 jogger:(P)=>{PR(P,12,30,8,3,'#1e2035');PR(P,12,33,3,9,'#1e2035');PR(P,17,33,3,9,'#1e2035');D(P,12,33,'#ff2bd6');PR(P,12,31,1,10,'#ff2bd6');PR(P,19,31,1,10,'#ff2bd6');PR(P,12,41,3,1,'#33365a');PR(P,17,41,3,1,'#33365a')},
 shorts:(P)=>{PR(P,12,30,8,3,'#1e2035');PR(P,12,33,3,3,'#1e2035');PR(P,17,33,3,3,'#1e2035');PR(P,12,35,3,1,'#22f0ff');PR(P,17,35,3,1,'#22f0ff')},
 armorleg:(P)=>{PR(P,12,30,8,3,'#cfd5e2');PR(P,12,33,3,9,'#cfd5e2');PR(P,17,33,3,9,'#cfd5e2');PR(P,14,33,1,9,'#9aa1b6');PR(P,19,33,1,9,'#9aa1b6');PR(P,12,30,8,1,'#e0222f');PR(P,12,36,3,2,'#e0222f');PR(P,17,36,3,2,'#e0222f')}};
const SHOES={canvas:['#5a6080','#e8e8f0',0],runner:['#f4f4fa','#ff2bd6',0],hightop:['#e0222f','#fff',2],armorboot:['#e0222f','#cfd5e2',3]};
function shoes(P,id){const[a,b,t]=SHOES[id]||SHOES.canvas;PR(P,11,42-t,4,2+t,a);PR(P,17,42-t,4,2+t,a);PR(P,11,43,4,1,b);PR(P,17,43,4,1,b);if(t){D(P,13,42-t,b);D(P,19,42-t,b)}}
const HC='#1a1424',HL='#3a2a50';
const HAIRS={side:P=>{PR(P,11,5,10,3,HC);PR(P,10,6,12,2,HC);PR(P,10,8,2,4,HC);PR(P,20,8,2,2,HC);PR(P,12,8,5,1,HC);PR(P,12,9,3,1,HC);PR(P,13,5,4,1,HL)},
 buzz:P=>{PR(P,11,6,10,2,'#2a2236');PR(P,10,7,1,3,'#2a2236');PR(P,21,7,1,3,'#2a2236');PR(P,12,8,8,1,'#2a2236')},
 slick:P=>{PR(P,11,4,10,4,HC);PR(P,10,5,12,3,HC);PR(P,10,8,1,3,HC);PR(P,21,8,1,3,HC);PR(P,13,4,6,1,'#ff2bd6');PR(P,12,5,3,1,HL)},
 dread:P=>{PR(P,11,5,10,3,HC);PR(P,10,6,12,3,HC);[9,11,20,22].forEach((x,i)=>{for(let y=8;y<20;y++)D(P,x,y,(y+i)%3?HC:'#22f0ff')})}};
const HEADS={band:P=>{PR(P,10,8,12,2,'#ff2bd6');PR(P,22,9,2,1,'#ff2bd6');D(P,23,10,'#ff2bd6');PR(P,10,8,12,1,'#ff7ae8')},
 cap:P=>{PR(P,10,4,12,4,'#22c4e0');PR(P,11,3,10,1,'#22c4e0');PR(P,17,8,8,1,'#178aa0');PR(P,14,5,3,2,'#ffe14a');PR(P,10,7,12,1,'#178aa0')},
 phones:P=>{PR(P,12,3,8,1,'#222');D(P,11,4,'#222');D(P,20,4,'#222');PR(P,10,5,1,4,'#222');PR(P,21,5,1,4,'#222');PR(P,9,9,2,5,'#ff2bd6');PR(P,21,9,2,5,'#ff2bd6');D(P,9,11,'#22f0ff');D(P,22,11,'#22f0ff')},
 helmet:P=>{PR(P,10,5,12,13,'#e0222f');PR(P,11,4,10,1,'#e0222f');PR(P,12,9,8,8,'#ffd24a');PR(P,13,12,2,1,'#22f0ff');PR(P,17,12,2,1,'#22f0ff');PR(P,14,15,4,1,'#c9a030');PR(P,21,6,1,11,'#a8141f');PR(P,13,5,6,1,'#ff6a72')}};
const ACCS={towel:P=>{PR(P,8,17,3,7,'#f4f4fa');PR(P,10,16,4,2,'#f4f4fa');PR(P,8,22,3,1,'#22f0ff')},
 bottle:(P,st)=>{const x=armX(st)[1][1]+1;PR(P,x,24,2,6,'#22f0ff');PR(P,x,23,2,1,'#222');D(P,x,26,'#bff9ff')},
 book:(P,st)=>{const x=armX(st)[0][0]-2;PR(P,x,26,3,5,'#ff2bd6');PR(P,x,26,1,5,'#a01890');D(P,x+1,27,'#fff')},
 paddle:(P,st)=>{const x=armX(st)[1][1];PR(P,x+1,29,1,3,'#8a5a32');PR(P,x,32,4,4,'#e0222f');PR(P,x+1,31,2,1,'#e0222f');PR(P,x+1,36,2,1,'#e0222f');D(P,x+4,27,'#ffe14a')},
 guitar:(P,st)=>{const x=armX(st)[1][1]+1;for(let i=0;i<10;i++)D(P,x+3-Math.floor(i/3),14+i,'#6a4020');PR(P,x+3,12,2,3,'#222');PR(P,x-1,24,5,6,'#ff2bd6');PR(P,x,23,3,1,'#ff2bd6');PR(P,x,30,3,1,'#ff2bd6');D(P,x+1,26,'#111');D(P,x+1,27,'#111');PR(P,x-1,24,1,6,'#a01890')}};
const BGS={
 bedroom:P=>{PR(P,0,0,32,48,'#1c1433');PR(P,0,0,32,2,'#251a44');PR(P,2,8,10,12,'#0c1430');PR(P,2,8,10,1,'#ff2bd6');PR(P,2,19,10,1,'#ff2bd6');PR(P,2,8,1,12,'#ff2bd6');PR(P,11,8,1,12,'#ff2bd6');PR(P,4,14,2,6,'#24305a');PR(P,7,12,3,8,'#2a2050');D(P,4,15,'#ffe14a');D(P,8,13,'#22f0ff');D(P,8,16,'#22f0ff');PR(P,22,34,10,5,'#3a2a66');PR(P,22,33,10,1,'#5a44a0');PR(P,26,31,4,2,'#ececf4');PR(P,0,44,32,4,'#120c22');PR(P,0,44,32,1,'#2e2058')},
 gym:P=>{PR(P,0,0,32,48,'#0f1224');for(let x=0;x<32;x+=4)PR(P,x,0,1,44,'#141830');PR(P,2,10,1,34,'#4a5070');PR(P,8,10,1,34,'#4a5070');PR(P,2,22,7,1,'#6a7090');PR(P,0,21,2,3,'#222');PR(P,9,21,2,3,'#222');PR(P,21,4,9,4,'#0a0a14');PR(P,22,5,7,2,'#ff2bd6');PR(P,24,40,6,2,'#6a7090');PR(P,23,39,2,4,'#222');PR(P,29,39,2,4,'#222');PR(P,0,44,32,4,'#1a1e34');PR(P,0,44,32,1,'#22f0ff')},
 roof:P=>{for(let y=0;y<44;y++)PR(P,0,y,32,1,y<14?'#0a0820':y<28?'#1a0c3a':'#2c0f4a');PR(P,24,4,4,4,'#ffe14a');PR(P,25,3,2,1,'#ffe14a');[[3,3],[9,6],[16,2],[30,9],[6,12]].forEach(([x,y])=>D(P,x,y,'#fff'));
  [[0,26,5],[5,20,4],[9,30,4],[23,22,5],[28,28,4]].forEach(([x,y,w])=>{PR(P,x,y,w,44-y,'#100828');for(let j=y+2;j<42;j+=3)for(let i=x+1;i<x+w-1;i+=2)if((i*7+j)%5<2)D(P,i,j,j%2?'#22f0ff':'#ff2bd6')});PR(P,5,19,4,1,'#ff2bd6');PR(P,23,21,5,1,'#22f0ff');PR(P,0,44,32,4,'#181030');PR(P,0,44,32,1,'#ff2bd6')},
 stage:P=>{PR(P,0,0,32,48,'#0c0618');for(let y=0;y<44;y++){const w=Math.floor(y/3);PR(P,8-w/2,y,4+w,1,'#ff2bd61c');PR(P,22-w/2,y,4+w,1,'#22f0ff18')}PR(P,8,0,4,2,'#ff2bd6');PR(P,22,0,4,2,'#22f0ff');PR(P,0,44,32,4,'#24103a');PR(P,0,44,32,1,'#ffe14a');PR(P,2,38,3,6,'#1a1a2a');PR(P,27,38,3,6,'#1a1a2a');D(P,3,40,'#ff2bd6');D(P,28,40,'#ff2bd6')},
 lab:P=>{PR(P,0,0,32,48,'#050f1c');for(let i=0;i<32;i+=4)PR(P,i,0,1,44,'#0b2236');for(let j=0;j<44;j+=4)PR(P,0,j,32,1,'#0b2236');PR(P,1,8,6,8,'#0a2a40');PR(P,2,9,4,1,'#22f0ff');PR(P,2,11,3,1,'#22f0ff');PR(P,2,13,4,1,'#ff2bd6');PR(P,25,6,6,10,'#0a2a40');PR(P,26,8,4,4,'#22f0ff40');D(P,27,9,'#22f0ff');PR(P,0,44,32,4,'#081a2a');PR(P,0,44,32,1,'#22f0ff');PR(P,10,44,12,1,'#bff9ff')}};
function toSVG(P,cls){let o='';for(let y=0;y<HH;y++){let x=0;while(x<W){const c=P[y*W+x];if(!c){x++;continue}let e=x;while(e+1<W&&P[y*W+e+1]===c)e++;o+=`<rect x="${x}" y="${y}" width="${e-x+1}" height="1" fill="${c}"/>`;x=e+1}}return o}
function charSVG(st,locked,fit,noBg){fit=fit||STAGE_FIT[st];
 const C=PB();
 if(fit.acc==='guitar')ACCS.guitar(C,st);
 body(C,st);(BOTS[fit.bottom]||(()=>{}))(C);shoes(C,fit.shoes);
 if(fit.top==='hoodie'||fit.top==='armor'){}(TOPS[fit.top]||TOPS.none)(C,st);
 if(fit.acc&&fit.acc!=='guitar'&&ACCS[fit.acc])ACCS[fit.acc](C,st);
 if(fit.head!=='helmet'){face(C,st);(HAIRS[fit.hair]||(()=>{}))(C);(HEADS[fit.head]||(()=>{}))(C)}else HEADS.helmet(C);
 // outline
 const O=PB();for(let y=0;y<HH;y++)for(let x=0;x<W;x++)if(!C[y*W+x]){const n=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>{const X=x+dx,Y=y+dy;return X>=0&&X<W&&Y>=0&&Y<HH&&C[Y*W+X]&&!/^#.{6}[0-9a-f]{2}$/i.test(C[Y*W+X])});if(n)O[y*W+x]=OUT}
 if(locked){for(let i=0;i<C.length;i++){if(C[i])C[i]='#1d2148';if(O[i])O[i]='#2c3270'}}
 const up=PB(),lo=PB();for(let i=0;i<C.length;i++){const v=C[i]||O[i];if(!v)continue;(i<30*W?up:lo)[i]=v}
 let bg='';if(!noBg&&!locked){const B=PB();(BGS[fit.bg]||BGS.bedroom)(B);bg=toSVG(B)}
 const sh=`<rect x="10" y="44" width="12" height="1" fill="#0008"/>`;
 let fx='';if(!locked&&st===5)fx=`<rect x="15" y="22" width="2" height="2" fill="#bff9ff"><animate attributeName="opacity" values="1;.3;1" dur="1.2s" repeatCount="indefinite"/></rect>`;
 if(!locked&&st>=4)fx+=[[6,14],[25,18],[7,30],[26,34]].map(([x,y],i)=>`<rect x="${x}" y="${y}" width="1" height="1" fill="${st===5?'#22f0ff':'#ff2bd6'}"><animate attributeName="opacity" values="0;1;0" dur="1.6s" begin="${i*.4}s" repeatCount="indefinite"/></rect>`).join('');
 return `<svg viewBox="0 0 32 48" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">${bg}${sh}<g>${toSVG(lo)}</g><g class="bob">${toSVG(up)}${fx}</g>${locked?'<text x="16" y="28" font-size="8" text-anchor="middle" fill="#4a5296" font-family="monospace">?</text>':''}</svg>`}
/* ---------- wardrobe ---------- */
function coins(){let r=0;for(const k in S.days)r+=rawXP(S.days[k]);return Math.floor(r/5)-(S.spent||0)}
function unlocked(it,T){const u=it.u;if(S.owned&&S.owned[it.id])return true;if(STAGE_FIT.slice(0,stageOf(T.lv)+1).some(f=>f[it.slot]===it.id))return true;
 if(u.lv)return T.lv>=u.lv;if(u.badge!==undefined)return !!S.badges[u.badge];if(u.streak)return streak()>=u.streak||!!(S.owned||{})[it.id];if(u.coin)return false;return true}
function lockTxt(it){const u=it.u;return u.lv?`Lv.${u.lv}`:u.badge!==undefined?'成就「'+BADGES[u.badge][1]+'」':u.streak?`连击 ${u.streak} 天`:u.coin?`🪙 ${u.coin}`:''}
function fitNow(st){return {...STAGE_FIT[st],...(S.outfit||{})}}
let wslot='top';
function renderWard(T){if(!window.wchar)return;const st=stageOf(T.lv),f=fitNow(st);
 // persist streak unlocks
 ITEMS.forEach(it=>{if(it.u.streak&&streak()>=it.u.streak){S.owned=S.owned||{};S.owned[it.id]=1}});
 wchar.innerHTML=charSVG(st,false,f);wcoin.innerHTML=pi('coin','s')+' '+coins();
 wslots.innerHTML=SLOTS.map(([k,n])=>`<button class="chip ${k===wslot?'son':''}" onclick="wslot='${k}';render()">${n}</button>`).join('');
 witems.innerHTML=ITEMS.filter(i=>i.slot===wslot).map(it=>{const ok=unlocked(it,T),on=f[it.slot]===it.id;
  return `<button class="bd ${on?'on':''}" style="${ok?'':'opacity:.55'}" onclick="wear('${it.id}')"><div style="width:64px;height:96px;margin:2px auto 4px;background:#04041a;box-shadow:0 0 0 2px #000">${charSVG(st,false,{...f,[it.slot]:it.id},it.slot!=='bg')}</div><b>${it.name}</b><small>${on?'✅ 穿戴中':ok?'点击换上':'🔒 '+lockTxt(it)}</small></button>`}).join('')}
function wear(id){const it=ITEMS.find(i=>i.id===id),T=totals();
 if(!unlocked(it,T)){if(it.u.coin){if(coins()<it.u.coin){toast(`金币不够，还差 ${it.u.coin-coins()}`);return}
   if(!confirm(`花 ${it.u.coin} 金币买「${it.name}」？`))return;S.spent=(S.spent||0)+it.u.coin;S.owned=S.owned||{};S.owned[id]=1;toast('🛍️ 已购买 '+it.name)}
  else{toast('🔒 解锁条件：'+lockTxt(it));return}}
 S.outfit=S.outfit||{};S.outfit[it.slot]=id;save();render();celebrate()}
function resetFit(){S.outfit={};save();render();toast('已恢复当前形态默认造型')}
/* ---------- render ---------- */
let preview=null;
function ring(p,col){const n=12,k=Math.round(p*n);let o='';const pos=[[1,0],[2,0],[3,0],[4,1],[4,2],[4,3],[3,4],[2,4],[1,4],[0,3],[0,2],[0,1]];pos.forEach(([x,y],i)=>o+=`<rect x="${x*8}" y="${y*8}" width="7" height="7" fill="${i<k?col:'#1c2050'}"/>`);return `<svg class="ring" viewBox="0 0 40 40" shape-rendering="crispEdges">${o}<text x="20" y="25" font-size="11" text-anchor="middle" fill="#e8ecff" font-family="FP,monospace">${Math.round(p*100)}</text></svg>`;const r=15,C=2*Math.PI*r;return `<svg class="ring" viewBox="0 0 38 38"><circle cx="19" cy="19" r="${r}" stroke="#262c42" stroke-width="4" fill="none"/><circle cx="19" cy="19" r="${r}" stroke="${col}" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="${C*p} ${C}" transform="rotate(-90 19 19)"/><text x="19" y="23" font-size="10" text-anchor="middle" fill="#e9ecf5" font-weight="700">${Math.round(p*100)}</text></svg>`}
function render(){const T=totals(),st=stageOf(T.lv),d=day();
 document.getElementById('stage').innerHTML=charSVG(st,false,fitNow(st));
 lv.textContent='Lv.'+T.lv;stname.textContent=STAGES[st][2]+' · '+STAGES[st][1];
 xpbar.style.width=(T.cur/T.nx*100)+'%';xptx.textContent=`${T.cur} / ${T.nx} XP · 累计 ${T.lvXP}`;
 const r=rawXP(d);document.getElementById('coinc').innerHTML=pi('coin','s')+' '+coins();document.getElementById('streak').innerHTML=pi('fire','s')+' 连击 '+streak()+' 天';todayxp.innerHTML=`${pi('bolt','s')} 今日 ${Math.min(r,CAP)}/${CAP} XP`;
 attrs.innerHTML=DOMS.map(x=>{const v=T.dom[x.id],l=Math.floor(Math.sqrt(v/40))+1;return `<div class="attr" style="color:${x.col}">${x.ic}<b>${l}</b><span style="color:#8a93ad">${x.attr}</span></div>`}).join('');
 const w=d.water||0;wtx.textContent=w+' / 2000 ml';wbar.style.width=Math.min(100,w/20)+'%';
 let tot=0,dn=0;
 doms.innerHTML=DOMS.filter(x=>!S.hidden[x.id]).map(x=>{const hs=S.habits.filter(h=>h.dom===x.id&&h.on);if(!hs.length)return'';
  let a=0;const items=hs.map(h=>{const cnt=countIn(h),doneToday=h.id==='train'?Object.keys(d.done).some(k=>k.startsWith('train_')):!!d.done[h.id],full=cnt>=h.target;
   const ok=h.freq==='day'?doneToday:full;a+=ok?1:0;
   const prog=h.freq==='day'?'':`<small style="color:${full?'#3ee08f':'#ffc24a'}">${cnt}/${h.target} ${FL[h.freq]}</small>`;
   const note=d.notes&&d.notes[h.id]?`<small>📝 ${esc(d.notes[h.id])}</small>`:'';
   return `<button class="q ${(h.freq==='day'?doneToday:doneToday||full)?'done':''}" onclick="tap('${h.id}')"><span class="ck">${doneToday||(h.freq!=='day'&&full)?'✓':''}</span><span class="qt"><b style="font-weight:600">${h.name}</b>${h.desc?`<small>${h.desc}</small>`:''}${note}</span>${prog?`<span style="text-align:right">${prog}</span>`:''}<span class="xp">+${h.xp}</span></button>`}).join('');
  tot+=hs.length;dn+=a;
  return `<div class="dom ${S.open[x.id]?'open':''}"><button class="dh" onclick="tog('${x.id}')">${ring(a/hs.length,x.col)}<span><b>${x.ic} ${x.name}</b><span class="mut">${x.attr} · ${a}/${hs.length} 已达成${x.by?' · '+x.by:''}</span></span><span class="arrow">▶</span></button><div class="items">${items}</div></div>`}).join('');
 qcount.textContent=dn+'/'+tot;
 renderRaidSel();renderHist();renderAch(T);renderSet();renderWard(T);
 if(T.lv>S.lastLv){const old=stageOf(S.lastLv);S.lastLv=T.lv;save();lvUp(T.lv,st,st>old)}else if(T.lv<S.lastLv){S.lastLv=T.lv;save()}
}
const esc=s=>String(s).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
function toast(t){const e=document.getElementById('toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),1600)}
function tog(id){S.open[id]=!S.open[id];save();render()}
function tap(id){const h=hab(id),d=day();
 if(id==='train'){go('raid');return}
 if(id==='water'){toast('用上方 +250ml 记录饮水');return}
 if(d.done[id]){if(confirm('取消这项打卡？')){delete d.done[id];if(d.notes)delete d.notes[id];save();render()}return}
 if(h.freq!=='day'&&countIn(h)>=h.target){toast(FL[h.freq]+'已达标 ✓');return}
 if(id==='bed'){const n=new Date(),hr=n.getHours();if(hr>=23||hr<4){d.done.bed=0;toast('过了 23:00，这次不加经验');save();render();return}}
 if(['breakfast','lunch','dinner'].includes(id)){const t=prompt('吃了什么？（可留空）','');if(t===null)return;if(t){d.notes=d.notes||{};d.notes[id]=t.slice(0,60)}}
 d.done[id]=h.xp;save();toast(`+${h.xp} XP · ${h.name}`);celebrate();render()}
function water(n){const d=day();d.water=Math.max(0,(d.water||0)+n);
 if(d.water>=2000&&d.done.water===undefined){d.done.water=hab('water').xp;toast('💧 喝满 2000ml +20 XP');celebrate()}
 else if(d.water<2000&&d.done.water!==undefined)delete d.done.water;else if(n>0)toast('💧 +250ml');save();render()}
function celebrate(){const s=document.querySelector('#stage svg');if(s){s.classList.remove('cele');void s.offsetWidth;s.classList.add('cele')}}
function lvUp(lv,st,evo){modalShow(`<div style="font-size:16px;color:var(--cy);letter-spacing:4px;text-shadow:0 0 8px #22f0ff">LEVEL UP!</div><div class="lv" style="font-size:44px">Lv.${lv}</div><div class="stage" style="width:144px;height:216px;margin:10px auto">${charSVG(st,false,fitNow(st))}</div>${evo?`<div class="ttl">形态进化：${STAGES[st][1]}</div><div class="mut">称号「${STAGES[st][2]}」</div>`:'<div class="mut">离下一形态更近了</div>'}<button class="btn gold" style="margin-top:14px;width:100%" onclick="modal.classList.remove('on')">继续变强</button>`);if(navigator.vibrate)navigator.vibrate([80,60,160]);burst()}
function burst(){const c=document.getElementById('fx'),x=c.getContext('2d');c.width=innerWidth/4|0;c.height=innerHeight/4|0;c.style.width='100%';c.style.height='100%';const cols=['#ff2bd6','#22f0ff','#ffe14a','#fff'],ps=[];for(let i=0;i<90;i++){const a=Math.random()*6.28,v=1+Math.random()*3;ps.push({x:c.width/2,y:c.height/2.6,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1.5,c:cols[i%4],l:40+Math.random()*30})}let t=0;(function f(){x.clearRect(0,0,c.width,c.height);ps.forEach(p=>{if(p.l--<=0)return;p.x+=p.vx;p.y+=p.vy;p.vy+=.08;x.fillStyle=p.c;x.fillRect(p.x|0,p.y|0,2,2)});if(t++<80)requestAnimationFrame(f);else x.clearRect(0,0,c.width,c.height)})()}
function modalShow(h){mbox.innerHTML=h;modal.classList.add('on')}
document.getElementById('stage').onclick=()=>{const T=totals(),cs=stageOf(T.lv);preview=preview??cs;
 const show=i=>{preview=i;const lk=i>cs;modalShow(`<div class="ttl">${STAGES[i][1]}</div><div class="mut">Lv.${STAGES[i][0]} 解锁 · 「${STAGES[i][2]}」</div><div class="stage" style="width:144px;height:216px;margin:10px auto">${charSVG(i,lk)}</div>${lk?`<div class="mut">🔒 还差 Lv.${STAGES[i][0]-T.lv} 级</div>`:''}<div class="forms" style="margin-top:10px">${STAGES.map((s,j)=>`<div class="fm ${j===i?'sel':''}" onclick="window._pv(${j})">${charSVG(j,j>cs)}<br>Lv.${s[0]}</div>`).join('')}</div>`)};
 window._pv=show;show(cs)};

/* ---------- raid ---------- */
let R=null,timer=null;
function weekDone(){const ks=periodKeys('week'),o={};ks.forEach(k=>{const d=S.days[k];if(d)for(const id in d.done)if(id.startsWith('train_'))o[id.slice(6)]=k});return o}
function renderRaidSel(){const w=weekDone();document.getElementById('wk').textContent=`本周 ${Object.keys(w).length}/3`;
 raidsel.innerHTML=Object.entries(PLANS).map(([k,p])=>`<button class="rs ${w[k]?'cl':''}" onclick="startRaid('${k}')"><b>${k}</b>${p.name}<div class="mut">${w[k]?'✅ '+w[k].slice(5):'未通关'}</div></button>`).join('');
 if(!R)raid.innerHTML=`<div class="card"><p class="mut" style="margin:0">选一个副本开打。每完成一组，Boss 掉血；组间自动倒计时休息。通关 +50 XP，并记入本周 A/B/C。漏练顺延一天，保证一周 3 次。</p></div>`}
function startRaid(k){const p=PLANS[k];R={k,sets:[]};p.ex.forEach((e,i)=>{for(let s=0;s<e[1];s++)R.sets.push({i,s})});R.pos=0;R.rest=0;drawRaid()}
function drawRaid(){const p=PLANS[R.k],tot=R.sets.length,hp=1-R.pos/tot;
 if(R.pos>=tot){clearInterval(timer);raid.innerHTML=`<div class="card" style="text-align:center"><div style="font-size:50px">🏆</div><h2 style="justify-content:center">副本 ${R.k} 通关！</h2><p class="mut">${p.boss} 已被击败</p><button class="btn gold" style="width:100%" onclick="finishRaid()">领取 +50 XP</button></div>`;return}
 const cur=R.sets[R.pos],e=p.ex[cur.i];
 raid.innerHTML=`<div class="card"><div class="row boss"><b>👹 ${p.boss}</b><span class="mut" style="margin-left:auto">HP ${Math.round(hp*100)}%</span></div><div class="hp"><i style="width:${hp*100}%"></i></div>
 <div style="text-align:center;margin:16px 0 6px">${R.rest>0?`<div class="mut">休息中，下一组：${e[0]}</div><div class="big" style="color:var(--cy)">${R.rest}s</div><button class="btn gh" onclick="R.rest=0;clearInterval(timer);drawRaid()">跳过休息</button>`:
 `<div class="mut">第 ${cur.s+1}/${e[1]} 组</div><div style="font-size:26px;font-weight:800">${e[0]}</div><div class="big" style="font-size:34px;color:var(--gold)">${e[2]}</div><button class="btn" style="width:100%;padding:16px;font-size:18px;margin-top:8px" onclick="setDone()">这组完成 ⚔️</button>`}</div>
 ${p.ex.map((x,i)=>`<div class="ex ${i===cur.i?'cur':i<cur.i?'ok':''}"><span>${x[0]}</span><span>${x[1]}×${x[2]}${x[3]?' · 休'+x[3]+'s':''}</span></div>`).join('')}
 <button class="btn gh" style="width:100%;margin-top:12px" onclick="if(confirm('放弃本次副本？')){R=null;clearInterval(timer);render()}">撤退</button></div>`}
function setDone(){const p=PLANS[R.k],e=p.ex[R.sets[R.pos].i];R.pos++;if(navigator.vibrate)navigator.vibrate(40);
 if(R.pos<R.sets.length&&e[3]){R.rest=e[3];clearInterval(timer);timer=setInterval(()=>{R.rest--;if(R.rest<=0){clearInterval(timer);R.rest=0;if(navigator.vibrate)navigator.vibrate([200,100,200])}drawRaid()},1000)}drawRaid()}
function finishRaid(){const d=day();d.done['train_'+R.k]=50;S.raids=(S.raids||0)+1;R=null;save();toast('+50 XP · 副本通关');render();go('home');celebrate()}

/* ---------- history ---------- */
let calRef=new Date();
function renderHist(){const ws=periodKeys('week'),wd=['一','二','三','四','五','六','日'];const vals=ws.map(k=>S.days[k]?Math.min(CAP,rawXP(S.days[k])):0),mx=Math.max(CAP,...vals);
 chart.innerHTML=ws.map((k,i)=>`<div><span style="color:#e9ecf5">${vals[i]||''}</span><i style="height:${vals[i]/mx*90}px"></i>${wd[i]}</div>`).join('');
 const y=calRef.getFullYear(),m=calRef.getMonth(),first=(new Date(y,m,1).getDay()+6)%7,n=new Date(y,m+1,0).getDate();
 calm.innerHTML=`<span onclick="calRef=new Date(${y},${m-1},1);renderHist()">◀</span> ${y}年${m+1}月 <span onclick="calRef=new Date(${y},${m+1},1);renderHist()">▶</span>`;
 let h=wd.map(x=>`<span class="mut">${x}</span>`).join('');for(let i=0;i<first;i++)h+='<span></span>';
 for(let i=1;i<=n;i++){const k=y+'-'+pad(m+1)+'-'+pad(i),d=S.days[k],x=d?Math.min(CAP,rawXP(d)):0,a=x/CAP;
  h+=`<div onclick="showDay('${k}')" style="background:${x?`rgba(255,59,71,${.15+a*.75})`:'#141826'};${k===today()?'outline:2px solid var(--gold)':''}">${i}</div>`}
 cal.innerHTML=h}
function showDay(k){const d=S.days[k];if(!d){dayd.textContent=k+'：没有记录';return}
 const names=Object.keys(d.done).map(id=>id.startsWith('train_')?'副本'+id.slice(6):(hab(id)||{}).name||id);
 dayd.innerHTML=`<b>${k}</b> · ${Math.min(CAP,rawXP(d))} XP · 💧${d.water||0}ml<br>${names.join('、')||'—'}${d.notes?Object.entries(d.notes).map(([a,b])=>`<br>📝 ${(hab(a)||{}).name}：${esc(b)}`).join(''):''}`}

/* ---------- achievements ---------- */
function everDone(id,n=1){let c=0;for(const k in S.days)if(S.days[k].done[id]!==undefined)c++;return c>=n}
function maxDaysFor(fn){let c=0;for(const k in S.days)if(fn(S.days[k]))c++;return c}
const BADGES=[['egg','第一口记录','记录第一餐',()=>['breakfast','lunch','dinner'].some(x=>everDone(x))],['sword','初次出击','通关第一个副本',()=>(S.raids||0)>=1],
['bucket','水桶','一天喝满 2000ml',()=>everDone('water')],['moon','早睡者','23:00 前上床',()=>maxDaysFor(d=>d.done.bed>0)>=1],
['bento','三餐全勤','一天三餐都记录',()=>maxDaysFor(d=>d.done.breakfast&&d.done.lunch&&d.done.dinner)>=1],['cal','周满训','一周通关 A/B/C',()=>{const o={};for(const k in S.days)for(const id in S.days[k].done)if(id.startsWith('train_')){const wk=periodKeys('week',pd(k))[0];(o[wk]=o[wk]||new Set).add(id)}return Object.values(o).some(s=>s.size>=3)}],
['fire','七日连击','连续打卡 7 天',()=>streak()>=7],['dna','薄肌学徒','达到 Lv5',T=>T.lv>=5],
['book','书虫','主线阅读累计 7 天',()=>everDone('read',7)],['guitar','乐手上路','音乐练习累计 10 次',()=>maxDaysFor(d=>['sing','guitar','drum','theory','song'].some(x=>d.done[x]))>=10],
['shield','纪律守卫','守纪律累计 14 天',()=>everDone('disc',14)],['side','造物者','产品推进累计 10 天',()=>everDone('mvp',10)],
['star','全能日','一天内五大领域都有打卡',()=>maxDaysFor(d=>DOMS.every(x=>Object.keys(d.done).some(id=>{const h=hab(id.replace(/^train_.*/,'train'));return h&&h.dom===x.id})))>=1],
['hundred','百炼','通关 10 次副本',()=>(S.raids||0)>=10],['armor','银红战甲','达到 Lv16',T=>T.lv>=16]];
function renderAch(T){let n=0;badges.innerHTML=BADGES.map(([ic,nm,ds,fn],i)=>{const on=fn(T);if(on){n++;if(!S.badges[i]){S.badges[i]=today();save();setTimeout(()=>toast('🏆 解锁成就：'+nm),700)}}return `<div class="bd ${on?'on':''}"><div class="ic">${pi(ic)}</div><b>${nm}</b><small>${ds}</small></div>`}).join('');achc.textContent=n+'/'+BADGES.length}

/* ---------- settings ---------- */
function renderSet(){habset.innerHTML=DOMS.map(x=>`<div style="margin:10px 0 4px;display:flex;align-items:center"><b>${x.ic} ${x.name}</b><label class="mut" style="margin-left:auto"><input type="checkbox" class="sw" ${S.hidden[x.id]?'':'checked'} onchange="S.hidden['${x.id}']=!this.checked;save();render()"> 显示</label></div>`+
 S.habits.filter(h=>h.dom===x.id).map(h=>`<div class="row" style="font-size:13px"><input type="checkbox" class="sw" ${h.on?'checked':''} ${h.auto?'disabled':''} onchange="hab('${h.id}').on=this.checked;save();render()"><span style="flex:1">${h.name}</span>
 <select style="width:auto;padding:4px" onchange="setFreq('${h.id}',this.value)" ${h.auto?'disabled':''}>${Object.entries({day:'每天',week:'每周',month:'每月',quarter:'每季'}).map(([k,v])=>`<option value="${k}" ${h.freq===k?'selected':''}>${v}</option>`).join('')}</select>
 ${h.freq==='day'?'':`<input type="number" min="1" max="9" value="${h.target}" style="width:46px;padding:4px" onchange="hab('${h.id}').target=+this.value||1;save();render()">次`}
 ${h.dcaDay!==undefined?`<span class="mut">每月</span><input type="number" min="1" max="28" value="${h.dcaDay}" style="width:46px;padding:4px" onchange="hab('${h.id}').dcaDay=+this.value;save()">号`:''}</div>`).join('')).join('')+`<p class="mut">「按期定投」「定投后记账」默认关闭，定好定投日后打开即可。</p>`}
function setFreq(id,v){const h=hab(id);h.freq=v;if(v==='day')h.target=1;save();render()}
function exp(){const b=new Blob([JSON.stringify(S,null,1)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='boji-backup-'+today()+'.json';a.click()}
function imp(inp){const f=inp.files[0];if(!f)return;f.text().then(t=>{try{const o=JSON.parse(t);if(!o.days)throw 0;S=o;save();render();toast('导入成功')}catch(e){alert('文件格式不对')}})}
function reset(){if(confirm('确定清空所有记录？此操作不可恢复（建议先导出）')&&confirm('再确认一次：真的重置？')){localStorage.removeItem(KEY);S=load();save();render()}}
function go(p){document.querySelectorAll('.page').forEach(e=>e.classList.toggle('on',e.id==='p-'+p));document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.p===p));scrollTo(0,0)}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>go(b.dataset.p));
// dev hook for previews: ?lv=N
const q=new URLSearchParams(location.search);if(q.get('stage')){window._forceStage=+q.get('stage')}
document.querySelectorAll('[data-ic]').forEach(e=>e.outerHTML=pi(e.dataset.ic,e.className.replace('pi','')));
save();render();
if(window._forceStage!==undefined){document.getElementById('stage').innerHTML=charSVG(window._forceStage);lv.textContent='Lv.'+STAGES[window._forceStage][0];stname.textContent=STAGES[window._forceStage][2]+' · '+STAGES[window._forceStage][1]}
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
if(q.get('raid')){go('raid');startRaid(q.get('raid'))}if(q.get('page'))go(q.get('page'));if(q.get('slot')){wslot=q.get('slot');render()}if(q.get('fit')){S.outfit=JSON.parse(q.get('fit'));render()}if(q.get('coins')){S.spent=-(+q.get('coins'));render()}if(q.get('pv'))document.getElementById('stage').click();if(q.get('lvup'))lvUp(5,2,true);if(q.get('icon')){document.body.innerHTML='<div id=ic style="width:100vw;height:100vh;background:#07071a"></div>';ic.innerHTML=charSVG(5,false,{...STAGE_FIT[5]}).replace('viewBox="0 0 32 48"','viewBox="7 1.5 18 18" preserveAspectRatio="xMidYMid slice" width="100%" height="100%"')}
