/* ミオの GIF の 絵（tools/mio_gif/mio_gif.py で 作った assets/mio/<服>_<髪>/<動き>.png）
   - assets/mio/index.json に ある 見た目から その日の 1つを えらび、 はじめて ミオを 描く ときに その分だけ 読みこむ
     （sw.js の CORE には 入れない。 読んだ 絵は sw.js が 'hoshienglish-mio' に のこす）
   - 動き: stand（ときどき blink）・wave・walk（左へ 歩く ときは 左右反転）。 ない 動きは stand で 描く
   - 読みこめなかった ときや GIF の 見た目が ない ときは、 前の ドット絵（MIOPX.draw）の まま
   - localStorage hoshi_mioGif = 'off' で 前の ドット絵、 = '<服>_<髪>' で その 見た目に 固定 */
(()=>{if(!window.MIO||MIO.gif0)return;
const BASE='assets/mio/',prev=MIO.draw;MIO.gif0=prev;
const ALIAS={cheer:'wave',sweep:'stand',doze:'stand',hold:'shy',shy:'stand',oops:'stand',happy:'wave'};
let IDX=null,cur=null,fail=false,t0=0;const M={};   // M[動き] = {m: json, im: Image, ok}
function pref(){try{return localStorage.getItem('hoshi_mioGif')||''}catch(e){return ''}}
function dayN(){const d=new Date();return d.getFullYear()*400+d.getMonth()*31+d.getDate()}
function pickLook(){if(!IDX)return null;const ks=Object.keys(IDX.looks||{}).filter(k=>(IDX.looks[k].motions||[]).includes('stand'));if(!ks.length)return null;
  const p=pref();if(p==='off')return null;if(ks.includes(p))return p;if(IDX.base&&ks.includes(IDX.base))return IDX.base;return ks[(dayN()*7)%ks.length]}   // base＝いつもの 見た目
function loadMotion(look,k){const o=M[k]={ok:0};
  fetch(BASE+look+'/'+k+'.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(m=>{o.m=m;const im=new Image();
    im.onload=()=>{o.im=im;o.ok=1};im.onerror=()=>{o.ok=-1;if(k==='stand')fail=true};im.src=BASE+look+'/'+(m.img||k+'.png')}).catch(()=>{o.ok=-1;if(k==='stand')fail=true})}
function start(){if(IDX||t0)return;t0=Date.now();
  fetch(BASE+'index.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(j=>{IDX=j;cur=pickLook();if(!cur){fail=true;return}
    const L=IDX.looks[cur];['stand'].concat(L.motions.filter(k=>k!=='stand')).forEach(k=>loadMotion(cur,k))}).catch(()=>{fail=true})}
/* 見た目の 名前・服の ひとこと（MIOPX.look）も GIF の 服に あわせる（index.json の pix ＝ mio-pix.js の 服の id） */
if(window.MIOPX&&MIOPX.look){const lk=MIOPX.look;MIOPX.look=night=>{if(cur&&!fail){const L=IDX.looks[cur],o=L.pix&&(MIOPX.OUT||[]).concat(MIOPX.SUMMER||[]).find(x=>x.id===L.pix);if(o)return o;
    if(L.en)return Object.assign({},lk(night),{id:cur,n:L.name,en:L.en,ja:L.ja,w:L.w})}return lk(night)}}
function frameOf(k,now){const o=M[k];const m=o.m;return Math.floor(now/m.ms)%m.n}
function draw(c,x,y,pose,f,opt){opt=opt||{};start();
  if(fail||pref()==='off')return prev(c,x,y,pose,f,opt);
  if(!M.stand||M.stand.ok!==1){if(Date.now()-t0>4000)return prev(c,x,y,pose,f,opt);return}   // 読みこみ中は 描かない（ちがう 絵が 一瞬 出ないように）
  let k=M[pose]&&M[pose].ok===1?pose:ALIAS[pose]&&M[ALIAS[pose]]&&M[ALIAS[pose]].ok===1?ALIAS[pose]:'stand';
  const now=performance.now();
  /* まばたき: 4.2びょうに 1回 くらい */
  if(k==='stand'&&M.blink&&M.blink.ok===1){const b=M.blink.m,ph=(now+x*37)%4200;if(ph<b.n*b.ms)k='blink'}
  const o=M[k],m=o.m,i=k==='blink'?Math.min(m.n-1,Math.floor(((now+x*37)%4200)/m.ms)):frameOf(k,now);
  const flip=m.face&&m.face!=='front'&&((m.face==='right'&&opt.dir<0)||(m.face==='left'&&opt.dir>0));
  const t=c.getTransform(),s=(t.a||1)/4,fx=x+7,fy=y+32+(opt.dy||0);   // 絵は 1マス＝4ドット
  const W=m.w*s,H=m.h*s,X=Math.round(t.e+fx*(t.a||1)-(flip?m.w-m.fx:m.fx)*s),Y=Math.round(t.f+fy*(t.d||1)-m.fy*s);
  c.save();c.setTransform(1,0,0,1,0,0);c.imageSmoothingEnabled=s<1;
  if(flip){c.translate(X+W,Y);c.scale(-1,1);c.drawImage(o.im,i*m.w,0,m.w,m.h,0,0,W,H)}else c.drawImage(o.im,i*m.w,0,m.w,m.h,X,Y,W,H);
  c.restore();
  if(pose==='doze'){c.fillStyle='#cfe3ff';c.font='5px monospace';c.fillText(f%2?'z':'Z',x+16,y-12-(f%2)*2)}}
MIO.draw=draw;
window.MIOGIF={start,get look(){return cur},get ready(){return !!(M.stand&&M.stand.ok===1)},get index(){return IDX}};
})();
/* ミナ先生の ひとこと（お店で 動く ミオを 見た あと） */
(()=>{if(!window.MINA_LINES)return;
Object.assign(MINA_LINES,{
 x_mioMove:[['smile','ミオさん、 お店で 手を ふって くれた？ 手を ふるは 英語で wave。 「She waved at me!」で 「わたしに 手を ふって くれた！」だよ'],
  ['happy','ミオさんが 手を ふって きたら、 「Hi, Mio!」って ふり返そう。 あいさつは 短い ほうが しぜんだよ'],
  ['wink','お店の 中を とことこ 歩く ミオさん、 見た？ 歩くは walk。 「She is walking to the shelf.」で 「たなの 方へ 歩いてる」'],
  ['smile','ミオさん、 ときどき まばたき してるの 気づいた？ まばたきは blink。 「Don\'t blink!」で 「まばたき しないで（見のがさないで）！」'],
  ['think','手を ふって 「さようなら」は wave goodbye。 「She waved goodbye.」って、 goodbye を うしろに つけるだけ。 かんたんでしょ？']]});
if(window.MINA_SENSE&&MINA_SENSE._rules)MINA_SENSE._rules.push(['x_mioMove',.8,()=>{let h=12;try{h=GH()}catch(e){}if(h<9||h>=21)return null;return window.MIOGIF&&MIOGIF.ready?{}:null},()=>window.SHOP&&SHOP.open?['🃏 ミオに 会いに',()=>SHOP.open()]:null]);
})();
