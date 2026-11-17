/* 看板娘の ミオ（20さいの 大学生・アルバイト）。 顔は ミナ先生と おなじ 作り（64x64 の まる顔）、 店の 中では ドット絵。
   MIO.face(ex,pose): ex = smile / laugh / wink / oops / sleepy、 pose = wave / peace / thumb / guts / ''
   MIO.draw(ctx,x,y,pose,frame): ドット絵（14x32）。 pose = stand / walk / wave / cheer / sweep / doze
   MIO_LINES: ミオの ことば（[英語, 日本語]） */
(()=>{
const MK5='#2a2340';
const D={name:'A ミオ',H:'#a8663a',H2:'#c98552',SK:'#ffe0cc',ir:'#3fae5a',ir2:'#b8f0a8',sleeve:'#fff6e4',cuff:'#4a78b0',bang:'mina',back:'bob',acc:'bandana'};
function kEyes(d,ex){const L=26,R=38,Y=37.4,s=1.08;
 const lash=(x,o)=>`<path d="M${x+o*3.3*s} ${Y-2.2*s}l${o*1.5} -.9M${x+o*3.5*s} ${Y-.6*s}l${o*1.5} -.1" stroke="${MK5}" stroke-width="1" stroke-linecap="round"/>`;
 const one=(x,o,big)=>{const rx=(big?3.4:3)*s,ry=(big?4.3:3.8)*s;
  return `<ellipse cx="${x}" cy="${Y}" rx="${rx}" ry="${ry}" fill="${MK5}"/><ellipse cx="${x}" cy="${Y+.9}" rx="${rx*.74}" ry="${ry*.62}" fill="${d.ir}"/><ellipse cx="${x}" cy="${Y+2}" rx="${rx*.5}" ry="${ry*.3}" fill="${d.ir2}" opacity=".6"/>`+
  `<path d="M${x+1.2} ${Y-3.3}l.6 1.3 1.3.4-1.3.4-.6 1.3-.6-1.3-1.3-.4 1.3-.4z" fill="#fff"/><circle cx="${x-1.3}" cy="${Y+2}" r=".65" fill="#fff"/>`+
  `<path d="M${x-rx-.7} ${Y-ry*.5}q${rx+.7} ${-ry*.85} ${2*rx+1.4} 0" stroke="${MK5}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`+lash(x,o)};
 const arc=(x,o,up)=>`<path d="M${x-3.4} ${Y+(up?1:-.6)}q3.4 ${up?-4.6:3.9} 6.8 0" stroke="${MK5}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M${x+o*3.4} ${Y+(up?1:-.6)}l${o*1.6} ${up?.2:-1.2}" stroke="${MK5}" stroke-width="1.1" stroke-linecap="round"/>`;
 if(ex==='laugh')return arc(L,-1,1)+arc(R,1,1);
 if(ex==='sleepy')return arc(L,-1,0)+arc(R,1,0);
 if(ex==='wink')return one(L,-1,1)+arc(R,1,1);
 if(ex==='oops')return `<path d="M23.4 35.2l4 2.2-4 2.2M40.6 35.2l-4 2.2 4 2.2" stroke="${MK5}" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
 return one(L,-1,1)+one(R,1,1);
}
const KPH={open:`<path d="M-3.1 .6V-4.6a3.1 3.1 0 0 1 6.2 0V.6z" fill="SK"/><ellipse cx="-3.4" cy="-1.6" rx="1.2" ry="2.1" transform="rotate(-28 -3.4 -1.6)" fill="SK"/>`,
 fist:`<rect x="-3.2" y="-5.4" width="6.4" height="6" rx="2.8" fill="SK"/>`,
 thumb:`<rect x="-1.15" y="-9.6" width="2.3" height="5.4" rx="1.15" fill="SK"/><rect x="-3.2" y="-5.4" width="6.4" height="6" rx="2.8" fill="SK"/>`,
 peace:`<rect x="-2.5" y="-10" width="2.1" height="6" rx="1.05" fill="SK" transform="rotate(-10 -1.5 -4.5)"/><rect x=".4" y="-10" width="2.1" height="6" rx="1.05" fill="SK" transform="rotate(10 1.5 -4.5)"/><rect x="-3.2" y="-5.2" width="6.4" height="5.8" rx="2.8" fill="SK"/>`};
function kPose(d,p){const hn=(k,x,y,r=0,sc=1,fl)=>`<g transform="translate(${x} ${y}) rotate(${r}) scale(${fl?-sc:sc} ${sc})">${KPH[k].replace(/SK/g,d.SK)}</g>`;
 const sl=(...pts)=>{const q='M'+pts.map(a=>a.join(' ')).join('L'),w=pts[pts.length-1];return `<path d="${q}" stroke="#0002" stroke-width="7.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${q}" stroke="${d.sleeve}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${w[0]}" cy="${w[1]}" r="2.8" fill="${d.cuff}"/>`};
 const RS=[43.5,56.5],LS=[20.5,56.5];
 return {wave:sl(RS,[55,58],[53.5,47])+hn('open',53.5,46.2,10,1.1)+'<path d="M58 34q1.6 2.4 0 4.8M60.5 33q2.2 3.4 0 6.8" stroke="#fff" stroke-width=".9" fill="none" stroke-linecap="round" opacity=".75"/>',
  peace:sl(RS,[54.5,59],[51,49.5])+hn('peace',51,48.7,6,1.1),
  thumb:sl(RS,[52.5,62],[46,58])+hn('thumb',45.6,57.2,-8,1.1),
  guts:sl(LS,[11,61],[17,55.5])+sl(RS,[53,61],[47,55.5])+hn('fist',17,54.8,-8,1.1)+hn('fist',47,54.8,8,1.1,1)}[p]||'';
}
function kFace(d,ex,pose){
 const Y=45.2,red='#d0606a',dark='#b4294a',H=d.H,H2=d.H2,SK=d.SK;
 const open=`<path d="M28.3 ${Y-1.2}q3.7 6 7.4 0z" fill="${dark}"/><path d="M30 ${Y+1.4}q2-1.4 4 0q-2 1.6-4 0z" fill="#ff8fa3"/>`;
 const big=`<path d="M27.6 ${Y-1.4}q4.4 8 8.8 0z" fill="${dark}"/><path d="M29.6 ${Y+2.2}q2.4-1.8 4.8 0q-2.4 2-4.8 0z" fill="#ff8fa3"/>`;
 const mouth={smile:open,laugh:big,wink:open,oops:`<path d="M28.6 ${Y}q.9-1 1.8 0t1.8 0 1.8 0 1.8 0" stroke="${red}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`,sleepy:`<ellipse cx="32" cy="${Y+.4}" rx="1.3" ry="1.6" fill="${dark}"/>`}[ex];
 const glow=ex!=='sleepy'&&ex!=='oops',op=glow?.9:.6;
 const cheek=`<ellipse cx="22.5" cy="42.5" rx="2.8" ry="1.7" fill="#ff9fb0" opacity="${op}"/><ellipse cx="41.5" cy="42.5" rx="2.8" ry="1.7" fill="#ff9fb0" opacity="${op}"/>`+(glow?'<path d="M20.5 42.5l1-1.4M23 42.6l1-1.4M40 42.6l1-1.4M42.5 42.5l1-1.4" stroke="#fff" stroke-width=".6" opacity=".7"/>':'');
 const extra={laugh:'<path d="M51 13l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5z" fill="#ffd23f"/><path d="M10 22l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="#ffd23f"/>',
  wink:'<path d="M50 24l1.2 2.4 2.4 1.2-2.4 1.2-1.2 2.4-1.2-2.4-2.4-1.2 2.4-1.2z" fill="#ffd23f"/>',
  oops:'<path d="M49 26q2.2 4.4 0 6.4q-2.2-2 0-6.4z" fill="#8fd3ff"/>',
  sleepy:'<text x="47" y="22" font-size="7" font-weight="bold" fill="#cfe3ff">z</text><text x="52" y="16" font-size="5" font-weight="bold" fill="#cfe3ff">z</text>'}[ex]||'';
 // うしろ髪
 const back={
  bob:`<path d="M12.5 42c-1-16 8-25.5 19.5-25.5S52.5 26 51.5 42c0 5 1.5 8 0 11.5-2 2-5 2-6.5 0l-1.5-10H20.5l-1.5 10c-1.5 2-4.5 2-6.5 0-1.5-3.5 0-6.5 0-11.5z" fill="${H}"/>`,
  pony:`<path d="M14.5 40c0-13 7.5-21.5 17.5-21.5S49.5 27 49.5 40l-1 6h-33z" fill="${H}"/><path d="M37 15.5c11-6.5 22 2 19.5 16-1.5 9 3 16-1.5 24.5-3-8-6.5-12.5-7.5-20.5-1-8-4-14-10.5-17.5z" fill="${H}"/><path d="M52 22q3 9 1 19" stroke="${H2}" stroke-width="1" fill="none"/>`,
  braid:`<path d="M13 44c-1-17 8-26 19-26s20 9 19 26v7q-3.5 3-6 0l-1-8.5H20l-1 8.5q-2.5 3-6 0z" fill="${H}"/>`,
  flip:`<path d="M14 40c0-14 8-22 18-22s18 8 18 22v5.5q4 3 7.5 0-2 6.5-9.5 4l-2-5.5H20l-2 5.5q-7.5 2.5-9.5-4 3.5 3 7.5 0z" fill="${H}"/>`}[d.back];
 // 服
 const body={
  A:`<path d="M18 76V62c0-7.4 6.4-11.6 14-11.6s14 4.2 14 11.6v14z" fill="#fff6e4"/><path d="M27 51.5l5 4 5-4" stroke="#e0cfa8" stroke-width="1.2" fill="none"/><path d="M25 76V60h14v16z" fill="#4a78b0"/><path d="M26 60l-2.5-8M38 60l2.5-8" stroke="#4a78b0" stroke-width="2.2"/><rect x="29" y="63" width="6" height="4.4" rx="1" fill="#355d8f"/>`,
  B:`<path d="M18 76V62c0-7.4 6.4-11.6 14-11.6s14 4.2 14 11.6v14z" fill="#fff"/><g stroke="#2f4f8f" stroke-width="1.8"><path d="M19 58h26M18.4 63h27.2M18 68h28M18 73h28"/></g><path d="M26 76V62h12v14z" fill="#e85a4a"/><path d="M27 62l-2-9M37 62l2-9" stroke="#e85a4a" stroke-width="2"/>`,
  C:`<path d="M18 76V62c0-7.4 6.4-11.6 14-11.6s14 4.2 14 11.6v14z" fill="#9cc096"/><path d="M26.5 51.5L32 74l5.5-22.5q-5.5 3-11 0z" fill="#f6efe0"/><path d="M26.5 51.5L32 74M37.5 51.5L32 74" stroke="#6f9070" stroke-width="1"/><circle cx="30.4" cy="62" r=".8" fill="#f6efe0"/><circle cx="31" cy="67" r=".8" fill="#f6efe0"/>`,
  D:`<path d="M18 76V62c0-7.4 6.4-11.6 14-11.6s14 4.2 14 11.6v14z" fill="#fffaf0"/><path d="M27 51.5q5 3.6 10 0" stroke="#ece4d4" stroke-width="1.4" fill="none"/><path d="M25 76V60h14v16z" fill="#ff8a5a"/><path d="M26 60l-2.5-8M38 60l2.5-8" stroke="#ff8a5a" stroke-width="2.2"/><g fill="#ffe8a0"><circle cx="28" cy="64" r="1.6"/><circle cx="35.5" cy="69" r="1.6"/></g><ellipse cx="33" cy="63.5" rx="1.8" ry=".9" fill="#3a9a5a" transform="rotate(30 33 63.5)"/>`}[d.name[0]];
 // 前髪
 const bangs={
  mina:`<path d="M17 38c0-11 6-17 15-17s15 6 15 17c-1.5-4-4-7-6-8 0 3-1.5 5-3 6 .5-2 0-4-1-5.5-3 3-7 4.5-12 4.5 1-1.2 1.5-2.5 1.6-3.8-4 2-6.6 3.8-9.6 6.8z" fill="${H}"/>`,
  minaR:`<g transform="translate(64 0) scale(-1 1)"><path d="M17 38c0-11 6-17 15-17s15 6 15 17c-1.5-4-4-7-6-8 0 3-1.5 5-3 6 .5-2 0-4-1-5.5-3 3-7 4.5-12 4.5 1-1.2 1.5-2.5 1.6-3.8-4 2-6.6 3.8-9.6 6.8z" fill="${H}"/></g><path d="M17.6 34q-2.4 8-.4 15 1.6-6 2.8-12zM46.4 34q2.4 8 .4 15-1.6-6-2.8-12z" fill="${H}"/>`,
  center:`<path d="M17 39c0-11 6-18 15-18s15 7 15 18c-2-6-5.5-10-10.5-11.5Q34 30 32 30t-4.5-2.5C22.5 29 19 33 17 39z" fill="${H}"/><path d="M17.4 34q-2.6 9 0 17 1.6-7 2.6-13zM46.6 34q2.6 9 0 17-1.6-7-2.6-13z" fill="${H}"/>`,
  choppy:`<path d="M17 38c0-11 6-17 15-17s15 6 15 17l-2.6-5.4-1.4 3.6-1.8-5.4-2.6 4.4-1.8-5.6-2.8 5.2-2-4.6-2.6 4.8-1.8-3.6-1.6 4.2z" fill="${H}"/>`}[d.bang];
 const shine=`<path d="M21.6 27.4q2.6-3.2 6.4-4.6M36.4 22.8q2.4.6 4.2 2" stroke="#fff" stroke-width="1.7" fill="none" stroke-linecap="round" opacity=".38"/>`;
 const acc={
  bandana:`<path d="M16.4 30.5Q32 12 47.6 30.5Q32 23 16.4 30.5z" fill="#ffc93c"/><path d="M46.5 28.5l5.5-3-1 6zM46.5 28.5l4.5 4.5-5.5.6z" fill="#ffc93c"/><g fill="#fff"><circle cx="25" cy="24.5" r=".9"/><circle cx="32" cy="21.6" r=".9"/><circle cx="39" cy="24.5" r=".9"/><circle cx="28.5" cy="27" r=".6"/><circle cx="35.5" cy="27" r=".6"/></g>`,
  ribbon:`<g transform="translate(40.5 17.5) rotate(-18)"><path d="M0 0l-5.4-3.4v6.8zM0 0l5.4-3.4v6.8z" fill="#ff5a6a"/><circle r="1.6" fill="#d8404e"/><path d="M0 0l-2.4 5.4M0 0l1.8 5.4" stroke="#ff5a6a" stroke-width="1.5" stroke-linecap="round"/></g>`,
  glasses:`<g fill="none" stroke="#6a3a2a" stroke-width="1.1"><circle cx="26" cy="37.6" r="5.2"/><circle cx="38" cy="37.6" r="5.2"/><path d="M31.2 37q.8-.8 1.6 0M20.8 36.6l-2.6-1M43.2 36.6l2.6-1"/></g><path d="M22.6 34.6l1.8-1.4M34.6 34.6l1.8-1.4" stroke="#fff" stroke-width=".8" opacity=".7"/>`,
  flower:`<g transform="translate(44.5 24)">${[0,72,144,216,288].map(a=>`<ellipse cy="-3" rx="2.2" ry="3.2" fill="#ff4a6a" transform="rotate(${a})"/>`).join('')}<circle r="1.2" fill="#ffe066"/></g>`}[d.acc];
 const braid=d.back==='braid'?[0,1,2,3].map(i=>`<ellipse cx="${17-i*.8}" cy="${49+i*5.2}" rx="3.6" ry="3.3" fill="${i%2?H2:H}"/>`).join('')+`<rect x="12.6" y="67" width="5" height="1.8" rx=".6" fill="#f6e6c0"/><path d="M15 69l-1.6 4M15 69l1.2 4" stroke="${H}" stroke-width="1.4" stroke-linecap="round"/>`:'';
 return `<svg viewBox="0 0 64 64"><defs><clipPath id="kc"><circle cx="32" cy="32" r="31"/></clipPath></defs><circle cx="32" cy="32" r="31" fill="#1f2a5c"/><g clip-path="url(#kc)"><g transform="translate(32 31) scale(.86) translate(-32 -31)">`+
  back+body+`<ellipse cx="17" cy="38.5" rx="2.4" ry="3" fill="${SK}"/><ellipse cx="47" cy="38.5" rx="2.4" ry="3" fill="${SK}"/><ellipse cx="32" cy="37" rx="15" ry="14" fill="${SK}"/>`+
  bangs+shine+`<g>${kEyes(d,ex)}</g>${cheek}${mouth}${d.acc==='glasses'?acc:''}${braid}${d.acc!=='glasses'?acc:''}${extra}${kPose(d,pose)}</g></g></svg>`;
}

const face=(ex='smile',pose='')=>kFace(D,ex,pose);

/* ---------- ドット絵 ---------- */
const R=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)};
const P={hair:'#a8663a',hair2:'#c98552',skin:'#ffe0cc',eye:'#3fae5a',shirt:'#fff6e4',apron:'#4a78b0',apron2:'#355d8f',low:'#7a5a42',shoe:'#5a3a22',acc:'#ffc93c'};
function draw(c,x,y,pose='stand',f=0){const s=P.skin,arm=P.shirt;x=Math.round(x);y=Math.round(y);
  const st=pose==='walk'?f%2:0;
  /* あし・ズボン */
  R(c,x+3,y+20,8,5,P.low);R(c,x+4,y+25,2,5-(st?1:0),P.low);R(c,x+8,y+25,2,5-(st?0:1),P.low);
  R(c,x+3,y+30-(st?1:0),3,2,P.shoe);R(c,x+8,y+30-(st?0:1),3,2,P.shoe);
  /* どう・エプロン */
  R(c,x+3,y+11,8,9,P.shirt);R(c,x+4,y+14,6,10,P.apron);R(c,x+5,y+12,4,2,P.apron);R(c,x+4,y+19,6,1,P.apron2);R(c,x+6,y+16,2,2,P.apron2);
  const armL=()=>{R(c,x+1,y+11,2,7,arm);R(c,x+1,y+18,2,2,s)},armR=()=>{R(c,x+11,y+11,2,7,arm);R(c,x+11,y+18,2,2,s)};
  if(pose==='wave'){armL();R(c,x+11,y+7,2,5,arm);R(c,x+11,y+5,2,2,s);if(f%2){R(c,x+13,y+4,1,1,'#fff');R(c,x+14,y+6,1,1,'#fff')}else R(c,x+10,y+5,1,2,s)}
  else if(pose==='cheer'){R(c,x+1,y+6,2,6,arm);R(c,x+11,y+6,2,6,arm);R(c,x+1,y+4,2,2,s);R(c,x+11,y+4,2,2,s);if(f%2){R(c,x,y+2,1,1,'#ffe066');R(c,x+13,y+2,1,1,'#ffe066')}}
  else if(pose==='sweep'){const o=f%2?1:0;for(let i=0;i<18;i++)R(c,x+12-Math.floor(i/3)-o,y+9+i,1,1,'#b07a3a');R(c,x+2-o,y+27,6,3,'#e8c86a');R(c,x+2-o,y+29,6,1,'#c8a64a');
    R(c,x+9,y+13,3,2,arm);R(c,x+10,y+15,2,2,s);R(c,x+3,y+14,2,6,arm);R(c,x+5,y+19,4,1,arm);R(c,x+8-o,y+19,2,2,s)}
  else if(pose==='walk'){R(c,x+1+(st?1:0),y+11,2,7,arm);R(c,x+1+(st?1:0),y+18,2,2,s);R(c,x+11-(st?0:1),y+11,2,7,arm);R(c,x+11-(st?0:1),y+18,2,2,s)}
  else{armL();armR()}
  /* あたま */
  R(c,x+6,y+10,2,1,s);R(c,x+3,y+2,8,8,s);const ey=y+6;
  if(pose==='doze'){R(c,x+4,ey,2,1,'#3a2a2a');R(c,x+8,ey,2,1,'#3a2a2a');R(c,x+6,y+8,2,1,'#d0606a');c.fillStyle='#cfe3ff';c.font='5px monospace';if(f%2)c.fillText('z',x+12,y+3);else c.fillText('z',x+14,y+1)}
  else if(pose==='cheer'){R(c,x+4,ey,1,1,'#2a1a1a');R(c,x+5,ey-1,1,1,'#2a1a1a');R(c,x+8,ey-1,1,1,'#2a1a1a');R(c,x+9,ey,1,1,'#2a1a1a');R(c,x+5,y+8,4,1,'#a8304a');R(c,x+6,y+9,2,1,'#ff8fa3')}
  else{R(c,x+4,ey-1,2,2,P.eye);R(c,x+8,ey-1,2,2,P.eye);R(c,x+4,ey-1,2,1,'#2a1a1a');R(c,x+8,ey-1,2,1,'#2a1a1a');R(c,x+5,ey,1,1,'#fff');R(c,x+9,ey,1,1,'#fff');R(c,x+3,ey-2,1,1,'#2a1a1a');R(c,x+10,ey-2,1,1,'#2a1a1a');R(c,x+6,y+8,2,1,'#a8304a');R(c,x+6,y+9,2,1,'#ff8fa3')}
  R(c,x+3,y+7,2,1,'#ffaab8');R(c,x+9,y+7,2,1,'#ffaab8');
  /* かみ＋バンダナ */
  const h=P.hair;R(c,x+3,y+1,8,3,h);R(c,x+4,y,6,1,h);R(c,x+2,y+2,2,8,h);R(c,x+10,y+2,2,8,h);R(c,x+3,y+4,2,1,h);R(c,x+7,y+4,2,1,h);R(c,x+5,y+1,3,1,P.hair2);
  R(c,x+3,y,8,2,P.acc);R(c,x+4,y-1,6,1,P.acc);R(c,x+11,y+1,2,1,P.acc);R(c,x+12,y+2,1,1,P.acc);R(c,x+5,y,1,1,'#fff');R(c,x+8,y+1,1,1,'#fff')}

