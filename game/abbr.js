/* 略語の 元の ことば: 単語帳の うら・カードの 📖くわしく に 出す（P.E. → Physical Education など） */
(()=>{
const A={
 'pe':['Physical Education','体の 教育'],
 'tv':['television','遠くを 見る もの'],
 'the uk':['the United Kingdom','連合 王国'],
 'cd':['Compact Disc','小さな 円盤'],
 'dvd':['Digital Versatile Disc','デジタルの いろいろ 使える 円盤'],
 'ufo':['Unidentified Flying Object','正体の わからない 飛ぶ 物体'],
 'dna':['DeoxyriboNucleic Acid','デオキシリボ 核酸'],
};
/* 見出しは 点を ぬいて くらべる（カードでは P.E. が p.e に なる ことが ある） */
const of=h=>A[String(h||'').trim().toLowerCase().replace(/\./g,'').replace(/\s+/g,' ')]||null;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* 「Physical Education（体の 教育）」の 形 */
const text=h=>{const a=of(h);return a?`${a[0]}（${a[1]}）`:''};
/* 頭文字を 太字に: Physical Education → <b>P</b>hysical <b>E</b>ducation */
const html=h=>{const a=of(h);if(!a)return '';const caps=String(h).replace(/^the\s+/i,'').replace(/[^A-Za-z]/g,'').toUpperCase();let k=0;
  const en=esc(a[0]).replace(/[A-Za-z]/g,c=>{if(k<caps.length&&c.toUpperCase()===caps[k]&&c===c.toUpperCase()){k++;return `<b>${c}</b>`}return c});
  return `${en}（${esc(a[1])}）`};
window.ABBR={of,text,html};
if(typeof MINA_LINES!=='undefined')Object.assign(MINA_LINES,{
 wi_abbr:[['smile','頭文字を ならべた ことばは、 元の ことばを 知ると ぐっと 覚えやすいよ'],
  ['happy','{w} の 文字は、 元の ことばの 頭文字なの。 太字の ところを 見てみて'],
  ['think','略語は 中身を 知ると、 ただの 記号じゃ なくなるね'],
  ['proud','元の ことばまで 言えたら、 もう 先生より くわしいかも']]});
})();
