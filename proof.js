'use strict';
/* ---------- proofs (证明) + day review + Veronica summaries ---------- */
const LIM={image:30e6,video:100e6,audio:20e6,file:100e6},TIC={text:'📝',image:'🖼',audio:'🎙',video:'🎬',file:'📄'};
let SUM={};try{SUM=JSON.parse(localStorage.getItem('lq_sum')||'{}')}catch(e){}
const idb=new Promise((ok,no)=>{const r=indexedDB.open('lq',1);r.onupgradeneeded=()=>r.result.createObjectStore('b');r.onsuccess=()=>ok(r.result);r.onerror=no});
const ip=(m,k,v)=>idb.then(db=>new Promise((ok,no)=>{const t=db.transaction('b',m==='get'?'readonly':'readwrite').objectStore('b'),q=m==='get'?t.get(k):m==='put'?t.put(v,k):t.delete(k);q.onsuccess=()=>ok(q.result);q.onerror=no}));
const pid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const proofsFor=(date,h)=>(S.proofs||[]).filter(p=>p.date===date&&(!h||p.habit===h));
const fmtSize=n=>n>1e6?(n/1e6).toFixed(1)+'MB':Math.ceil(n/1e3)+'KB';
const hname=id=>id.startsWith('train_')?'副本 '+id.slice(6):(hab(id)||{}).name||id;
function imgCompress(file,max,q){return new Promise((ok,no)=>{const u=URL.createObjectURL(file),im=new Image();im.onload=()=>{let w=im.naturalWidth,h=im.naturalHeight,s=Math.min(1,max/Math.max(w,h));const c=document.createElement('canvas');c.width=w*s|0;c.height=h*s|0;c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(b=>b?ok(b):no(new Error('压缩失败')),'image/jpeg',q)};im.onerror=()=>no(new Error('无法读取图片'));im.src=u})}
function videoThumb(file){return new Promise(ok=>{const v=document.createElement('video'),u=URL.createObjectURL(file);let done=0;const fin=b=>{if(done++)return;URL.revokeObjectURL(u);ok(b)};v.muted=true;v.playsInline=true;v.preload='metadata';v.src=u;
 v.onloadeddata=()=>{try{v.currentTime=Math.min(.5,(v.duration||1)/2)}catch(e){fin(null)}};v.onseeked=()=>{try{const s=Math.min(1,240/Math.max(v.videoWidth,v.videoHeight)),c=document.createElement('canvas');c.width=v.videoWidth*s|0;c.height=v.videoHeight*s|0;c.getContext('2d').drawImage(v,0,0,c.width,c.height);c.toBlob(b=>fin(b),'image/jpeg',.7)}catch(e){fin(null)}};v.onerror=()=>fin(null);setTimeout(()=>fin(null),6000)})}
function extOf(name,type){const m=(name||'').match(/\.([a-z0-9]{1,5})$/i);if(m)return m[1].toLowerCase();return({'image/jpeg':'jpg','audio/mp4':'m4a','audio/webm':'webm','audio/ogg':'ogg','video/mp4':'mp4','video/quicktime':'mov','video/webm':'webm'})[(type||'').split(';')[0]]||'bin'}
function ensureDone(h,date){const d=day(date);if(h==='train'||h.startsWith('train_')||d.done[h]!==undefined)return;const H=hab(h);if(H&&!H.auto)d.done[h]=H.xp}
function bonus(h,date){const d=day(date);if(d.done['proof_'+h]===undefined){d.done['proof_'+h]=2;toast('+2 XP · 证明奖励')}}
async function addProof(h,date,type,src,name){const cap=(document.getElementById('pfcap')||{}).value||'';
 const m={id:pid(),habit:h,date,type,name:name||'',caption:cap.trim(),createdAt:Date.now(),st:'up'};
 try{if(type==='text'){if(!src.trim())return;m.text=src.trim().slice(0,2000);m.size=m.text.length}
 else{let blob=src,thumb=null;
  if(src.size>LIM[type]){toast(`文件太大（${fmtSize(src.size)}），${({image:'图片',video:'视频',audio:'音频',file:'文件'})[type]}上限 ${fmtSize(LIM[type])}`);return}
  if(type==='image'){toast('压缩中…');blob=await imgCompress(src,1600,.8);thumb=await imgCompress(src,240,.7)}
  if(type==='video')thumb=await videoThumb(src);
  m.size=blob.size;m.mime=blob.type||src.type;m.ext=type==='image'?'jpg':extOf(name,src.type);m.st='pending';
  await ip('put',m.id,blob);if(thumb){await ip('put',m.id+'_t',thumb);m.hasThumb=1}}
 }catch(e){toast('添加失败：'+e.message);return}
 S.proofs=S.proofs||[];S.proofs.push(m);ensureDone(h,date);bonus(h,date);save();render();proofModal(h,date);uploadQueue()}
