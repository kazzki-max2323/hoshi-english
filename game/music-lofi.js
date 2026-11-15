/* スローな ローファイ 10曲（2026-11-15 追加）。 音は ぜんぶ ブラウザで その場で 作る（音声ファイルなし・軽い）。
   - 鍵盤・ギター・ベルは 「テープ」に 通す（ゆっくり ゆれる ワウ・こもった 音）。 ゆれの 強さと こもり方は 曲ごとに ちがう
   - 雨・波・風・汽車・レコードの パチパチ などの 「うしろの 音」は 1小節ずつ 重ねて なめらかに つなぐ（ループの つなぎ目が 出ない）
   - ドラムと ベースは いつもの I.kick / I.snare / I.hat / I.bass を 使う（曲の はじまりは 静か・ときどき ブレイク、の しくみが そのまま 効く）
   - 値段・アイコンは game/catalog.js、 英語の やりとりは game/zakka-goods.js、 うんちくは game/unchiku-data.js */
(()=>{if(typeof TRACKS==='undefined'||typeof I==='undefined')return;
const R=(a,b)=>a+Math.random()*(b-a),DBG=()=>window.LOFI_DBG||{};
const kill=(n,ms)=>setTimeout(()=>{try{n.disconnect()}catch(e){}},ms);

/* ---------- テープ（ワウ・フラッター・こもり） ---------- */
let TP=null;
function tape(){if(TP&&TP.ac===ac)return TP;const inp=ac.createGain(),dl=ac.createDelay(.1),w=ac.createOscillator(),wg=ac.createGain(),fl=ac.createOscillator(),fg=ac.createGain(),lp=ac.createBiquadFilter(),hp=ac.createBiquadFilter();
  dl.delayTime.value=.02;w.frequency.value=.45;wg.gain.value=0;fl.frequency.value=5.1;fg.gain.value=0;w.connect(wg).connect(dl.delayTime);fl.connect(fg).connect(dl.delayTime);w.start();fl.start();
  lp.type='lowpass';lp.frequency.value=3000;lp.Q.value=.55;hp.type='highpass';hp.frequency.value=70;
  inp.connect(dl).connect(lp).connect(hp).connect(mBus());TP={ac,inp,wg,fg,lp,w};return TP}
function setTape(o){try{const T=tape(),t=ac.currentTime;T.wg.gain.setTargetAtTime(o.wow||.0012,t,.1);T.fg.gain.setTargetAtTime(o.flut||.00005,t,.1);T.w.frequency.setTargetAtTime(o.rate||.45,t,.1);
  T.lp.frequency.setTargetAtTime(o.cut||3000,t,.1);T.inp.gain.cancelScheduledValues(t);T.inp.gain.setValueAtTime(1,t)}catch(e){}}
/* テープが 一瞬 よれる（音が ふっと 小さく なる） */
function dropout(t){try{const g=tape().inp.gain;g.setValueAtTime(1,t);g.linearRampToValueAtTime(.4,t+.07);g.linearRampToValueAtTime(1,t+.4)}catch(e){}}
function out(t,d,pan){const g=ac.createGain();g.gain.value=((MUS.track&&MUS.track.vol)||1)*(MUS.soft||1);
  if(ac.createStereoPanner){const p=ac.createStereoPanner();p.pan.value=pan||0;g.connect(p);p.connect(tape().inp);kill(p,(t-ac.currentTime+d+2)*1000)}else g.connect(tape().inp);kill(g,(t-ac.currentTime+d+2)*1000);return g}

/* ---------- 楽器 ---------- */
/* parts: [倍音, 大きさ, 波の形, 消えるまでの 長さ（1=音の 長さぜんぶ）] */
function voice(parts,m,t,v,d,pan,cA,cB,att,trem){if(DBG().nomus)return;t+=R(0,.012);v*=R(.85,1.05);const f0=mf(m),o=out(t,d,pan),g=ac.createGain(),lp=ac.createBiquadFilter();
  lp.type='lowpass';lp.frequency.setValueAtTime(Math.min(9000,f0*cA),t);lp.frequency.exponentialRampToValueAtTime(Math.max(260,f0*cB),t+d*.7);
  parts.forEach(([k,a,ty,dm])=>{const s=ac.createOscillator(),sg=ac.createGain();s.type=ty;s.frequency.value=f0*k;sg.gain.setValueAtTime(a,t);if(dm<1)sg.gain.exponentialRampToValueAtTime(Math.max(.0001,a*.02),t+d*dm);s.connect(sg).connect(lp);s.start(t);s.stop(t+d+.05)});
  let last=g;if(trem){const tg=ac.createGain(),lf=ac.createOscillator(),lg=ac.createGain();tg.gain.value=1;lf.frequency.value=trem;lg.gain.value=.16;lf.connect(lg).connect(tg.gain);lf.start(t);lf.stop(t+d+.05);g.connect(tg);last=tg}
  lp.connect(g);last.connect(o);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+att);g.gain.exponentialRampToValueAtTime(v*.42,t+Math.min(d*.4,.7));g.gain.exponentialRampToValueAtTime(.0001,t+d)}
const rh =(m,t,v=.02,d=2.4,pan=R(-.3,.3))=>voice([[1,1,'sine',1],[1.0035,.45,'sine',1],[2,.2,'triangle',.22],[7.03,.05,'sine',.05]],m,t,v,d,pan,9,2.2,.008,4.2);   // エレピ（ゆらゆら）
const pf =(m,t,v=.024,d=2.2,pan=R(-.25,.25))=>voice([[1,1,'triangle',1],[1.002,.5,'sine',1],[2,.3,'sine',.4],[3,.1,'sine',.2]],m,t,v,d,pan,5,1.2,.012);       // フェルトの ピアノ
const cel=(m,t,v=.02,d=1.8,pan=R(-.4,.4))=>voice([[1,1,'sine',1],[4,.22,'sine',.12],[2,.08,'sine',.4]],m,t,v,d,pan,12,3,.004);                                // チェレスタ・オルゴール
const ny =(m,t,v=.016,d=1.3,pan=R(-.35,.35))=>voice([[1,1,'triangle',1],[2,.4,'sine',.3],[3,.14,'sawtooth',.07]],m,t,v,d,pan,10,1.1,.004);                    // ナイロンギター
function pad(ns,t,d,v=.006,cut=900){if(DBG().nomus)return;ns.forEach((m,i)=>{const o=out(t,d,(i-(ns.length-1)/2)*.3),g=ac.createGain(),lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=cut;
  [-9,9].forEach(dt=>{const s=ac.createOscillator();s.type='sawtooth';s.frequency.value=mf(m);s.detune.value=dt;s.connect(lp);s.start(t);s.stop(t+d+.1)});
  lp.connect(g).connect(o);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+d*.35);g.gain.setValueAtTime(v,t+d*.65);g.gain.linearRampToValueAtTime(.0001,t+d)})}
