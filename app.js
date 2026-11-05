'use strict';
const KEY='bojiv1',CAP=160;
const DOMS=[
{id:'fit',name:'健身',attr:'体魄',ic:'💪',col:'#ff3b47',by:'Veronica'},
{id:'learn',name:'学习',attr:'智识',ic:'📚',col:'#3fd7ff',by:'Edith'},
{id:'music',name:'音乐',attr:'乐感',ic:'🎸',col:'#b57bff',by:''},
{id:'inv',name:'投资',attr:'财商',ic:'📈',col:'#ffc24a',by:'Friday'},
{id:'side',name:'副业',attr:'创造',ic:'🚀',col:'#3ee08f',by:'Forge'}];
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
const STAGES=[[1,'普通身材','新手村民'],[3,'运动觉醒','晨练少年'],[5,'肩臂显线','薄肌学徒'],[8,'腹肌轮廓','腹肌显影者'],[12,'明显薄肌','薄肌战士'],[16,'银红战甲','Veronica 战甲']];
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
const BODY=[{sh:22,wa:21},{sh:23,wa:19},{sh:25,wa:17},{sh:26,wa:16},{sh:27,wa:15.5},{sh:28,wa:15}];
function charSVG(st,locked,fit,noBg){fit=fit||STAGE_FIT[st];const{sh,wa}=BODY[st],c=60,sk='#efc19c',ln='#a8724e';
 const torso=`M${c-sh} 50 Q${c} 44 ${c+sh} 50 L${c+wa+(st===0?3:0)} 86 Q${c+wa} 100 ${c+wa-1} 102 L${c-wa+1} 102 Q${c-wa} 100 ${c-wa-(st===0?3:0)} 86 Z`;
 const legs=`M${c-wa+1} 100 L${c-14} 158 L${c-4} 158 L${c} 108 L${c+4} 158 L${c+14} 158 L${c+wa-1} 100 Z`;
 const armP=s=>{const x=c+s*sh,ux=x+s*6,hx=x+s*9,bi=st>=2?4.8:3.6;return `M${x} 52 Q${ux+s*bi} 70 ${ux} 82 L${hx} 104`};
 const sleeve=(col,long)=>[-1,1].map(s=>long?`<path d="${armP(s)}" stroke="${col}" stroke-width="${st>=2?10.5:9.5}" stroke-linecap="round" fill="none"/>`:`<path d="M${c+s*sh} 51 Q${c+s*(sh+7)} 60 ${c+s*(sh+7)} 66" stroke="${col}" stroke-width="12" stroke-linecap="round" fill="none"/>`).join('');
 let g='';
 // background
 const BG={bedroom:`<rect width="120" height="170" fill="#251f33"/><rect x="10" y="18" width="30" height="36" rx="3" fill="#36507a"/><path d="M25 18v36M10 36h30" stroke="#251f33" stroke-width="2"/><circle cx="33" cy="26" r="4" fill="#f5e6a8"/><rect x="72" y="118" width="48" height="22" rx="4" fill="#4a3a5e"/><rect x="0" y="150" width="120" height="20" fill="#1a1524"/>`,
 gym:`<rect width="120" height="170" fill="#161a24"/><rect x="0" y="150" width="120" height="20" fill="#20252f"/><path d="M8 40v110M28 40v110M8 70h20M8 110h20" stroke="#3a4152" stroke-width="3"/><rect x="88" y="138" width="24" height="5" rx="2" fill="#555d70"/><circle cx="90" cy="140" r="6" fill="#2b2f3a"/><circle cx="110" cy="140" r="6" fill="#2b2f3a"/><text x="100" y="30" font-size="9" fill="#ff3b4760" text-anchor="middle" font-weight="900">GYM</text>`,
 roof:`<defs><linearGradient id="ng" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0f2c"/><stop offset="1" stop-color="#3a1b4a"/></linearGradient></defs><rect width="120" height="170" fill="url(#ng)"/><circle cx="95" cy="22" r="8" fill="#f5e6a8"/><circle cx="20" cy="15" r=".8" fill="#fff"/><circle cx="45" cy="30" r=".8" fill="#fff"/><circle cx="70" cy="12" r=".8" fill="#fff"/><path d="M0 130V100h12V88h10v20h8V80h14v50h8V95h12v35h10V90h16v40h10V105h20v25Z" fill="#141530"/><rect x="0" y="150" width="120" height="20" fill="#24203a"/><path d="M0 150h120" stroke="#5a4a7a"/>`,
 stage:`<rect width="120" height="170" fill="#12071c"/><path d="M45 0L15 160h90L75 0Z" fill="#b57bff22"/><path d="M60 0L30 160h60Z" fill="#ff3b4718"/><rect x="0" y="152" width="120" height="18" fill="#2a1438"/><circle cx="12" cy="10" r="5" fill="#b57bff"/><circle cx="108" cy="10" r="5" fill="#ff3b47"/>`,
 lab:`<rect width="120" height="170" fill="#07131f"/><path d="M0 40h120M0 80h120M0 120h120M30 0v170M60 0v170M90 0v170" stroke="#3fd7ff14"/><circle cx="60" cy="95" r="52" fill="none" stroke="#3fd7ff40" stroke-dasharray="4 4"><animateTransform attributeName="transform" type="rotate" from="0 60 95" to="360 60 95" dur="20s" repeatCount="indefinite"/></circle><rect x="0" y="152" width="120" height="18" fill="#0e2233"/><path d="M0 152h120" stroke="#3fd7ff60"/>`};
 const bgs=noBg?'':(BG[fit.bg]||'');
 if(st>=4)g+=`<ellipse cx="60" cy="95" rx="48" ry="70" fill="url(#au${st})" opacity=".6"/>`;
 g+=`<ellipse cx="60" cy="163" rx="30" ry="4" fill="#000" opacity=".45"/>`;
 // body
 g+=`<path d="${legs}" fill="${sk}"/>`;
 // accessory behind (guitar)
 if(fit.acc==='guitar')g+=`<g transform="rotate(-25 92 110)"><rect x="89" y="58" width="5" height="40" fill="#5a3a22"/><rect x="87" y="54" width="9" height="8" rx="2" fill="#222"/><path d="M80 108 Q78 96 88 96 Q92 92 96 96 Q106 96 104 108 Q108 124 92 126 Q76 124 80 108Z" fill="#d8202c" stroke="#fff" stroke-width="1"/><circle cx="92" cy="110" r="3" fill="#111"/></g>`;
 g+=[-1,1].map(s=>`<path d="${armP(s)}" stroke="${sk}" stroke-width="${st>=2?9:8}" stroke-linecap="round" fill="none"/>`+(st>=2?`<path d="M${c+s*(sh+3)} 58 Q${c+s*(sh+9)} 66 ${c+s*(sh+7)} 76" stroke="#0003" stroke-width="1.4" fill="none"/>`:'')+`<circle cx="${c+s*(sh+9)}" cy="105" r="4.5" fill="${sk}"/>`).join('');
 g+=`<path d="${torso}" fill="${sk}"/>`;
 if(st>=2)g+=`<path d="M${c-sh+6} 58 Q${c-8} 64 ${c} 60 Q${c+8} 64 ${c+sh-6} 58" stroke="${ln}" stroke-width="1.3" fill="none"/>`;
 if(st>=3)for(let i=0;i<3;i++)g+=`<rect x="${c-8}" y="${68+i*9}" width="7" height="7" rx="2.5" fill="#0001" stroke="${ln}" stroke-width=".9"/><rect x="${c+1}" y="${68+i*9}" width="7" height="7" rx="2.5" fill="#0001" stroke="${ln}" stroke-width=".9"/>`;
 else if(st<2)g+=`<circle cx="60" cy="88" r="1" fill="${ln}"/>`;
 // bottom
 const B={jeans:`<path d="${legs}" fill="#3a4a6b"/><path d="M${c-wa+1} 100h${2*wa-2}" stroke="#2a3550" stroke-width="3"/>`,
 jogger:`<path d="${legs}" fill="#1d2333"/><path d="M${c-14} 154h10M${c+4} 154h10" stroke="#3a425e" stroke-width="3"/><path d="M${c-wa+2} 104 L${c-13} 150M${c+wa-2} 104 L${c+13} 150" stroke="#ff3b47" stroke-width="1"/>`,
 shorts:`<path d="M${c-wa+1} 100 L${c-wa+2} 124 L${c-2} 124 L${c} 110 L${c+2} 124 L${c+wa-2} 124 L${c+wa-1} 100Z" fill="#20242f"/><path d="M${c-wa+2} 104 L${c-wa+2} 123M${c+wa-2} 104 L${c+wa-2} 123" stroke="#ff3b47" stroke-width="1.6"/>`,
 armorleg:`<path d="${legs}" fill="#c9ced8"/><path d="M${c-12} 128h7M${c+5} 128h7" stroke="#d8202c" stroke-width="3"/><path d="M${c-wa+1} 100h${2*wa-2}" stroke="#d8202c" stroke-width="4"/>`}[fit.bottom]||'';
 g+=B;
 const SH={canvas:['#55607a','#e9ecf5'],runner:['#fff','#ff3b47'],hightop:['#d8202c','#fff'],armorboot:['#d8202c','#c9ced8']}[fit.shoes]||['#333','#555'];
 const tall=fit.shoes==='hightop'||fit.shoes==='armorboot'?6:0;
 g+=`<rect x="${c-16}" y="${156-tall}" width="13" height="${6+tall}" rx="3" fill="${SH[0]}"/><rect x="${c+3}" y="${156-tall}" width="13" height="${6+tall}" rx="3" fill="${SH[0]}"/><path d="M${c-15} 159h11M${c+4} 159h11" stroke="${SH[1]}" stroke-width="1.5"/>`;
 // top
 const T={
 greyT:`<path d="${torso}" fill="#7b8296"/>${sleeve('#7b8296')}<circle cx="60" cy="66" r="6" fill="none" stroke="#ffffff40" stroke-width="2"/>`,
 sportT:`<path d="${torso}" fill="#2b6fd6"/>${sleeve('#2b6fd6')}<path d="M${c-sh+3} 52 L${c-wa+2} 100 M${c+sh-3} 52 L${c+wa-2} 100" stroke="#fff" stroke-width="2"/>`,
 tank:`<path d="M${c-sh+7} 50 L${c-9} 47 Q60 60 ${c+9} 47 L${c+sh-7} 50 L${c+wa} 86 Q${c+wa} 100 ${c+wa-1} 102 L${c-wa+1} 102 Q${c-wa} 100 ${c-wa} 86Z" fill="#20242f"/><text x="60" y="82" font-size="8" fill="#ff3b47" text-anchor="middle" font-weight="900">BOJI</text>`,
 hoodie:`${sleeve('#3a3f55',1)}<path d="${torso}" fill="#3a3f55"/><path d="M48 47 Q60 58 72 47" stroke="#2c3044" stroke-width="5" fill="none"/><path d="M57 52v10M63 52v10" stroke="#e9ecf5" stroke-width="1"/><rect x="${c-11}" y="84" width="22" height="12" rx="3" fill="#2c3044"/>`,
 compress:`${sleeve('#111319',1)}<path d="${torso}" fill="#111319"/><path d="M${c-sh+3} 52 Q60 70 ${c+sh-3} 52 M60 62V100" stroke="#d8202c" stroke-width="1.4" fill="none"/><path d="M${c-8} 76h16M${c-7} 88h14" stroke="#ffffff22"/>`,
 pingpong:`<path d="${torso}" fill="#d8202c"/>${sleeve('#d8202c')}<path d="M52 47 L60 56 L68 47" stroke="#fff" stroke-width="3" fill="none"/><path d="M${c-sh+2} 54 L${c-wa+1} 100" stroke="#ffd24a" stroke-width="3"/><text x="66" y="72" font-size="6" fill="#ffd24a">★</text>`,
 leather:`${sleeve('#1a1a1c',1)}<path d="${torso}" fill="#1a1a1c"/><path d="M54 48 L56 102 L64 102 L66 48Z" fill="#e9ecf5"/><path d="M54 48 L48 64 L55 70 M66 48 L72 64 L65 70" stroke="#3a3a40" stroke-width="2" fill="none"/><path d="M64 60v40" stroke="#888" stroke-width=".8"/>`,
 suit:`${sleeve('#23283a',1)}<path d="${torso}" fill="#23283a"/><path d="M53 47 L60 70 L67 47Z" fill="#fff"/><path d="M60 50 L58 54 L60 68 L62 54Z" fill="#d8202c"/><path d="M53 47 L50 62 L60 72 M67 47 L70 62 L60 72" stroke="#151826" stroke-width="2" fill="none"/><circle cx="60" cy="84" r="1.2" fill="#888"/>`,
 armor:`${sleeve('#c9ced8',1)}<path d="${torso}" fill="#d7dbe4"/><path d="M${c-sh+2} 50 Q60 64 ${c+sh-2} 50 L${c+sh-6} 62 Q60 74 ${c-sh+6} 62 Z" fill="#d8202c"/><path d="M${c-wa+2} 86 L60 96 L${c+wa-2} 86" stroke="#d8202c" stroke-width="3" fill="none"/><circle cx="60" cy="72" r="6.5" fill="#bff6ff"/><circle cx="60" cy="72" r="4" fill="#3fd7ff"><animate attributeName="opacity" values="1;.5;1" dur="1.8s" repeatCount="indefinite"/></circle><path d="M60 80V100M${c-8} 86h16M${c-7} 93h14" stroke="#9aa1b0" stroke-width="1"/><circle cx="${c-sh}" cy="52" r="7" fill="#d8202c"/><circle cx="${c+sh}" cy="52" r="7" fill="#d8202c"/>`}[fit.top]||'';
 g+=T;
 if(st===5&&fit.top!=='armor')g+=`<circle cx="60" cy="72" r="3.5" fill="#3fd7ff" opacity=".85"><animate attributeName="opacity" values=".9;.4;.9" dur="1.8s" repeatCount="indefinite"/></circle>`;
 // hands accessories
 const rh=[c+sh+9,105],lh=[c-sh-9,105];
 g+={towel:`<path d="M${c-sh-3} 46 Q${c-sh+6} 44 ${c-sh+9} 50 L${c-sh+5} 76 L${c-sh-3} 74Z" fill="#f2f4f8"/><path d="M${c-sh-2} 70h7" stroke="#3fd7ff" stroke-width="2"/>`,
 bottle:`<rect x="${rh[0]-4}" y="${rh[1]-16}" width="8" height="18" rx="3" fill="#3fd7ff"/><rect x="${rh[0]-3}" y="${rh[1]-19}" width="6" height="4" fill="#222"/><circle cx="${rh[0]}" cy="${rh[1]}" r="4.5" fill="${sk}"/>`,
 book:`<rect x="${lh[0]-9}" y="${lh[1]-10}" width="13" height="17" rx="1.5" fill="#d8202c"/><path d="M${lh[0]-7} ${lh[1]-6}h9" stroke="#fff" stroke-width="1"/><circle cx="${lh[0]}" cy="${lh[1]}" r="4.5" fill="${sk}"/>`,
 paddle:`<rect x="${rh[0]-1.5}" y="${rh[1]}" width="3" height="10" fill="#8a5a32"/><circle cx="${rh[0]+2}" cy="${rh[1]+18}" r="9" fill="#d8202c" stroke="#111" stroke-width="1"/><circle cx="${rh[0]}" cy="${rh[1]}" r="4.5" fill="${sk}"/><circle cx="${rh[0]+12}" cy="${rh[1]-6}" r="2.5" fill="#ffb347"/>`}[fit.acc]||'';
 // neck & head
 g+=`<rect x="55" y="38" width="10" height="10" rx="3" fill="${sk}"/>`;
 if(fit.top==='hoodie')g+=`<path d="M44 44 Q60 36 76 44 Q74 52 60 52 Q46 52 44 44Z" fill="#3a3f55"/>`;
 g+=`<path d="M45 26 Q45 8 60 8 Q75 8 75 26 Q75 40 60 42 Q45 40 45 26Z" fill="${sk}"/>`;
 if(fit.head==='helmet'){g+=`<path d="M44 26 Q44 6 60 6 Q76 6 76 26 Q76 41 60 43 Q44 41 44 26Z" fill="#d8202c"/><path d="M49 22 Q60 18 71 22 L69 38 Q60 41 51 38Z" fill="#f2c94c"/><path d="M51 26h7M62 26h7" stroke="#bff6ff" stroke-width="2.5" stroke-linecap="round"/>`}
 else{
  g+=`<circle cx="54" cy="27" r="1.8" fill="#222"/><circle cx="66" cy="27" r="1.8" fill="#222"/>`;
  if(st>=2)g+=`<path d="M51 23.5l5 1M69 23.5l-5 1" stroke="#222" stroke-width="1.3"/>`;
  g+=`<path d="M56 35 Q60 ${st?38:36.5} 64 35" stroke="#a5513a" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  if(st===0)g+=`<circle cx="50.5" cy="32" r="2" fill="#ff8a8a50"/><circle cx="69.5" cy="32" r="2" fill="#ff8a8a50"/>`;
  const hc='#16130f';
  g+={side:`<path d="M44 26 Q42 6 60 5 Q79 5 76 25 Q73 14 66 13 Q58 17 50 14 Q46 18 44 26Z" fill="${hc}"/>`,
  buzz:`<path d="M45 22 Q45 8 60 8 Q75 8 75 22 Q70 14 60 14 Q50 14 45 22Z" fill="${hc}" opacity=".9"/>`,
  slick:`<path d="M44 24 Q43 4 62 4 Q78 5 76 22 Q72 12 60 12 Q50 12 44 24Z" fill="${hc}"/><path d="M52 8 Q62 5 70 9" stroke="#ffffff40" stroke-width="1.5" fill="none"/>`,
  dread:`<path d="M44 24 Q43 5 60 5 Q77 5 76 24 Q70 13 60 13 Q50 13 44 24Z" fill="${hc}"/>`+[46,50,70,74].map((x,i)=>`<path d="M${x} 18 Q${x+(i<2?-3:3)} 34 ${x+(i<2?-2:2)} 48" stroke="${hc}" stroke-width="3.2" stroke-linecap="round" fill="none"/>`).join('')}[fit.hair]||'';
  g+={band:`<path d="M45 19 Q60 13 75 19 L75 23 Q60 17 45 23Z" fill="#ff3b47"/><path d="M75 20 l6 4 l-6 1" fill="#ff3b47"/>`,
  cap:`<path d="M44 20 Q44 4 60 4 Q76 4 76 20Z" fill="#2b6fd6"/><path d="M60 20 Q76 18 86 22 L76 23Z" fill="#1d4fa0"/><circle cx="60" cy="5" r="1.5" fill="#fff"/><text x="57" y="17" font-size="7" fill="#fff" font-weight="900">B</text>`,
  phones:`<path d="M43 26 Q42 2 60 2 Q78 2 77 26" stroke="#222" stroke-width="3" fill="none"/><rect x="39" y="21" width="7" height="12" rx="3" fill="#d8202c"/><rect x="74" y="21" width="7" height="12" rx="3" fill="#d8202c"/>`}[fit.head]||'';
 }
 if(locked)return `<svg viewBox="0 0 120 170" xmlns="http://www.w3.org/2000/svg"><defs><filter id="sil"><feFlood flood-color="#232842"/><feComposite in2="SourceAlpha" operator="in"/></filter></defs><g filter="url(#sil)">${g}</g><text x="60" y="95" font-size="22" text-anchor="middle" fill="#4a5272">?</text></svg>`;
 return `<svg viewBox="0 0 120 170" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="au${st}"><stop offset="0" stop-color="${st===5?'#3fd7ff':'#ff3b47'}" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>${bgs}<g class="bob">${g}</g></svg>`}
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
 wchar.innerHTML=charSVG(st,false,f);wcoin.textContent='🪙 '+coins();
 wslots.innerHTML=SLOTS.map(([k,n])=>`<button class="chip ${k===wslot?'son':''}" onclick="wslot='${k}';render()">${n}</button>`).join('');
 witems.innerHTML=ITEMS.filter(i=>i.slot===wslot).map(it=>{const ok=unlocked(it,T),on=f[it.slot]===it.id;
  return `<button class="bd ${on?'on':''}" style="${ok?'':'opacity:.55'}" onclick="wear('${it.id}')"><div style="width:56px;height:72px;margin:auto;border-radius:10px;overflow:hidden">${charSVG(st,false,{...f,[it.slot]:it.id},it.slot!=='bg')}</div><b>${it.name}</b><small>${on?'✅ 穿戴中':ok?'点击换上':'🔒 '+lockTxt(it)}</small></button>`}).join('')}
function wear(id){const it=ITEMS.find(i=>i.id===id),T=totals();
 if(!unlocked(it,T)){if(it.u.coin){if(coins()<it.u.coin){toast(`金币不够，还差 ${it.u.coin-coins()}`);return}
   if(!confirm(`花 ${it.u.coin} 金币买「${it.name}」？`))return;S.spent=(S.spent||0)+it.u.coin;S.owned=S.owned||{};S.owned[id]=1;toast('🛍️ 已购买 '+it.name)}
  else{toast('🔒 解锁条件：'+lockTxt(it));return}}
 S.outfit=S.outfit||{};S.outfit[it.slot]=id;save();render();celebrate()}
function resetFit(){S.outfit={};save();render();toast('已恢复当前形态默认造型')}
/* ---------- render ---------- */
let preview=null;
function ring(p,col){const r=15,C=2*Math.PI*r;return `<svg class="ring" viewBox="0 0 38 38"><circle cx="19" cy="19" r="${r}" stroke="#262c42" stroke-width="4" fill="none"/><circle cx="19" cy="19" r="${r}" stroke="${col}" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="${C*p} ${C}" transform="rotate(-90 19 19)"/><text x="19" y="23" font-size="10" text-anchor="middle" fill="#e9ecf5" font-weight="700">${Math.round(p*100)}</text></svg>`}
function render(){const T=totals(),st=stageOf(T.lv),d=day();
 document.getElementById('stage').innerHTML=charSVG(st,false,fitNow(st));
 lv.textContent='Lv.'+T.lv;stname.textContent=STAGES[st][2]+' · '+STAGES[st][1];
 xpbar.style.width=(T.cur/T.nx*100)+'%';xptx.textContent=`${T.cur} / ${T.nx} XP · 累计 ${T.lvXP}`;
 const r=rawXP(d);document.getElementById('coinc').textContent='🪙 '+coins();document.getElementById('streak').textContent='🔥 连击 '+streak()+' 天';todayxp.textContent=`⚡ 今日 ${Math.min(r,CAP)}/${CAP} XP`;
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
function lvUp(lv,st,evo){modalShow(`<div style="font-size:13px;color:var(--gold);letter-spacing:4px">LEVEL UP</div><div class="lv" style="font-size:44px">Lv.${lv}</div><div style="width:150px;height:200px;margin:auto">${charSVG(st)}</div>${evo?`<div class="ttl">形态进化：${STAGES[st][1]}</div><div class="mut">称号「${STAGES[st][2]}」</div>`:'<div class="mut">离下一形态更近了</div>'}<button class="btn gold" style="margin-top:14px;width:100%" onclick="modal.classList.remove('on')">继续变强</button>`);if(navigator.vibrate)navigator.vibrate([80,60,160])}
function modalShow(h){mbox.innerHTML=h;modal.classList.add('on')}
document.getElementById('stage').onclick=()=>{const T=totals(),cs=stageOf(T.lv);preview=preview??cs;
 const show=i=>{preview=i;const lk=i>cs;modalShow(`<div class="ttl">${STAGES[i][1]}</div><div class="mut">Lv.${STAGES[i][0]} 解锁 · 「${STAGES[i][2]}」</div><div style="width:170px;height:230px;margin:6px auto">${charSVG(i,lk)}</div>${lk?`<div class="mut">🔒 还差 Lv.${STAGES[i][0]-T.lv} 级</div>`:''}<div class="forms" style="margin-top:10px">${STAGES.map((s,j)=>`<div class="fm ${j===i?'sel':''}" onclick="window._pv(${j})">${charSVG(j,j>cs)}<br>Lv.${s[0]}</div>`).join('')}</div>`)};
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
const BADGES=[['🍳','第一口记录','记录第一餐',()=>['breakfast','lunch','dinner'].some(x=>everDone(x))],['⚔️','初次出击','通关第一个副本',()=>(S.raids||0)>=1],
['🪣','水桶','一天喝满 2000ml',()=>everDone('water')],['🌙','早睡者','23:00 前上床',()=>maxDaysFor(d=>d.done.bed>0)>=1],
['🍱','三餐全勤','一天三餐都记录',()=>maxDaysFor(d=>d.done.breakfast&&d.done.lunch&&d.done.dinner)>=1],['🗓️','周满训','一周通关 A/B/C',()=>{const o={};for(const k in S.days)for(const id in S.days[k].done)if(id.startsWith('train_')){const wk=periodKeys('week',pd(k))[0];(o[wk]=o[wk]||new Set).add(id)}return Object.values(o).some(s=>s.size>=3)}],
['🔥','七日连击','连续打卡 7 天',()=>streak()>=7],['🧬','薄肌学徒','达到 Lv5',T=>T.lv>=5],
['📖','书虫','主线阅读累计 7 天',()=>everDone('read',7)],['🎸','乐手上路','音乐练习累计 10 次',()=>maxDaysFor(d=>['sing','guitar','drum','theory','song'].some(x=>d.done[x]))>=10],
['🛡️','纪律守卫','守纪律累计 14 天',()=>everDone('disc',14)],['🚀','造物者','产品推进累计 10 天',()=>everDone('mvp',10)],
['🌈','全能日','一天内五大领域都有打卡',()=>maxDaysFor(d=>DOMS.every(x=>Object.keys(d.done).some(id=>{const h=hab(id.replace(/^train_.*/,'train'));return h&&h.dom===x.id})))>=1],
['💯','百炼','通关 10 次副本',()=>(S.raids||0)>=10],['🦾','银红战甲','达到 Lv16',T=>T.lv>=16]];
function renderAch(T){let n=0;badges.innerHTML=BADGES.map(([ic,nm,ds,fn],i)=>{const on=fn(T);if(on){n++;if(!S.badges[i]){S.badges[i]=today();save();setTimeout(()=>toast('🏆 解锁成就：'+nm),700)}}return `<div class="bd ${on?'on':''}"><div class="ic">${ic}</div><b>${nm}</b><small>${ds}</small></div>`}).join('');achc.textContent=n+'/'+BADGES.length}

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
save();render();
if(window._forceStage!==undefined){document.getElementById('stage').innerHTML=charSVG(window._forceStage);lv.textContent='Lv.'+STAGES[window._forceStage][0];stname.textContent=STAGES[window._forceStage][2]+' · '+STAGES[window._forceStage][1]}
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
if(q.get('raid')){go('raid');startRaid(q.get('raid'))}if(q.get('page'))go(q.get('page'));if(q.get('slot')){wslot=q.get('slot');render()}if(q.get('fit')){S.outfit=JSON.parse(q.get('fit'));render()}if(q.get('coins')){S.spent=-(+q.get('coins'));render()}if(q.get('pv'))document.getElementById('stage').click();
