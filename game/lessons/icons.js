/* ミニ授業の 絵（ふくしゅう リストなどで つかう）。授業の id → 絵文字。
   授業を ふやしたら ここにも 1行 足してね（足さなくても カードは できる。そのときは 種類ごとの 絵から 自動で えらぶ）。
   授業の データに ico:'🦉' と 書いても よい（そちらが 優先） */
const LESSON_ICO={
 'es-phonics-abc':'🔤','es-a-an':'🍎','es-plural-s':'🐱','es-word-order':'🧱','es-be-am-are':'🙋','es-question':'❓','es-can':'💪','es-in-on-under':'📦',
 'es-like':'😋','es-days-months':'📅','es-teen':'🔢','es-colors-feelings':'🎨','es-greetings':'👋','es-linking':'🔗','es-5min':'⏱️','es-speak-aloud':'📣',
 'es-picture-words':'🖍️','es-hama-week':'🎶','es-hama-bd':'🛏️','es-hama-count':'✋',
 'jh-tense-line':'📏','jh-progressive':'🏃','jh-present-perfect':'🏹','jh-3sg-s':'🔍','jh-comparison':'🏆','jh-passive':'🔄','jh-to-ing':'🎯',
 'jh-relative':'🧩','jh-prep-time':'🕰️','jh-word-order':'🚃','jh-there-is':'🏝️','jh-modal-strength':'📶','jh-get-image':'🧲','jh-take-image':'🤲',
 'jh-make-do':'🛠️','jh-th-l-r':'👅','jh-linking':'🎧','jh-shadowing':'👥','jh-review-timing':'⏰','jh-hama-irregular':'🌀','jh-hama-better-best':'🥇','jh-hama-for-since':'⌛',
 'hs-kateiho-kyori':'🌈','hs-jisei-itchi':'⌚','hs-bunshi-kobun':'✂️','hs-kankei-fukushi':'🗺️','hs-kyocho-itthat':'🔦','hs-article-a-the':'👉','hs-kazoe-countable':'💧',
 'hs-will-goingto':'🛤️','hs-phrasal-up-out-off':'🚀','hs-gogen-word-parts':'🌱','hs-collocation':'🍱','hs-oto-datsuraku':'🍃','hs-hama-uncountable':'🪑',
 'adv-paraphrase':'🔁','adv-discourse-markers':'🪧','adv-ipa':'🔣','adv-tadoku-seidoku':'📚','adv-eiken-toeic':'📝','adv-think-in-english':'💭','adv-hama-affect-effect':'⚡',
 'es-recall-cover':'🙈','es-sleep':'😴','es-gesture':'🤸','es-katakana-trap':'🪤','es-rhythm':'🥁','es-question-up':'⤴️',
 'jh-study-map':'🧭','jh-test-effect':'✅','jh-interleave':'🔀','jh-keyword':'🔑','jh-chunk':'🍇','jh-dictation':'✍️','jh-minimal-pair':'👂','jh-word-family':'👨‍👩‍👧',
 'hs-leitner':'🗃️','hs-slash-reading':'➗','hs-skim-scan':'🔎','hs-stress-timed':'🎼','hs-core-prep':'🖼️','hs-dictionary':'📖',
 'adv-input-level':'🪜','adv-four-strands':'🏛️','adv-432':'🏎️','adv-notice-gap':'💎','adv-if-then':'🔧','adv-elaboration':'🤔','adv-guess-first':'🔮',
 'es-magic-e':'🪄','es-sh-ch-th':'🤫','es-f-v':'💋','es-word-web':'🕸️','es-opposites':'☯️','es-compound':'🧷','es-sing':'🎤',
 'jh-schwa':'😶','jh-no-extra-vowel':'🚫','jh-memory-palace':'🏰','jh-look-see-watch':'👀','jh-come-go':'🚶','jh-mirror-order':'🪞','jh-read-look-up':'🆙','jh-diary-3':'📔',
 'hs-four-a':'🅰️','hs-flap-t':'💦','hs-say-tell':'💬','hs-adj-order':'📐','hs-sentence-mining':'⛏️','hs-pomodoro':'🍅',
 'adv-tense-grid':'🗓️','adv-word-iceberg':'🧊','adv-subtitles':'🎬','adv-retelling':'🗣️','adv-can-do':'🚩','adv-plateau':'📈',
};
