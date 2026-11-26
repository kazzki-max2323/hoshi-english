/* 👗 見た目の 組み合わせ（2026-11-27）
   ミオ: 服（上）× 色 × スカート・パンツ × 色 × 丈 × エプロン × 小物 × くつ × 髪型 を 日替わりで 組み合わせる。
         3〜4日に 1回くらいは 決まった 服（game/mio-pix.js の OUT/SUMMER/NIGHT）。 同じ 日は 同じ 服。
   お客さん: 名前の ある 人は 顔・髪の 色・いつもの 小物は そのままで、 服と 色が 日替わり（ときどき いつもの 服）。
         名前の ない 「通りすがりの お客さん」は 人・服・髪型・小物を ぜんぶ 組み合わせて 毎回 ちがう 人。
   絵を かくのは game/mio-pix.js（sprite）。 ここは 何を 着るかを きめるだけ */
(()=>{if(!window.MIOPX)return;
const look0=MIOPX.look;
const dayK=()=>{const d=new Date();return d.getFullYear()*1000+d.getMonth()*40+d.getDate()};
const rng=seed=>{let a=(seed>>>0)||1;return ()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
const pk=(r,L)=>L[r()*L.length|0];
const wp=(r,L,wf)=>{const t=L.reduce((a,x)=>a+wf(x),0);let v=r()*t;for(const x of L){v-=wf(x);if(v<=0)return x}return L[L.length-1]};
/* 季節: 0 あたたかい（6〜9月）・1 さむい（11〜3月）・.5 その間 */
const cold=()=>{const m=new Date().getMonth();return m>=5&&m<=8?0:(m>=10||m<=2)?1:.5};
const sw=(x,c)=>{const w=x.w||[1,1];return w[0]*(1-c)+w[1]*c};
/* 色: [色, 日本語, 英語] */
const COL={white:['#fbf8f2','白い','white'],cream:['#f2e6c8','クリーム色の','cream'],pink:['#f497b4','ピンクの','pink'],coral:['#ff8a7a','コーラルの','coral'],
 red:['#e05050','赤い','red'],yellow:['#ffd84a','黄色い','yellow'],orange:['#ffa24a','オレンジの','orange'],mint:['#98e0c8','ミントの','mint'],
 green:['#5aa05a','緑の','green'],sky:['#a8d4f4','水色の','light blue'],blue:['#4a8ad8','青い','blue'],navy:['#3a4a7a','紺の','navy'],
 lav:['#c8b4ec','ラベンダーの','lavender'],gray:['#a0a0aa','グレーの','gray'],black:['#3a3a44','黒い','black'],brown:['#8a5a3a','茶色の','brown'],
 khaki:['#b8a878','カーキの','khaki'],denim:['#5a7ab0','デニムの','denim'],wine:['#8a3a4a','ワインレッドの','wine red'],beige:['#e0c8a0','ベージュの','beige']};
const TOPC=['white','cream','pink','coral','red','yellow','orange','mint','green','sky','blue','navy','lav','gray','black','brown','khaki','denim','wine','beige'];
const BOTC=['white','cream','navy','black','gray','brown','khaki','denim','beige','pink','sky','mint','lav','wine','green','red'];
const ACCC=['yellow','red','pink','sky','mint','lav','navy','white','black','brown','orange','wine'];
const SHOEC=['brown','white','black','red','navy','pink','beige'];
/* 服（上）。 w = [あたたかい, さむい] の 出やすさ、 f = 女の人だけ、 m = 男の人の ほうが 多い */
const TOPS=[
 {k:'tee',ja:'Tシャツ',en:'T-shirt',o:{sl:'short',neck:'round'},pr:1,w:[3,1]},
 {k:'shirt',ja:'シャツ',en:'shirt',o:{sl:'long',neck:'v',btn:1},w:[1,2]},
 {k:'blouse',ja:'ブラウス',en:'blouse',o:{sl:'short',neck:'collar'},w:[2,1],f:1},
 {k:'knit',ja:'ニット',en:'sweater',o:{sl:'long',neck:'round',rib:1},w:[0,3]},
 {k:'cardi',ja:'カーディガン',en:'cardigan',o:{sl:'long',neck:'round',coat:1},inner:1,w:[.6,3]},
 {k:'off',ja:'オフショルダー',en:'off-shoulder top',o:{sl:'off',neck:'none'},w:[2,.3],f:1},
 {k:'tank',ja:'ノースリーブ',en:'sleeveless top',o:{sl:'none',neck:'scoop'},w:[2,0],f:1},
 {k:'polo',ja:'ポロシャツ',en:'polo shirt',o:{sl:'short',neck:'collar',btn:1},w:[1.2,.4],m:1}];
const PRINTS=[['',''],['border','ボーダーの'],['star','星の'],['wave','波の'],['heart','ハートの']];
/* スカート・パンツ。 h = 丈（すそ の 高さ。 小さいほど 短い）、 cols = この 色だけ */
const BOTS=[
 {k:'pleat',ja:'プリーツスカート',en:'pleated skirt',o:{skt:'pleat'},h:[62,66,70,76]},
 {k:'flare',ja:'フレアスカート',en:'flared skirt',o:{skt:'flare'},h:[64,68,74]},
 {k:'tight',ja:'タイトスカート',en:'pencil skirt',o:{skt:'tight'},h:[63,68,74]},
 {k:'tier',ja:'ティアードスカート',en:'tiered skirt',o:{skt:'tier'},h:[70,76,84]},
 {k:'maxi',ja:'ロングスカート',en:'long skirt',o:{skt:'maxi',flow:1},h:[84,87]},
 {k:'button',ja:'前ボタンの スカート',en:'button-front skirt',o:{skt:'button'},h:[66,72]},
 {k:'wrap',ja:'ラップスカート',en:'wrap skirt',o:{skt:'wrap'},h:[66,72]},
 {k:'check',ja:'チェックの スカート',en:'plaid skirt',o:{skt:'check'},h:[62,66,70],cols:['red','navy','green','brown','gray','khaki','wine']},
 {k:'shorts',ja:'ショートパンツ',en:'shorts',o:{shorts:1},h:[60],pl:1,w:[3,.3]},
 {k:'pants',ja:'パンツ',en:'pants',o:{pants:1},h:[50],pl:1,w:[1,2]}];
const APRON=['denim','pink','cream','brown','green','navy','wine','khaki'];
/* 髪型（ミオ）: mio-pix.js の HAIRS ＋ 新しい 4つ */
const NEWHAIR=[['pony','ポニーテール',1.2],['bunhi','おだんご 1つ',1],['sidepony','サイドポニー',1],['lowtwin','ゆるい おさげ',1]];
const HAIRS=MIOPX.HAIRS.concat(NEWHAIR);
const UP=['buns','bunhi','halfup'];
const art=w=>/^[aeiou]/i.test(w)?'an':'a';
const cn=k=>COL[k];
/* ------------------------------------------------ ミオの 日替わり（昼） */
function mioDay(r){const c=cold();
  const top=wp(r,TOPS.filter(t=>!t.m),t=>sw(t,c)),bot=wp(r,BOTS,b=>sw(b,c));
  let tc=pk(r,TOPC),bc=pk(r,bot.cols||BOTC);if(tc===bc)bc=pk(r,bot.cols||BOTC);
  const pr=top.pr&&r()<.45?pk(r,PRINTS.slice(1)):PRINTS[0],inner=top.inner?pk(r,['white','cream','gray','sky','pink']):null;
  const hem=pk(r,bot.h),apr=r()<.5?pk(r,APRON):null,scarf=c>.6&&r()<.4?pk(r,ACCC):null;
  let acc=wp(r,[['band',3],['kachu',2],['ribbon',1.4],['pin',1.4],['none',1.6],['hat',2*(1-c)],['beret',1.2*c],['beanie',1.2*c]],x=>x[1])[0];
  const accc=acc==='band'&&r()<.5?'yellow':pk(r,ACCC);
  let hair=wp(r,HAIRS,x=>x[2])[0];if(['hat','beret','beanie'].includes(acc)&&UP.includes(hair))hair='bob';
  const pants=bot.o.pants,socks=!pants&&r()<.45,shoe=pk(r,SHOEC);
  const o=Object.assign({top:'gtop',cuff:'gtop',sk:'glow',apron:apr?'gap':null,hem,neck:'round',socks:socks?1:0,shoe:'gshoe',print:pr[0]||null,scarf:scarf?'gsc':null},top.o,bot.o,{hem});
  if(apr==='denim')o.apron='apron';
  const pal={gtop:cn(tc)[0],gin:inner?cn(inner)[0]:cn(tc)[0],glow:cn(bc)[0],gap:apr?cn(apr)[0]:null,band:cn(accc)[0],red:cn(accc)[0],gshoe:cn(shoe)[0],gsc:scarf?cn(scarf)[0]:null};
  const tN=`${cn(tc)[1]} ${pr[1]}${top.ja}`,bN=`${cn(bc)[1]} ${bot.ja}`;
  const bEn=`${bot.pl?'':art(cn(bc)[2])+' '}${cn(bc)[2]} ${bot.en}`;
  const en=`${art(cn(tc)[2])==='an'?'An':'A'} ${cn(tc)[2]} ${top.en} and ${bEn} today!${apr?` And ${art(cn(apr)[2])} ${cn(apr)[2]} apron.`:''}`;
  const ja=`きょうは ${tN}と ${bN}！${apr?` エプロンは ${cn(apr)[1].replace(/の$/,'')}。`:''}`;
  return {id:'mix',n:`${tN}＋${bN}`,en,ja,
    w:top.en,acc,hair,o,pal}}
/* ------------------------------------------------ ミオの 夜（部屋着） */
const NTOP=[{ja:'Tシャツ',o:{sl:'short',neck:'round'}},{ja:'長そでTシャツ',o:{sl:'long',neck:'round'}},{ja:'ゆるニット',o:{sl:'long',neck:'round',rib:1}},{ja:'キャミ',o:{style:'cami',sl:'none',neck:'none'}}];
const NBOT=[{ja:'ショートパンツ',o:{shorts:1},h:60},{ja:'ロングパンツ',o:{pants:1},h:50},{ja:'ロングスカート',o:{skt:'maxi',flow:1},h:86}];
const NCOL=['pink','sky','lav','mint','cream','gray','navy','yellow','white','coral','beige'];
function mioNight(r){const pj=r()<.35,c1=pk(r,NCOL),c2=pj?c1:pk(r,NCOL);
  const top=pj?{ja:'パジャマ',o:{sl:pk(r,['long','short']),neck:'collar',btn:1}}:pk(r,NTOP),bot=pj?(r()<.6?NBOT[1]:NBOT[0]):pk(r,NBOT);
  const pr=r()<.5?pk(r,[['moon',''],['star',''],['heart',''],['dots','水玉の ']]):['',''];
  const o=Object.assign({top:'gtop',cuff:'gtop',sk:'glow',apron:null,socks:0,shoe:'slip',print:pr[0]==='dots'?null:pr[0]||null,dots:pr[0]==='dots'?'#ffffff':null},top.o,bot.o,{hem:bot.h});
  if(top.o.style==='cami')o.print=null;
  const n=pj?`${pr[1]}${cn(c1)[1]} パジャマ`:`${cn(c1)[1]} ${top.ja}と ${cn(c2)[1]} ${bot.ja}`;
  return {id:'nmix',n,acc:r()<.25?'pin':'none',hair:r()<.5?'bob':wp(r,HAIRS,x=>x[2])[0],o,pal:{gtop:cn(c1)[0],gin:cn(c1)[0],glow:cn(c2)[0],gshoe:'#f497b4'}}}
const LC={};
MIOPX.look=night=>{const k=dayK()+(night?.5:0);if(LC[k])return LC[k];
  const r=rng(dayK()*13+(night?7:3));let L;
  if(r()<(night?.4:.28))L=look0(night);   // ときどき 決まった 服
  else{L=night?mioNight(r):mioDay(r);const h=HAIRS.find(x=>x[0]===L.hair)||HAIRS[0];L.hairN=h[1]}
  for(const x in LC)delete LC[x];return LC[k]=L};

/* ------------------------------------------------ お客さん */
const SKIN=['#ffe8d8','#ffe0c8','#f6d6c0','#f0c8a0','#e0b088','#d8a880','#b88060','#8a5a3a'];
const HAIRC=['#2a2020','#3a3030','#4a2a1a','#6a4028','#8a5a32','#c8a050','#e8d080','#c86a3a','#a8663a'];
const OLDH=['#bbbbbb','#9a9a9a','#d8d8d8','#7a7070'];
const EYEC=['#4a6a8a','#4a8ad8','#5a3a2a','#6a5a4a','#3a7ac0','#8a5a3a','#3a2a2a','#6aa04a'];
const FHAIR=['bob','long','long','pony','bunhi','sidepony','lowtwin','flip','inner','wavy','halfup','twin','center','side','tuck','braid','buns'];
const MHAIR=['short','short','crop','mside'];
/* いつもの（GUEST_LOOK）→ 組み合わせの 形へ */
function base(L){const m=!!L.pants,old=L.style==='bun'||!!L.beard;
  return {sex:m?'m':'f',old,skin:L.skin,hairC:L.hair,eyeC:null,glass:!!L.glass,shades:!!L.shades,beard:!!L.beard,
    hs:L.hs||{cap:'short',hat:'long',short:'short',bun:'oldbun',long:'long'}[L.style]||'short',
    acc:L.acc2||(L.style==='cap'?'cap':L.style==='hat'?'hat':'none'),accC:L.acc||null,bag:!!L.bag,bagC:L.bag||null}}
function usual(B,L){return Object.assign({},B,{gen:1,topC:L.coat||L.shirt,innerC:L.shirt,botC:L.low,shoeC:L.shoe,
  o:{sl:L.coat?'long':'short',neck:'round',coat:L.coat?1:0,pants:B.sex==='m'?1:0,hem:B.sex==='m'?50:B.old?82:68,flow:B.old&&B.sex!=='m'?1:0}})}
/* 服を 組み合わせる（B = 人。 小物は B の ものを まず 使う） */
function dress(B,r){const c=cold(),m=B.sex==='m';
  const top=wp(r,TOPS.filter(t=>m?!t.f:true),t=>sw(t,c)*(m&&t.m?2:1)*(B.old&&t.k==='cardi'?2:1));
  let bot;if(m)bot=r()<.25*(1-c)+.05?BOTS[8]:BOTS[9];
  else bot=wp(r,BOTS,b=>sw(b,c)*(B.old?(['maxi','flare','tier','pants'].includes(b.k)?3:.2):1));
  let tc=pk(r,TOPC),bc=pk(r,bot.cols||(m?['navy','black','gray','brown','khaki','denim','beige']:BOTC));if(tc===bc)bc=pk(r,bot.cols||BOTC);
  const pr=top.pr&&r()<.4?pk(r,PRINTS.slice(1)):PRINTS[0],inner=top.inner?pk(r,['white','cream','gray','sky','pink','black']):null;
  let hem=pk(r,bot.h);if(B.old&&!bot.pl)hem=Math.max(hem,76);
  const scarf=B.scarf||(c>.6&&r()<.35?pk(r,ACCC):null);
  return Object.assign({},B,{gen:1,topC:cn(tc)[0],innerC:inner?cn(inner)[0]:cn(tc)[0],botC:cn(bc)[0],shoeC:cn(pk(r,SHOEC))[0],scarf:!!scarf,scarfC:scarf?cn(scarf)[0]:null,
    o:Object.assign({neck:'round',socks:!bot.o.pants&&!m&&r()<.4?1:0,print:pr[0]||null},top.o,bot.o,{hem}),
    tk:{tc,top,pr,bc,bot,scarf}})}
/* 名前の ない お客さん: 人を つくる */
function person(r){const c=cold(),m=r()<.5,old=r()<.2;
  const B={sex:m?'m':'f',old,skin:pk(r,SKIN),hairC:old?pk(r,OLDH):pk(r,HAIRC),eyeC:pk(r,EYEC),
    hs:m?pk(r,MHAIR):old?pk(r,['oldbun','oldbun','short','bob']):pk(r,FHAIR),glass:r()<(old?.5:.18),shades:false,beard:m&&r()<(old?.45:.1),bag:r()<.35};
  B.bagC=pk(r,['#a06a3a','#3a3a44','#c84a3a','#4a6aa0','#e0c8a0']);
  B.acc=wp(r,m?[['none',4],['cap',1.4],['beanie',1.4*c],['hat',1*(1-c)],['phones',.8]]:[['none',4],['hat',1.2*(1-c)],['beret',1*c],['beanie',1*c],['kachu',.8],['ribbon',.8],['phones',.6],['pin',.6]],x=>x[1])[0];
  if(['hat','beret','beanie','cap'].includes(B.acc)&&UP.concat(['oldbun']).includes(B.hs))B.hs=m?'short':'bob';
  const ak=pk(r,ACCC);B.accC=cn(ak)[0];B.ak=ak;
  if(!B.glass&&B.acc!=='phones'&&r()<.12*(1-c)+.03)B.shades=true;
  return B}
const ACCN={cap:'ぼうし',beanie:'ニットぼう',beret:'ベレーぼう',kachu:'カチューシャ',ribbon:'リボン'};
function anonName(L,r){const t=L.tk,f=[];
  if(L.acc==='hat')f.push('むぎわらぼうしの');if(ACCN[L.acc])f.push(`${cn(L.ak)[1]} ${ACCN[L.acc]}の`);
  if(L.acc==='phones')f.push('ヘッドホンの');if(L.shades)f.push('サングラスの');if(L.scarf&&t.scarf)f.push(`${cn(t.scarf)[1]} マフラーの`);
  if(L.glass)f.push('めがねの');if(L.beard)f.push('おひげの');
  f.push(`${cn(t.tc)[1]} ${t.pr[1]}${t.top.ja}の`,`${cn(t.bc)[1]} ${t.bot.ja}の`);
  return `${pk(r,f.slice(0,Math.max(2,f.length-1)))} お客さん`}
const CATS=['nat','food','ani','look','heart','learn','word','act','life','tr'];
/* 来た お客さんを えらぶ: 3人に 1人くらいは 名前の ない 人 */
function pickGuest(){if(typeof GUESTS==='undefined')return null;
  if(Math.random()<.34){const seed=Math.random()*1e9|0,r=rng(seed),B=person(r),L=dress(B,r);
    const a=[];while(a.length<3){const x=pk(r,CATS);if(!a.includes(x))a.push(x)}
    return {G:{n:anonName(L,r),anon:1,seed,v:{s:B.sex,p:B.old?.85+r()*.1:.95+r()*.2,r:B.old?.88:.95+r()*.1},a},L}}
  const G=GUESTS[Math.random()*GUESTS.length|0];return {G,L:guestLook(G)}}
/* 名前の ある 人の きょうの 見た目（同じ 日は 同じ） */
function guestLook(G){const i=GUESTS.indexOf(G),L0=GUEST_LOOK[G.l]||GUEST_LOOK[0],B=base(L0);B.eyeC=EYEC[(G.l|0)%EYEC.length];
  const r=rng(dayK()*31+i*977+5);if(r()<.35)return usual(B,L0);
  if(B.sex==='f'&&!B.old&&B.hs==='long'&&B.acc!=='hat')B.hs=pk(r,['long','long','pony','sidepony','bunhi','lowtwin','braid']);
  return dress(B,r)}
MIOPX.guestLook=guestLook;MIOPX.pickGuest=pickGuest;
/* 何通り あるかの めやす（せってい・しらべる用） */
MIOPX.mixCount=()=>{const hs=HAIRS.length,acc=8,colsT=TOPC.length,colsB=BOTC.length;let n=0;
  TOPS.filter(t=>!t.m).forEach(t=>BOTS.forEach(b=>{n+=colsT*(t.pr?PRINTS.length:1)*(t.inner?5:1)*(b.cols||BOTC).length*b.h.length}));
  return n*(APRON.length+1)*acc*SHOEC.length*hs};

/* ------------------------------------------------ ミナ先生の セリフ */
if(window.MINA_LINES){
  const add=(k,L)=>{MINA_LINES[k]=(MINA_LINES[k]||[]).concat(L)};
  add('r_mioLook',[['happy','ミオさんの 「{n}」、 色の 英語で 言えるかな？ 白は white、 紺は navy、 水色は light blue だよ'],
   ['wink','ミオさん、 毎日 ちがう 組み合わせ なんだって。 「Your skirt matches your top!」（上と スカートが あってるね）も 言って みて']]);
  add('x_mioLook',[['smile','ミオさんの 服、 上と 下の 組み合わせが 毎日 かわるんだって。 色の 英語の 練習に ぴったり！']]);
  add('sh_lookNew',[['wow','お知らせ！ ミオさんの 服が 組み合わせで 毎日 かわるように なったよ。 上・スカート・色・髪型・小物… ほとんど 同じ 日は ないんだって'],
   ['happy','カードショップに 新しい お客さんが ふえたよ。 郵便屋さん・看護師さん・大工さん・花屋さん・写真家さん・大学生。 名前の ない 通りすがりの 人も 毎回 ちがう 見た目で 来るの']]);
  add('x_guestLook',[['smile','お店の お客さん、 「赤い ぼうしの お客さん」みたいに 見た目で よばれる 人も いるよ。 英語なら 「the man in the red cap」。 in で 「〜を 身につけた」だよ'],
   ['think','「the woman with glasses」＝ めがねの 女の人。 見た目は with や in で 言えるよ。 お店の お客さんで ためして みて']]);
  if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(['x_guestLook',.6,()=>{try{return window.SHOP&&SHOP.rec&&SHOP.rec().met?{}:null}catch(e){return null}},()=>window.SHOP&&SHOP.open?['🃏 お店を 見に',()=>SHOP.open()]:null]);
}
})();
