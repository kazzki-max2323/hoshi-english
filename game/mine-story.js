/* 📜 鉱山の 小さな お話: 5まい ほりだしたら、 その 5つの ことばが 入った 短い 英文が 岩の 奥から 出てくる（game/mine.js の floorClear から）
   - 形は 古い 鉱夫の 日記・びんの 手紙・かべの 落書き・ミオの メモ など（FRAMES）。 1行に 1つの ことば（例文は 📖くわしく と 同じ WI.exOf → 文カード → きまった 形）
   - 1行ずつ タップで 読む・🇯🇵 日本語を 見る。 「読めた！」で 2問（日本語に 合う 行を えらぶ・あなうめ）。 ヒント → 解説（苦手とっくんと 同じ 形）
   - 正解の 数で ボーナス（0問でも 少し もらえる。 失敗なし） */
(()=>{
const {sfx:SFX}=BEACH;
const H=HE,esc=H.esc,$=id=>document.getElementById(id);
const C=CG,pickL=a=>a[Math.random()*a.length|0];
const sf=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const ML=(k,v)=>{try{return MINA.line(k,v||{})}catch(e){return ['smile','']}};
const head1=I=>I.en.split(',')[0].trim();

/* お話の 形。 {n}=何日目 など 小さな 数・{fl}=階 */
const FRAMES=[
 {ico:'📔',n:'古い 鉱夫の 日記',o:["Day {n}. I am deep in the mine again.","{n}日目。 また 鉱山の 奥に いる。"],c:["I will write more tomorrow.","あした また 書こう。"]},
 {ico:'🍾',n:'岩に はさまった びんの 手紙',o:["Hello, whoever finds this bottle!","この びんを 見つけた だれかへ！"],c:["Please keep these words safe.","この ことばたちを だいじに してね。"]},
 {ico:'🪨',n:'かべの 落書き',o:["A miner wrote these lines on the wall.","ある 鉱夫が かべに この 文を 書いた。"],c:["— a miner who never gave up","― あきらめなかった ある 鉱夫より"]},
 {ico:'📝',n:'ミオの 練習メモ',o:["Mio's English notes. Practice, practice!","ミオの 英語メモ。 れんしゅう、 れんしゅう！"],c:["Boss, did you read all of them?","店長、 ぜんぶ 読めました？"]},
 {ico:'🗒️',n:'ランプの 下の 手帳',o:["Notes from the lamp light.","ランプの 明かりで 書いた メモ。"],c:["The lamp is low. Good night.","ランプが 暗く なってきた。 おやすみ。"]},
 {ico:'💌',n:'だれかの 手紙の きれはし',o:["Dear friend, here is my news.","親愛なる 友へ、 近況です。"],c:["See you soon. Your friend.","また すぐに。 あなたの 友より。"]},
 {ico:'🌟',n:'星の 層の ふしぎな 石板',o:["The old stone says:","古い 石板には こう ある。"],c:["Those who read this will go deeper.","これを 読めた 者は もっと 深くへ 行ける。"],deep:8}];

/* その ことばの 例文: 📖 と 同じ 例文 → 文カード → きまった 形。 短くて やさしい 方を えらぶ */
const reOf=h=>{const e=h.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return new RegExp(`\\b(${e}(?:s|es|ed|d|ing|er|est|ies)?)\\b`,'i')};
function lineOf(I){const h=head1(I).toLowerCase(),re=reOf(h),c=[];
  try{const x=window.WI&&WI.exOf(h,I.k);if(x&&x[0])c.push([x[0],x[1]||''])}catch(e){}
  (C.SENT||[]).forEach(s=>{if(re.test(s.en))c.push([s.en,s.ja])});
  const ok=c.filter(x=>x[0].length<=80);
  if(ok.length){ok.sort((a,b)=>(re.test(b[0])?1:0)-(re.test(a[0])?1:0)||a[0].length-b[0].length);return ok[Math.random()<.7?0:Math.min(ok.length-1,1)]}
  return tmpl(I)}
/* 例文が ない ことば（高校・ハイレベルに 多い）: 品詞で えらぶ きまった 形 */
function tmpl(I){const W=head1(I),ja=I.ja.replace(/（.*?）|\(.*?\)/g,'').split(/[、・,]/)[0].trim();let p='';try{p=window.WI?WI.pos(I):''}catch(e){}
  const N=[[`We talked about the ${W} all night.`,`ひと晩じゅう ${ja}の 話を した。`],[`I read about the ${W} in an old book.`,`古い 本で ${ja}に ついて 読んだ。`],[`Nobody here knows much about the ${W}.`,`ここの だれも ${ja}の ことを よく 知らない。`]],
    A=[[`It was a very ${W} night in the mine.`,`鉱山の とても ${ja}夜だった。`.replace('な夜','な 夜')],[`Everything looked ${W} under the lamp.`,`ランプの 下では ぜんぶが ${/い$/.test(ja)?ja.replace(/い$/,'く'):ja.replace(/な$/,'')+'に'} 見えた。`]],
    G=[[`I wrote the word "${W}" on the wall.`,`かべに 「${W}」（${ja}）と いう ことばを 書いた。`],[`Today's word is "${W}."`,`きょうの ことばは 「${W}」（${ja}）。`],[`I found the word "${W}" under a rock.`,`岩の 下で 「${W}」（${ja}）と いう ことばを 見つけた。`],
      [`My teacher once said, "Remember the word ${W}."`,`先生が むかし 「${W} と いう ことばを おぼえておいて」と 言った。（${ja}）`],[`"${W}" — I said it three times, and now I remember it.`,`「${W}」（${ja}）… 3回 言ったら おぼえた。`],[`The miner smiled and said, "${W}."`,`鉱夫は ほほえんで 「${W}」（${ja}）と 言った。`]];
  const L=p==='n'&&!/\s/.test(W)&&Math.random()<.6?N:p==='a'&&!/\s/.test(W)&&Math.random()<.5?A:G;return pickL(L)}
const mark=(en,I)=>{const h=head1(I).toLowerCase(),re=reOf(h),e=esc(en);if(re.test(e))return e.replace(re,'<b>$1</b>');
  if(h.length>=4&&!/\s/.test(h)){const r2=new RegExp(`\\b(${h.slice(0,3)}[a-z]*)\\b`,'i');if(r2.test(e))return e.replace(r2,'<b>$1</b>')}return e};

function build(ids,fl){const ok=FRAMES.filter(f=>!f.deep||fl>=f.deep),F=pickL(ok),n=fl+Math.floor(Math.random()*20)+3;
  const sub=s=>s.replace('{n}',n).replace('{fl}',fl);
  const ws=ids.map(id=>C.info(id)).filter(Boolean);
  const body=ws.map(I=>{const [en,ja]=lineOf(I);return {I,en,ja}});
  return {F,o:[sub(F.o[0]),sub(F.o[1])],c:F.c,body}}

/* 2問: ① 日本語に 合う 行 ② あなうめ（5つの ことばから） */
function quiz(S){const out=[],B=S.body;if(B.length<2)return out;
  const a=pickL(B),others=H.shuffle(B.filter(x=>x!==a)).slice(0,2),ch=H.shuffle([a,...others]);
  out.push({t:'st1',q:`<span class="qja">${esc(a.ja)}</span>`,ch:ch.map(x=>x.en),ans:ch.indexOf(a),hint:`「${esc(a.I.ja)}」は 英語で <b>${esc(head1(a.I))}</b>`,
    tip:`<b>${esc(a.en)}</b><br>${esc(a.ja)}<br><small>${esc(head1(a.I))} ＝ ${esc(a.I.ja)}</small>`,say:[a.I.lv,a.en]});
  const re=x=>reOf(head1(x.I).toLowerCase()),cand=B.filter(x=>x!==a&&re(x).test(x.en)),b=pickL(cand.length?cand:B.filter(x=>x!==a));
  const m=b.en.match(re(b));if(m){const blank=esc(b.en).replace(re(b),'＿＿＿'),w=m[1],pool=H.shuffle(B.filter(x=>x!==b).map(x=>head1(x.I))).slice(0,3),ch2=H.shuffle([w,...pool]);
    out.push({t:'st2',q:`<span class="qen">${blank}</span><span class="qja">${esc(b.ja)}</span>`,ch:ch2,ans:ch2.indexOf(w),hint:`いみは「${esc(b.I.ja)}」`,
      tip:`<b>${esc(b.en)}</b><br>${esc(b.ja)}<br><small>${esc(head1(b.I))} ＝ ${esc(b.I.ja)}</small>`,say:[b.I.lv,b.en]})}
  return out}

/* 画面。 done(n) … 正解の 数（0〜2） */
function run(ids,fl,done){const S=build(ids,fl);let jp=false;const [ex,tx]=ML('mn_story');
  const draw=()=>{H.show('cg',`<section class="pnl cgp mnp mnsty" data-stay>
    <div class="qtop"><span></span><b>📜 岩の 奥から…</b><span class="qn">地下${fl}階</span></div>
    <div class="mnstp"><p class="mnsth">${S.F.ico} ${esc(S.F.n)}</p>
      <p class="mnsl op" data-i="o">${esc(S.o[0])}${jp?`<small>${esc(S.o[1])}</small>`:''}</p>
      ${S.body.map((x,i)=>`<p class="mnsl" data-i="${i}">${mark(x.en,x.I)}${jp?`<small>${esc(x.ja)}</small>`:''}</p>`).join('')}
      <p class="mnsl op" data-i="c">${esc(S.c[0])}${jp?`<small>${esc(S.c[1])}</small>`:''}</p></div>
    <p class="mntap">🔊 1行ずつ タップで 読むよ。 太字が ほりだした ことば</p>
    <div class="kmina"><span class="lface">${MINA.face('m',ex)}</span><p>${tx}</p></div>
    <div class="row"><button class="sub" id="mnjp">🇯🇵 日本語 ${jp?'を かくす':'も 見る'}</button><button class="big" id="mnrd">📖 読めた！</button></div></section>`);
    H.panel.querySelectorAll('.mnsl').forEach(p=>p.onclick=()=>{sf('tap');const i=p.dataset.i,en=i==='o'?S.o[0]:i==='c'?S.c[0]:S.body[+i].en,lv=i==='o'||i==='c'?'es':S.body[+i].I.lv;
      H.panel.querySelectorAll('.mnsl').forEach(x=>x.classList.toggle('on',x===p));try{H.say(lv,en)}catch(e){}});
    $('mnjp').onclick=()=>{sf('tap');jp=!jp;draw()};
    $('mnrd').onclick=()=>{sf('step');check()}};
  const Q=quiz(S);let k=0,ok=0;
  const check=()=>{if(k>=Q.length)return done(Q.length&&ok>=Q.length?2:ok?1:0,S);const q=Q[k];
    H.show('cg',`<section class="pnl cgp mnp mnsty" data-stay>
      <div class="qtop"><span></span><b>📜 読めたかな？</b><span class="qn">${k+1} / ${Q.length}</span></div>
      <div id="mnsq"></div></section>`);
    const qt={st1:'日本語に 合う 文は？',st2:'お話の あなうめ'};
    C.ask($('mnsq'),q,r=>{if(r.ok)ok++;k++;check()},{tag:qt[q.t]})};
  draw()}
window.MINE_STORY={run,build,lineOf};
})();