const roll=(ns,t,fn,gap=.04)=>ns.forEach((n,i)=>fn(n,t+i*gap));

/* ---------- うしろの 音 ---------- */
const NBF={};
function nbuf(kind){const c0=NBF[kind];if(c0&&c0.ac===ac)return c0.b;const n=ac.sampleRate*6,b=ac.createBuffer(2,n,ac.sampleRate);
  for(let c=0;c<2;c++){const d=b.getChannelData(c);let b0=0,b1=0,b2=0,last=0;for(let i=0;i<n;i++){const w=Math.random()*2-1;
    if(kind==='brown'){last=(last+.02*w)/1.02;d[i]=last*3.5}else if(kind==='pink'){b0=.99765*b0+w*.099046;b1=.963*b1+w*.2965164;b2=.57*b2+w*1.0526913;d[i]=(b0+b1+b2+w*.1848)*.11}else d[i]=w}}
  NBF[kind]={ac,b};return b}
/* 1小節ぶんの うしろの 音。 前の 小節と .8びょう 重ねて、 すっと 入れかわる。 shape / フィルターの fn は 時刻の 関数なので 小節を またいでも なめらか */
function bed(t,dur,kind,flt,v,shape){if(DBG().nobed)return;try{const X=.8,N=96,L=dur+X,s=ac.createBufferSource(),g=ac.createGain();s.buffer=nbuf(kind);let node=s;
  flt.forEach(([ty,f,q,fn])=>{const bq=ac.createBiquadFilter();bq.type=ty;bq.Q.value=q||.7;if(fn){const c=new Float32Array(N);for(let i=0;i<N;i++)c[i]=f*fn(t+i/(N-1)*L);bq.frequency.setValueCurveAtTime(c,t,L)}else bq.frequency.value=f;node.connect(bq);node=bq});
  const c=new Float32Array(N);for(let i=0;i<N;i++){const x=i/(N-1)*L,e=x<X?Math.sin(x/X*Math.PI/2):x>dur?Math.cos(Math.min(1,(x-dur)/X)*Math.PI/2):1;c[i]=Math.max(.00001,v*e*(shape?shape(t+x):1))}
  g.gain.setValueCurveAtTime(c,t,L);node.connect(g).connect(mBus());s.start(t,Math.random()*Math.max(0,s.buffer.duration-L-.1));s.stop(t+L+.05);kill(g,(t-ac.currentTime+L+1)*1000)}catch(e){}}
