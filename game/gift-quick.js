/* 🎁 プレゼントの「さらっと」わたす とき の セリフ（2026-11-22 ユーザー「プレゼントの 会話が 長い、 ワンパターン」）
   - ふだんは わたして → ひとことの 反応 で おわり（ボタンを えらぶ 会話は 5回に 1回くらい。 しくみは game/gift.js）
   - 出だし（GIFT_Q.open）と 反応（GIFT_Q.r）は 毎回 くじ。 同じ 人に 同じ セリフは しばらく 出ない（GF.qr）
   - 共通の セリフは GIFT_STYLE で キャラの 口ぐせに なる。 ミオは ていねい語 なので 自分の セリフ（GIFT_Q.own.mio）だけ
   [英, 日] */
const GIFT_Q={
 /* 相手が 先に 気づく ひとこと（そのまま 反応へ） */
 notice:[
  ["Hm? What's that?","ん？ それ なに？"],["Oh? Is that for me?","お？ それ、 わたしに？"],["You look like you have a secret.","なにか ひみつが ありそうな 顔だね。"],
  ["Hey, what are you holding?","ねえ、 なに もってるの？"],["Wait... a present?","まって… プレゼント？"],["Hi! Oh, what's this?","やあ！ あれ、 これ なあに？"],
  ["You're smiling. What is it?","にこにこ してるね。 どうしたの？"],["Is that a present? For me?","それ プレゼント？ わたしに？"]],
 /* その日 2回目 */
 again:[["Another one? Really?","また？ ほんとに？"],["Again? You spoil me!","また？ あまやかしすぎだよ！"],["Two in one day? Wow.","1日に 2つ？ すごい。"]],
 /* 前の 品を おぼえてる（{last}） */
 mem:[["I still use the {last} you gave me, you know.","前に くれた {lastj}、 まだ つかってるよ。"],["The {last} from last time is still my favorite.","この前の {lastj}、 いまでも お気に入り。"]],
 /* つつんで ある とき */
 wrap:[["Ooh, it's wrapped! Can I open it? ...Let's see!","わあ、 つつんで ある！ あけて いい？ …どれどれ！"],["What a pretty package! I'll open it now.","かわいい つつみ！ いま あけちゃう。"]],
 /* 反応（4だん）。 相手 ごとの r（gift-data.js）とも まぜて くじ */
 r:{
  3:[["No way! A {w}! I love it!","うそ！ {n}！ 大好き！"],["This is perfect! How did you know?","ぴったり！ なんで わかったの？"],["A {w}! You really know me.","{n}！ わたしの こと よく わかってるね。"],
     ["Wow! This made my whole week!","わあ！ 今週 いちばん うれしい！"],["I've wanted a {w} for so long! Thank you!","ずっと {n}が ほしかったの！ ありがとう！"],["Oh! I'm so happy I could dance!","わあ！ うれしくて おどりたく なる！"],
     ["For me? Really? Thank you, thank you!","わたしに？ ほんとに？ ありがとう、 ありがとう！"],["I love it. I'm going to keep it forever.","大好き。 ずっと 大事に する。"],["Best present ever!","さいこうの プレゼント！"]],
  2:[["Oh, a {w}! Thank you!","あ、 {n}！ ありがとう！"],["How nice! Thank you so much.","すてき！ ほんとに ありがとう。"],["A {w}? I like it!","{n}？ 気に いった！"],
     ["That's so kind of you. Thanks!","やさしいね。 ありがとう！"],["Thank you! This is really nice.","ありがとう！ これ、 すごく いいね。"],["Oh, I'll use it right away!","わあ、 さっそく つかうね！"],
     ["What a sweet present. Thanks!","すてきな プレゼント。 ありがとう！"],["You're so thoughtful. Thank you!","気が きくね。 ありがとう！"]],
  1:[["Oh, thank you!","あ、 ありがとう！"],["A {w}. Thanks!","{n}だね。 ありがと！"],["Thank you. That's nice of you.","ありがとう。 やさしいね。"],
     ["Oh, for me? Thanks!","あ、 わたしに？ ありがと！"],["Hmm, a {w}. Thank you!","ふむ、 {n}。 ありがとう！"],["Thanks! I'll find a place for it.","ありがと！ 置く 場所を 考えるね。"],
     ["Oh, how interesting. Thanks!","へえ、 おもしろいね。 ありがと！"]],
  0:[["Oh... a {w}. Thank you, ha ha.","あ… {n}。 ありがとう、 あはは。"],["Hmm... thanks! I'm not sure what to do with it.","うーん… ありがと！ どう つかうか まよう けど。"],["A {w}? ...Well, thank you!","{n}？ …えっと、 ありがとう！"],
     ["Oh! Thank you. It's... different.","わあ！ ありがとう。 その… めずらしいね。"],["Thanks! It's the thought that counts.","ありがと！ 気持ちが うれしいよ。"]]},
 /* キャラ だけの セリフ（ここに ある キャラは 共通の r を つかわない） */
 own:{
  mio:{
   notice:[["Boss? You're hiding something!","店長？ なにか かくしてますね！"],["Hm? Boss, what's that in your hand?","ん？ 店長、 その 手の もの なんですか？"],["Is that... for me?","それ… わたしに ですか？"],["Boss, you have a funny face. What is it?","店長、 へんな 顔 してますよ。 なんですか？"],["Ooh, a present? For the shop? For me?","お、 プレゼント？ お店に？ わたしに？"]],
   r:{3:[["Kyaa! A {w}! I love it, boss!","きゃー！ {n}！ 大好きです、 店長！"],["Boss! How did you know I wanted this?!","店長！ なんで ほしいの わかったんですか？！"],["I'm putting it by the register right now!","いますぐ レジの 横に かざります！"],["This is the best! Thank you, boss!","さいこうです！ ありがとう、 店長！"],["Wow... I'm really happy. Thank you.","わあ… ほんとに うれしい。 ありがとう。"]],
      2:[["A {w}! Thank you, boss!","{n}！ ありがとう、 店長！"],["So cute! Thank you!","かわいい！ ありがとうございます！"],["Thanks, boss! I'll take good care of it.","ありがとう、 店長！ 大切に します。"],["Oh, nice! I'll use it on my break.","いいですね！ 休けい中に つかいます。"]],
      1:[["Oh, thank you, boss!","あ、 ありがとう、 店長！"],["A {w}? Thanks!","{n}？ ありがとうございます！"],["Thank you! Um... I'll keep it in the back.","ありがとう！ えっと… 奥に 置いて おきます。"],["Ha ha, thanks, boss!","あはは、 ありがとう、 店長！"]],
      0:[["Ah... a {w}. Thank you, boss... ha ha.","あ… {n}。 ありがとう、 店長… あはは。"],["Hmm, this is a little fancy for me. But thanks!","うーん、 わたしには ちょっと 大人っぽいかも。 でも ありがとう！"],["Thank you, boss! I'll... try to use it!","ありがとう、 店長！ つかって… みます！"]]}}},
 /* さらっと わたす ときの 自分の ことば（小・中・高。 GIFT_HAND・GIFT_HAND_X と まぜる） */
 hand:[['es',"Here!","はい！"],['es',"Here you go.","はい、 どうぞ。"],['es',"Take this!","これ、 どうぞ！"],['jh',"I have a little something for you.","ちょっとした ものが あるんだ。"],
  ['jh',"I found this for you.","あなたに 見つけてきたよ。"],['hs',"Just a little something. I hope you like it.","ほんの 気持ち。 気に いると いいな。"],['hs',"I couldn't resist. It's for you.","つい 買っちゃった。 あなたに。"]]
};
