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

# さいごの k の 息が 長く のびて、 ちがう 音に 聞こえる 単語（park が「パーツ」に 聞こえた。 11/18）。
# tools/make_trim.py が 同じ 声で 作りなおして、 のびた 息を みじかく する（audio/trim.*）
TRIM = {'park'}

# ふだんの 声 af_heart だと 頭に「エ」「ア」が 入ったり にごったり する 単語（11/20 Vietnam が「エ・ヴィエトナム」）。
# 全部の 単語を 音声認識で しらべて、 af_bella なら 聞きとれた 単語。 tools/make_voice.py が audio/v_*.mp3 に 録りなおす
VOICE = {
    "Antigua and Barbuda": 'af_bella', "Aries": 'af_bella', "Armenia": 'af_bella', "Belize": 'af_bella', "Bolivia": 'af_bella', "Brazil": 'af_bella',
    "Brunei": 'af_bella', "CD": 'af_bella', "France": 'af_bella', "French": 'af_bella', "German": 'af_bella', "Ghana": 'af_bella',
    "Greece": 'af_bella', "Greenland": 'af_bella', "Guam": 'af_bella', "Guinea": 'af_bella', "Guyana": 'af_bella', "Hindu temple": 'af_bella',
    "India": 'af_bella', "Japanese macaque": 'af_bella', "Kiribati": 'af_bella', "Latvia": 'af_bella', "Lebanon": 'af_bella', "Liberia": 'af_bella',
    "Libra": 'af_bella', "Lithuania": 'af_bella', "Morocco": 'af_bella', "Mount Fuji": 'af_bella', "Myanmar": 'af_bella', "Sagittarius": 'af_bella',
    "Saturn": 'af_bella', "Solomon Islands": 'af_bella', "Vietnam": 'af_bella', "abide by": 'af_bella', "able": 'af_bella', "abscond": 'af_bella',
    "accelerate": 'af_bella', "accept": 'af_bella', "accomplice": 'af_bella', "accounts receivable": 'af_bella', "acquiesce": 'af_bella', "adorn": 'af_bella',
    "affection": 'af_bella', "aghast": 'af_bella', "agree": 'af_bella', "airport": 'af_bella', "algorithmic": 'af_bella', "alien": 'af_bella',
    "alike": 'af_bella', "all day": 'af_bella', "allegory": 'af_bella', "alleviate": 'af_bella', "allure": 'af_bella', "although": 'af_bella',
    "ambulance": 'af_bella', "amortization": 'af_bella', "anathema": 'af_bella', "ant": 'af_bella', "antipathy": 'af_bella', "any": 'af_bella',
    "aplomb": 'af_bella', "appetite": 'af_bella', "application": 'af_bella', "appreciate": 'af_bella', "archive": 'af_bella', "arduous": 'af_bella',
    "argue": 'af_bella', "arrange": 'af_bella', "array": 'af_bella', "articulate": 'af_bella', "arts and crafts": 'af_bella', "ascribe": 'af_bella',
    "asleep": 'af_bella', "assert": 'af_bella', "assimilate": 'af_bella', "assist": 'af_bella', "assistant": 'af_bella', "at a loss": 'af_bella',
    "attack": 'af_bella', "avert": 'af_bella', "awful": 'af_bella', "baffle": 'af_bella', "bagel": 'af_bella', "balloon": 'af_bella',
    "banter": 'af_bella', "bath": 'af_bella', "bathtub": 'af_bella', "be concerned about": 'af_bella', "bean": 'af_bella', "beat": 'af_bella',
    "beautiful": 'af_bella', "behave": 'af_bella', "believe": 'af_bella', "benediction": 'af_bella', "benign": 'af_bella', "bento": 'af_bella',
    "berate": 'af_bella', "bewildered": 'af_bella', "bilingual": 'af_bella', "bird": 'af_bella', "bite": 'af_bella', "bizarre": 'af_bella',
    "black": 'af_bella', "blackboard": 'af_bella', "blackout": 'af_bella', "blame": 'af_bella', "blank": 'af_bella', "blatant": 'af_bella',
    "bleak": 'af_bella', "blockchain": 'af_bella', "blood": 'af_bella', "bloom": 'af_bella', "blue": 'af_bella', "blue whale": 'af_bella',
    "blueprint": 'af_bella', "blunder": 'af_bella', "blunt": 'af_bella', "boil": 'af_bella', "boil down to": 'af_bella', "borrow": 'af_bella',
    "both": 'af_bella', "bottle": 'af_bella', "bowling": 'af_bella', "brain": 'af_bella', "brand": 'af_bella', "bread": 'af_bella',
    "break down": 'af_bella', "breakthrough": 'af_bella', "briefcase": 'af_bella', "bright": 'af_bella', "brilliant": 'af_bella', "brittle": 'af_bella',
    "bronze medal": 'af_bella', "broom": 'af_bella', "button": 'af_bella', "calculate": 'af_bella', "calculation": 'af_bella', "call for": 'af_bella',
    "camp": 'af_bella', "candy": 'af_bella', "capricious": 'af_bella', "carry on": 'af_bella', "cave": 'af_bella', "ceasefire": 'af_bella',
    "celestial": 'af_bella', "century": 'af_bella', "chair": 'af_bella', "chart": 'af_bella', "chatbot": 'af_bella', "cheerful": 'af_bella',
    "chef": 'af_bella', "chipmunk": 'af_bella', "choice": 'af_bella', "chorus": 'af_bella', "church": 'af_bella', "circumscribe": 'af_bella',
    "class": 'af_bella', "clearance sale": 'af_bella', "clerk": 'af_bella', "clock": 'af_bella', "closed": 'af_bella', "club": 'af_bella',
    "coat": 'af_bella', "cogent": 'af_bella', "coin": 'af_bella', "collection": 'af_bella', "comic book": 'af_bella', "concede": 'af_bella',
    "concur": 'af_bella', "condemn": 'af_bella', "construe": 'af_bella', "consumer price index": 'af_bella', "contaminate": 'af_bella', "contemporary": 'af_bella',
    "contempt": 'af_bella', "convert": 'af_bella', "cookie": 'af_bella', "credit card": 'af_bella', "creditor": 'af_bella', "crop yield": 'af_bella',
    "cruise ship": 'af_bella', "crust": 'af_bella', "crystal ball": 'af_bella', "culminate": 'af_bella', "cup": 'af_bella', "curtail": 'af_bella',
    "customary": 'af_bella', "daughter": 'af_bella', "deadline": 'af_bella', "debacle": 'af_bella', "debate": 'af_bella', "debunk": 'af_bella',
    "deep": 'af_bella', "defamation": 'af_bella', "default": 'af_bella', "defeat": 'af_bella', "defunct": 'af_bella', "degree": 'af_bella',
    "delight": 'af_bella', "detect": 'af_bella', "determine": 'af_bella', "deterrence": 'af_bella', "develop": 'af_bella', "devote": 'af_bella',
    "devour": 'af_bella', "devout": 'af_bella', "dialogue": 'af_bella', "dichotomy": 'af_bella', "disappear": 'af_bella', "disappoint": 'af_bella',
    "discrepancy": 'af_bella', "dispel": 'af_bella', "displace": 'af_bella', "dispute": 'af_bella', "distinct": 'af_bella', "distinguish": 'af_bella',
    "dive": 'af_bella', "dog": 'af_bella', "doll": 'af_bella', "door": 'af_bella', "dot": 'af_bella', "dragon": 'af_bella',
    "dress": 'af_bella', "drive": 'af_bella', "dry": 'af_bella', "durable": 'af_bella', "dwell": 'af_bella', "dwindle": 'af_bella',
    "each other": 'af_bella', "eager": 'af_bella', "eccentricity": 'af_bella', "educate": 'af_bella', "eliminate": 'af_bella', "emergency kit": 'af_bella',
    "endangered species": 'af_bella', "endless": 'af_bella', "enigma": 'af_bella', "enough to": 'af_bella', "entirely": 'af_bella', "equator": 'af_bella',
    "equilibrium": 'af_bella', "erode": 'af_bella', "essence": 'af_bella', "estimate": 'af_bella', "etymology": 'af_bella', "everything": 'af_bella',
    "exact": 'af_bella', "excess": 'af_bella', "exhaust": 'af_bella', "exigency": 'af_bella', "exonerate": 'af_bella', "extant": 'af_bella',
    "facade": 'af_bella', "faction": 'af_bella', "fail": 'af_bella', "faith": 'af_bella', "falafel": 'af_bella', "fall apart": 'af_bella',
    "famine": 'af_bella', "farmer": 'af_bella', "fatal": 'af_bella', "federal": 'af_bella', "feed": 'af_bella', "filibuster": 'af_bella',
    "finance": 'af_bella', "finger": 'af_bella', "first": 'af_bella', "flashlight": 'af_bella', "flat shoe": 'af_bella', "flextime": 'af_bella',
    "flip-flops": 'af_bella', "flourish": 'af_bella', "flout": 'af_bella', "focus": 'af_bella', "folk": 'af_bella', "forget": 'af_bella',
    "forgive": 'af_bella', "fork": 'af_bella', "fortune slip": 'af_bella', "fossil fuel": 'af_bella', "foster": 'af_bella', "fragment": 'af_bella',
    "freeze": 'af_bella', "frequently": 'af_bella', "friction": 'af_bella', "frighten": 'af_bella', "front": 'af_bella', "fruit": 'af_bella',
    "frustrate": 'af_bella', "fuel": 'af_bella', "full moon face": 'af_bella', "function": 'af_bella', "gap": 'af_bella', "garden": 'af_bella',
    "garner": 'af_bella', "gender": 'af_bella', "gene": 'af_bella', "general": 'af_bella', "genie": 'af_bella', "genome": 'af_bella',
    "genre": 'af_bella', "gentle": 'af_bella', "gently": 'af_bella', "genuine": 'af_bella', "geothermal": 'af_bella', "gesture": 'af_bella',
    "get to": 'af_bella', "girl": 'af_bella', "glance": 'af_bella', "glass": 'af_bella', "glean": 'af_bella', "glimpse": 'af_bella',
    "glitch": 'af_bella', "global": 'af_bella', "gloomy": 'af_bella', "glue": 'af_bella', "goal": 'af_bella', "gondola lift": 'af_bella',
    "govern": 'af_bella', "government": 'af_bella', "gradual": 'af_bella', "gradually": 'af_bella', "grain": 'af_bella', "grammar": 'af_bella',
    "granddaughter": 'af_bella', "grandmother": 'af_bella', "grandson": 'af_bella', "grapefruit": 'af_bella', "grapes": 'af_bella', "grateful": 'af_bella',
    "gratitude": 'af_bella', "gratuity": 'af_bella', "gravity": 'af_bella', "gray": 'af_bella', "great": 'af_bella', "green": 'af_bella',
    "green apple": 'af_bella', "green tea": 'af_bella', "gridlock": 'af_bella', "grievance": 'af_bella', "ground": 'af_bella', "ground floor": 'af_bella',
    "group": 'af_bella', "grow": 'af_bella', "grudge": 'af_bella', "guard": 'af_bella', "guide": 'af_bella', "guitar": 'af_bella',
    "habit": 'af_bella', "hamper": 'af_bella', "hardship": 'af_bella', "harmful": 'af_bella', "harvest": 'af_bella', "have to": 'af_bella',
    "heart": 'af_bella', "heirloom": 'af_bella', "help": 'af_bella', "heredity": 'af_bella', "holiday": 'af_bella', "honeybee": 'af_bella',
    "honor": 'af_bella', "hook": 'af_bella', "horse": 'af_bella', "hospital": 'af_bella', "hostage": 'af_bella', "hot": 'af_bella',
    "hot dog": 'af_bella', "hot spring": 'af_bella', "hydroelectric": 'af_bella', "idea": 'af_bella', "immigration": 'af_bella', "impeccable": 'af_bella',
    "implication": 'af_bella', "in": 'af_bella', "in advance": 'af_bella', "in particular": 'af_bella', "inadvertently": 'af_bella', "incessant": 'af_bella',
    "indicate": 'af_bella', "initiative": 'af_bella', "injury": 'af_bella', "innovative": 'af_bella', "inscribe": 'af_bella', "insofar as": 'af_bella',
    "intake": 'af_bella', "interest rate": 'af_bella', "intersection": 'af_bella', "into": 'af_bella', "inundate": 'af_bella', "irregular": 'af_bella',
    "jealousy": 'af_bella', "jeans": 'af_bella', "jeopardy": 'af_bella', "job": 'af_bella', "joke": 'af_bella', "jubilant": 'af_bella',
    "judo": 'af_bella', "jump": 'af_bella', "jump rope": 'af_bella', "jungle": 'af_bella', "justice": 'af_bella', "keen": 'af_bella',
    "keep": 'af_bella', "keep up with": 'af_bella', "key": 'af_bella', "kick": 'af_bella', "kite": 'af_bella', "kiwi": 'af_bella',
    "koala": 'af_bella', "lab coat": 'af_bella', "labor union": 'af_bella', "laboratory": 'af_bella', "lacrosse": 'af_bella', "ladder": 'af_bella',
    "lake": 'af_bella', "lament": 'af_bella', "land": 'af_bella', "landfill": 'af_bella', "landing": 'af_bella', "landslide": 'af_bella',
    "lantern": 'af_bella', "laptop": 'af_bella', "latitude": 'af_bella', "lawn": 'af_bella', "lead": 'af_bella', "lead to": 'af_bella',
    "leaf": 'af_bella', "learn": 'af_bella', "leather shoe": 'af_bella', "leave": 'af_bella', "lecture": 'af_bella', "ledger": 'af_bella',
    "left": 'af_bella', "legal": 'af_bella', "legend": 'af_bella', "legitimate": 'af_bella', "length": 'af_bella', "lenient": 'af_bella',
    "leopard": 'af_bella', "less": 'af_bella', "letter": 'af_bella', "leverage": 'af_bella', "light": 'af_bella', "lightning": 'af_bella',
    "like": 'af_bella', "line": 'af_bella', "linger": 'af_bella', "linguistics": 'af_bella', "lion": 'af_bella', "lipstick": 'af_bella',
    "listen": 'af_bella', "literary": 'af_bella', "little": 'af_bella', "living room": 'af_bella', "lizard": 'af_bella', "locate": 'af_bella',
    "location": 'af_bella', "lock": 'af_bella', "lodging": 'af_bella', "log": 'af_bella', "logic": 'af_bella', "logical": 'af_bella',
    "logistics": 'af_bella', "lollipop": 'af_bella', "lonely": 'af_bella', "long": 'af_bella', "look like": 'af_bella', "loose": 'af_bella',
    "lose": 'af_bella', "loss": 'af_bella', "loudspeaker": 'af_bella', "low": 'af_bella', "lucid": 'af_bella', "luckily": 'af_bella',
    "lucrative": 'af_bella', "luggage": 'af_bella', "lunch": 'af_bella', "magazine": 'af_bella', "mammal": 'af_bella', "manual": 'af_bella',
    "marginal": 'af_bella', "maybe": 'af_bella', "mean": 'af_bella', "meaningful": 'af_bella', "member": 'af_bella', "mentor": 'af_bella',
    "mermaid": 'af_bella', "misgiving": 'af_bella', "misinformation": 'af_bella', "mitigate": 'af_bella', "mittens": 'af_bella', "month": 'af_bella',
    "moral": 'af_bella', "mosque": 'af_bella', "mousetrap": 'af_bella', "move to": 'af_bella', "movie camera": 'af_bella', "municipal": 'af_bella',
    "mural": 'af_bella', "mutation": 'af_bella', "mutiny": 'af_bella', "myriad": 'af_bella', "necktie": 'af_bella', "negligible": 'af_bella',
    "new moon": 'af_bella', "newspaper": 'af_bella', "nominal": 'af_bella', "nuclear weapon": 'af_bella', "nuisance": 'af_bella', "obesity": 'af_bella',
    "obey": 'af_bella', "objective": 'af_bella', "obsequious": 'af_bella', "observe": 'af_bella', "obstacle": 'af_bella', "obstruct": 'af_bella',
    "occasion": 'af_bella', "odd": 'af_bella', "old age": 'af_bella', "on": 'af_bella', "on the whole": 'af_bella', "oppose": 'af_bella',
    "out of order": 'af_bella', "outcry": 'af_bella', "overtime": 'af_bella', "part": 'af_bella', "particularly": 'af_bella', "party popper": 'af_bella',
    "passport": 'af_bella', "patch up": 'af_bella', "patience": 'af_bella', "peach": 'af_bella', "pear": 'af_bella', "pedagogy": 'af_bella',
    "pet": 'af_bella', "pity": 'af_bella', "plate": 'af_bella', "play devil's advocate": 'af_bella', "pleasant": 'af_bella', "pledge": 'af_bella',
    "plot twist": 'af_bella', "plug": 'af_bella', "pocket": 'af_bella', "pompous": 'af_bella', "popcorn": 'af_bella', "prevail": 'af_bella',
    "prevalent": 'af_bella', "primate": 'af_bella', "prior": 'af_bella', "profession": 'af_bella', "proof": 'af_bella', "propose": 'af_bella',
    "prove": 'af_bella', "push": 'af_bella', "pushpin": 'af_bella', "quarter": 'af_bella', "quick": 'af_bella', "quite": 'af_bella',
    "rabbit": 'af_bella', "radiate": 'af_bella', "radical": 'af_bella', "radio": 'af_bella', "rain": 'af_bella', "ramification": 'af_bella',
    "rational": 'af_bella', "reading": 'af_bella', "reality": 'af_bella', "reason": 'af_bella', "reasonable": 'af_bella', "reasoning": 'af_bella',
    "rebuke": 'af_bella', "recall": 'af_bella', "reclaim": 'af_bella', "recognize": 'af_bella', "reconcile": 'af_bella', "recycle": 'af_bella',
    "red envelope": 'af_bella', "redeem": 'af_bella', "reform": 'af_bella', "refugee": 'af_bella', "registration": 'af_bella',
}
