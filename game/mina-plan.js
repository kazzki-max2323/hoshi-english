/* 👩‍🏫 ミナ先生が えらんで はじめる しくみ（MPLAN）
   ユーザーの 希望（2026-11-20）: 「何分？」は なし。 えらぶのは ミナ先生。 全部で いくつ・のこり いくつは 見せない
   - 🔥 きょうの授業（大きく。 自動では はじまらない: ユーザーの 希望 11/20）: ちょっと ふくしゅう 2問 → いまの 単元の つぎの 1時間 → おまけ（音・ことば・勉強の コツの ミニ授業）
       はじめての 単元は さいしょに 1問ずつ 聞いて、 わかる 時間は とばす（UNIT.probe）
   - 💪 特別授業: 苦手が いちばん 多い 単元を、 まちがえた 時間から 通しで
   - 📖 勉強: きょうの授業とは べつの 単元の 1時間（なければ 音・ことばの ミニ授業）
   - 📚 復習: 単元の まちがい → ミニ授業の まちがいノート → 苦手とっくん → 習った 単元 を じゅんばんに
   - ☕ おしゃべり: 先生役の 会話 か 長い おしゃべり
   単元の じゅんばんは ORDER（先に 習うと あとが 楽に なる じゅん。 まだ ない 単元は とばす）
   セリフは game/unit-lines.js（mp_ ・ x_mp）。 きろくは localStorage 'hoshi_plan' */
