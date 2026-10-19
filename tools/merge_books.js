// 追加の単語帳を、同じレベルの単語（すでにある冊と、先に並んだ冊）と重ならないように取りこみ、1冊20語にそろえる
// node tools/merge_books.js tools/wordsrc/jh_more.js JH_MORE jh game/levels/jh-more.js
const fs=require('fs'),path=require('path');
global.LEVELS={};for(const f of ['es','jh','hs','adv'])eval(fs.readFileSync(path.join(__dirname,'../game/levels',f+'.js'),'utf8'));
const [src,arr,lv,out]=process.argv.slice(2);
eval(fs.readFileSync(src,'utf8').replace(new RegExp('^const '+arr+'=','m'),'global.'+arr+'='));
const key=w=>w[0].toLowerCase().replace(/[^a-z' ]/g,'').trim();
const seen=new Set();for(const k of [lv])LEVELS[k].books.forEach(b=>b.w.forEach(w=>seen.add(key(w))));
const books=[],short=[];
for(const b of global[arr]){const w=[];for(const x of b.w){const k=key(x);if(seen.has(k)||w.length>=20)continue;seen.add(k);w.push(x)}
  if(w.length<20)short.push(`${b.t}:${w.length}`);books.push({t:b.t,w})}
fs.writeFileSync(out,`/* ${LEVELS[lv].name}の 追加の単語帳（${path.basename(src)} から 重なりを取りのぞいて 作った） */\nLEVELS.${lv}.books.push(\n`+books.map(b=>' '+JSON.stringify(b).replace(/"([tw])":/g,'$1:')).join(',\n')+'\n);\n');
console.log('books',books.length,'words',books.reduce((a,b)=>a+b.w.length,0),'short',short.join(' '));
