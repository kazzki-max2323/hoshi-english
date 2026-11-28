# ミオの GIF を ゲームの 絵に する

Gemini で 作った ミオの GIF を、 背景を ぬいて・大きさと 足もとを そろえて・軽い 横ならび PNG に する 道具。

## つかいかた

```
python3 tools/mio_gif/mio_gif.py <GIF> <見た目> --split <動き>:<はじめ>-<おわり>,... [--face right] [--name 日本語名] [--pix 服id] [--preview]
```

例:
```
# いつもの ミオ（浜辺の 背景の 歩き → --sea。 1コマめ 7 を 横向きの 立ち に）
python3 tools/mio_gif/mio_gif.py b.gif whiteskirt_bob --split walk:0-29,stand:7 --face right --sea --base --name "白タンクと 白スカート・ボブ"
python3 tools/mio_gif/mio_gif.py g1.gif tankdenim_longwave --split stand:0-2,blink:3-4,wave:6-26 --name "白タンクと デニム・ゆるふわロング" --pix tank --preview
python3 tools/mio_gif/mio_gif.py g2.gif tankdenim_longwave --split walk:0-29 --face right --bg row --preview
```

- `--preview` で GIF の よこに `_preview.png`（赤い 線＝足の 裏と 体の まん中）が できる。 まず これで コマの 番号と 切りぬきを 見る
- ぬけすぎ（足が 消える）→ `--thr 45`、 背景が のこる → `--thr 75`
- 歩きは ふつう 全コマの 中央値を 背景に して 足を ぬく（`--bg time`）。 背景に 海が あって 足もとに 波が のこる → `--sea`（**青い 服の ときは 使わない**。 デニムが 消える。 その ときは `--bg row`）
- Dreamina などの 動画（mp4）も そのまま わたせる（10コマ/秒の GIF に して 読む）。 背景の 緑が ざらざら → `--key`、 背景が ミント色で 足や はだが 消える → `--thr 35`。 例: `--split cheer:3-30 --key --holes --thr 35`
- `--base` で その 見た目を いつもの ミオに（index.json の base）
- `--face right` の GIF は どの 動きも 左へ 向く とき 反転する
- キャラが 見つからない・となりの 物まで 入る → `--box 150,480`（キャラの いる 横の はんい）

## ファイル名の きまり

```
assets/mio/index.json                 見た目の 一覧（道具が 書きかえる）
assets/mio/<服>_<髪>/<動き>.png       横ならびの コマ
assets/mio/<服>_<髪>/<動き>.json      コマの 数・大きさ・足の 位置（fx,fy）・1コマの ms・向き
```

- **見た目** = `<服>_<髪>`。 小文字と 数字だけ、 `_` は まん中の 1つだけ
  - 服: `tankdenim` `apron` `pajama` `flowerdress` …（色ちがいは `apronpink` の ように つなげる）
  - 髪: `longwave` `bob` `pony` `buns` …
- **動き**（ゲームの ポーズと 同じ 名前）
  | 動き | いつ | なければ |
  |---|---|---|
  | `stand` | ふだん（**かならず いる**） | — |
  | `blink` | stand の 間に 4びょうに 1回 | まばたき なし |
  | `wave` | 手を ふる | stand |
  | `walk` | 歩く（右向きで 作る。 左は 反転） | stand |
  | `cheer` | よろこぶ（ジャンプも そのまま。 `--align-y ground`） | wave |
  | `sweep` | そうじ | stand |
  | `doze` | いねむり | stand |
  | `hold` `shy` `oops` | ドキッと できごと（game/mio-doki.js） | stand |

- 大きさ: 立った 高さが 192ドット（ゲームの 48マス × 4）。 足の 裏は 下から 2ドット
- 色: 96色の PNG。 1コマ だいたい 5KB（30コマで 150KB くらい）

## ゲームでの 読みこみ（game/mio-gif.js）

- その日の 見た目を index.json から 1つ えらび、 **お店で はじめて ミオを 描く ときに その 見た目の ぶんだけ** 読む
- sw.js の CORE には 入れない。 読んだ 絵は `hoshienglish-mio` に のこる（版を 上げても 消えない）
- index.json の `pix` は game/mio-pix.js の 服の id（服の 名前・ミオの ひとこと・ミナ先生の コメントに 使う）
- `localStorage.hoshi_mioGif` = `off` で 前の ドット絵、 = `<服>_<髪>` で その 見た目に 固定
