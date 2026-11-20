/* 💪 ミナ先生の 単元「助動詞」（MODAL）。 しくみは game/unit.js（単元の しくみは この 授業を 土台に 作った）
   - 5時間。 1時間 = カード → たしかめ 3問。 さいごに まとめテスト 8問・📄まとめ 1まい
   - 入口: ミナ先生が えらぶ（game/mina-plan.js）・とことん授業の チップ・文法ノート「助動詞」・ミナ先生の ひとこと（x_md）
   中身と セリフは game/modal-data.js。 きろくは localStorage 'hoshi_modal'（前の きろくを そのまま つかう） */
(()=>{
const H=HE,$=id=>document.getElementById(id);
const {sfx:SFX}=BEACH;const snd=k=>{try{SFX[k]&&SFX[k]()}catch(e){}};
const D=window.MODAL_DATA,CH=D.CH,GID=D.gid;
const U=UNIT.make(D,{key:'hoshi_modal',lk:'md_',head:'💪 助動詞'}),R=U.rec();
/* 文法ノート「助動詞」の ページ */
H.on('gramView',(lv,i,n)=>setTimeout(()=>{if(!n||n.id!==GID)return;const row=H.panel.querySelector('.gview .row');if(!row||row.querySelector('#gmd'))return;
  row.insertAdjacentHTML('beforeend','<button id="gmd" class="sub">💪 助動詞の 授業</button><button id="gms" class="sub">📄 まとめ</button>');$('gmd').onclick=()=>{snd('lesson');U.open()};$('gms').onclick=()=>{snd('book');U.sheet(U.close)}},0));
/* ミナ先生の ひとこと（game/mina-sense.js の ルールに 足す） */
try{const RL=MINA_SENSE._rules,go=ci=>['💪 助動詞の 授業へ',()=>U.open(ci!=null?{ch:ci}:null)];
  RL.push(['x_mdWeak',3,F=>{let w=false;try{w=SENSEI.weak().includes(GID)}catch(e){}if(!w||!R.n)return null;
    const ci=Object.keys(R.miss).sort((a,b)=>R.miss[b]-R.miss[a])[0];return {t:ci!=null&&CH[ci]?'「'+CH[ci].short+'」':'助動詞',_i:ci!=null&&CH[ci]?+ci:null}},v=>go(v._i)]);
}catch(e){}
window.MODAL=Object.assign(U,{});
})();