/* 波の よせて かえす ゆれ（0〜1） */
const tide=(tt,p=8.7)=>{const u=.5+.4*Math.sin(Math.PI*2*tt/p)+.1*Math.sin(Math.PI*2*tt/3.3);return .18+.82*u*u};
const waves=(t,bar,v=.06,p=8.7)=>bed(t,bar,'brown',[['lowpass',1,.6,tt=>380+900*tide(tt,p)]],v,tt=>tide(tt,p));
const rain=(t,bar,v=.016)=>{bed(t,bar,'white',[['highpass',1400,.5],['lowpass',7500,.5]],v);bed(t,bar,'pink',[['lowpass',1600,.5]],v*1.6)};
const hiss=(t,bar,v=.004,f=5000)=>bed(t,bar,'white',[['highpass',f,.6]],v);
const wind=(t,bar,v=.05)=>bed(t,bar,'brown',[['bandpass',1,1.4,tt=>340+520*(.5+.5*Math.sin(Math.PI*2*tt/11.3))*(.7+.3*Math.sin(Math.PI*2*tt/4.1))]],v,tt=>.5+.5*Math.sin(Math.PI*2*tt/11.3+1));
/* レコードの パチパチ（1ステップごと） */
function crackle(t,spb,p=.35,v=1){if(DBG().nobed)return;if(Math.random()<p)nz(t+R(0,spb),R(.002,.006),R(.004,.012)*v,'highpass',R(1500,4200),.7);if(Math.random()<.02)nz(t+R(0,spb),.018,.016*v,'bandpass',R(700,1400),1)}
const drop=(t,spb,p=.5)=>{if(DBG().nobed)return;if(Math.random()<p)nz(t+R(0,spb),R(.01,.03),R(.003,.009),'bandpass',R(2500,6500),R(2,6));if(Math.random()<.06){const f=R(900,1500);osc('sine',f,t+R(0,spb),.07,.005,null,f*.65)}};
const clack=(t,v=1)=>{if(DBG().nobed)return;nz(t,.05,.014*v,'bandpass',R(380,460),2);osc('sine',R(85,95),t,.09,.022*v,null,60);if(Math.random()<.15)nz(t+.01,.08,.004*v,'bandpass',3200,8)};
const chirp=(t)=>{if(DBG().nobed)return;const f=R(2600,3800),n=2+(Math.random()*3|0);for(let i=0;i<n;i++)osc('sine',f*R(.95,1.05),t+i*R(.09,.14),.07,.0035,null,f*1.3)};
const page=(t)=>{if(DBG().nobed)return;nz(t,.28,.007,'bandpass',R(2400,3600),.8);nz(t+R(.15,.25),.16,.005,'bandpass',R(3800,5200),.8)};
function foghorn(t,v=.009){if(DBG().nobed)return;try{const g=ac.createGain(),lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=340;[98,98.7,49].forEach(f=>{const o=ac.createOscillator();o.type='sawtooth';o.frequency.value=f;o.connect(lp);o.start(t);o.stop(t+4.2)});
  lp.connect(g).connect(mBus());g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.8);g.gain.setValueAtTime(v,t+2.6);g.gain.linearRampToValueAtTime(.0001,t+4.1);kill(g,(t-ac.currentTime+5)*1000)}catch(e){}}

