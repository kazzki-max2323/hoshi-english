// 「読み上げる英語」の一覧を、音声ファイルごとに書き出す（make_audio.py が使う）
// node tools/list_texts.js <出力フォルダ>
//   es / jh / hs / adv … レベルの単語とセリフ   pop … キャラクター・流行りの英文
//   season … 季節の単語帳とセリフ   star … 星空ラジオ   folk … 浜辺の住人   (suika は手で作った一覧)
const fs=require('fs'),path=require('path');
global.LEVELS={};
const load=f=>eval(fs.readFileSync(path.join(__dirname,'..',f),'utf8').replace(/^const (SEASON_BOOKS|FOLK)=/m,'global.$1='));
['es','jh','hs','adv'].forEach(f=>load(`game/levels/${f}.js`));['pop','season','folk'].forEach(f=>load(`game/extras/${f}.js`));
const out=process.argv[2]||'.',lists={};
const add=(k,t,v)=>{(lists[k]=lists[k]||new Map()).set(t,v)};
for(const k of ['es','jh','hs','adv']){const L=LEVELS[k];
  L.books.flatMap(b=>b.w).forEach(w=>add(k,w[0],'af_heart'));   // 単語：女性の声
  L.talk.forEach(t=>add(k,t[0],'am_michael'));                    // ラジオのセリフ：男性の声
  L.pop.forEach(t=>add('pop',t[0],'am_michael'))}
for(const s of Object.values(SEASON_BOOKS)){s.w.forEach(w=>add('season',w[0],'af_heart'));s.talk.forEach(t=>add('season',t[0],'am_michael'))}
LEVELS.star.books[0].w.forEach(w=>add('star',w[0],'af_heart'));LEVELS.star.talk.forEach(t=>add('star',t[0],'am_michael'));
const V={mike:'af_bella',kani:'am_puck',penta:'af_sky',rakko:'af_nicole',kame:'bm_george',hakase:'bm_lewis'};  // 住人ごとの声
for(const f of FOLK)f[5].forEach(t=>add('folk',t[0],V[f[0]]));
for(const [k,m] of Object.entries(lists)){fs.writeFileSync(path.join(out,k+'.texts.json'),JSON.stringify([...m]));console.log(k,m.size)}
