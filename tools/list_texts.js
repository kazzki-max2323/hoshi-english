// 各レベルの「読み上げる英語」の一覧を書き出す（make_audio.py が使う）
// node tools/list_texts.js <出力フォルダ>
const fs=require('fs'),path=require('path');
global.LEVELS={};
for(const f of ['es','jh','hs','adv'])eval(fs.readFileSync(path.join(__dirname,'../game/levels',f+'.js'),'utf8'));
const out=process.argv[2]||'.';
for(const [k,L] of Object.entries(LEVELS)){
  const m=new Map();
  L.books.flatMap(b=>b.w).forEach(w=>m.set(w[0],'af_heart'));  // 単語：女性の声
  L.talk.forEach(t=>m.set(t[0],'am_michael'));                 // ラジオのセリフ：男性の声
  fs.writeFileSync(path.join(out,k+'.texts.json'),JSON.stringify([...m]));
  console.log(k,m.size);
}