const PEN=[0,2,4,7,9],MPEN=[0,3,5,7,10],DOR=[0,2,3,5,7,9,10];
const L=(id,o)=>{TRACKS[id]=o};
window.LOFI_RAIN=(st,t,spb)=>{if(st%16===0){rain(t,spb*16,.011)}drop(t,spb,.4)};

/* ===== 小 ===== */
/* ① おひるねビーチ：波の 音・ゆらゆら エレピ・ねむたい ベル */
L('lofi_nap',{name:'ローファイ「おひるねビーチ」',bpm:62,swing:.26,vol:1,
  chords:[[57,60,64,67],[55,59,62,64],[53,57,60,64],[58,62,65,69]],roots:[41,40,38,46],
  init(){setTape({wow:.0013,cut:2800});this.mel=motif(8,72,PEN,8)},
  play(st,t,spb){const b=st>>4,s=st%16,c=this.chords[b%4],r=this.roots[b%4],bar=spb*16;
    if(s===0){waves(t,bar,.07);roll(c,t,(n,tt)=>rh(n,tt,.019,bar*.9),.05);I.bass(r,t,bar*.55,.11)}
    if(s===10&&b%2)c.slice(1).forEach(n=>rh(n+12,t,.009,1.6));if(s===11)I.bass(r+7,t,.6,.06);
    if(s===0||s===10)I.kick(t,.15);if(s===8)I.snare(t,.022);if(s%4===2)I.hat(t,.008,.06);
    if(s%4===0&&b%4>=2){const m=this.mel[(s>>2)+(b%2)*4];if(m)cel(fitN(m),t,.026,2.2)}
    if(b%8===7&&s===0)this.mel=motif(8,72,PEN,8)}});
/* ② ねこと ひなたぼっこ：ナイロンギターの アルペジオ・オルゴール・レコードの パチパチ・小鳥 */
L('lofi_cat',{name:'ローファイ「ねこと ひなたぼっこ」',bpm:64,swing:.28,vol:1,
  chords:[[60,64,67,71],[57,60,64,67],[57,60,62,65],[55,59,62,65]],roots:[36,33,38,31],
  init(){setTape({wow:.0011,cut:3200});this.mel=motif(16,76,PEN,9)},
  play(st,t,spb){const b=st>>4,s=st%16,c=this.chords[b%4],r=this.roots[b%4],bar=spb*16;crackle(t,spb,.3);
    if(s===0)hiss(t,bar,.0035);
    if(s%2===0)ny([c[0],c[2],c[1]+12,c[3],c[2]+12,c[1]+12,c[3],c[2]][s/2]-12,t,s===0?.02:.014,1.4);
    if(s===0)I.bass(r,t,bar*.45,.11);if(s===8)I.bass(r+7,t,.7,.07);
    if(s===0||s===10)I.kick(t,.14);if(s===7&&Math.random()<.5)I.kick(t,.08);if(s===4||s===12)I.snare(t,.02);if(s%2===1)I.shaker(t,.007);
    if((b>>2)%2===1&&s%4===0){const m=this.mel[(s/4+b*4)%16];if(m)cel(fitN(m),t,.024,1.6)}
    if((b>>2)%2===0&&b>=2&&s===8&&Math.random()<.5)rh(c[3]+12,t,.012,1.8);
    if(b%4===1&&s===6&&Math.random()<.5)chirp(t);
    if(b%8===7&&s===0)this.mel=motif(16,76,PEN,9)}});