/* ミオの 声: 若い 女の人の 声を えらぶ（ミナ先生の Samantha とは べつの 声を 先に さがす）。 男の 声は つかわない */
const FEM=/Ava|Allison|Nicky|Karen|Tessa|Moira|Serena|Susan|Victoria|Kathy|Princess|Jenny|Aria|Michelle|Emma|Ana\b|Zira|Hazel|Libby|Sonia|Natasha|Clara|Female|Woman|Samantha|Google US English|Google UK English Female/i;
const MALE=/\bMale\b|Alex|Daniel|Fred|Tom\b|Aaron|Arthur|Guy|David|Mark|George|Ryan|Eric|Rishi|Oliver|Thomas|Gordon|Lee\b|Ralph|Junior|Albert|Bruce|Christopher|Roger|Steffan|Brian|Andrew|William|James|Liam/i;
let MV=null,MVok=false;
function voice(){if(MVok)return MV;if(!window.speechSynthesis)return null;const vs=speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang));if(!vs.length)return null;
  const ok=vs.filter(v=>!MALE.test(v.name));
  const pref=['Ava','Allison','Nicky','Jenny','Aria','Karen','Tessa','Susan','Zira','Libby','Google US English','Samantha'];
  MV=null;for(const n of pref){MV=ok.find(v=>v.name.includes(n));if(MV)break}
  MV=MV||ok.find(v=>FEM.test(v.name))||null;MVok=true;return MV}