let upBusy=false,upT=null;
async function uploadQueue(){if(upBusy||!tok())return;upBusy=true;let changed=false;
 try{for(const m of (S.proofs||[]).filter(p=>p.st==='pending')){
  const b=await ip('get',m.id);if(!b){m.st='lost';changed=true;continue}
  const post=async(blob,ext)=>{const r=await fetch(`api/media?date=${m.date}&ext=${ext}`,{method:'POST',headers:{'X-Sync-Token':tok()},body:blob});if(r.status===413)throw Object.assign(new Error('文件太大'),{fatal:1});if(r.status===401||r.status===429)throw Object.assign(new Error(r.status===401?'口令错误':'尝试太多，请 15 分钟后再试'),{auth:1});if(!r.ok)throw new Error('HTTP '+r.status);return (await r.json()).file};
  try{m.file=await post(b,m.ext);if(m.hasThumb){const t=await ip('get',m.id+'_t');if(t)m.thumb=await post(t,'jpg')}}catch(e){if(e.fatal){m.st='lost';changed=true;continue}throw e}
  m.st='up';changed=true;await ip('del',m.id);await ip('del',m.id+'_t');save()}
 }catch(e){clearTimeout(upT);if(!e.auth)upT=setTimeout(uploadQueue,30000)}finally{upBusy=false;if(changed)render()}}
addEventListener('online',uploadQueue);
const urlCache={};
async function mediaURL(m,thumb){const key=m.id+(thumb?'_t':'');if(urlCache[key])return urlCache[key];
 let b=await ip('get',key).catch(()=>null);
 if(!b){const f=thumb?m.thumb:m.file;if(!f)return null;const r=await fetch('api/media/'+f,{headers:{'X-Sync-Token':tok()}});if(!r.ok)return null;b=await r.blob()}
 return urlCache[key]=URL.createObjectURL(b)}
function hydrate(root){(root||document).querySelectorAll('[data-pf]').forEach(async e=>{const m=(S.proofs||[]).find(p=>p.id===e.dataset.pf);if(!m)return;const u=await mediaURL(m,e.dataset.t==='1');if(u){e.src=u;e.classList.add('ld')}})}
function proofItem(m,small){const cap=m.caption?`<div class="pcap">${esc(m.caption)}</div>`:'';const pend=m.st==='pending'?'<span class="pst">⏳待上传</span>':m.st==='lost'?'<span class="pst" style="color:var(--red)">上传失败</span>':'';
 if(m.type==='text')return `<div class="pfi pt">📝 ${esc(m.text)}${cap}</div>`;
 if(m.type==='image')return `<div class="pfi"><img data-pf="${m.id}" data-t="${small?1:0}" onclick="viewer('${m.id}')" alt="">${pend}${cap}</div>`;
 if(m.type==='video')return small?`<div class="pfi"><img data-pf="${m.id}" data-t="1" onclick="viewer('${m.id}')" alt=""><span class="play">▶</span>${pend}${cap}</div>`:`<div class="pfi pw"><video data-pf="${m.id}" controls playsinline preload="metadata"></video>${pend}${cap}</div>`;
 if(m.type==='audio')return `<div class="pfi pw"><audio data-pf="${m.id}" controls preload="none"></audio>${pend}${cap}</div>`;
 return `<div class="pfi pw pt">📄 <a href="#" onclick="openFile('${m.id}');return false">${esc(m.name||'文件')}</a> <span class="mut">${fmtSize(m.size||0)}</span>${pend}${cap}</div>`}
async function openFile(id){const m=S.proofs.find(p=>p.id===id),u=await mediaURL(m);if(!u)return toast('加载失败');const a=document.createElement('a');a.href=u;a.download=m.name||'file';a.click()}
async function viewer(id){const m=S.proofs.find(p=>p.id===id);modalShow('<div class="mut">加载中…</div>');const u=await mediaURL(m);if(!u){modalShow('<div class="mut">加载失败（未同步或离线）</div>');return}
 modalShow((m.type==='video'?`<video src="${u}" controls autoplay playsinline style="width:100%;max-height:70vh;background:#000"></video>`:`<img src="${u}" style="width:100%;max-height:75vh;object-fit:contain;image-rendering:auto">`)+(m.caption?`<p>${esc(m.caption)}</p>`:'')+`<button class="btn gh" style="width:100%;margin-top:10px" onclick="modal.classList.remove('on')">关闭</button>`);mbox.classList.add('wide')}