/* ③ おやすみ お月さま：3拍子の 子守歌・チェレスタ・やわらかい パッド（16分 12こで 1小節） */
L('lofi_moon',{name:'ローファイ「おやすみ お月さま」',bpm:58,vol:1,
  cc:[[55,59,62,66],[55,59,62,64],[52,55,60,64],[54,57,62,64]],rs:[43,40,36,38],
  init(){setTape({wow:.0012,cut:2600});this.mel=motif(12,74,PEN,8)},
  play(st,t,spb){const bar=Math.floor(st/12),s=st%12,i=bar%4,c=this.cc[i],r=this.rs[i],len=spb*12;crackle(t,spb,.18,.8);
    if(s===0){hiss(t,len,.003);pad(c.slice(0,3),t,len*1.05,.0045);roll(c.slice(0,3),t,(n,tt)=>rh(n,tt,.016,len*.95),.06);I.bass(r,t,len*.8,.1);I.kick(t,.1)}
    if(s===4||s===8){I.hat(t,.007,.14);rh(c[3]+12,t,.009,1.4)}
    if(bar>=2&&s%4===0){const m=this.mel[(bar%4)*3+s/4];if(m)cel(m,t,.025,2.4)}
    if(bar%8===7&&s===0)this.mel=motif(12,74,PEN,8)}});

/* ===== 中 ===== */
/* ④ 雨音と ホットココア：雨の 音・ジャズっぽい エレピ */
L('lofi_rain',{name:'ローファイ「雨音と ホットココア」',bpm:66,swing:.3,vol:1,
  chords:[[56,60,63,67],[53,58,62,65],[55,56,60,63],[56,60,63,65]],roots:[44,43,41,46],
  init(){setTape({wow:.0014,cut:2900});this.mel=motif(8,75,PEN,8)},
  play(st,t,spb){const b=st>>4,s=st%16,c=this.chords[b%4],r=this.roots[b%4],bar=spb*16;drop(t,spb,.55);
    if(s===0){rain(t,bar,.016);roll(c,t,(n,tt)=>rh(n,tt,.018,bar*.6),.045);I.bass(r,t,bar*.4,.11)}
    if(s===6&&b%2===1)c.slice(1).forEach(n=>rh(n,t,.011,1.2));if(s===10)I.bass(r+7,t,.45,.07);
    if(s===0||s===10)I.kick(t,.15);if(s===7&&Math.random()<.4)I.kick(t,.07);if(s===4||s===12)I.snare(t,.026);if(s%2===0)I.hat(t,s%4?.006:.009);if(s===14&&b%2)I.hat(t,.007,.16);
    if(b%8>=4&&s%4===2&&Math.random()<.7){const m=this.mel[(s>>2)+(b%2)*4];if(m)rh(fitN(m),t,.024,1.6)}
    if(b%8<4&&s===8&&Math.random()<.4)cel(c[3]+12,t,.012,1.6);
    if(b%8===7&&s===0)this.mel=motif(8,75,PEN,8)}});
/* ⑤ 古い カセットテープ：よれる テープ・サーッと いう ヒスノイズ・ピアノ */
L('lofi_tape',{name:'ローファイ「古い カセットテープ」',bpm:68,swing:.32,vol:1,
  chords:[[53,57,60,64],[53,57,58,62],[57,58,62,65],[55,58,61,64]],roots:[38,46,43,45],
  init(){setTape({wow:.0026,flut:.00012,rate:.38,cut:2200});this.mel=motif(16,74,MPEN,8)},
  play(st,t,spb){const b=st>>4,s=st%16,c=this.chords[b%4],r=this.roots[b%4],bar=spb*16;
    if(s===0){hiss(t,bar,.009,3200);roll(c,t,(n,tt)=>pf(n,tt,.02,bar*.55),.03);I.bass(r,t,bar*.3,.11)}
    if(s===8&&b%2===1)c.slice(1).forEach(n=>pf(n,t,.013,1.4));if(s===6)I.bass(r,t,.4,.07);if(s===10)I.bass(r+12,t,.35,.06);
    if(s===0||s===10)I.kick(t,.16);if(s===4||s===12)I.snare(t,.03);if(s%2===0)I.hat(t,s%4?.007:.01);
    if(b%8>=4&&s%2===0&&Math.random()<.5){const m=this.mel[(s/2+b*8)%16];if(m)pf(fitN(m),t,.026,1.3)}
    if(b%8===5&&s===8)dropout(t);
    if(b%8===7&&s===0)this.mel=motif(16,74,MPEN,8)}});
