"""Kokoro（espeak）が読みまちがえる言葉の、正しい読み（音素）。make_audio.py と make_fix.py が使う。

  WORD … その言葉が どの文に出ても こう読む（人名・地名・めずらしい語）
  TEXT … その文・単語カードだけ こう読む（同じつづりで 意味によって 読みが変わる語。
         例：単語カード close「しめる」は klˈoʊz、Close your eyes. も klˈoʊz）
  SAY  … 読み上げる前に 書きかえる（「adapt / adopt」の / を「スラッシュ」と読まないように）

phonemes(text, tok) は Kokoro に渡す音素を返す。直すところが無ければ None。
"""

WORD = {
    # 人名・キャラクター
    'Pochi': 'pˈoʊtʃi', 'Taro': 'tˈɑːɹoʊ', 'Kiki': 'kˈiːki', 'Mike': 'mˈiːkeɪ',  # Mike = ネコのミケ
    'Doraemon': 'dˌoʊɹɐˈɛmɑːn', 'dorayaki': 'dˌoʊɹɐjˈɑːki', 'Pikachu': 'pˈiːkətʃˌuː',
    'Labubu': 'lɑːbˈuːbuː', 'Shinichi': 'ʃˈiːnɪtʃi', 'Tanjiro': 'tˈɑːndʒiɹoʊ', 'Gurashi': 'ɡuːɹˈɑːʃi',
    'Totoro': 'toʊtˈɔːɹoʊ', 'Claus': 'klˈɔz', 'Pokémon': 'pˈoʊkeɪmˌɑːn',
    # 地名
    'Hokkaido': 'hoʊkˈaɪdoʊ', 'Kyoto': 'kiˈoʊɾoʊ', 'Principe': 'pɹˈɪnsɪpeɪ', 'Verde': 'vˈɜːdi',
    # 日本の もの
    'hanafuda': 'hˌɑːnɐfˈuːdə', 'kadomatsu': 'kˌɑːdoʊmˈɑːtsuː', 'Tanabata': 'tˌɑːnɐbˈɑːtə',
    # めずらしい語
    'hibiscus': 'haɪbˈɪskəs', 'Ophiuchus': 'ˌɑːfiˈuːkəs', 'moai': 'mˈoʊˌaɪ', 'coup': 'kˈuː',
    'lingua': 'lˈɪŋɡwə', 'vitae': 'vˈiːtaɪ',
}

# (まちがった読み, 正しい読み)
_LIVE, _LIVES = ('lˈaɪv', 'lˈɪv'), ('lˈaɪvz', 'lˈɪvz')
_CLOSE, _USE = ('klˈoʊs', 'klˈoʊz'), ('jˈuːs', 'jˈuːz')
TEXT = {
    'live': [_LIVE], 'live up to': [_LIVE], 'live on': [_LIVE],
    'close': [_CLOSE], 'Close your eyes.': [_CLOSE], 'Close your eyes and make a wish.': [_CLOSE],
    'use': [_USE], 'use up': [_USE],
    'Excuse me.': [('ɛkskjˈuːs', 'ɪkskjˈuːz')],
    'read, read, read': [('ɹˈiːd, ɹˈiːd, ɹˈiːd', 'ɹˈiːd, ɹˈɛd, ɹˈɛd')],
    'Totoro lives in the forest.': [_LIVES],
    'My grandmother lives in Okinawa.': [_LIVES],
    'The town where my grandmother lives is famous for hot springs.': [_LIVES],
    'Live as if you were to die tomorrow. Learn as if you were to live forever.': [('lˈaɪv æz', 'lˈɪv æz')],
    'Mt. Fuji is higher than any other mountain in Japan.': [('ˌɛmtˈiː. fˈuːdʒi', 'mˈaʊnt fˈuːdʒi')],
    'The Pokémon series started in 1996.': [('nˈaɪntiːnhˈʌndɹɪd nˈaɪnti sˈɪks', 'nˈaɪntiːn nˈaɪnti sˈɪks')],
    # 動詞の意味で のっている カード（名詞の読みになっていた）
    'conduct': [('kˈɑːndʌkt', 'kəndˈʌkt')], 'transport': [('tɹˈænspɔːɹt', 'tɹænspˈɔːɹt')],
    'export': [('ˈɛkspɔːɹt', 'ɛkspˈɔːɹt')], 'conscript': [('kˈɑːnskɹɪpt', 'kənskɹˈɪpt')],
    'separate': [('sˈɛpɹət', 'sˈɛpɚɹˌeɪt')], 'graduate': [('ɡɹˈædʒuːət', 'ɡɹˈædʒuːˌeɪt')],
    'suspect': [('sˈʌspɛkt', 'səspˈɛkt')], 'insult': [('ˈɪnsʌlt', 'ɪnsˈʌlt')],
}

SAY = {t: t.replace(' / ', ', ') for t in [
    'adapt / adopt', 'affect / effect', 'economic / economical', 'sensible / sensitive',
    'industrial / industrious', 'respectful / respective', 'imaginary / imaginative']}


def phonemes(text, tok):
    """tok = Kokoro(...).tokenizer"""
    import re
    src = SAY.get(text, text)
    words = [w for w in WORD if re.search(r'\b' + w + r'\b', src)]
    if src == text and text not in TEXT and not words:
        return None
    ph0 = ph = tok.phonemize(src, 'en-us')
    for bad, good in TEXT.get(text, []):
        if bad not in ph:
            raise ValueError(f'{text!r}: {bad!r} が {ph!r} に ない')
        ph = ph.replace(bad, good)
    for w in words:
        ph = ph.replace(tok.phonemize(w, 'en-us'), WORD[w])  # 文の中で もう正しく読めていれば そのまま
    return None if ph == ph0 and src == text and text not in TEXT else ph