function delProof(id,h,date){if(!confirm('删除这条证明？'))return;const m=S.proofs.find(p=>p.id===id);S.proofs=S.proofs.filter(p=>p.id!==id);ip('del',id);ip('del',id+'_t');
 if(m&&m.st==='up'&&tok())[m.file,m.thumb].filter(Boolean).forEach(f=>fetch('api/media/'+f,{method:'DELETE',headers:{'X-Sync-Token':tok()}}).catch(()=>{}));
 if(!proofsFor(date,h).length)delete day(date).done['proof_'+h];save();render();proofModal(h,date)}
function pick(type,h,date,accept,capture,multi){const i=document.createElement('input');i.type='file';i.accept=accept;if(capture)i.setAttribute('capture',capture);if(multi)i.multiple=true;
 i.onchange=async()=>{for(const f of i.files)await addProof(h,date,type==='auto'?(f.type.startsWith('image')?'image':f.type.startsWith('video')?'video':f.type.startsWith('audio')?'audio':'file'):type,f,f.name)};i.click()}
let rec=null;
async function recAudio(h,date){if(rec){rec.stop();return}if(!window.MediaRecorder||!navigator.mediaDevices){pick('audio',h,date,'audio/*','',false);return}
 try{const st=await navigator.mediaDevices.getUserMedia({audio:true}),mt=['audio/mp4','audio/webm','audio/ogg'].find(t=>MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(t))||'';
  const r=new MediaRecorder(st,mt?{mimeType:mt}:{}),ch=[],t0=Date.now();rec=r;r.ondataavailable=e=>ch.push(e.data);
  const tick=setInterval(()=>{const b=document.getElementById('recb');if(b)b.textContent='■ 停止 '+Math.floor((Date.now()-t0)/1000)+'s'},500);
  r.onstop=()=>{clearInterval(tick);st.getTracks().forEach(t=>t.stop());rec=null;const b=new Blob(ch,{type:r.mimeType||mt||'audio/webm'});addProof(h,date,'audio',b,'录音'+new Date().toTimeString().slice(0,5).replace(':','')+'.'+extOf('',b.type))};
  r.start();const b=document.getElementById('recb');if(b){b.classList.remove('gh');b.textContent='■ 停止 0s'}}catch(e){toast('无法录音：'+(e.message||'没有麦克风权限'))}}
function proofModal(h,date=today()){const d=day(date),done=h==='train'?Object.keys(d.done).some(k=>k.startsWith('train_')):d.done[h]!==undefined,ps=proofsFor(date,h);
 modalShow(`<div class="ttl" style="font-size:18px">${hname(h)} · 证明</div><div class="mut">${date} · 可选，不强制 · 每项每天首个证明 +2 XP</div>
 <div class="pgrid">${ps.map(m=>`<div class="pwrap">${proofItem(m,1)}<button class="px" onclick="delProof('${m.id}','${h}','${date}')">✕</button></div>`).join('')||'<div class="mut" style="grid-column:1/-1;padding:10px">还没有证明</div>'}</div>
 <input id="pfcap" placeholder="说明（可选，附在下一个证明上）" style="margin:8px 0">
 <textarea id="pftx" rows="2" placeholder="写点什么：做了什么、感受、数据…"></textarea>
 <div class="pbtns"><button class="btn gh" onclick="addProof('${h}','${date}','text',pftx.value)">📝 文字</button><button class="btn gh" onclick="pick('image','${h}','${date}','image/*','',true)">🖼 照片</button>
 <button class="btn gh" id="recb" onclick="recAudio('${h}','${date}')">🎙 录音</button><button class="btn gh" onclick="pick('video','${h}','${date}','video/*','',false)">🎬 视频</button>
 <button class="btn gh" onclick="pick('audio','${h}','${date}','audio/*','',true)">🎵 音频</button><button class="btn gh" onclick="pick('auto','${h}','${date}','*/*','',true)">📄 文件</button></div>
 <div class="row" style="margin-top:8px">${done&&h!=='train'&&h!=='water'?`<button class="btn gh" style="flex:1;color:var(--red)" onclick="undoHabit('${h}','${date}')">取消打卡</button>`:''}<button class="btn gold" style="flex:1" onclick="modal.classList.remove('on')">完成</button></div>`);
 mbox.classList.add('wide');hydrate(mbox)}