/* ⑥ 夜行列車の 窓：ガタン ゴトン・遠くの 灯りみたいな ベル */
L('lofi_train',{name:'ローファイ「夜行列車の 窓」',bpm:70,swing:.28,vol:1,
  chords:[[55,59,62,66],[55,59,61,64],[55,59,62,64],[54,57,62,64]],roots:[40,45,36,35],
  init(){setTape({wow:.0013,cut:2700});this.mel=motif(8,76,DOR,9)},
  play(st,t,spb){const b=st>>4,s=st%16,c=this.chords[b%4],r=this.roots[b%4],bar=spb*16;
    if(s===0){bed(t,bar,'brown',[['lowpass',150,.7]],.055);pad(c,t,bar*1.04,.004,800);roll(c,t,(n,tt)=>rh(n,tt,.016,bar*.8),.05);I.bass(r,t,bar*.45,.11)}
    if(s===0||s===8){clack(t);clack(t+spb*.55,.8)}if(s===10)I.bass(r+12,t,.4,.06);
    if(s===0||s===10)I.kick(t,.15);if(s===8)I.snare(t,.03);if(s%2===1)I.hat(t,.006);
    if(s%4===2&&b>=2&&Math.random()<.6){const m=this.mel[(s>>2)+(b%2)*4];if(m)cel(fitN(m),t,.02,2)}
    if(b%8===7&&s===0)this.mel=motif(8,76,DOR,9)}});
/* ⑦ 灯台の あかり：ギターの アルペジオ・遠い 霧笛・波 */
L('lofi_lamp',{name:'ローファイ「灯台の あかり」',bpm:64,swing:.26,vol:1,
  chords:[[59,61,64,68],[57,61,62,66],[56,59,61,64],[57,59,62,66]],roots:[45,38,37,40],
  init(){setTape({wow:.0012,cut:3000});this.mel=motif(16,73,PEN,9)},
  play(st,t,spb){const b=st>>4,s=st%16,c=this.chords[b%4],r=this.roots[b%4],bar=spb*16;
    if(s===0){waves(t,bar,.045,10.3);rh(c[0],t,.012,bar*.9);rh(c[2],t+.05,.011,bar*.9);I.bass(r,t,bar*.5,.11)}
    if(s%2===0)ny([c[0],c[1],c[2],c[3],c[2]+12,c[3],c[2],c[1]][s/2],t,.014,1.5);
    if(s===9)I.bass(r+7,t,.5,.06);if(s===0||s===9)I.kick(t,.14);if(s===8)I.snare(t,.022);if(s%2===0&&s)I.shaker(t,.006);
    if(b%8>=4&&s%4===0){const m=this.mel[(s/4+b*4)%16];if(m)rh(fitN(m)+12,t,.017,1.8)}
    if(b%8===4&&s===0)foghorn(t);
    if(b%8===7&&s===0)this.mel=motif(16,73,PEN,9)}});

/* ===== 高 ===== */
/* ⑧ しずかな 雪の 夜：風の 音・フェルトの ピアノ・ちらちら チェレスタ・ブラシ */
L('lofi_snow',{name:'ローファイ「しずかな 雪の 夜」',bpm:60,swing:.26,vol:1,
  chords:[[51,55,58,62],[55,60,63,67],[55,56,60,63],[53,56,59,62]],roots:[36,44,41,43],
  init(){setTape({wow:.0015,cut:2500});this.mel=motif(8,72,MPEN,8)},
  play(st,t,spb){const b=st>>4,s=st%16,c=this.chords[b%4],r=this.roots[b%4],bar=spb*16;
    if(s===0){wind(t,bar,.075);pad(c,t,bar*1.04,.0045,700);roll(c,t,(n,tt)=>pf(n,tt,.019,bar*.7),.07);I.bass(r,t,bar*.6,.1);I.kick(t,.12)}
    if(s===10)I.kick(t,.08);if(s%4===2)I.hat(t,.007,.16);if(s===8)I.snare(t,.016);
    if(s%2===0&&Math.random()<.22)cel(c[Math.random()*c.length|0]+24,t,.01,1.4);
    if(b%8>=4&&s%4===0){const m=this.mel[(s>>2)+(b%2)*4];if(m)pf(fitN(m),t,.026,2.2)}
    if(b%8===7&&s===0)this.mel=motif(8,72,MPEN,8)}});
