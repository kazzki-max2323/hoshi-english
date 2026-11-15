/* カードの「くわしく」の 自動の 例文を 作る: node tools/build-word-ex.js → game/winfo-ex.js
   アプリの 中に ある 英文と 日本語訳の 組（ラジオ・文法・会話・お店 など）から、
   その 単語（変化した 形も）を ふくみ、日本語訳にも その 単語の 意味が 出てくる 文だけを えらぶ（意味の ちがう 同じ つづりを さけるため）。
   手書きの 例文（game/winfo-data*.js）が ある 単語は そちらが 先に 出る。 */
const fs=require('fs'),vm=require('vm'),path=require('path');
const R=path.join(__dirname,'..','game')+'/';
const ctx={console,setTimeout:()=>0};ctx.window=ctx;vm.createContext(ctx);
for(const f of ['levels/index.js','levels/es.js','levels/jh.js','levels/hs.js','levels/adv.js','levels/jh-more.js','levels/hs-more.js','levels/adv-more.js','cards-data.js','winfo.js'])
  vm.runInContext(fs.readFileSync(R+f,'utf8').replace(/^const (LEVELS|LV_ORDER|CARDS_DATA)/mg,'var $1'),ctx);
const WI=ctx.WI;
/* 文の 出どころ（上ほど 先に えらぶ） */
const SRC=[/^levels\//,/^extras\/talk/,/^cg-data/,/^deep-data|^mio-study-data|^sensei-data/];
const files=[...fs.readdirSync(R).filter(f=>f.endsWith('.js')),...fs.readdirSync(R+'levels').map(f=>'levels/'+f),'extras/talk.js'];
const re=/(["'])([A-Z][A-Za-z0-9 ,'’\-?!.;:]{3,90}?[.!?])\1\s*,\s*(["'])([^"'\n]*?[ぁ-んァ-ン一-龥][^"'\n]*?)\3/g;
const OKCAP=/^(I|I'm|I'll|I've|I'd|English|Japanese|Japan|Tokyo|Kyoto|Osaka|Okinawa|Mt|Mr|Ms|Mrs|Dr|OK|TV|America|American|China|Chinese|France|French|Italy|Italian|Korea|Korean|Spain|Spanish|India|Indian|Australia|Canada|London|Paris|Christmas|Halloween|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|January|February|March|April|May|June|July|August|September|October|November|December)$/;
const P=[];
for(const f of files){const rank=SRC.findIndex(r=>r.test(f));if(rank<0)continue;const s=fs.readFileSync(R+f,'utf8');let m;
  while(m=re.exec(s)){const en=m[2].replace(/’/g,"'"),ja=m[4];const ws=en.split(/\s+/);
    if(ws.length<3||ws.length>13||/\?!|!\?|\.\.\.|…|[A-Z]{2,}[a-z]*!/.test(en)||/？！|！？|…|（.*おにいさん|ばか/.test(ja))continue;
    if(ws.slice(1).some(w=>{const t=w.replace(/[^A-Za-z']/g,'');return /^[A-Z]/.test(t)&&!OKCAP.test(t)}))continue;
    P.push({en,ja,rank,low:' '+en.toLowerCase().replace(/[^a-z' -]/g,' ').replace(/\s+/g,' ')+' ',jh:hira(ja)})}}
function hira(s){return s.replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60))}
const seenP=new Set();const PP=P.filter(p=>!seenP.has(p.en)&&seenP.add(p.en)).sort((a,b)=>a.rank-b.rank||a.en.length-b.en.length);
function forms(I){const h=I.h;const set=new Set([h]);const p=WI.pos(I);
  if(/^[a-z]+$/.test(h)){if(p==='v'){const v=WI.verb(h,I.ja);if(v)[v.s,v.ing,v.past,v.pp].forEach(x=>x.split('/').forEach(y=>set.add(y)))}
    if(p==='n'||p==='np'||I.k==='t')set.add(WI.plural(h));}
  return [...set].map(f=>' '+f+' ')}
function jaKeys(ja){return ja.replace(/（.*?）|\(.*?\)/g,'').split(/[・、,／/〜~]/).map(x=>hira(x.trim())).filter(Boolean)
  .map(p=>p.length>=3&&/[ぁ-ん]$/.test(p)?p.slice(0,-1):p).map(p=>p.replace(/^(お|ご)/,'')).filter(p=>p.length>=2||/[一-龥]/.test(p))}
const head=e=>String(e).split(',')[0].trim().toLowerCase().replace(/[.!?]$/,'');
const words=[],seen=new Set();
for(const lv of ctx.LV_ORDER)ctx.LEVELS[lv].books.forEach(b=>b.w.forEach(w=>{const h=head(w[0]);if(seen.has(h))return;seen.add(h);words.push({k:'w',lv,en:w[0],h,ja:w[1],bt:b.t})}));
ctx.CARDS_DATA.forEach(t=>{const h=head(t[1]);if(seen.has(h))return;seen.add(h);words.push({k:'t',lv:'tr',en:t[1],h,ja:t[2],bt:''})});
const out={};let n=0;
for(const I of words){if(I.h.length<2)continue;const fs_=forms(I),ks=jaKeys(I.ja);if(!ks.length)continue;
  const p=PP.find(p=>fs_.some(f=>p.low.includes(f))&&ks.some(k=>p.jh.includes(k)));if(p){out[I.h]=[p.en,p.ja];n++}}
const body=Object.entries(out).map(([k,v])=>' '+JSON.stringify(k)+':'+JSON.stringify(v)).join(',\n');
fs.writeFileSync(R+'winfo-ex.js','/* 自動で えらんだ 例文（tools/build-word-ex.js で 作る。 手で 直さない） */\nconst WINFO_EX={\n'+body+'\n};\n');
console.log('examples:',n,'/',words.length);