if(window.speechSynthesis&&speechSynthesis.addEventListener)speechSynthesis.addEventListener('voiceschanged',()=>{MVok=false});
function say(en){try{const ST=BEACH.S;if(!ST.sound||!window.speechSynthesis||!en)return;speechSynthesis.cancel();
  const t=(typeof sayNames==='function'?sayNames(String(en)):String(en)).replace(/[“”"]/g,'').replace(/\.\.\.|…/g,', ');
  const u=new SpeechSynthesisUtterance(t);u.lang='en-US';const v=voice();if(v)u.voice=v;
  u.pitch=v?1.2:1.45;u.rate=(ST.slow?.76:.98);u.volume=Math.min(1,(ST.vol&&ST.vol.voice!=null)?ST.vol.voice:1);speechSynthesis.speak(u)}catch(e){}}
/* ほかの 人の 声（カウンターの お客さんなど）: sex 'f' = 女の人・'m' = 男の人。 seed で 人ごとに ちがう 声。 女の人は ミオと べつの 声を 先に。 見つからなければ null */
function vpick(sex,seed){if(!window.speechSynthesis)return null;const vs=speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang));
  let l=sex==='m'?vs.filter(v=>MALE.test(v.name)):vs.filter(v=>!MALE.test(v.name)&&FEM.test(v.name));
  if(sex!=='m'){const mv=voice(),o=l.filter(v=>v!==mv);if(o.length)l=o}
  return l.length?l[Math.abs(seed|0)%l.length]:null}
window.MIO={face,draw,say,voice,vpick,name:'ミオ'};
})();