/* ⑨ 図書館の 窓ぎわ：ジャズの ピアノ・ゆっくり 歩く ベース・ページを めくる 音 */
L('lofi_library',{name:'ローファイ「図書館の 窓ぎわ」',bpm:72,swing:.34,vol:1,
  chords:[[51,55,58,62],[57,62,63,67],[53,57,58,62],[53,57,58,62]],roots:[36,41,46,43],
  init(){setTape({wow:.001,cut:3400});this.mel=motif(16,70,MAJ,10)},
  play(st,t,spb){const b=st>>4,s=st%16,c=this.chords[b%4],r=this.roots[b%4],nr=this.roots[(b+1)%4],bar=spb*16;
    if(s===0)bed(t,bar,'pink',[['lowpass',1100,.6]],.012);
    if(s===0)c.forEach(n=>pf(n,t,.017,1.6));if(s===6&&Math.random()<.7)c.slice(1).forEach(n=>pf(n,t,.012,.6));
    if(s%4===0){const q=s/4,n=q===0?r:q===1?r+7:q===2?r+12:nr+(nr>r?-1:1);I.bass(n>52?n-12:n,t,.55,.1)}
    if(s%4===0)I.ride(t,.011);if(s%4===2)I.ride(t,.007);if(s===4||s===12)I.hat(t,.007,.03);if(s===0)I.kick(t,.1);if(s===12&&b%2)I.snare(t,.014);
    if(b%8>=2&&s%2===0&&Math.random()<.55){const m=this.mel[(s/2+b*8)%16];if(m)pf(fitN(m),t,.024,1.1,.2)}
    if(b%8===3&&s===4&&Math.random()<.6)page(t);
    if(b%8===7&&s===0)this.mel=motif(16,70,MAJ,10)}});
/* ⑩ 満ち潮の ゆりかご：とても ゆっくり。 長い パッド・波・ぽつんと ピアノ（和音は 2小節ずつ） */
L('lofi_tide',{name:'ローファイ「満ち潮の ゆりかご」',bpm:56,swing:.22,vol:1.25,
  chords:[[57,61,64,66],[57,61,64,66],[54,57,59,62],[54,57,59,62],[54,57,61,64],[54,57,61,64],[57,59,61,64],[57,59,61,64]],roots:[38,38,43,43,47,47,45,45],
  init(){setTape({wow:.0014,cut:2600});this.mel=motif(8,76,PEN,8)},
  play(st,t,spb){const b=st>>4,s=st%16,c=this.chords[b%8],r=this.roots[b%8],bar=spb*16;
    if(s===0){waves(t,bar,.07,9.6);if(b%2===0){pad(c,t,bar*2.05,.005,850);pf(r+12,t,.02,bar*1.2);pf(r+19,t+.08,.014,bar)}}
    if(s===0&&b%2===0)I.bass(r,t,bar*1.6,.1);
    if(s===0&&b%2===0)I.kick(t,.1);if(s===8&&b%2===1)I.snare(t,.012);if(s%4===2)I.shaker(t,.005);
    if(s%8===0&&Math.random()<.7){const m=this.mel[((s>>3)+b*2)%8];if(m)pf(fitN(m),t,.024,3.2)}
    if(b%8===6&&s===8)cel(c[0]+12,t,.012,3);
    if(b%8===7&&s===0)this.mel=motif(8,76,PEN,8)}});
})();
/* 「雨の日の喫茶店」（scene.js の lofi を ずらした 曲）にも 本物っぽい 雨の 音を 足す（ノラさんの 説明どおりに） */
(()=>{const T=typeof TRACKS!=='undefined'&&TRACKS.lofi_cafe;if(!T||T._rain)return;const base=T.play;T._rain=1;
  T.play=function(st,t,spb){try{if(window.LOFI_RAIN)LOFI_RAIN(st,t,spb)}catch(e){}return base.apply(this,arguments)}})();