function undoHabit(h,date){if(!confirm('取消这项打卡？（证明会保留）'))return;const d=day(date);delete d.done[h];delete d.done['proof_'+h];if(d.notes)delete d.notes[h];save();render();modal.classList.remove('on')}
/* ---------- 当日回顾 ---------- */
let dayK=null;
function openDay(k){dayK=k;go('day');renderDay()}
function renderDay(){const el=document.getElementById('dayv');if(!el||!dayK)return;const k=dayK,d=S.days[k]||{done:{},notes:{},water:0},raw=rawXP(d),wd='日一二三四五六'[pd(k).getDay()];
 let before=0;for(const x in S.days)if(x<k)before+=Math.min(CAP,rawXP(S.days[x]));const lvAt=x=>{let l=1;while(x>=need(l)){x-=need(l);l++}return l},l0=lvAt(before),l1=lvAt(before+Math.min(CAP,raw));
 const ps=proofsFor(k),tm=id=>{const m=ps.filter(p=>p.habit===id).sort((a,b)=>a.createdAt-b.createdAt)[0];return m?new Date(m.createdAt).toTimeString().slice(0,5):''};
 const trains=Object.keys(d.done).filter(x=>x.startsWith('train_'));
 const groups=DOMS.map(x=>{const ids=Object.keys(d.done).filter(id=>!id.startsWith('proof_')&&((id.startsWith('train_')&&x.id==='fit')||(hab(id)||{}).dom===x.id));
  const pOnly=[...new Set(ps.filter(p=>(hab(p.habit)||{}).dom===x.id&&!ids.includes(p.habit)&&!(p.habit==='train'&&trains.length)).map(p=>p.habit))];
  const all=[...ids,...pOnly];if(!all.length)return'';
  return `<div class="dom open"><div class="dh">${x.ic}<b>${x.name}</b><span class="mut" style="margin-left:auto">${ids.length} 项</span></div><div class="items">${all.map(id=>{const pp=ps.filter(p=>p.habit===id||(id.startsWith('train_')&&p.habit==='train'));const note=(d.notes||{})[id];
   return `<div class="q ${ids.includes(id)?'done':''}" style="display:block"><div style="display:flex;gap:8px;align-items:center"><span class="ck">${ids.includes(id)?'✓':''}</span><b style="flex:1;font-weight:400">${hname(id)}</b><span class="mut">${tm(id)}</span><span class="xp">${d.done[id]?'+'+d.done[id]:''}${d.done['proof_'+id]?' +2':''}</span></div>${note?`<div class="mut" style="margin:6px 0 0 30px">📝 ${esc(note)}</div>`:''}${pp.length?`<div class="pgrid">${pp.map(m=>proofItem(m,0)).join('')}</div>`:''}<button class="chip" style="margin:8px 0 0 30px" onclick="proofModal('${id.startsWith('train_')?'train':id}','${k}')">＋ 证明</button></div>`}).join('')}</div></div>`}).join('');
 const sm=SUM[k];
 el.innerHTML=`<div class="card"><div class="row"><button class="btn gh" onclick="go('hist')">◀ 返回</button><div style="margin-left:auto;text-align:right"><div class="lv" style="font-size:24px">${k.slice(5).replace('-','月')}日 周${wd}</div><div class="mut">${k}</div></div></div>
 <div class="attrs" style="grid-template-columns:repeat(4,1fr)"><div class="attr" style="color:var(--gold)">${pi('bolt','s')}<b>+${Math.min(CAP,raw)}</b><span class="mut">XP</span></div><div class="attr" style="color:var(--red)">${pi('star','s')}<b>${l1>l0?'Lv'+l0+'→'+l1:'Lv'+l1}</b><span class="mut">等级</span></div><div class="attr" style="color:var(--cy)">${pi('drop','s')}<b>${d.water||0}</b><span class="mut">ml</span></div><div class="attr" style="color:var(--grn)">${pi('sword','s')}<b>${trains.map(x=>x.slice(6)).join('')||'—'}</b><span class="mut">训练</span></div></div>
 <div class="mut" style="margin-top:10px">🍳 ${['breakfast','lunch','dinner'].map(m=>hab(m).name+'：'+(d.done[m]!==undefined?((d.notes||{})[m]||'✓'):'—')).join('　')}<br>🌙 睡觉：${d.done.bed===undefined?'—':d.done.bed?'23:00 前上床 ✓':'晚于 23:00'} · 证明 ${ps.length} 条</div></div>
 ${sm?`<div class="card vsum"><h2>${pi('shield','s')}Veronica 的当日总结<small>${new Date(sm.createdAt).toLocaleString('zh-CN',{hour12:false})}</small></h2><div class="sumt">${esc(sm.text)}</div></div>`:''}
 <div class="card"><h2>${pi('scroll','s')}完成记录</h2>${groups||'<p class="mut">这天没有记录</p>'}</div>`;hydrate(el)}
async function pullSummaries(){if(!tok())return;try{const r=await fetch('api/summaries',{headers:{'X-Sync-Token':tok()},cache:'no-store'});if(r.ok){SUM=await r.json();localStorage.setItem('lq_sum',JSON.stringify(SUM));renderSumToday();renderDay()}}catch(e){}}
function renderSumToday(){const e=document.getElementById('sumtoday');if(!e)return;const sm=SUM[today()]||null;e.style.display=sm?'block':'none';if(sm)e.innerHTML=`<h2>${pi('shield','s')}Veronica 的今日总结</h2><div class="sumt">${esc(sm.text)}</div>`}
