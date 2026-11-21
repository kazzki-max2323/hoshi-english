/* 📘 のこりの 単元（11/21 ミナ先生まわり 作りなおし 3回目）
   文法ノート（GRAMMAR）・とことん授業（DEEP_DATA）・先生の 会話の 文法チェック（SENSEI_DRILL / SENSEI_ERR）を
   特別授業（game/unit.js）の 形に 組みなおす。 中身は ほぼ 流用: 1つの 文法ノート ＝ 1時間
   - カード: ひとことで（＋図）→ ルール（＋例文）→ なんで？（＋覚え方）→ にてる 文法との ちがい → よくある 疑問（2つまで）
   - たしかめ: 文法ノートの 空らん ＋ 会話の 文法チェック。 ヒントと 解説は よく ある まちがい（SENSEI_ERR）から
     会話チェックの まちがい選択肢には 🤔教えて 用の 「なぜ ちがう？」も つく（TEACH_WHY）
   - 📄まとめ 1まい ＝ 前の 文法ノートの 役目
   とことん授業の 入口（DEEP.open）は、 その 文法の 時間へ つなぎかえる。 セリフは u_（unit-lines.js）と この ファイルの さいご */
(()=>{
if(!window.UNIT||typeof GRAMMAR==='undefined')return;
const DD=typeof DEEP_DATA!=='undefined'?DEEP_DATA:{},ERR=typeof SENSEI_ERR!=='undefined'?SENSEI_ERR:{},DR=typeof SENSEI_DRILL!=='undefined'?SENSEI_DRILL:{};
const NOTE={};['es','jh','hs'].forEach(lv=>(GRAMMAR[lv]?GRAMMAR[lv].notes:[]).forEach(n=>NOTE[n.id]=Object.assign({lv},n)));
const strip=t=>String(t||'').replace(/<[^>]+>/g,'');
const cap=t=>t&&t.charAt(0).toUpperCase()+t.slice(1);
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const words=t=>(String(t).toLowerCase().match(/[a-z']+/g)||[]);
const overlap=(a,b)=>{const B=new Set(words(b));return words(a).filter(w=>B.has(w)&&w.length>1).length};
const shortOf=t=>String(t).split(/[（(]/)[0].trim();

/* 単元と 時間（文法ノートの id） */
const PLAN=[
 ['basic','🌱','文の きほん',['es_be','es_heshe','es_this','es_like','jh_be','jh_do','jh_3s','jh_pron','jh_imp']],
 ['past','⏪','いまと 過去',['es_past','jh_prog','jh_past1','jh_past2','jh_pastprog']],
 ['future','🔮','未来と 夢',['es_want','es_dream','jh_future']],
 ['count','🍎','数と a / the',['es_plural','es_howmany','jh_plural','jh_art','hs_quant']],
 ['ask','❓','たずねる',['es_time','es_way','jh_wh','jh_indq']],
 ['toing','🎯','to と -ing',['jh_inf','jh_ger','hs_inf2','hs_ginf']],
 ['passive','🔄','受け身と 「させる」',['jh_passive','hs_passive2','hs_caus']],
 ['prep','📍','前置詞',['es_place','jh_prep']],
 ['form','🧱','文の 形',['jh_there','jh_svoo','hs_5']],
 ['rel','🔗','名詞を 説明する',['jh_part','jh_rel','hs_rel2','hs_reladv','hs_partc']],
 ['conj','🤝','文を つなぐ',['jh_conj','hs_conj2']],
 ['subj','💭','仮定法',['jh_subj','hs_subj2']],
 ['speech','💬','人の 話を 伝える',['hs_speech','hs_seq']],
 ['adv','🏔️','上級の 形',['jh_perfprog','hs_tense','hs_modperf','hs_comp2','hs_emph','hs_neg','hs_noun','hs_ellip']]];

const errsOf=gid=>Object.keys(ERR).filter(k=>ERR[k][0]===gid);
function errFor(gid,text){const ks=errsOf(gid);if(!ks.length)return null;
  const best=ks.map(k=>[k,overlap(text,ERR[k][1]+' '+ERR[k][2])]).sort((a,b)=>b[1]-a[1])[0];return best[1]>0?best[0]:null}
const ruleFor=(n,text)=>n.r.map(r=>[r,overlap(text,r)]).sort((a,b)=>b[1]-a[1])[0][0];

/* ---------- カード ---------- */
const ul=a=>`<ul class="uarul">${a.map(x=>`<li>${x}</li>`).join('')}</ul>`;
function cards(gid){const n=NOTE[gid],d=DD[gid]||{},out=[];
  out.push({x:'happy',say:d.one?`<b>${shortOf(n.t)}</b>は ひとことで 言うと…<br>${d.one}`:`きょうは <b>${n.t}</b>`,f:d.fig||''});
  out.push({x:'smile',say:`ルールは この ${n.r.length}つ。 例文と いっしょに 見てね`,f:ul(n.r),ex:n.ex});
  if(d.why)out.push({x:'think',say:`<b>なんで？</b> ${d.why}`,f:d.tip?`<p class="mdnote">💡 ${d.tip}</p>`:''});
  else if(d.tip)out.push({x:'proud',say:`<b>覚え方</b> ${d.tip}`});
  if(d.vs&&NOTE[d.vs[0]])out.push({x:'wow',say:`にている 「${shortOf(NOTE[d.vs[0]].t)}」との ちがい。 ${d.vs[1]}`,f:d.vs[2]||''});
  (d.qa||[]).slice(0,2).forEach(q=>out.push({x:'smile',say:`<b>🙋 ${q[0]}</b><br>${q[1]}`,f:q[2]||''}));
  return out.slice(0,6)}

/* ---------- たしかめの 問題（o[0] が 正解） ---------- */
const WHY=window.TEACH_WHY=window.TEACH_WHY||{};
function noteQs(gid){const n=NOTE[gid],d=DD[gid]||{};return (n.q||[]).concat(d.qz||[]).map(q=>{const ans=q[1][q[2]],full=q[0].replace('___',ans),ek=errFor(gid,full),rule=ruleFor(n,full);
  return {s:q[0],ja:q[3]||'',o:[ans].concat(q[1].filter((x,i)=>i!==q[2])),h:q[4]||(ek?strip(ERR[ek][1]):'ルールを 思い出して：'+strip(rule)),e:q[5]||(ek?strip(ERR[ek][2]):strip(rule))}})}
function drillQs(gid,max){if(!window.SENSEI||!SENSEI.fill)return [];const n=NOTE[gid];
  return shuffle((DR[gid]||[]).filter(x=>x.bad&&x.bad.length)).slice(0,max).map(x=>{const V={},F=t=>cap(SENSEI.fill(t,V)),s=F(x.s),ja=SENSEI.fill(x.j,V),good=F(x.good[0]);
    const bad=x.bad.slice(0,2).map(b=>({t:F(b[0]),ek:b[1]&&ERR[b[1]]?b[1]:null}));const ek=(bad.find(b=>b.ek)||{}).ek;
    const p=`「${s}」（${ja}）と 聞かれたら？`,w=WHY[p]=WHY[p]||{};
    bad.forEach(b=>{w[b.t]=b.ek?strip(ERR[b.ek][2]):'英語の 形は いいけど、 質問と 話が かみあわない 答え'});
    return {p,o:[good].concat(bad.map(b=>b.t)),h:ek?strip(ERR[ek][1]):'ルールを 思い出して：'+strip(ruleFor(n,good)),e:ek?strip(ERR[ek][2]):`${good} が しぜんな 答え。 ${strip(ruleFor(n,good))}`}})}

/* ---------- 組み立て ---------- */
const BY_G={};
PLAN.forEach(([id,ico,title,gids])=>{if(UNIT.get(id))return;const gs=gids.filter(g=>NOTE[g]);if(!gs.length)return;
  const CH=gs.map(g=>{const n=NOTE[g],d=DD[g]||{},qs=noteQs(g).concat(drillQs(g,3));
    return {ico:{es:'🐣',jh:'🎒',hs:'🎓'}[n.lv]||'📘',t:n.t,short:shortOf(n.t),g,lv:n.lv,cards:cards(g),q:qs,
      sum:{pt:d.one||strip(n.r[0]),f:ul(n.r),memo:d.tip||''}}}).filter(c=>c.q.length);
  if(!CH.length)return;
  const U=UNIT.make({id,ico,title,gid:CH[0].g,CH,MIX:[]});CH.forEach((c,ci)=>BY_G[c.g]=[U,ci])});
/* 4つの 特別授業の 中の 文法も */
['modal','perfect','comp','shikumi'].forEach(id=>{const u=UNIT.get(id);if(!u)return;u.D.CH.forEach((c,ci)=>{const g=c.g||u.D.gid;if(g&&!BY_G[g])BY_G[g]=[u,ci]})});
UNIT.byGram=gid=>BY_G[gid]||null;

/* ---------- とことん授業・文法ノートの 入口を その 時間へ ---------- */
function openG(gid){const f=BY_G[gid];if(!f)return false;try{f[0].open({ch:f[1]})}catch(e){return false}return true}
UNIT.openGram=openG;
if(window.DEEP&&DEEP.open){const o=DEEP.open;DEEP.open=function(gid){if(gid&&openG(gid))return;return o.apply(this,arguments)}}

/* ---------- セリフ ---------- */
Object.assign(MINA_LINES,{
 x_uaNew:[['happy','文法ノートと とことん授業を、 1つの 「授業」に まとめなおしたよ。 カードで ゆっくり 見られるから ためしてね'],['smile','授業が ぜんぶ 同じ 形に なったよ。 わからない 問題は 🤔 教えて を おしてね']]
});
})();