(()=>{
const {S:ST,sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const pickL=a=>a[Math.random()*a.length|0];
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const KEY='hoshi_plan';
const MP=(()=>{try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&typeof s==='object')return s}catch(e){}return {}})();
const keep=()=>{try{localStorage.setItem(KEY,JSON.stringify(MP))}catch(e){}};
const dk=d=>{d=d||new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const day=()=>{if(!MP.day||MP.day.d!==dk())MP.day={d:dk(),done:0,n:0};return MP.day};

/* ---------- 単元の じゅんばん ---------- */
const ORDER=['basic','past','future','count','ask','modal','perfect','toing','comp','passive','prep','form','rel','conj','subj','speech','adv'];
const units=()=>{const L=UNIT.list.slice();return ORDER.map(id=>L.find(u=>u.id===id)).filter(Boolean).concat(L.filter(u=>!ORDER.includes(u.id)))};
/* いまの 単元: まだ おわっていない（全部の 時間＋まとめテスト）さいしょの もの。 ぜんぶ おわったら ★が いちばん 少ない もの */
function cur(){const L=units();return L.find(u=>!u.done())||L.slice().sort((a,b)=>(a.rec().best||0)-(b.rec().best||0)||(a.rec().t||0)-(b.rec().t||0))[0]}
const chOf=u=>{const i=u.nextCh();return i==null?null:u.D.CH[i]};
/* いま 何を するか（ページの 表示と 同じ もの） */
function todayInfo(){const u=cur();if(!u)return null;const c=chOf(u),fresh=!u.started();
  return {u,c,fresh,test:!c,t:c?c.short:'まとめテスト'}}

/* ---------- おまけ: 音・ことば・勉強の コツの ミニ授業（文法の ミニ授業は 単元に 入った） ---------- */
const lesDone=id=>!!((MINA.rec().les||{})[id]);
function omake(){if(typeof LESSONS==='undefined')return null;let lv='jh';try{lv=MINA.level()}catch(e){}
  const tip=Math.random()<.3,cats=tip?['yarikata','kagaku']:['oto','kotsu','hama'];
  const ok=l=>cats.includes(l.cat)&&!lesDone(l.id),same=LESSONS.filter(l=>ok(l)&&l.lv===lv),any=LESSONS.filter(ok);
  return pickL(same.length?same:any)||null}
function omakeBtn(){const l=omake();if(!l)return ['👩‍🏫 ミナ先生に ほうこく ▶',()=>MINA.open()];
  return [`🎁 おまけ：${esc(l.t)} ▶`,()=>{try{LESSON.open(l.id,MINA.open)}catch(e){MINA.open()}}]}

/* ---------- 🔥 きょうの授業 ---------- */
function warmFrom(u){/* ほかの 単元（まちがいが ある もの 優先）か この 単元の おわった 時間から 2問 */
  const L=units().filter(x=>x.doneN()>0),w=L.filter(x=>x.missOf()>0),src=pickL(w.length?w:L);if(!src)return null;
  const qs=src.warmQs(2);return qs.length?{src,qs}:null}
function today(){const D=day(),I=todayInfo();if(!I)return;const u=I.u,label='🔥 きょうの 授業';
  const P={label,then:()=>D.done?null:omakeBtn(),done:()=>{D.done=1;D.n++;keep();try{RECENT.add('plan',{k:'today',u:u.id})}catch(e){}}};
  if(D.done){/* もう1時間: ふくしゅう・おまけ なし */P.then=null;u.go(P);return}
  if(I.fresh&&u.D.CH.length>2&&!u.rec().pr){u.probe(P);return}
  const W=warmFrom(u),start=()=>u.go(Object.assign({},P,{test:I.test}));
  if(W)W.src.warmRun(W.qs,label,start);else start()}

/* ---------- 💪 特別授業: 苦手が 多い 単元を まちがえた 時間から ---------- */
function weakUnit(){const L=units().filter(u=>u.started()),m=L.filter(u=>u.missOf()>0).sort((a,b)=>b.missOf()-a.missOf());if(m.length)return m[0];
  let w=[];try{w=SENSEI.weak()}catch(e){}const g=L.find(u=>u.gids().some(id=>w.includes(id)));if(g)return g;
  return L.find(u=>(u.rec().best||0)<3)||cur()}
function special(){const u=weakUnit();if(!u)return;const R=u.rec(),CH=u.D.CH;
  const miss=Object.keys(R.miss).map(Number).filter(i=>CH[i]).sort((a,b)=>R.miss[b]-R.miss[a]);
  const label=`💪 特別授業：${esc(u.D.title)}`;
  /* 通しで: その 時間の あと → つぎの まちがえた 時間 → まだの 時間 → まとめテスト */
  const queue=miss.length?miss:CH.map((c,i)=>i).filter(i=>!(R.ch[i]&&R.ch[i].d));
  const step=k=>{const ci=queue[k];if(ci==null){u.go({label,test:1,then:null});return}
    u.go({label,ci,then:()=>[queue[k+1]!=null?`▶ つぎ：${esc(CH[queue[k+1]].short)}`:'📝 まとめテストへ ▶',()=>step(k+1)]})};
  if(!queue.length){u.go({label,test:1});return}
  step(0)}
function specialName(){const u=weakUnit();return u?u.D.title:''}

/* ---------- 📖 勉強: べつの 単元の 1時間 ---------- */
function study(){const c=cur(),L=units().filter(u=>u!==c&&!u.done()),u=L.find(u=>u.started())||L[0];
  if(!u){const l=omake();if(l){SFX.lesson();LESSON.open(l.id,MINA.open)}else today();return}
  const P={label:'📖 勉強',then:()=>omakeBtn()};
  if(!u.started()&&u.D.CH.length>2&&!u.rec().pr){u.probe(P);return}
  u.go(Object.assign(P,{test:u.nextCh()==null}))}

/* ---------- 📚 復習: いろいろな ところから じゅんばんに 1つ ---------- */
function review(){const opts=[];
  const um=units().filter(u=>u.missOf()>0);if(um.length)opts.push(()=>um[0].review({label:'📚 復習'}));
  try{if(REVIEW.missN()>0)opts.push(()=>{SFX.lesson();REVIEW.drill('miss',MINA.open,5)})}catch(e){}
  try{if(REVIEW.dueIds().length)opts.push(()=>{SFX.lesson();REVIEW.drill('today',MINA.open)})}catch(e){}
  try{const w=SENSEI.weak();if(w.length)opts.push(()=>{SFX.step();SENSEI.tokkun(w.slice(0,3),0,'mina')})}catch(e){}
  const ud=units().filter(u=>u.doneN()>0);if(ud.length)opts.push(()=>pickL(ud).review({label:'📚 復習'}));
  if(!opts.length){const [ex,tx]=ML('mp_none');try{MINA.say(ex,tx,5000)}catch(e){}today();return}
  MP.rv=(MP.rv||0)+1;keep();opts[(MP.rv-1)%opts.length]()}

/* ---------- ☕ おしゃべり ---------- */
function chat(){let lv='es';try{lv=MINA.level();if(lv==='adv')lv='hs'}catch(e){}
  const sc=(window.SENSEI?SENSEI.scenes:[]).filter(s=>s.lv===lv),done=(window.SENSEI&&SENSEI.rec().done)||{};
  const fresh=sc.filter(s=>!done[s.id]),scene=pickL(fresh.length?fresh:sc);
  MP.ct=(MP.ct||0)+1;keep();
  if(scene&&(MP.ct%2||!window.MCHAT)){SFX.talk();SENSEI.play(scene.id,'mina');return}
  if(window.MCHAT){SFX.talk();MCHAT.open(null,MINA.open);return}
  if(window.SENSEI)SENSEI.open()}

/* ---------- ミナ先生の ページの 上の ぶぶん（game/mina.js） ---------- */
let cdT=null,snooze=0;
/* まだ 聞いていない ミナ先生の うんちく（game/unchiku-data.js の UNK_MINA）。 きょうの うんちく（ほかも やる の 中）とは べつの もの */
function unkPick(p){if(typeof UNK_MINA==='undefined'||!window.UNK||Math.random()>p)return null;let td=-1;try{td=UNK.todayIdx()}catch(e){}
  const L=UNK_MINA.map((t,i)=>i).filter(i=>i!==td&&!UNK.heard('mina',i));if(!L.length)return null;const i=pickL(L);UNK.hear('mina',i);return {i,t:UNK_MINA[i]}}
function page(from){const D=day(),I=todayInfo();let ex='smile',say='',sub='',auto=false;
  if(!I){[ex,say]=ML('mp_done')}
  else if(D.done){[ex,say]=ML('mp_done');sub='もう 1時間'}
  else{[ex,say]=I.fresh?ML('mp_new',{u:I.u.D.title}):I.test?ML('mp_test',{u:I.u.D.title}):ML('mp_hello',{u:I.u.D.title,t:I.t})}
  /* たまに うんちく（ユーザーが うんちく好き）: きょうの授業の あとは 半分、 ふだんは 3回に 1回くらい */
  const U=unkPick(D.done?.5:.33);if(U){[ex,say]=ML('mp_unk',{t:esc(U.t[0]),ja:esc(U.t[2])});say+=` <button class="ksay mpunk" id="mpunk" data-en="${esc(U.t[1])}" aria-label="英語で 聞く">🔊</button>`}
  const sp=specialName();
  return {auto,html:`<div class="mpcard${auto?' cd':''}" id="mpcard">
    <div class="stsay"><span class="lface">${MINA.face('m',ex)}</span><p>${say}</p></div>
    <button class="mpgo${D.done?' done':''}" id="mpgo"><span class="mpico">${D.done?'🌟':'🔥'}</span><span class="mptx"><small>${D.done?'きょうの 授業 おわり！':'きょうの 授業'}</small><b>${I?esc(I.u.D.title)+'　'+esc(I.t):''}</b></span><span class="mpplay"><i id="mpcd">${auto?3:'▶'}</i>${sub?`<small>${sub}</small>`:''}</span></button>
    ${auto?'<button id="mplater" class="sub stlater">あとで</button>':''}
  </div>
  <button class="mpsp" id="mpsp"><span>💪</span><b>特別授業</b><small>${esc(sp)}</small></button>
  <div class="st3 mp3"><button id="mpst"><span>📖</span><b>勉強</b></button><button id="mprv"><span>📚</span><b>復習</b></button><button id="mpct"><span>☕</span><b>おしゃべり</b></button></div>`}}
function stopCd(){if(cdT){clearInterval(cdT);cdT=null}const c=$('mpcard');if(c){c.classList.remove('cd');const i=$('mpcd');if(i)i.textContent='▶';const l=$('mplater');if(l)l.remove()}}
function bind(info){const g=$('mpgo');if(!g)return;
  g.onclick=()=>{stopCd();SFX.lesson();today()};
  $('mpsp').onclick=()=>{stopCd();SFX.lesson();special()};
  $('mpst').onclick=()=>{stopCd();SFX.lesson();study()};
  $('mprv').onclick=()=>{stopCd();SFX.lesson();review()};
  $('mpct').onclick=()=>{stopCd();chat()};
  const uk=$('mpunk');if(uk)uk.onclick=e=>{e.stopPropagation();SFX.pop();try{SENSEI.talk(uk.dataset.en)}catch(er){}};
  const lt=$('mplater');if(lt)lt.onclick=e=>{e.stopPropagation();SFX.pop();stopCd();snooze=Date.now()+30*60000;const [,t]=ML('mp_later');const p=$('mpcard').querySelector('.stsay p');if(p)p.textContent=t};
  if(!info.auto)return;
  /* ホームから 来た ときは 3びょうで 自動スタート（前と 同じ）。 ほかを さわったら とまる */
  let n=3;cdT=setInterval(()=>{const i=$('mpcd');if(!i||H.screen!=='mina'){stopCd();return}n--;if(n>0){i.textContent=n;return}stopCd();today()},1000);
  const stop=e=>{if(e.target.closest('#mpgo,#mplater'))return;stopCd();H.panel.removeEventListener('pointerdown',stop,true)};
  H.panel.addEventListener('pointerdown',stop,true)}

/* ---------- ホームの 「きょうの授業」カード（前の ミニ授業の カードを 入れかえる） ---------- */
function homeCard(){const v=H.panel.querySelector('.home .row');if(!v)return;const o=$('lcard');if(o)o.remove();const I=todayInfo();if(!I)return;const D=day();
  v.insertAdjacentHTML('beforebegin',`<div class="lcard2${D.done?' done':''}" id="lcard"><button class="lcgo" id="mphome"><span class="lcico">${D.done?'🌟':'🔥'}</span>
    <span class="lctx"><small>${D.done?'✅ きょうの 授業 クリア！':'🔥 きょうの 授業'}</small><b>${esc(I.u.D.title)}　${esc(I.t)}</b></span><span class="lcplay">${D.done?'もう1時間':'はじめる'} ▶</span></button></div>`);
  $('mphome').onclick=()=>{SFX.lesson();today()}}
H.on('home',()=>setTimeout(homeCard,0));if(H.screen==='home')setTimeout(homeCard,0);

/* ---------- ホームの ミナ先生の ひとこと: 「何分？」と ミニ授業の きょうの1本 は やめて、 こっちに ---------- */
try{const RL=MINA_SENSE._rules,drop=['x_stAsk','x_stNext','x_lesToday','x_lesStreakKeep','x_lesMore','x_lesStreakLost','x_dpWeak','x_dpCurious','x_dpCheck','x_dpMaster'];
  for(let i=RL.length-1;i>=0;i--)if(drop.includes(RL[i][0]))RL.splice(i,1);
  const go=()=>['🔥 きょうの 授業',()=>today()];
  RL.push(['x_mpToday',6,F=>{const D=day(),I=todayInfo();return !D.done&&I&&!I.fresh?{u:I.u.D.title,t:I.t}:null},go]);
  RL.push(['x_mpNew',4,F=>{const D=day(),I=todayInfo();return !D.done&&I&&I.fresh?{u:I.u.D.title}:null},go]);
  RL.push(['x_mpWeak',3,F=>{const u=units().find(u=>u.missOf()>=2);return u?{u:u.D.title}:null},()=>['💪 特別授業',()=>special()]]);
  RL.push(['x_mpRev',2,F=>units().some(u=>u.doneN()>0&&u.rec().t&&Date.now()-u.rec().t>2*864e5)?{}:null,()=>['📚 復習',()=>review()]]);
}catch(e){console.error(e)}

window.MPLAN={page,bind,today,special,study,review,chat,cur,todayInfo,units,doneToday:()=>!!day().done,rec:()=>MP,_stop:stopCd};
})();
