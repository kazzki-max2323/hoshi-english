# 浜辺の英語 のルール

## 更新のしくみ（sw.js）
- `sw.js` は「更新がかならず届く」しくみ。ほかのアプリでも使うひな形は kazzki-max2323/my-web-toys の `templates/pwa-update/`
- アプリを更新したら `sw.js` の `CACHE` の数字を1つ上げ、新しく増えた js/css を `CORE` に足す（音声 mp3 は `CORE` に入れない。聞いたときに保存される）
