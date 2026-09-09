import { SyncedLyricLine } from './types';

export interface LyricLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LYRIC_LANGUAGES: LyricLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'tl', name: 'Filipino', nativeName: 'Tagalog', flag: '🇵🇭' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文 (简体)', flag: '🇨🇳' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
];

/**
 * Pre-compiled multilingual synchronized lyrics for all songs in Sonora.
 * Each language entry maintains EXACT matching timestamps with the original song.
 */
export const CATALOG_LYRICS_DB: Record<string, Record<string, SyncedLyricLine[]>> = {
  "song-1788809484263": {
    "en": [
      {
        "time": 0,
        "text": "♪ (Gentle piano intro) ♪"
      },
      {
        "time": 10,
        "text": "All along, it was a fever"
      },
      {
        "time": 14,
        "text": "A cold sweat, hot-headed believer"
      },
      {
        "time": 19,
        "text": "I threw my hands in the air, said, 'Show me somethin''"
      },
      {
        "time": 25,
        "text": "He said, 'If you dare, come a little closer'"
      },
      {
        "time": 31,
        "text": "'Round and around and around and around we go"
      },
      {
        "time": 37,
        "text": "Oh, now, tell me now, tell me now, tell me now you know"
      },
      {
        "time": 43,
        "text": "Not really sure how to feel about it"
      },
      {
        "time": 48,
        "text": "Somethin' in the way you move"
      },
      {
        "time": 53,
        "text": "Makes me feel like I can't live without you"
      },
      {
        "time": 59,
        "text": "It takes me all the way"
      },
      {
        "time": 64,
        "text": "I want you to stay"
      },
      {
        "time": 72,
        "text": "It's not much of a life you're livin'"
      },
      {
        "time": 77,
        "text": "It's not just something you take, it's given"
      },
      {
        "time": 83,
        "text": "'Round and around and around and around we go"
      },
      {
        "time": 89,
        "text": "Oh, now, tell me now, tell me now, tell me now you know"
      },
      {
        "time": 95,
        "text": "Not really sure how to feel about it"
      },
      {
        "time": 100,
        "text": "Something in the way you move"
      },
      {
        "time": 106,
        "text": "Makes me feel like I can't live without you"
      },
      {
        "time": 111,
        "text": "It takes me all the way"
      },
      {
        "time": 117,
        "text": "And I want you to stay"
      },
      {
        "time": 123,
        "text": "Ooh, the reason I hold on"
      },
      {
        "time": 129,
        "text": "'Cause I need this hole gone"
      },
      {
        "time": 135,
        "text": "Funny you're the broken one"
      },
      {
        "time": 139,
        "text": "But I'm the only one who needed savin'"
      },
      {
        "time": 144,
        "text": "'Cause when you never see the light"
      },
      {
        "time": 148,
        "text": "It's hard to know which one of us is cavin'"
      },
      {
        "time": 153,
        "text": "Not really sure how to feel about it"
      },
      {
        "time": 158,
        "text": "Somethin' in the way you move"
      },
      {
        "time": 163,
        "text": "Makes me feel like I can't live without you"
      },
      {
        "time": 168,
        "text": "It takes me all the way"
      },
      {
        "time": 173,
        "text": "I want you to stay... stay"
      }
    ],
    "es": [
      {
        "time": 0,
        "text": "♪ (Intro suave de piano) ♪"
      },
      {
        "time": 10,
        "text": "Todo este tiempo, fue una fiebre"
      },
      {
        "time": 14,
        "text": "Un sudor frío, una creyente apasionada"
      },
      {
        "time": 19,
        "text": "Lancé mis manos al aire y dije: 'Muéstrame algo'"
      },
      {
        "time": 25,
        "text": "Él dijo: 'Si te atreves, acércate un poco más'"
      },
      {
        "time": 31,
        "text": "Vueltas y vueltas y vueltas damos sin parar"
      },
      {
        "time": 37,
        "text": "Oh, dime ahora, dime ahora, dime si ya lo sabes"
      },
      {
        "time": 43,
        "text": "No estoy segura de qué sentir al respecto"
      },
      {
        "time": 48,
        "text": "Algo en la manera en que te mueves"
      },
      {
        "time": 53,
        "text": "Me hace sentir que no puedo vivir sin ti"
      },
      {
        "time": 59,
        "text": "Me transporta por completo"
      },
      {
        "time": 64,
        "text": "Quiero que te quedes"
      },
      {
        "time": 72,
        "text": "No es mucha vida la que estás viviendo"
      },
      {
        "time": 77,
        "text": "No es algo que solo tomas, es un regalo"
      },
      {
        "time": 83,
        "text": "Vueltas y vueltas y vueltas damos sin parar"
      },
      {
        "time": 89,
        "text": "Oh, dime ahora, dime ahora, dime si ya lo sabes"
      },
      {
        "time": 95,
        "text": "No estoy seguro de qué sentir al respecto"
      },
      {
        "time": 100,
        "text": "Algo en la forma en que te mueves"
      },
      {
        "time": 106,
        "text": "Me hace sentir que no puedo vivir sin ti"
      },
      {
        "time": 111,
        "text": "Me transporta por completo"
      },
      {
        "time": 117,
        "text": "Y quiero que te quedes"
      },
      {
        "time": 123,
        "text": "Ooh, la razón por la que resisto"
      },
      {
        "time": 129,
        "text": "Porque necesito que este vacío se vaya"
      },
      {
        "time": 135,
        "text": "Es curioso que tú seas el que está roto"
      },
      {
        "time": 139,
        "text": "Pero yo era quien necesitaba ser salvada"
      },
      {
        "time": 144,
        "text": "Porque cuando nunca ves la luz"
      },
      {
        "time": 148,
        "text": "Es difícil saber cuál de los dos se está rindiendo"
      },
      {
        "time": 153,
        "text": "No estoy segura de qué sentir al respecto"
      },
      {
        "time": 158,
        "text": "Algo en la manera en que te mueves"
      },
      {
        "time": 163,
        "text": "Me hace sentir que no puedo vivir sin ti"
      },
      {
        "time": 168,
        "text": "Me transporta por completo"
      },
      {
        "time": 173,
        "text": "Quiero que te quedes... quédate"
      }
    ],
    "tl": [
      {
        "time": 0,
        "text": "♪ (Mahinahong intro ng piyano) ♪"
      },
      {
        "time": 10,
        "text": "Sa simula pa lang, parang lagnat"
      },
      {
        "time": 14,
        "text": "Malamig na pawis, pusong nananalig"
      },
      {
        "time": 19,
        "text": "Tinaas ko ang aking mga kamay, 'Ipakita mo sa akin'"
      },
      {
        "time": 25,
        "text": "Sabi niya, 'Kung kaya mo, lumapit ka pa'"
      },
      {
        "time": 31,
        "text": "Paikot-ikot at paikot-ikot tayo kung saan"
      },
      {
        "time": 37,
        "text": "Oh, sabihin mo ngayon, sabihin mo kung alam mo na"
      },
      {
        "time": 43,
        "text": "Hindi ko tiyak kung ano ang mararamdaman"
      },
      {
        "time": 48,
        "text": "May kung ano sa bawat galaw mo"
      },
      {
        "time": 53,
        "text": "Na nagpaparamdam na di ko kayang mabuhay nang wala ka"
      },
      {
        "time": 59,
        "text": "Dinadala ako hanggang dulo"
      },
      {
        "time": 64,
        "text": "Gusto kong manatili ka"
      },
      {
        "time": 72,
        "text": "Hindi ito tunay na buhay na iyong tinatahak"
      },
      {
        "time": 77,
        "text": "Hindi lang basta kinukuha, ito ay ibinibigay"
      },
      {
        "time": 83,
        "text": "Paikot-ikot at paikot-ikot tayo kung saan"
      },
      {
        "time": 89,
        "text": "Oh, sabihin mo ngayon, sabihin mo kung alam mo na"
      },
      {
        "time": 95,
        "text": "Hindi ko tiyak kung ano ang mararamdaman"
      },
      {
        "time": 100,
        "text": "May kakaiba sa iyong paggalaw"
      },
      {
        "time": 106,
        "text": "Pakiramdam ko hindi ko kayang mawala ka"
      },
      {
        "time": 111,
        "text": "Dinadala ako hanggang dulo"
      },
      {
        "time": 117,
        "text": "At gusto kong manatili ka"
      },
      {
        "time": 123,
        "text": "Ooh, ang dahilan kung bakit kumakapit"
      },
      {
        "time": 129,
        "text": "Dahil kailangang mapuno ang puwang na ito"
      },
      {
        "time": 135,
        "text": "Nakapagtataka na ikaw ang wasak"
      },
      {
        "time": 139,
        "text": "Ngunit ako ang tanging kailangang iligtas"
      },
      {
        "time": 144,
        "text": "Dahil kapag hindi mo kailanman nakikita ang liwanag"
      },
      {
        "time": 148,
        "text": "Mahirap malaman kung sino sa atin ang sumusuko"
      },
      {
        "time": 153,
        "text": "Hindi ko tiyak kung ano ang mararamdaman"
      },
      {
        "time": 158,
        "text": "May kung ano sa bawat galaw mo"
      },
      {
        "time": 163,
        "text": "Na nagpaparamdam na di ko kayang mabuhay nang wala ka"
      },
      {
        "time": 168,
        "text": "Dinadala ako hanggang dulo"
      },
      {
        "time": 173,
        "text": "Gusto kong manatili ka... manatili ka"
      }
    ],
    "ja": [
      {
        "time": 0,
        "text": "♪ (穏やかなピアノのイントロ) ♪"
      },
      {
        "time": 10,
        "text": "ずっと、まるで熱病のようだった"
      },
      {
        "time": 14,
        "text": "冷や汗を流し、夢中になって信じていた"
      },
      {
        "time": 19,
        "text": "両手を上げて「何か見せて」と言った"
      },
      {
        "time": 25,
        "text": "彼は「勇気があるなら、もっと近くにおいで」と答えた"
      },
      {
        "time": 31,
        "text": "ぐるぐると、私たちは回り続ける"
      },
      {
        "time": 37,
        "text": "ねえ、今教えて、分かっているなら言ってよ"
      },
      {
        "time": 43,
        "text": "どう受け止めればいいのか分からない"
      },
      {
        "time": 48,
        "text": "あなたの仕草のひとつひとつが"
      },
      {
        "time": 53,
        "text": "あなたなしでは生きられないと思わせる"
      },
      {
        "time": 59,
        "text": "私をどこまでも連れていく"
      },
      {
        "time": 64,
        "text": "そばにいてほしい"
      },
      {
        "time": 72,
        "text": "それは生きているとは言えない人生だよ"
      },
      {
        "time": 77,
        "text": "ただ奪うものじゃない、与えられるものなんだ"
      },
      {
        "time": 83,
        "text": "ぐるぐると、私たちは回り続ける"
      },
      {
        "time": 89,
        "text": "ねえ、今教えて、分かっているなら言ってよ"
      },
      {
        "time": 95,
        "text": "どんな気持ちでいればいいか分からない"
      },
      {
        "time": 100,
        "text": "あなたのその仕草が"
      },
      {
        "time": 106,
        "text": "あなたなしでは生きられないと思わせる"
      },
      {
        "time": 111,
        "text": "すべてを連れ去っていく"
      },
      {
        "time": 117,
        "text": "そして、そばにいてほしいんだ"
      },
      {
        "time": 123,
        "text": "ああ、私がすがりつく理由"
      },
      {
        "time": 129,
        "text": "この心の穴を埋めたいから"
      },
      {
        "time": 135,
        "text": "傷ついているのはあなたなのに"
      },
      {
        "time": 139,
        "text": "救われるべきだったのは私だけだった"
      },
      {
        "time": 144,
        "text": "光を見失っているとき"
      },
      {
        "time": 148,
        "text": "どちらが崩れ落ちているのか見分けがつかない"
      },
      {
        "time": 153,
        "text": "どう受け止めればいいのか分からない"
      },
      {
        "time": 158,
        "text": "あなたのその身のこなしが"
      },
      {
        "time": 163,
        "text": "あなたなしでは生きられないと思わせる"
      },
      {
        "time": 168,
        "text": "私をどこまでも連れていく"
      },
      {
        "time": 173,
        "text": "お願い、そばにいて…ここにいて"
      }
    ],
    "fr": [
      {
        "time": 0,
        "text": "♪ (Douce intro au piano) ♪"
      },
      {
        "time": 10,
        "text": "Depuis le début, c'était une fièvre"
      },
      {
        "time": 14,
        "text": "Une sueur froide, une croyante passionnée"
      },
      {
        "time": 19,
        "text": "J'ai levé les bras au ciel, en disant 'Montre-moi quelque chose'"
      },
      {
        "time": 25,
        "text": "Il a dit, 'Si tu l'oses, approche-toi un peu plus'"
      },
      {
        "time": 31,
        "text": "Encore et encore, nous tournons en rond"
      },
      {
        "time": 37,
        "text": "Oh, dis-le-moi maintenant, dis-moi que tu sais"
      },
      {
        "time": 43,
        "text": "Pas vraiment sûre de ce que je ressens"
      },
      {
        "time": 48,
        "text": "Quelque chose dans ta façon de bouger"
      },
      {
        "time": 53,
        "text": "Me fait sentir que je ne peux vivre sans toi"
      },
      {
        "time": 59,
        "text": "Ça m'emporte tout entier"
      },
      {
        "time": 64,
        "text": "Je veux que tu restes"
      },
      {
        "time": 72,
        "text": "Ce n'est pas vraiment une vie que tu mènes"
      },
      {
        "time": 77,
        "text": "Ce n'est pas juste quelque chose qu'on prend, c'est offert"
      },
      {
        "time": 83,
        "text": "Encore et encore, nous tournons en rond"
      },
      {
        "time": 89,
        "text": "Oh, dis-le-moi maintenant, dis-moi que tu sais"
      },
      {
        "time": 95,
        "text": "Pas vraiment sûr de ce que je ressens"
      },
      {
        "time": 100,
        "text": "Quelque chose dans ta façon de bouger"
      },
      {
        "time": 106,
        "text": "Me fait sentir que je ne peux pas vivre sans toi"
      },
      {
        "time": 111,
        "text": "Ça m'emporte tout entier"
      },
      {
        "time": 117,
        "text": "Et je veux que tu restes"
      },
      {
        "time": 123,
        "text": "Ooh, la raison pour laquelle je m’accroche"
      },
      {
        "time": 129,
        "text": "C'est que j'ai besoin de combler ce vide"
      },
      {
        "time": 135,
        "text": "C'est drôle, tu es celui qui est brisé"
      },
      {
        "time": 139,
        "text": "Mais j'étais la seule à devoir être sauvée"
      },
      {
        "time": 144,
        "text": "Parce que quand on ne voit jamais la lumière"
      },
      {
        "time": 148,
        "text": "C'est dur de savoir lequel de nous s'effondre"
      },
      {
        "time": 153,
        "text": "Pas vraiment sûre de ce que je ressens"
      },
      {
        "time": 158,
        "text": "Quelque chose dans ta manière d’être"
      },
      {
        "time": 163,
        "text": "Me fait sentir que je ne peux vivre sans toi"
      },
      {
        "time": 168,
        "text": "Ça m'emporte tout entier"
      },
      {
        "time": 173,
        "text": "Je veux que tu restes... reste"
      }
    ],
    "de": [
      {
        "time": 0,
        "text": "♪ (Sanftes Klavier-Intro) ♪"
      },
      {
        "time": 10,
        "text": "Die ganze Zeit war es wie ein Fieber"
      },
      {
        "time": 14,
        "text": "Kalter Schweiß, ein heißblütiger Glaube"
      },
      {
        "time": 19,
        "text": "Ich warf die Hände in die Luft und sagte: Zeig mir was"
      },
      {
        "time": 25,
        "text": "Er sagte: Wenn du dich traust, komm etwas näher"
      },
      {
        "time": 31,
        "text": "Rundherum und immer weiter im Kreis"
      },
      {
        "time": 37,
        "text": "Oh, sag es mir jetzt, sag mir, dass du es weißt"
      },
      {
        "time": 43,
        "text": "Ich weiß nicht genau, was ich fühlen soll"
      },
      {
        "time": 48,
        "text": "Etwas an der Art, wie du dich bewegst"
      },
      {
        "time": 53,
        "text": "Lässt mich glauben, dass ich ohne dich nicht leben kann"
      },
      {
        "time": 59,
        "text": "Es nimmt mich ganz gefangen"
      },
      {
        "time": 64,
        "text": "Ich will, dass du bleibst"
      },
      {
        "time": 72,
        "text": "Das ist kaum ein Leben, das du führst"
      },
      {
        "time": 77,
        "text": "Es ist nichts, was man einfach nimmt, es wird geschenkt"
      },
      {
        "time": 83,
        "text": "Rundherum und immer weiter im Kreis"
      },
      {
        "time": 89,
        "text": "Oh, sag es mir jetzt, sag mir, dass du es weißt"
      },
      {
        "time": 95,
        "text": "Nicht wirklich sicher, wie ich fühlen soll"
      },
      {
        "time": 100,
        "text": "Etwas an der Art, wie du dich bewegst"
      },
      {
        "time": 106,
        "text": "Lässt mich spüren, dass ich ohne dich nicht sein kann"
      },
      {
        "time": 111,
        "text": "Es trägt mich ganz davon"
      },
      {
        "time": 117,
        "text": "Und ich will, dass du bleibst"
      },
      {
        "time": 123,
        "text": "Ooh, der Grund, warum ich festhalte"
      },
      {
        "time": 129,
        "text": "Weil diese Leere verschwinden muss"
      },
      {
        "time": 135,
        "text": "Komisch, dass du der Zerbrochene bist"
      },
      {
        "time": 139,
        "text": "Aber ich die Einzige war, die Rettung brauchte"
      },
      {
        "time": 144,
        "text": "Denn wenn man das Licht nie sieht"
      },
      {
        "time": 148,
        "text": "Ist es schwer zu wissen, wer von uns nachgibt"
      },
      {
        "time": 153,
        "text": "Nicht wirklich sicher, was ich fühlen soll"
      },
      {
        "time": 158,
        "text": "Etwas an der Art, wie du dich bewegst"
      },
      {
        "time": 163,
        "text": "Gibt mir das Gefühl, nicht ohne dich leben zu können"
      },
      {
        "time": 168,
        "text": "Es nimmt mich ganz ein"
      },
      {
        "time": 173,
        "text": "Ich will, dass du bleibst... bleib"
      }
    ],
    "ko": [
      {
        "time": 0,
        "text": "♪ (부드러운 피아노 도입부) ♪"
      },
      {
        "time": 10,
        "text": "처음부터, 그건 마치 열병 같았어"
      },
      {
        "time": 14,
        "text": "식은땀을 흘리며 열정적으로 믿었지"
      },
      {
        "time": 19,
        "text": "두 손을 하늘로 들며 말했어, '뭐든 보여줘 봐'"
      },
      {
        "time": 25,
        "text": "그는 말했지, '자신 있다면, 조금 더 가까이 와'"
      },
      {
        "time": 31,
        "text": "빙글빙글 우리는 맴돌고 있어"
      },
      {
        "time": 37,
        "text": "오, 지금 내게 말해줘, 너도 알고 있다고"
      },
      {
        "time": 43,
        "text": "어떤 마음이어야 할지 잘 모르겠어"
      },
      {
        "time": 48,
        "text": "너의 움직임 속 그 무언가가"
      },
      {
        "time": 53,
        "text": "너 없이는 살 수 없을 것만 같게 해"
      },
      {
        "time": 59,
        "text": "나를 온전히 사로잡아"
      },
      {
        "time": 64,
        "text": "네가 곁에 머물렀으면 좋겠어"
      },
      {
        "time": 72,
        "text": "네가 사는 건 그리 온전한 삶이 아니야"
      },
      {
        "time": 77,
        "text": "그냥 쥐는 게 아니라, 서로 주는 선물이지"
      },
      {
        "time": 83,
        "text": "빙글빙글 우리는 맴돌고 있어"
      },
      {
        "time": 89,
        "text": "오, 지금 말해줘, 이제는 알고 있다고"
      },
      {
        "time": 95,
        "text": "어떻게 느껴야 할지 잘 모르겠어"
      },
      {
        "time": 100,
        "text": "너의 움직임 속 그 어떤 것이"
      },
      {
        "time": 106,
        "text": "너 없이 살 수 없을 것 같은 기분을 만들어"
      },
      {
        "time": 111,
        "text": "나를 온전히 이끌어가"
      },
      {
        "time": 117,
        "text": "그리고 난 네가 머물러 주길 바라"
      },
      {
        "time": 123,
        "text": "오, 내가 붙잡고 있는 이유"
      },
      {
        "time": 129,
        "text": "이 빈자리가 채워지길 원하기에"
      },
      {
        "time": 135,
        "text": "상처 입은 건 너인데"
      },
      {
        "time": 139,
        "text": "정작 구원이 필요했던 건 나뿐이었어"
      },
      {
        "time": 144,
        "text": "빛을 전혀 보지 못할 때는"
      },
      {
        "time": 148,
        "text": "우리 중 누가 무너지고 있는지 알기 어렵잖아"
      },
      {
        "time": 153,
        "text": "어떤 마음이어야 할지 여전히 모르겠어"
      },
      {
        "time": 158,
        "text": "너의 그 몸짓 하나하나가"
      },
      {
        "time": 163,
        "text": "너 없이는 살 수 없을 것처럼 느껴지게 해"
      },
      {
        "time": 168,
        "text": "나를 전부 데려가"
      },
      {
        "time": 173,
        "text": "네가 머물렀으면 해... 머물러줘"
      }
    ]
  },
  "song-1788808460743": {
    "en": [
      {
        "time": 0,
        "text": "♪ (Acoustic guitar strum intro) ♪"
      },
      {
        "time": 6,
        "text": "Just the guitar, okay, cool"
      },
      {
        "time": 10,
        "text": "This was all you, none of it me"
      },
      {
        "time": 14,
        "text": "You put your hands all over my body and told me, mmm"
      },
      {
        "time": 19,
        "text": "You told me you were ready"
      },
      {
        "time": 23,
        "text": "For the big one, for the big jump"
      },
      {
        "time": 28,
        "text": "I'd be your last love, everlasting, you and me, mmm"
      },
      {
        "time": 33,
        "text": "That was what you told me"
      },
      {
        "time": 37,
        "text": "I'm giving you up, I've forgiven it all"
      },
      {
        "time": 43,
        "text": "You set me free"
      },
      {
        "time": 47,
        "text": "Send my love to your new lover"
      },
      {
        "time": 51,
        "text": "Treat her better"
      },
      {
        "time": 55,
        "text": "We've gotta let go of all of our ghosts"
      },
      {
        "time": 59,
        "text": "We both know we ain't kids no more"
      },
      {
        "time": 64,
        "text": "Send my love to your new lover"
      },
      {
        "time": 68,
        "text": "Treat her better"
      },
      {
        "time": 72,
        "text": "We've gotta let go of all of our ghosts"
      },
      {
        "time": 76,
        "text": "We both know we ain't kids no more"
      },
      {
        "time": 81,
        "text": "I was too strong, you were trembling"
      },
      {
        "time": 85,
        "text": "You couldn't handle the hot heat rising"
      },
      {
        "time": 90,
        "text": "Baby, I'm still rising"
      },
      {
        "time": 94,
        "text": "I was running, you were walking"
      },
      {
        "time": 98,
        "text": "You couldn't keep up, you were falling down"
      },
      {
        "time": 103,
        "text": "There's only one way down"
      },
      {
        "time": 107,
        "text": "I'm giving you up, I've forgiven it all"
      },
      {
        "time": 113,
        "text": "You set me free, oh"
      },
      {
        "time": 117,
        "text": "Send my love to your new lover"
      },
      {
        "time": 121,
        "text": "Treat her better"
      },
      {
        "time": 125,
        "text": "We've gotta let go of all of our ghosts"
      },
      {
        "time": 129,
        "text": "We both know we ain't kids no more"
      },
      {
        "time": 134,
        "text": "If you're ready, if you're ready"
      },
      {
        "time": 139,
        "text": "If you're ready, I am ready"
      },
      {
        "time": 143,
        "text": "We both know we ain't kids no more"
      },
      {
        "time": 148,
        "text": "Send my love to your new lover"
      },
      {
        "time": 152,
        "text": "Treat her better"
      },
      {
        "time": 156,
        "text": "We've gotta let go of all of our ghosts"
      },
      {
        "time": 160,
        "text": "We both know we ain't kids no more"
      },
      {
        "time": 165,
        "text": "Treat her better, treat her better..."
      },
      {
        "time": 172,
        "text": "We ain't kids no more"
      }
    ],
    "es": [
      {
        "time": 0,
        "text": "♪ (Intro con rasgueo de guitarra acústica) ♪"
      },
      {
        "time": 6,
        "text": "Solo la guitarra, está bien, genial"
      },
      {
        "time": 10,
        "text": "Todo esto fuiste tú, nada de mí"
      },
      {
        "time": 14,
        "text": "Pusiste tus manos en todo mi cuerpo y me dijiste, mmm"
      },
      {
        "time": 19,
        "text": "Me dijiste que estabas listo"
      },
      {
        "time": 23,
        "text": "Para el gran paso, para el gran salto"
      },
      {
        "time": 28,
        "text": "Que sería tu último amor, eterno, tú y yo, mmm"
      },
      {
        "time": 33,
        "text": "Eso fue lo que me dijiste"
      },
      {
        "time": 37,
        "text": "Te estoy dejando ir, lo he perdonado todo"
      },
      {
        "time": 43,
        "text": "Me has hecho libre"
      },
      {
        "time": 47,
        "text": "Mándale mi amor a tu nuevo amor"
      },
      {
        "time": 51,
        "text": "Trátala mejor"
      },
      {
        "time": 55,
        "text": "Tenemos que dejar ir a todos nuestros fantasmas"
      },
      {
        "time": 59,
        "text": "Los dos sabemos que ya no somos niños"
      },
      {
        "time": 64,
        "text": "Mándale mi amor a tu nuevo amor"
      },
      {
        "time": 68,
        "text": "Trátala mejor"
      },
      {
        "time": 72,
        "text": "Tenemos que dejar ir a todos nuestros fantasmas"
      },
      {
        "time": 76,
        "text": "Los dos sabemos que ya no somos niños"
      },
      {
        "time": 81,
        "text": "Fui demasiado fuerte, tú estabas temblando"
      },
      {
        "time": 85,
        "text": "No pudiste soportar el calor en aumento"
      },
      {
        "time": 90,
        "text": "Cariño, todavía sigo en ascenso"
      },
      {
        "time": 94,
        "text": "Yo corría, tú caminabas"
      },
      {
        "time": 98,
        "text": "No pudiste seguirme el paso, te estabas cayendo"
      },
      {
        "time": 103,
        "text": "Solo hay un camino hacia abajo"
      },
      {
        "time": 107,
        "text": "Te estoy dejando ir, lo he perdonado todo"
      },
      {
        "time": 113,
        "text": "Me has dejado libre, oh"
      },
      {
        "time": 117,
        "text": "Mándale mi amor a tu nuevo amor"
      },
      {
        "time": 121,
        "text": "Trátala mejor"
      },
      {
        "time": 125,
        "text": "Tenemos que dejar ir a todos nuestros fantasmas"
      },
      {
        "time": 129,
        "text": "Los dos sabemos que ya no somos niños"
      },
      {
        "time": 134,
        "text": "Si estás listo, si estás listo"
      },
      {
        "time": 139,
        "text": "Si estás listo, yo estoy lista"
      },
      {
        "time": 143,
        "text": "Los dos sabemos que ya no somos niños"
      },
      {
        "time": 148,
        "text": "Mándale mi amor a tu nuevo amor"
      },
      {
        "time": 152,
        "text": "Trátala mejor"
      },
      {
        "time": 156,
        "text": "Tenemos que dejar ir a todos nuestros fantasmas"
      },
      {
        "time": 160,
        "text": "Los dos sabemos que ya no somos niños"
      },
      {
        "time": 165,
        "text": "Trátala mejor, trátala mejor..."
      },
      {
        "time": 172,
        "text": "Ya no somos niños"
      }
    ],
    "tl": [
      {
        "time": 0,
        "text": "♪ (Intro ng akustikong gitara) ♪"
      },
      {
        "time": 6,
        "text": "Gitara lang, sige ayos"
      },
      {
        "time": 10,
        "text": "Lahat ng ito ay ikaw, walang bahagi sa akin"
      },
      {
        "time": 14,
        "text": "Hinawakan mo ako at sinabing, mmm"
      },
      {
        "time": 19,
        "text": "Sinabi mong handa ka na"
      },
      {
        "time": 23,
        "text": "Para sa malaking hakbang, para sa pagtalon"
      },
      {
        "time": 28,
        "text": "Ako ang huli mong pag-ibig, walang hanggan"
      },
      {
        "time": 33,
        "text": "Iyon ang sinabi mo sa akin"
      },
      {
        "time": 37,
        "text": "Binitiwan na kita, pinatawad ko na ang lahat"
      },
      {
        "time": 43,
        "text": "Pinalaya mo ako"
      },
      {
        "time": 47,
        "text": "Ihatid mo ang pagbati sa bago mong minamahal"
      },
      {
        "time": 51,
        "text": "Tratuhin mo siya nang mas mabuti"
      },
      {
        "time": 55,
        "text": "Kailangan na nating pakawalan ang mga alaala"
      },
      {
        "time": 59,
        "text": "Pareho nating alam na hindi na tayo bata"
      },
      {
        "time": 64,
        "text": "Ihatid mo ang pagbati sa bago mong minamahal"
      },
      {
        "time": 68,
        "text": "Tratuhin mo siya nang mas mabuti"
      },
      {
        "time": 72,
        "text": "Kailangan na nating pakawalan ang mga alaala"
      },
      {
        "time": 76,
        "text": "Pareho nating alam na hindi na tayo bata"
      },
      {
        "time": 81,
        "text": "Masyado akong matatag, ikaw ay nangangatal"
      },
      {
        "time": 85,
        "text": "Hindi mo nakayanan ang tumitinding init"
      },
      {
        "time": 90,
        "text": "Mahal, pataas pa rin ako"
      },
      {
        "time": 94,
        "text": "Ako ay tumatakbo, ikaw ay naglalakad"
      },
      {
        "time": 98,
        "text": "Hindi ka nakahabol, ikaw ay bumagsak"
      },
      {
        "time": 103,
        "text": "Iisa lang ang daan pababa"
      },
      {
        "time": 107,
        "text": "Binitiwan na kita, pinatawad ko na ang lahat"
      },
      {
        "time": 113,
        "text": "Pinalaya mo ako, oh"
      },
      {
        "time": 117,
        "text": "Ihatid mo ang pagbati sa bago mong minamahal"
      },
      {
        "time": 121,
        "text": "Tratuhin mo siya nang mas mabuti"
      },
      {
        "time": 125,
        "text": "Kailangan na nating pakawalan ang mga alaala"
      },
      {
        "time": 129,
        "text": "Pareho nating alam na hindi na tayo bata"
      },
      {
        "time": 134,
        "text": "Kung handa ka na, kung handa ka na"
      },
      {
        "time": 139,
        "text": "Kung handa ka na, handa na rin ako"
      },
      {
        "time": 143,
        "text": "Alam nating dalawa na di na tayo bata"
      },
      {
        "time": 148,
        "text": "Ihatid mo ang pagbati sa bago mong minamahal"
      },
      {
        "time": 152,
        "text": "Tratuhin mo siya nang mas mabuti"
      },
      {
        "time": 156,
        "text": "Pakawalan na natin ang nakaraan"
      },
      {
        "time": 160,
        "text": "Alam nating dalawa na hindi na tayo bata"
      },
      {
        "time": 165,
        "text": "Tratuhin mo siya nang maayos..."
      },
      {
        "time": 172,
        "text": "Hindi na tayo bata"
      }
    ],
    "ja": [
      {
        "time": 0,
        "text": "♪ (アコースティックギターのイントロ) ♪"
      },
      {
        "time": 6,
        "text": "ギターだけでいい、そう、いいね"
      },
      {
        "time": 10,
        "text": "全部あなたのせい、私じゃない"
      },
      {
        "time": 14,
        "text": "私に触れて、囁いたよね"
      },
      {
        "time": 19,
        "text": "覚悟はできているって"
      },
      {
        "time": 23,
        "text": "大きな一歩、大きな跳躍への覚悟が"
      },
      {
        "time": 28,
        "text": "私があなたの最後の愛、永遠にふたりで"
      },
      {
        "time": 33,
        "text": "そう言ってくれたじゃない"
      },
      {
        "time": 37,
        "text": "もうあなたを手放すわ、すべて許したの"
      },
      {
        "time": 43,
        "text": "あなたが私を自由にしてくれた"
      },
      {
        "time": 47,
        "text": "新しい恋人に愛を伝えてあげて"
      },
      {
        "time": 51,
        "text": "もっと大切にしてあげてね"
      },
      {
        "time": 55,
        "text": "過去の亡霊たちを手放さなきゃ"
      },
      {
        "time": 59,
        "text": "もう私たち、子供じゃないんだから"
      },
      {
        "time": 64,
        "text": "新しい恋人に愛を伝えて"
      },
      {
        "time": 68,
        "text": "もっと優しくしてあげて"
      },
      {
        "time": 72,
        "text": "過去の亡霊たちを手放さなきゃ"
      },
      {
        "time": 76,
        "text": "もう私たちは子供じゃない"
      },
      {
        "time": 81,
        "text": "私は強すぎた、あなたは震えていた"
      },
      {
        "time": 85,
        "text": "立ちのぼる熱気に耐えられなかったのね"
      },
      {
        "time": 90,
        "text": "ベイビー、私はまだ昇り続けている"
      },
      {
        "time": 94,
        "text": "私は走っていた、あなたは歩いていた"
      },
      {
        "time": 98,
        "text": "追いつけずに、あなたは崩れ落ちていった"
      },
      {
        "time": 103,
        "text": "落ちていく道はひとつだけ"
      },
      {
        "time": 107,
        "text": "もう諦めるわ、すべてを許したの"
      },
      {
        "time": 113,
        "text": "あなたが私を自由にしたのよ"
      },
      {
        "time": 117,
        "text": "新しい恋人に愛を届けて"
      },
      {
        "time": 121,
        "text": "彼女をもっと大切にしてあげて"
      },
      {
        "time": 125,
        "text": "すべての過去の亡霊を解放しよう"
      },
      {
        "time": 129,
        "text": "もう子供じゃないって分かってるでしょ"
      },
      {
        "time": 134,
        "text": "準備ができてるなら"
      },
      {
        "time": 139,
        "text": "あなたが良ければ、私も覚悟はできてる"
      },
      {
        "time": 143,
        "text": "もう子供じゃないんだから"
      },
      {
        "time": 148,
        "text": "新しい恋人によろしく伝えて"
      },
      {
        "time": 152,
        "text": "もっと大切にしてあげてね"
      },
      {
        "time": 156,
        "text": "過去のしがらみはすべて捨てよう"
      },
      {
        "time": 160,
        "text": "私たち、もう子供じゃない"
      },
      {
        "time": 165,
        "text": "もっと大切に…大切にしてあげて"
      },
      {
        "time": 172,
        "text": "もう子供じゃないんだから"
      }
    ],
    "fr": [
      {
        "time": 0,
        "text": "♪ (Intro guitare acoustique) ♪"
      },
      {
        "time": 6,
        "text": "Juste la guitare, d’accord, super"
      },
      {
        "time": 10,
        "text": "C'était entièrement toi, rien de moi"
      },
      {
        "time": 14,
        "text": "Tu as posé tes mains sur moi et m'as dit, mmm"
      },
      {
        "time": 19,
        "text": "Tu disais que tu étais prêt"
      },
      {
        "time": 23,
        "text": "Pour le grand saut, pour la grande aventure"
      },
      {
        "time": 28,
        "text": "Que je serais ton dernier amour éternel, toi et moi"
      },
      {
        "time": 33,
        "text": "C'est ce que tu m'avais promis"
      },
      {
        "time": 37,
        "text": "Je te laisse partir, j'ai tout pardonné"
      },
      {
        "time": 43,
        "text": "Tu m'as libérée"
      },
      {
        "time": 47,
        "text": "Transmets mon amour à ta nouvelle conquête"
      },
      {
        "time": 51,
        "text": "Traite-la mieux"
      },
      {
        "time": 55,
        "text": "Il faut lâcher prise de tous nos fantômes"
      },
      {
        "time": 59,
        "text": "On sait tous les deux qu’on n’est plus des enfants"
      },
      {
        "time": 64,
        "text": "Transmets mon amour à ta nouvelle amoureuse"
      },
      {
        "time": 68,
        "text": "Sois meilleur avec elle"
      },
      {
        "time": 72,
        "text": "Laissons partir tous nos fantômes"
      },
      {
        "time": 76,
        "text": "On sait tous les deux qu’on n’est plus des gosses"
      },
      {
        "time": 81,
        "text": "J'étais trop forte, tu tremblais"
      },
      {
        "time": 85,
        "text": "Tu ne pouvais pas supporter cette ardeur montante"
      },
      {
        "time": 90,
        "text": "Chéri, je m'élève toujours"
      },
      {
        "time": 94,
        "text": "Je courais, tu marchais"
      },
      {
        "time": 98,
        "text": "Tu ne pouvais pas suivre, tu tombais"
      },
      {
        "time": 103,
        "text": "Il n'y a qu'une seule issue vers le bas"
      },
      {
        "time": 107,
        "text": "Je t'abandonne, j'ai tout pardonné"
      },
      {
        "time": 113,
        "text": "Tu m'as rendue libre, oh"
      },
      {
        "time": 117,
        "text": "Transmets mon amour à ta nouvelle amante"
      },
      {
        "time": 121,
        "text": "Prends bien soin d’elle"
      },
      {
        "time": 125,
        "text": "Oublions tous nos fantômes passés"
      },
      {
        "time": 129,
        "text": "On sait bien qu'on n'est plus des enfants"
      },
      {
        "time": 134,
        "text": "Si tu es prêt, si tu es prêt"
      },
      {
        "time": 139,
        "text": "Si tu es prêt, je suis prête"
      },
      {
        "time": 143,
        "text": "Nous ne sommes plus des enfants"
      },
      {
        "time": 148,
        "text": "Donne mon amour à ta nouvelle amoureuse"
      },
      {
        "time": 152,
        "text": "Traite-la mieux"
      },
      {
        "time": 156,
        "text": "Délivrons-nous de nos fantômes"
      },
      {
        "time": 160,
        "text": "Nous ne sommes plus des gosses"
      },
      {
        "time": 165,
        "text": "Traite-la mieux, sois bon avec elle..."
      },
      {
        "time": 172,
        "text": "Nous ne sommes plus des enfants"
      }
    ],
    "de": [
      {
        "time": 0,
        "text": "♪ (Akustikgitarren-Intro) ♪"
      },
      {
        "time": 6,
        "text": "Nur die Gitarre, okay, cool"
      },
      {
        "time": 10,
        "text": "Das lag alles an dir, nichts an mir"
      },
      {
        "time": 14,
        "text": "Du hast mich berührt und mir gesagt, mmm"
      },
      {
        "time": 19,
        "text": "Du hast gesagt, du wärst bereit"
      },
      {
        "time": 23,
        "text": "Für den großen Sprung, das große Ganze"
      },
      {
        "time": 28,
        "text": "Dass ich deine letzte, ewige Liebe sein würde"
      },
      {
        "time": 33,
        "text": "Das hast du mir versprochen"
      },
      {
        "time": 37,
        "text": "Ich gebe dich auf, ich habe alles vergeben"
      },
      {
        "time": 43,
        "text": "Du hast mich befreit"
      },
      {
        "time": 47,
        "text": "Grüß deine neue Liebe von mir"
      },
      {
        "time": 51,
        "text": "Behandle sie besser"
      },
      {
        "time": 55,
        "text": "Wir müssen all unsere Geister loslassen"
      },
      {
        "time": 59,
        "text": "Wir wissen beide, dass wir keine Kinder mehr sind"
      },
      {
        "time": 64,
        "text": "Schick meine Liebe an deine Neue"
      },
      {
        "time": 68,
        "text": "Behandle sie besser"
      },
      {
        "time": 72,
        "text": "Wir müssen die Geister der Vergangenheit loslassen"
      },
      {
        "time": 76,
        "text": "Wir sind keine Kinder mehr"
      },
      {
        "time": 81,
        "text": "Ich war zu stark, du hast gezittert"
      },
      {
        "time": 85,
        "text": "Du konntest die steigende Hitze nicht ertragen"
      },
      {
        "time": 90,
        "text": "Baby, ich steige immer noch auf"
      },
      {
        "time": 94,
        "text": "Ich rannte, du gingst nur"
      },
      {
        "time": 98,
        "text": "Du konntest nicht mithalten und stürztest ab"
      },
      {
        "time": 103,
        "text": "Es gibt nur einen Weg nach unten"
      },
      {
        "time": 107,
        "text": "Ich gebe dich auf, ich habe alles verziehen"
      },
      {
        "time": 113,
        "text": "Du hast mich befreit, oh"
      },
      {
        "time": 117,
        "text": "Grüß deine neue Liebe von mir"
      },
      {
        "time": 121,
        "text": "Sei besser zu ihr"
      },
      {
        "time": 125,
        "text": "Lassen wir all unsere Geister ziehen"
      },
      {
        "time": 129,
        "text": "Wir sind keine Kinder mehr"
      },
      {
        "time": 134,
        "text": "Wenn du bereit bist"
      },
      {
        "time": 139,
        "text": "Wenn du bereit bist, bin ich es auch"
      },
      {
        "time": 143,
        "text": "Wir wissen, dass wir erwachsen sind"
      },
      {
        "time": 148,
        "text": "Grüß deine neue Liebe"
      },
      {
        "time": 152,
        "text": "Behandle sie besser"
      },
      {
        "time": 156,
        "text": "Lassen wir unsere Geister los"
      },
      {
        "time": 160,
        "text": "Wir sind keine Kinder mehr"
      },
      {
        "time": 165,
        "text": "Behandle sie besser, sei gut zu ihr..."
      },
      {
        "time": 172,
        "text": "Wir sind keine Kinder mehr"
      }
    ],
    "ko": [
      {
        "time": 0,
        "text": "♪ (어쿠스틱 기타 인트로) ♪"
      },
      {
        "time": 6,
        "text": "기타만 연주해 줘, 좋아, 멋져"
      },
      {
        "time": 10,
        "text": "전부 네 탓이었어, 내 탓은 전혀 없어"
      },
      {
        "time": 14,
        "text": "날 감싸 안으며 내게 속삭였지, mmm"
      },
      {
        "time": 19,
        "text": "준비가 되었다고 말했잖아"
      },
      {
        "time": 23,
        "text": "그 큰 도약을 향해 뛰어들 준비가"
      },
      {
        "time": 28,
        "text": "내가 너의 마지막 영원한 사랑이 될 거라고"
      },
      {
        "time": 33,
        "text": "그게 네가 내게 했던 말이었어"
      },
      {
        "time": 37,
        "text": "이제 널 보내줄게, 모든 걸 용서했어"
      },
      {
        "time": 43,
        "text": "날 자유롭게 해줬어"
      },
      {
        "time": 47,
        "text": "너의 새 연인에게 내 사랑을 전해줘"
      },
      {
        "time": 51,
        "text": "그녀에겐 더 잘해줘"
      },
      {
        "time": 55,
        "text": "우린 모든 과거의 유령들을 털어내야 해"
      },
      {
        "time": 59,
        "text": "우린 둘 다 이제 어린애가 아니잖아"
      },
      {
        "time": 64,
        "text": "새 연인에게 내 안부를 전해줘"
      },
      {
        "time": 68,
        "text": "더 잘 대해주길 바라"
      },
      {
        "time": 72,
        "text": "우리의 과거는 이제 놓아주자"
      },
      {
        "time": 76,
        "text": "우리 둘 다 이제 다 자랐잖아"
      },
      {
        "time": 81,
        "text": "난 너무 강했고, 넌 떨고 있었지"
      },
      {
        "time": 85,
        "text": "점점 뜨거워지는 열기를 넌 감당하지 못했어"
      },
      {
        "time": 90,
        "text": "그대여, 난 여전히 날아오르는 중이야"
      },
      {
        "time": 94,
        "text": "난 달렸고, 넌 걷고 있었어"
      },
      {
        "time": 98,
        "text": "따라오지 못해 넌 주저앉고 말았지"
      },
      {
        "time": 103,
        "text": "추락할 길은 하나뿐이었어"
      },
      {
        "time": 107,
        "text": "널 놓아줄게, 전부 용서했어"
      },
      {
        "time": 113,
        "text": "날 자유롭게 놓아줘서 고마워"
      },
      {
        "time": 117,
        "text": "새 연인에게 내 인사를 전해줘"
      },
      {
        "time": 121,
        "text": "그녀는 더 아껴줘"
      },
      {
        "time": 125,
        "text": "우리의 모든 미련을 털어내자"
      },
      {
        "time": 129,
        "text": "우린 더 이상 아이가 아니잖아"
      },
      {
        "time": 134,
        "text": "네가 준비되었다면"
      },
      {
        "time": 139,
        "text": "네가 준비됐다면 나도 준비됐어"
      },
      {
        "time": 143,
        "text": "우린 이제 어린애가 아니야"
      },
      {
        "time": 148,
        "text": "너의 새로운 사랑에게 전해줘"
      },
      {
        "time": 152,
        "text": "더 잘해주라고"
      },
      {
        "time": 156,
        "text": "과거의 그림자는 묻어두자"
      },
      {
        "time": 160,
        "text": "우린 이제 아이가 아니니까"
      },
      {
        "time": 165,
        "text": "더 잘해줘, 아껴줘..."
      },
      {
        "time": 172,
        "text": "우린 이제 다 컸어"
      }
    ]
  },
  "song-1788806751595": {
    "en": [
      {
        "time": 0,
        "text": "♪ (Melancholy acoustic intro) ♪"
      },
      {
        "time": 8,
        "text": "Yelling at the sky"
      },
      {
        "time": 12,
        "text": "Screaming at the world"
      },
      {
        "time": 17,
        "text": "Baby, why'd you go away?"
      },
      {
        "time": 21,
        "text": "I'm still your girl"
      },
      {
        "time": 25,
        "text": "Holding on too tight"
      },
      {
        "time": 30,
        "text": "Head up in the clouds"
      },
      {
        "time": 34,
        "text": "Heaven only knows where you are now"
      },
      {
        "time": 42,
        "text": "How do I love, how do I love again?"
      },
      {
        "time": 50,
        "text": "How do I trust, how do I trust again?"
      },
      {
        "time": 59,
        "text": "I stay up all night, tell myself I'm alright"
      },
      {
        "time": 67,
        "text": "Baby, you're just harder to see than most"
      },
      {
        "time": 75,
        "text": "I put the record on, wait 'til I hear our song"
      },
      {
        "time": 84,
        "text": "Every night, I'm dancing with your ghost"
      },
      {
        "time": 92,
        "text": "Every night, I'm dancing with your ghost"
      },
      {
        "time": 101,
        "text": "Never got the chance"
      },
      {
        "time": 105,
        "text": "To say a last goodbye"
      },
      {
        "time": 110,
        "text": "I gotta move on"
      },
      {
        "time": 114,
        "text": "But it hurts to try"
      },
      {
        "time": 122,
        "text": "How do I love, how do I love again?"
      },
      {
        "time": 131,
        "text": "How do I trust, how do I trust again?"
      },
      {
        "time": 139,
        "text": "I stay up all night, tell myself I'm alright"
      },
      {
        "time": 148,
        "text": "Baby, you're just harder to see than most"
      },
      {
        "time": 156,
        "text": "I put the record on, wait 'til I hear our song"
      },
      {
        "time": 165,
        "text": "Every night, I'm dancing with your ghost"
      },
      {
        "time": 173,
        "text": "Every night, I'm dancing with your ghost"
      }
    ],
    "es": [
      {
        "time": 0,
        "text": "♪ (Intro acústico melancólico) ♪"
      },
      {
        "time": 8,
        "text": "Gritándole al cielo"
      },
      {
        "time": 12,
        "text": "Gritándole al mundo"
      },
      {
        "time": 17,
        "text": "Cariño, ¿por qué te fuiste?"
      },
      {
        "time": 21,
        "text": "Todavía sigo siendo tu chica"
      },
      {
        "time": 25,
        "text": "Aferrándome con demasiada fuerza"
      },
      {
        "time": 30,
        "text": "Con la cabeza en las nubes"
      },
      {
        "time": 34,
        "text": "Solo el cielo sabe dónde estás ahora"
      },
      {
        "time": 42,
        "text": "¿Cómo vuelvo a amar? ¿Cómo amo otra vez?"
      },
      {
        "time": 50,
        "text": "¿Cómo vuelvo a confiar? ¿Cómo confío otra vez?"
      },
      {
        "time": 59,
        "text": "Me quedo despierta toda la noche, diciéndome que estoy bien"
      },
      {
        "time": 67,
        "text": "Cariño, solo eres más difícil de ver que los demás"
      },
      {
        "time": 75,
        "text": "Pongo el disco y espero hasta escuchar nuestra canción"
      },
      {
        "time": 84,
        "text": "Cada noche, bailo con tu fantasma"
      },
      {
        "time": 92,
        "text": "Cada noche, bailo con tu fantasma"
      },
      {
        "time": 101,
        "text": "Nunca tuve la oportunidad"
      },
      {
        "time": 105,
        "text": "De decir un último adiós"
      },
      {
        "time": 110,
        "text": "Tengo que seguir adelante"
      },
      {
        "time": 114,
        "text": "Pero duele tanto intentarlo"
      },
      {
        "time": 122,
        "text": "¿Cómo vuelvo a amar? ¿Cómo amo otra vez?"
      },
      {
        "time": 131,
        "text": "¿Cómo vuelvo a confiar? ¿Cómo confío otra vez?"
      },
      {
        "time": 139,
        "text": "Me quedo despierta toda la noche, diciéndome que estoy bien"
      },
      {
        "time": 148,
        "text": "Cariño, solo eres más difícil de ver que los demás"
      },
      {
        "time": 156,
        "text": "Pongo el disco y espero hasta escuchar nuestra canción"
      },
      {
        "time": 165,
        "text": "Cada noche, bailo con tu fantasma"
      },
      {
        "time": 173,
        "text": "Cada noche, bailo con tu fantasma"
      }
    ],
    "tl": [
      {
        "time": 0,
        "text": "♪ (Malungkot na akustikong intro) ♪"
      },
      {
        "time": 8,
        "text": "Sumisigaw sa kalangitan"
      },
      {
        "time": 12,
        "text": "Humihiyaw sa mundo"
      },
      {
        "time": 17,
        "text": "Giliw, bakit ka lumayo?"
      },
      {
        "time": 21,
        "text": "Ako pa rin ang iyong giliw"
      },
      {
        "time": 25,
        "text": "Humahawak nang labis na mahigpit"
      },
      {
        "time": 30,
        "text": "Ulo ay nasa alapaap"
      },
      {
        "time": 34,
        "text": "Langit lamang ang may alam kung nasaan ka ngayon"
      },
      {
        "time": 42,
        "text": "Paano ako magmamahal, paano iibig muli?"
      },
      {
        "time": 50,
        "text": "Paano magtitiwala, paano magtitiwala muli?"
      },
      {
        "time": 59,
        "text": "Gising ako magdamag, sinasabi sa sarili na ayos lang"
      },
      {
        "time": 67,
        "text": "Mahal, mas mahirap ka lang makita kaysa sa iba"
      },
      {
        "time": 75,
        "text": "Pinapatugtog ko ang plaka, naghihintay sa ating awit"
      },
      {
        "time": 84,
        "text": "Gabi-gabi, sumasayaw ako kasama ng iyong multo"
      },
      {
        "time": 92,
        "text": "Gabi-gabi, sumasayaw ako kasama ng iyong multo"
      },
      {
        "time": 101,
        "text": "Hindi man lang nagkaroon ng pagkakataon"
      },
      {
        "time": 105,
        "text": "Upang magpaalam sa huling sandali"
      },
      {
        "time": 110,
        "text": "Kailangan ko nang magpatuloy"
      },
      {
        "time": 114,
        "text": "Ngunit masakit sumubok"
      },
      {
        "time": 122,
        "text": "Paano ako magmamahal muli?"
      },
      {
        "time": 131,
        "text": "Paano ako magtitiwala muli?"
      },
      {
        "time": 139,
        "text": "Gising ako magdamag, sinasabi sa sarili na ayos lang"
      },
      {
        "time": 148,
        "text": "Mahal, mas mahirap ka lang makita kaysa sa karamihan"
      },
      {
        "time": 156,
        "text": "Pinapatugtog ko ang plaka, naghihintay sa ating awit"
      },
      {
        "time": 165,
        "text": "Gabi-gabi, kasayaw ko ang iyong multo"
      },
      {
        "time": 173,
        "text": "Gabi-gabi, kasayaw ko ang iyong multo"
      }
    ],
    "ja": [
      {
        "time": 0,
        "text": "♪ (切ないアコースティックの調べ) ♪"
      },
      {
        "time": 8,
        "text": "空に向かって叫んでいる"
      },
      {
        "time": 12,
        "text": "世界に向かって叫んでいる"
      },
      {
        "time": 17,
        "text": "ねえ、どうして行ってしまったの？"
      },
      {
        "time": 21,
        "text": "私は今でもあなたの恋人なのに"
      },
      {
        "time": 25,
        "text": "強く握りしめすぎているの"
      },
      {
        "time": 30,
        "text": "心は雲の上をさまよったまま"
      },
      {
        "time": 34,
        "text": "あなたが今どこにいるのか、神様しか知らない"
      },
      {
        "time": 42,
        "text": "どうやって、もう一度人を愛せばいいの？"
      },
      {
        "time": 50,
        "text": "どうやって、もう一度信じればいいの？"
      },
      {
        "time": 59,
        "text": "一晩中起きて、大丈夫だと自分に言い聞かせる"
      },
      {
        "time": 67,
        "text": "あなたはただ、他の誰よりも見えにくいだけ"
      },
      {
        "time": 75,
        "text": "レコードに針を落とし、ふたりの曲が流れるのを待つ"
      },
      {
        "time": 84,
        "text": "毎晩、私はあなたの幻と踊っている"
      },
      {
        "time": 92,
        "text": "毎晩、私はあなたの幻と踊っている"
      },
      {
        "time": 101,
        "text": "最後のさよならを言う"
      },
      {
        "time": 105,
        "text": "チャンスさえ与えられなかった"
      },
      {
        "time": 110,
        "text": "前を向かなきゃいけないのに"
      },
      {
        "time": 114,
        "text": "前に進もうとするだけで胸が痛む"
      },
      {
        "time": 122,
        "text": "どうやってまた人を愛せばいいの？"
      },
      {
        "time": 131,
        "text": "どうやってまた信じればいいの？"
      },
      {
        "time": 139,
        "text": "夜通し起きて、平気だと自分に言い聞かせる"
      },
      {
        "time": 148,
        "text": "あなたはただ、姿が見えないだけなんだって"
      },
      {
        "time": 156,
        "text": "レコードをかけて、私たちの歌を待つ"
      },
      {
        "time": 165,
        "text": "毎晩、私はあなたの面影と踊っている"
      },
      {
        "time": 173,
        "text": "毎晩、あなたの幻と踊り続けるの"
      }
    ],
    "fr": [
      {
        "time": 0,
        "text": "♪ (Intro mélancolique à la guitare) ♪"
      },
      {
        "time": 8,
        "text": "Je hurle vers le ciel"
      },
      {
        "time": 12,
        "text": "Je crie contre le monde entier"
      },
      {
        "time": 17,
        "text": "Bébé, pourquoi es-tu parti ?"
      },
      {
        "time": 21,
        "text": "Je suis toujours ta fille"
      },
      {
        "time": 25,
        "text": "Je m’accroche trop fort"
      },
      {
        "time": 30,
        "text": "La tête perdue dans les nuages"
      },
      {
        "time": 34,
        "text": "Le ciel seul sait où tu te trouves à présent"
      },
      {
        "time": 42,
        "text": "Comment aimer, comment aimer à nouveau ?"
      },
      {
        "time": 50,
        "text": "Comment faire confiance, comment croire à nouveau ?"
      },
      {
        "time": 59,
        "text": "Je veille toute la nuit, me disant que tout va bien"
      },
      {
        "time": 67,
        "text": "Bébé, tu es juste plus difficile à apercevoir que les autres"
      },
      {
        "time": 75,
        "text": "Je lance le disque, attendant notre chanson"
      },
      {
        "time": 84,
        "text": "Chaque nuit, je danse avec ton fantôme"
      },
      {
        "time": 92,
        "text": "Chaque nuit, je danse avec ton fantôme"
      },
      {
        "time": 101,
        "text": "Je n'ai jamais eu la chance"
      },
      {
        "time": 105,
        "text": "De te dire un dernier adieu"
      },
      {
        "time": 110,
        "text": "Je dois aller de l'avant"
      },
      {
        "time": 114,
        "text": "Mais essayer fait trop mal"
      },
      {
        "time": 122,
        "text": "Comment aimer à nouveau ?"
      },
      {
        "time": 131,
        "text": "Comment accorder ma confiance à nouveau ?"
      },
      {
        "time": 139,
        "text": "Je reste éveillée toute la nuit, me répétant que ça va"
      },
      {
        "time": 148,
        "text": "Tu es juste plus invisible que le reste du monde"
      },
      {
        "time": 156,
        "text": "Je mets le vinyle, j’attends notre chanson"
      },
      {
        "time": 165,
        "text": "Toutes les nuits, je danse avec ton fantôme"
      },
      {
        "time": 173,
        "text": "Toutes les nuits, je danse avec ton fantôme"
      }
    ],
    "de": [
      {
        "time": 0,
        "text": "♪ (Melancholisches Akustik-Intro) ♪"
      },
      {
        "time": 8,
        "text": "Ich schreie den Himmel an"
      },
      {
        "time": 12,
        "text": "Ich schreie die ganze Welt an"
      },
      {
        "time": 17,
        "text": "Baby, warum bist du gegangen?"
      },
      {
        "time": 21,
        "text": "Ich bin immer noch dein Mädchen"
      },
      {
        "time": 25,
        "text": "Ich klammere mich zu fest fest"
      },
      {
        "time": 30,
        "text": "Den Kopf in den Wolken verloren"
      },
      {
        "time": 34,
        "text": "Nur der Himmel weiß, wo du jetzt bist"
      },
      {
        "time": 42,
        "text": "Wie soll ich je wieder lieben?"
      },
      {
        "time": 50,
        "text": "Wie soll ich je wieder vertrauen?"
      },
      {
        "time": 59,
        "text": "Ich bleibe die ganze Nacht wach, rede mir ein, es geht mir gut"
      },
      {
        "time": 67,
        "text": "Baby, man sieht dich nur schwerer als die meisten"
      },
      {
        "time": 75,
        "text": "Ich lege die Platte auf und warte auf unser Lied"
      },
      {
        "time": 84,
        "text": "Jede Nacht tanze ich mit deinem Geist"
      },
      {
        "time": 92,
        "text": "Jede Nacht tanze ich mit deinem Geist"
      },
      {
        "time": 101,
        "text": "Ich hatte nie die Chance"
      },
      {
        "time": 105,
        "text": "Einen letzten Abschied zu nehmen"
      },
      {
        "time": 110,
        "text": "Ich muss weitermachen"
      },
      {
        "time": 114,
        "text": "Aber der Versuch tut so weh"
      },
      {
        "time": 122,
        "text": "Wie soll ich je wieder lieben?"
      },
      {
        "time": 131,
        "text": "Wie soll ich je wieder vertrauen?"
      },
      {
        "time": 139,
        "text": "Die ganze Nacht wach, mir einredend, es sei okay"
      },
      {
        "time": 148,
        "text": "Du bist nur unsichtbarer als alle anderen"
      },
      {
        "time": 156,
        "text": "Ich starte die Platte, warte auf unseren Song"
      },
      {
        "time": 165,
        "text": "Jede Nacht tanze ich mit deinem Geist"
      },
      {
        "time": 173,
        "text": "Jede Nacht tanze ich mit deinem Geist"
      }
    ],
    "ko": [
      {
        "time": 0,
        "text": "♪ (애절한 어쿠스틱 인트로) ♪"
      },
      {
        "time": 8,
        "text": "하늘을 향해 소리쳐"
      },
      {
        "time": 12,
        "text": "세상을 향해 비명을 질러"
      },
      {
        "time": 17,
        "text": "그대여, 왜 떠나간 거야?"
      },
      {
        "time": 21,
        "text": "난 여전히 너의 연인인데"
      },
      {
        "time": 25,
        "text": "너무 꽉 붙잡고 있어"
      },
      {
        "time": 30,
        "text": "머릿속은 온통 구름 위를 헤매"
      },
      {
        "time": 34,
        "text": "네가 지금 어디에 있는지 오직 하늘만이 알겠지"
      },
      {
        "time": 42,
        "text": "어떻게 다시 사랑해야 할까?"
      },
      {
        "time": 50,
        "text": "어떻게 다시 누군가를 믿어야 할까?"
      },
      {
        "time": 59,
        "text": "밤새 깨어 있으면서, 난 괜찮다고 스스로를 달래"
      },
      {
        "time": 67,
        "text": "그대여, 넌 그저 다른 이들보다 보기 어려울 뿐이야"
      },
      {
        "time": 75,
        "text": "음반을 틀고, 우리의 노래가 나오길 기다려"
      },
      {
        "time": 84,
        "text": "매일 밤, 난 너의 유령과 춤을 춰"
      },
      {
        "time": 92,
        "text": "매일 밤, 난 너의 그림자와 춤을 춰"
      },
      {
        "time": 101,
        "text": "기회조차 없었어"
      },
      {
        "time": 105,
        "text": "마지막 작별 인사를 건넬"
      },
      {
        "time": 110,
        "text": "앞으로 나아가야 하는데"
      },
      {
        "time": 114,
        "text": "노력할수록 가슴이 너무 아파"
      },
      {
        "time": 122,
        "text": "어떻게 다시 사랑을 시작할 수 있을까?"
      },
      {
        "time": 131,
        "text": "어떻게 다시 믿음을 가질 수 있을까?"
      },
      {
        "time": 139,
        "text": "온 밤을 지새우며 괜찮다고 속삭여"
      },
      {
        "time": 148,
        "text": "너는 단지 조금 더 숨어있는 것뿐이라고"
      },
      {
        "time": 156,
        "text": "레코드를 올리고 우리의 멜로디를 기다리지"
      },
      {
        "time": 165,
        "text": "매일 밤, 난 너의 영혼과 춤을 춰"
      },
      {
        "time": 173,
        "text": "매일 밤, 난 너의 유령과 함께 춤을 춰"
      }
    ]
  },
  "song-1788803603766": {
    "en": [
      {
        "time": 0,
        "text": "♪ (Soft cinematic piano chords) ♪"
      },
      {
        "time": 8,
        "text": "Take your eyes off of me so I can leave"
      },
      {
        "time": 15,
        "text": "I'm far too ashamed to do it with you watching me"
      },
      {
        "time": 22,
        "text": "This is never ending, we have been here before"
      },
      {
        "time": 29,
        "text": "But I can't stay this time, 'cause I don't love you anymore"
      },
      {
        "time": 37,
        "text": "Please, stay where you are, don't come any closer"
      },
      {
        "time": 44,
        "text": "Don't try to change my mind, I'm being cruel to be kind"
      },
      {
        "time": 51,
        "text": "I can't love you in the dark"
      },
      {
        "time": 58,
        "text": "It feels like we're oceans apart"
      },
      {
        "time": 65,
        "text": "There is so much space between us"
      },
      {
        "time": 72,
        "text": "Baby, we're already defeated"
      },
      {
        "time": 79,
        "text": "Everything changed me"
      },
      {
        "time": 86,
        "text": "You have given me something that I can't live without"
      },
      {
        "time": 94,
        "text": "You mustn't underestimate that when you are in doubt"
      },
      {
        "time": 101,
        "text": "But I don't want to carry on like everything is fine"
      },
      {
        "time": 108,
        "text": "The longer we ignore it, all the more that we will fight"
      },
      {
        "time": 116,
        "text": "Please, don't fall apart, I can't face your breaking heart"
      },
      {
        "time": 123,
        "text": "I'm trying to be brave, stop asking me to stay"
      },
      {
        "time": 130,
        "text": "I can't love you in the dark"
      },
      {
        "time": 137,
        "text": "It feels like we're oceans apart"
      },
      {
        "time": 144,
        "text": "There is so much space between us"
      },
      {
        "time": 151,
        "text": "Baby, we're already defeated"
      },
      {
        "time": 158,
        "text": "Everything changed me"
      },
      {
        "time": 167,
        "text": "And I don't think you can save me"
      }
    ],
    "es": [
      {
        "time": 0,
        "text": "♪ (Acordes cinematográficos de piano) ♪"
      },
      {
        "time": 8,
        "text": "Aparta tus ojos de mí para que pueda irme"
      },
      {
        "time": 15,
        "text": "Siento demasiada vergüenza de hacerlo mientras me miras"
      },
      {
        "time": 22,
        "text": "Esto nunca termina, ya hemos estado aquí antes"
      },
      {
        "time": 29,
        "text": "Pero no puedo quedarme esta vez, porque ya no te amo"
      },
      {
        "time": 37,
        "text": "Por favor, quédate donde estás, no te acerques más"
      },
      {
        "time": 44,
        "text": "No intentes hacerme cambiar de opinión, soy cruel para ser compasiva"
      },
      {
        "time": 51,
        "text": "No puedo amarte en la oscuridad"
      },
      {
        "time": 58,
        "text": "Se siente como si estuviéramos a océanos de distancia"
      },
      {
        "time": 65,
        "text": "Hay demasiado espacio entre nosotros"
      },
      {
        "time": 72,
        "text": "Cariño, ya estamos derrotados"
      },
      {
        "time": 79,
        "text": "Todo me cambió"
      },
      {
        "time": 86,
        "text": "Me has dado algo sin lo que no puedo vivir"
      },
      {
        "time": 94,
        "text": "No debes subestimar eso cuando tengas dudas"
      },
      {
        "time": 101,
        "text": "Pero no quiero seguir fingiendo que todo está bien"
      },
      {
        "time": 108,
        "text": "Cuanto más lo ignoremos, más pelearemos"
      },
      {
        "time": 116,
        "text": "Por favor, no te derrumbes, no puedo soportar ver tu corazón romperse"
      },
      {
        "time": 123,
        "text": "Estoy intentando ser valiente, deja de pedirme que me quede"
      },
      {
        "time": 130,
        "text": "No puedo amarte en la oscuridad"
      },
      {
        "time": 137,
        "text": "Se siente como si estuviéramos a océanos de distancia"
      },
      {
        "time": 144,
        "text": "Hay tanto espacio entre los dos"
      },
      {
        "time": 151,
        "text": "Cariño, ya fuimos vencidos"
      },
      {
        "time": 158,
        "text": "Todo me transformó"
      },
      {
        "time": 167,
        "text": "Y no creo que puedas salvarme"
      }
    ],
    "tl": [
      {
        "time": 0,
        "text": "♪ (Banayad na tunog ng piyano) ♪"
      },
      {
        "time": 8,
        "text": "Ialis mo ang iyong tingin sa akin upang ako ay makaalis"
      },
      {
        "time": 15,
        "text": "Labis akong nahihiyang gawin ito habang nakatingin ka"
      },
      {
        "time": 22,
        "text": "Wala itong katapusan, nandito na tayo noon"
      },
      {
        "time": 29,
        "text": "Ngunit hindi ako makakatagal ngayon, dahil hindi na kita mahal"
      },
      {
        "time": 37,
        "text": "Pakiusap, manatili ka riyan, huwag ka nang lumapit"
      },
      {
        "time": 44,
        "text": "Huwag mong subukang baguhin ang isip ko, nagpapakatatag lang ako"
      },
      {
        "time": 51,
        "text": "Hindi kita kayang mahalin sa dilim"
      },
      {
        "time": 58,
        "text": "Tila karagatan ang layo natin sa isa't isa"
      },
      {
        "time": 65,
        "text": "Napakalaki ng espasyo sa pagitan natin"
      },
      {
        "time": 72,
        "text": "Mahal, talo na tayo sa labang ito"
      },
      {
        "time": 79,
        "text": "Binago ako ng lahat"
      },
      {
        "time": 86,
        "text": "Binigyan mo ako ng bagay na di ko kayang mabuhay nang wala ito"
      },
      {
        "time": 94,
        "text": "Huwag mong mamaliitin iyon kapag ikaw ay nagdududa"
      },
      {
        "time": 101,
        "text": "Ngunit ayaw ko nang magpanggap na maayos ang lahat"
      },
      {
        "time": 108,
        "text": "Habang mas binabalewala natin, lalo lang tayong magtatalo"
      },
      {
        "time": 116,
        "text": "Pakiusap, huwag kang mawalan ng pag-asa, di ko kayang makitang durog ka"
      },
      {
        "time": 123,
        "text": "Sinusubukan kong maging matapang, huwag mo na akong pakiusapang manatili"
      },
      {
        "time": 130,
        "text": "Hindi kita kayang mahalin sa dilim"
      },
      {
        "time": 137,
        "text": "Para tayong pinaghihiwalay ng karagatan"
      },
      {
        "time": 144,
        "text": "Napakalayo natin sa isa't isa"
      },
      {
        "time": 151,
        "text": "Mahal, talo na tayo bago pa man magsimula"
      },
      {
        "time": 158,
        "text": "Binago ako ng lahat"
      },
      {
        "time": 167,
        "text": "At sa palagay ko hindi mo na ako maililigtas"
      }
    ],
    "ja": [
      {
        "time": 0,
        "text": "♪ (静謐なシネマティックピアノ) ♪"
      },
      {
        "time": 8,
        "text": "私から目をそらして、立ち去れるように"
      },
      {
        "time": 15,
        "text": "あなたに見つめられたまま去るなんて、あまりに惨めだから"
      },
      {
        "time": 22,
        "text": "終わりのない繰り返し、前にもここにいたわ"
      },
      {
        "time": 29,
        "text": "でも今回は残れない、もうあなたを愛していないから"
      },
      {
        "time": 37,
        "text": "お願い、そこにいて、これ以上近づかないで"
      },
      {
        "time": 44,
        "text": "考え直させようとしないで、優しさのために冷たくしているの"
      },
      {
        "time": 51,
        "text": "暗闇の中であなたを愛することはできない"
      },
      {
        "time": 58,
        "text": "まるで海を隔てているかのように遠く感じる"
      },
      {
        "time": 65,
        "text": "ふたりの間には広すぎる隙間があるの"
      },
      {
        "time": 72,
        "text": "ねえ、私たちはもう敗北している"
      },
      {
        "time": 79,
        "text": "すべてが私を変えてしまった"
      },
      {
        "time": 86,
        "text": "あなたは私になくてはならないものをくれた"
      },
      {
        "time": 94,
        "text": "迷ったときでも、その価値を決して見くびらないで"
      },
      {
        "time": 101,
        "text": "でも何事もないかのように続けるのはもう嫌なの"
      },
      {
        "time": 108,
        "text": "無視し続けるほど、私たちは争うことになる"
      },
      {
        "time": 116,
        "text": "お願い、崩れ落ちないで、あなたの傷つく姿を見たくない"
      },
      {
        "time": 123,
        "text": "勇敢であろうとしているの、引き止めないで"
      },
      {
        "time": 130,
        "text": "暗闇の中では愛せないの"
      },
      {
        "time": 137,
        "text": "海のように遠く離れてしまった"
      },
      {
        "time": 144,
        "text": "ふたりの隙間は埋まらない"
      },
      {
        "time": 151,
        "text": "私たちはすでに負けてしまったの"
      },
      {
        "time": 158,
        "text": "すべてが私を変えた"
      },
      {
        "time": 167,
        "text": "もうあなたにも私を救えないと思う"
      }
    ],
    "fr": [
      {
        "time": 0,
        "text": "♪ (Accords de piano cinématographiques) ♪"
      },
      {
        "time": 8,
        "text": "Détourne tes yeux de moi pour que je puisse partir"
      },
      {
        "time": 15,
        "text": "J'ai bien trop honte de le faire sous ton regard"
      },
      {
        "time": 22,
        "text": "C'est sans fin, nous avons déjà vécu cela"
      },
      {
        "time": 29,
        "text": "Mais je ne peux rester cette fois, car je ne t'aime plus"
      },
      {
        "time": 37,
        "text": "S'il te plaît, reste où tu es, n'approche pas plus"
      },
      {
        "time": 44,
        "text": "N'essaie pas de me faire changer d'avis, je suis dure pour être juste"
      },
      {
        "time": 51,
        "text": "Je ne peux pas t'aimer dans le noir"
      },
      {
        "time": 58,
        "text": "J'ai l'impression qu'un océan nous sépare"
      },
      {
        "time": 65,
        "text": "Il y a tant d'espace entre nous"
      },
      {
        "time": 72,
        "text": "Bébé, nous sommes déjà vaincus"
      },
      {
        "time": 79,
        "text": "Tout m’a changée"
      },
      {
        "time": 86,
        "text": "Tu m'as donné quelque chose sans lequel je ne peux vivre"
      },
      {
        "time": 94,
        "text": "Tu ne dois pas sous-estimer cela quand tu doutes"
      },
      {
        "time": 101,
        "text": "Mais je refuse de faire comme si tout allait bien"
      },
      {
        "time": 108,
        "text": "Plus nous l'ignorons, plus nous nous déchirons"
      },
      {
        "time": 116,
        "text": "Ne t'effondre pas, je ne supporterais pas ton cœur brisé"
      },
      {
        "time": 123,
        "text": "J'essaie d'être courageuse, cesse de me supplier de rester"
      },
      {
        "time": 130,
        "text": "Je ne peux pas t'aimer dans l'obscurité"
      },
      {
        "time": 137,
        "text": "C'est comme si un océan nous séparait"
      },
      {
        "time": 144,
        "text": "Il y a tant de distance entre nous"
      },
      {
        "time": 151,
        "text": "Nous avons déjà perdu cette bataille"
      },
      {
        "time": 158,
        "text": "Tout a changé en moi"
      },
      {
        "time": 167,
        "text": "Et je ne crois pas que tu puisses me sauver"
      }
    ],
    "de": [
      {
        "time": 0,
        "text": "♪ (Sanfte filmreife Klavierakkorde) ♪"
      },
      {
        "time": 8,
        "text": "Wende deinen Blick von mir ab, damit ich gehen kann"
      },
      {
        "time": 15,
        "text": "Ich schäme mich zu sehr, es vor deinen Augen zu tun"
      },
      {
        "time": 22,
        "text": "Das nimmt kein Ende, wir waren schon einmal hier"
      },
      {
        "time": 29,
        "text": "Doch dieses Mal kann ich nicht bleiben, weil ich dich nicht mehr liebe"
      },
      {
        "time": 37,
        "text": "Bitte bleib stehen, wo du bist, komm nicht näher"
      },
      {
        "time": 44,
        "text": "Versuch nicht, mich umzustimmen, ich muss grausam sein, um ehrlich zu sein"
      },
      {
        "time": 51,
        "text": "Ich kann dich nicht im Dunkeln lieben"
      },
      {
        "time": 58,
        "text": "Es fühlt sich an, als lägen Ozeane zwischen uns"
      },
      {
        "time": 65,
        "text": "Da ist so viel Leere zwischen uns beiden"
      },
      {
        "time": 72,
        "text": "Baby, wir haben diesen Kampf längst verloren"
      },
      {
        "time": 79,
        "text": "Alles hat mich verändert"
      },
      {
        "time": 86,
        "text": "Du hast mir etwas gegeben, ohne das ich nicht leben kann"
      },
      {
        "time": 94,
        "text": "Unterschätze das nicht, wenn du zweifelst"
      },
      {
        "time": 101,
        "text": "Aber ich will nicht so tun, als wäre alles in Ordnung"
      },
      {
        "time": 108,
        "text": "Je länger wir es totschweigen, desto mehr streiten wir"
      },
      {
        "time": 116,
        "text": "Bitte brich nicht zusammen, ich ertrage dein gebrochenes Herz nicht"
      },
      {
        "time": 123,
        "text": "Ich versuche tapfer zu sein, bitte mich nicht zu bleiben"
      },
      {
        "time": 130,
        "text": "Ich kann dich nicht im Schatten lieben"
      },
      {
        "time": 137,
        "text": "Es fühlt sich an wie endlose Meere"
      },
      {
        "time": 144,
        "text": "So viel Raum zwischen unseren Seelen"
      },
      {
        "time": 151,
        "text": "Wir sind bereits geschlagen"
      },
      {
        "time": 158,
        "text": "Alles hat mich gewandelt"
      },
      {
        "time": 167,
        "text": "Und ich glaube nicht, dass du mich retten kannst"
      }
    ],
    "ko": [
      {
        "time": 0,
        "text": "♪ (고요하고 영화 같은 피아노 선율) ♪"
      },
      {
        "time": 8,
        "text": "내가 떠날 수 있게 네 시선을 거두어줘"
      },
      {
        "time": 15,
        "text": "네가 지켜보는 앞에서 떠나기엔 너무 부끄러우니까"
      },
      {
        "time": 22,
        "text": "끝나지 않는 굴레, 우린 전에도 이러했지"
      },
      {
        "time": 29,
        "text": "하지만 이번엔 머물 수 없어, 더는 널 사랑하지 않으니까"
      },
      {
        "time": 37,
        "text": "제발 거기 서 있어 줘, 더는 다가오지 마"
      },
      {
        "time": 44,
        "text": "내 마음을 돌리려 하지 마, 진심을 위해 독해지는 거야"
      },
      {
        "time": 51,
        "text": "어둠 속에서 널 사랑할 순 없어"
      },
      {
        "time": 58,
        "text": "마치 바다만큼 멀리 떨어진 것 같아"
      },
      {
        "time": 65,
        "text": "우리 사이엔 너무 큰 간극이 있어"
      },
      {
        "time": 72,
        "text": "그대여, 우린 이미 패배했어"
      },
      {
        "time": 79,
        "text": "모든 것이 날 바꾸어 놓았지"
      },
      {
        "time": 86,
        "text": "넌 내게 없어서는 안 될 소중한 것을 주었어"
      },
      {
        "time": 94,
        "text": "의심이 들 때도 그 사실을 잊지는 마"
      },
      {
        "time": 101,
        "text": "하지만 다 괜찮은 척 계속 버티고 싶진 않아"
      },
      {
        "time": 108,
        "text": "외면할수록 우린 더 상처 입고 싸울 테니까"
      },
      {
        "time": 116,
        "text": "제발 무너지지 마, 네 찢어지는 마음을 마주할 자신이 없어"
      },
      {
        "time": 123,
        "text": "난 용기를 내고 있어, 머물러 달라고 붙잡지 마"
      },
      {
        "time": 130,
        "text": "어둠 속에선 널 품을 수 없어"
      },
      {
        "time": 137,
        "text": "우린 마치 대양만큼이나 멀어진 것 같아"
      },
      {
        "time": 144,
        "text": "우리 사이에 가로놓인 너무 많은 빈자리"
      },
      {
        "time": 151,
        "text": "우린 이미 져버린 사랑이야"
      },
      {
        "time": 158,
        "text": "모든 것이 날 바꾸었어"
      },
      {
        "time": 167,
        "text": "그리고 이젠 너도 날 구할 수 없다고 생각해"
      }
    ]
  },
  "song-night-drive": {
    "en": [
      {
        "time": 0,
        "text": "♪ (Atmospheric synth intro) ♪"
      },
      {
        "time": 15,
        "text": "Cruising past the neon glow"
      },
      {
        "time": 22,
        "text": "Watching shadows in the rear-view grow"
      },
      {
        "time": 30,
        "text": "City skyline burning bright"
      },
      {
        "time": 37,
        "text": "Guided only by the midnight light"
      },
      {
        "time": 45,
        "text": "We're alive in the slipstream"
      },
      {
        "time": 52,
        "text": "Living out this electric dream"
      },
      {
        "time": 60,
        "text": "Feel the bass underneath the wheels"
      },
      {
        "time": 67,
        "text": "This is how the night time feels"
      },
      {
        "time": 75,
        "text": "Night drive, across the endless line"
      },
      {
        "time": 82,
        "text": "Lost inside this space and time"
      },
      {
        "time": 90,
        "text": "Night drive, forever on the run"
      },
      {
        "time": 97,
        "text": "Racing toward the morning sun"
      }
    ],
    "es": [
      {
        "time": 0,
        "text": "♪ (Intro atmosférico de sintetizador) ♪"
      },
      {
        "time": 15,
        "text": "Avanzando entre el resplandor de neón"
      },
      {
        "time": 22,
        "text": "Mirando crecer las sombras en el retrovisor"
      },
      {
        "time": 30,
        "text": "El horizonte de la ciudad ardiendo brillante"
      },
      {
        "time": 37,
        "text": "Guiados solo por la luz de medianoche"
      },
      {
        "time": 45,
        "text": "Estamos vivos en la corriente"
      },
      {
        "time": 52,
        "text": "Viviendo este sueño eléctrico"
      },
      {
        "time": 60,
        "text": "Siente los graves bajo las ruedas"
      },
      {
        "time": 67,
        "text": "Así se siente la noche"
      },
      {
        "time": 75,
        "text": "Viaje nocturno, a través de la línea infinita"
      },
      {
        "time": 82,
        "text": "Perdidos en este espacio y tiempo"
      },
      {
        "time": 90,
        "text": "Viaje nocturno, siempre en movimiento"
      },
      {
        "time": 97,
        "text": "Corriendo hacia el sol naciente"
      }
    ],
    "tl": [
      {
        "time": 0,
        "text": "♪ (Mahiwagang synth intro) ♪"
      },
      {
        "time": 15,
        "text": "Bumabagtas lampas sa kislap ng neon"
      },
      {
        "time": 22,
        "text": "Pinagmamasdan ang anino sa salamin"
      },
      {
        "time": 30,
        "text": "Abot-tanaw ng lungsod na nagliliyab"
      },
      {
        "time": 37,
        "text": "Gabay lamang ang liwanag ng hatinggabi"
      },
      {
        "time": 45,
        "text": "Buhay tayo sa hangin ng kalsada"
      },
      {
        "time": 52,
        "text": "Isinasabuhay ang de-kuryenteng panaginip"
      },
      {
        "time": 60,
        "text": "Damhin ang bass sa ilalim ng gulong"
      },
      {
        "time": 67,
        "text": "Ito ang tunay na damdamin ng gabi"
      },
      {
        "time": 75,
        "text": "Biyaheng gabi, sa walang katapusang guhit"
      },
      {
        "time": 82,
        "text": "Naliligaw sa puwang at panahong ito"
      },
      {
        "time": 90,
        "text": "Biyaheng gabi, habang-buhay na tumatakbo"
      },
      {
        "time": 97,
        "text": "Humaharurot patungo sa sumisikat na araw"
      }
    ],
    "ja": [
      {
        "time": 0,
        "text": "♪ (幻想的なシンセイントロ) ♪"
      },
      {
        "time": 15,
        "text": "ネオンの輝きを追い抜いていく"
      },
      {
        "time": 22,
        "text": "バックミラーに伸びる影を見つめながら"
      },
      {
        "time": 30,
        "text": "きらめく摩天楼の夜景"
      },
      {
        "time": 37,
        "text": "真夜中の光だけを道標にして"
      },
      {
        "time": 45,
        "text": "風の流れの中で今を生きている"
      },
      {
        "time": 52,
        "text": "エレクトリックな夢を駆け抜けて"
      },
      {
        "time": 60,
        "text": "タイヤの底から伝わる重低音"
      },
      {
        "time": 67,
        "text": "これこそが夜の鼓動"
      },
      {
        "time": 75,
        "text": "ナイトドライブ、果てなき直線道路"
      },
      {
        "time": 82,
        "text": "時空の迷路に溶け込んで"
      },
      {
        "time": 90,
        "text": "ナイトドライブ、どこまでも走り続ける"
      },
      {
        "time": 97,
        "text": "昇る朝日を目指して疾走する"
      }
    ],
    "fr": [
      {
        "time": 0,
        "text": "♪ (Intro atmosphérique au synthétiseur) ♪"
      },
      {
        "time": 15,
        "text": "Roulant à travers la lueur des néons"
      },
      {
        "time": 22,
        "text": "Regardant les ombres grandir dans le rétro"
      },
      {
        "time": 30,
        "text": "La skyline illuminée de mille feux"
      },
      {
        "time": 37,
        "text": "Guidés seulement par la lueur de minuit"
      },
      {
        "time": 45,
        "text": "Vivants au cœur de l'aspiration"
      },
      {
        "time": 52,
        "text": "Vivant ce rêve électrique"
      },
      {
        "time": 60,
        "text": "Ressens les basses sous les roues"
      },
      {
        "time": 67,
        "text": "C'est ainsi que vibre la nuit"
      },
      {
        "time": 75,
        "text": "Traversée nocturne, sur la ligne sans fin"
      },
      {
        "time": 82,
        "text": "Perdus dans cet espace-temps"
      },
      {
        "time": 90,
        "text": "Virée de nuit, en fuite éternelle"
      },
      {
        "time": 97,
        "text": "Filant droit vers le soleil levant"
      }
    ],
    "de": [
      {
        "time": 0,
        "text": "♪ (Atmosphärisches Synth-Intro) ♪"
      },
      {
        "time": 15,
        "text": "Gleite vorbei am Neonglanz"
      },
      {
        "time": 22,
        "text": "Beobachte, wie die Schatten im Rückspiegel wachsen"
      },
      {
        "time": 30,
        "text": "Die Skyline der Stadt strahlt hell"
      },
      {
        "time": 37,
        "text": "Geleitet nur vom Licht der Mitternacht"
      },
      {
        "time": 45,
        "text": "Wir leben im Windschatten"
      },
      {
        "time": 52,
        "text": "Leben diesen elektrischen Traum"
      },
      {
        "time": 60,
        "text": "Spüre den Bass unter den Rädern"
      },
      {
        "time": 67,
        "text": "So fühlt sich die Nacht an"
      },
      {
        "time": 75,
        "text": "Nachtfahrt über die endlose Straße"
      },
      {
        "time": 82,
        "text": "Verloren in Raum und Zeit"
      },
      {
        "time": 90,
        "text": "Nachtfahrt, für immer unterwegs"
      },
      {
        "time": 97,
        "text": "Der Morgensonne entgegen"
      }
    ],
    "ko": [
      {
        "time": 0,
        "text": "♪ (몽환적인 신스 인트로) ♪"
      },
      {
        "time": 15,
        "text": "네온 불빛을 가르며 달리는 밤"
      },
      {
        "time": 22,
        "text": "백미러 속 길어지는 그림자를 보며"
      },
      {
        "time": 30,
        "text": "환하게 불타오르는 도시의 스카이라인"
      },
      {
        "time": 37,
        "text": "오직 자정의 불빛만을 길잡이 삼아"
      },
      {
        "time": 45,
        "text": "우린 바람 속에서 살아 숨 쉬고 있어"
      },
      {
        "time": 52,
        "text": "이 일렉트릭 꿈속을 달리며"
      },
      {
        "time": 60,
        "text": "바퀴 아래로 전해지는 베이스의 울림"
      },
      {
        "time": 67,
        "text": "이것이 바로 밤이 건네는 느낌"
      },
      {
        "time": 75,
        "text": "나이트 드라이브, 끝없는 지평선을 넘어"
      },
      {
        "time": 82,
        "text": "이 시공간 속에 흠뻑 빠져들어"
      },
      {
        "time": 90,
        "text": "나이트 드라이브, 영원히 멈추지 않는 질주"
      },
      {
        "time": 97,
        "text": "아침 해를 향해 속도를 높여"
      }
    ]
  },
  "song-velvet-touch": {
    "en": [
      {
        "time": 6,
        "text": "♪ (Velvet Touch - Kai Sterling) ♪"
      },
      {
        "time": 16.9,
        "text": "Walking through the city with the music in my ears"
      },
      {
        "time": 27.8,
        "text": "Every beat that's dropping washes away the fears"
      },
      {
        "time": 38.6,
        "text": "Look into the distance, colors coming alive"
      },
      {
        "time": 49.5,
        "text": "Feel the rhythm moving, helping our souls survive"
      },
      {
        "time": 60.4,
        "text": "This is the moment, this is where we belong"
      },
      {
        "time": 71.3,
        "text": "Singing together to our favorite song"
      },
      {
        "time": 82.1,
        "text": "Feel the vibration, hold on to the light"
      },
      {
        "time": 93,
        "text": "We're dancing together all through the night"
      },
      {
        "time": 103.9,
        "text": "Never gonna let this feeling fade away"
      },
      {
        "time": 114.8,
        "text": "Tomorrow is coming with a brighter day"
      },
      {
        "time": 125.6,
        "text": "♪ (Velvet Touch continues) ♪"
      },
      {
        "time": 136.5,
        "text": "Every little melody touching the heart inside"
      },
      {
        "time": 147.4,
        "text": "Nothing left to lose and nothing left to hide"
      },
      {
        "time": 158.3,
        "text": "We made it through the storm, we reached the other side"
      },
      {
        "time": 169.1,
        "text": "♪ (Outro fade) ♪"
      }
    ],
    "es": [
      {
        "time": 0,
        "text": "♪ (Intro suave de Fender Rhodes) ♪"
      },
      {
        "time": 12,
        "text": "Susurra despacio, no apresures la noche"
      },
      {
        "time": 18,
        "text": "Todo se siente perfecto"
      },
      {
        "time": 25,
        "text": "Tu silueta dibujada en la pared"
      },
      {
        "time": 31,
        "text": "Cada vez que me llamas suavemente"
      },
      {
        "time": 38,
        "text": "Tacto de terciopelo en mi piel"
      },
      {
        "time": 44,
        "text": "Ahí es donde comienza toda la magia"
      },
      {
        "time": 51,
        "text": "Tacto de terciopelo, toma mi mano"
      },
      {
        "time": 57,
        "text": "Nadie más podría comprender"
      }
    ],
    "tl": [
      {
        "time": 0,
        "text": "♪ (Mahinahong intro ng Fender Rhodes) ♪"
      },
      {
        "time": 12,
        "text": "Dahan-dahang bumulong, huwag madaliin ang gabi"
      },
      {
        "time": 18,
        "text": "Ang lahat ay napakaganda at tama"
      },
      {
        "time": 25,
        "text": "Ang anino mo sa dingding"
      },
      {
        "time": 31,
        "text": "Tuwing tatawag ka nang marahan"
      },
      {
        "time": 38,
        "text": "Haplos ng pelus sa aking balat"
      },
      {
        "time": 44,
        "text": "Doon nagsisimula ang hiwaga"
      },
      {
        "time": 51,
        "text": "Haplos ng pelus, hawakan ang aking kamay"
      },
      {
        "time": 57,
        "text": "Walang iba ang makakaunawa"
      }
    ],
    "ja": [
      {
        "time": 0,
        "text": "♪ (柔らかなローズピアノのイントロ) ♪"
      },
      {
        "time": 12,
        "text": "ゆっくり囁いて、夜を急がないで"
      },
      {
        "time": 18,
        "text": "すべてが心地よく溶け合っていく"
      },
      {
        "time": 25,
        "text": "壁に映るあなたのシルエット"
      },
      {
        "time": 31,
        "text": "優しく名前を呼ばれるたび"
      },
      {
        "time": 38,
        "text": "肌に触れるベルベットの温もり"
      },
      {
        "time": 44,
        "text": "そこからすべての魔法が始まる"
      },
      {
        "time": 51,
        "text": "ベルベットタッチ、手を取って"
      },
      {
        "time": 57,
        "text": "他の誰にも分からないふたりだけの世界"
      }
    ],
    "fr": [
      {
        "time": 0,
        "text": "♪ (Douce intro Fender Rhodes) ♪"
      },
      {
        "time": 12,
        "text": "Chuchote lentement, ne presse pas la nuit"
      },
      {
        "time": 18,
        "text": "Tout semble si parfait"
      },
      {
        "time": 25,
        "text": "Ta silhouette dessinée contre le mur"
      },
      {
        "time": 31,
        "text": "Chaque fois que tu m’appelles doucement"
      },
      {
        "time": 38,
        "text": "Une touche de velours sur ma peau"
      },
      {
        "time": 44,
        "text": "C’est là que toute la magie commence"
      },
      {
        "time": 51,
        "text": "Touche de velours, prends ma main"
      },
      {
        "time": 57,
        "text": "Personne d’autre ne pourrait comprendre"
      }
    ],
    "de": [
      {
        "time": 0,
        "text": "♪ (Sanftes Fender Rhodes Intro) ♪"
      },
      {
        "time": 12,
        "text": "Flüstere leise, beeile die Nacht nicht"
      },
      {
        "time": 18,
        "text": "Alles fühlt sich genau richtig an"
      },
      {
        "time": 25,
        "text": "Deine Silhouette an der Wand"
      },
      {
        "time": 31,
        "text": "Jedes Mal, wenn du leise rufst"
      },
      {
        "time": 38,
        "text": "Samtene Berührung auf meiner Haut"
      },
      {
        "time": 44,
        "text": "Dort beginnt die ganze Magie"
      },
      {
        "time": 51,
        "text": "Samtene Berührung, nimm meine Hand"
      },
      {
        "time": 57,
        "text": "Niemand sonst könnte das verstehen"
      }
    ],
    "ko": [
      {
        "time": 0,
        "text": "♪ (부드러운 로즈 피아노 인트로) ♪"
      },
      {
        "time": 12,
        "text": "천천히 속삭여줘, 밤을 서두르지 마"
      },
      {
        "time": 18,
        "text": "모든 것이 완벽하게 느껴져"
      },
      {
        "time": 25,
        "text": "벽에 비치는 너의 실루엣"
      },
      {
        "time": 31,
        "text": "네가 나를 다정하게 부를 때마다"
      },
      {
        "time": 38,
        "text": "내 살결에 닿는 벨벳 같은 감촉"
      },
      {
        "time": 44,
        "text": "모든 마법은 바로 거기서 시작돼"
      },
      {
        "time": 51,
        "text": "벨벳의 손길, 내 손을 잡아줘"
      },
      {
        "time": 57,
        "text": "그 누구도 이해하지 못할 우리만의 순간"
      }
    ]
  },
  "song-tokyo-drizzle": {
    "en": [
      {
        "time": 6,
        "text": "♪ (Tokyo Drizzle - Maya Lin) ♪"
      },
      {
        "time": 15.6,
        "text": "Walking through the city with the music in my ears"
      },
      {
        "time": 25.1,
        "text": "Every beat that's dropping washes away the fears"
      },
      {
        "time": 34.7,
        "text": "Look into the distance, colors coming alive"
      },
      {
        "time": 44.3,
        "text": "Feel the rhythm moving, helping our souls survive"
      },
      {
        "time": 53.8,
        "text": "This is the moment, this is where we belong"
      },
      {
        "time": 63.4,
        "text": "Singing together to our favorite song"
      },
      {
        "time": 72.9,
        "text": "Feel the vibration, hold on to the light"
      },
      {
        "time": 82.5,
        "text": "We're dancing together all through the night"
      },
      {
        "time": 92.1,
        "text": "Never gonna let this feeling fade away"
      },
      {
        "time": 101.6,
        "text": "Tomorrow is coming with a brighter day"
      },
      {
        "time": 111.2,
        "text": "♪ (Tokyo Drizzle continues) ♪"
      },
      {
        "time": 120.8,
        "text": "Every little melody touching the heart inside"
      },
      {
        "time": 130.3,
        "text": "Nothing left to lose and nothing left to hide"
      },
      {
        "time": 139.9,
        "text": "We made it through the storm, we reached the other side"
      },
      {
        "time": 149.4,
        "text": "♪ (Outro fade) ♪"
      }
    ],
    "es": [
      {
        "time": 0,
        "text": "♪ (Crujido de vinilo y lluvia suave de fondo) ♪"
      },
      {
        "time": 15,
        "text": "♪ (Comienza el suave riff de piano jazz) ♪"
      },
      {
        "time": 45,
        "text": "♪ (Entra la batería suave con escobillas) ♪"
      },
      {
        "time": 75,
        "text": "Gotas de lluvia cayendo en las calles de neón"
      },
      {
        "time": 105,
        "text": "Ecos de pasos y ritmos silenciosos"
      },
      {
        "time": 135,
        "text": "♪ (El sonido de lluvia se desvanece en paz) ♪"
      }
    ],
    "tl": [
      {
        "time": 0,
        "text": "♪ (Lagitik ng plaka at mahinang ulan) ♪"
      },
      {
        "time": 15,
        "text": "♪ (Nagsisimula ang banayad na jazz piano) ♪"
      },
      {
        "time": 45,
        "text": "♪ (Pumapasok ang malumanay na tunog ng tambol) ♪"
      },
      {
        "time": 75,
        "text": "Mga patak ng ulan sa mga kalyeng may neon"
      },
      {
        "time": 105,
        "text": "Alingawngaw ng yabag at banayad na tugtog"
      },
      {
        "time": 135,
        "text": "♪ (Unti-unting humuhupa ang ulan sa kapayapaan) ♪"
      }
    ],
    "ja": [
      {
        "time": 0,
        "text": "♪ (レコードの針音と優しい雨の音) ♪"
      },
      {
        "time": 15,
        "text": "♪ (心地よいジャズピアノの旋律が響く) ♪"
      },
      {
        "time": 45,
        "text": "♪ (ブラシアクションの柔らかなドラム) ♪"
      },
      {
        "time": 75,
        "text": "ネオンの街並みに降り注ぐ雨粒"
      },
      {
        "time": 105,
        "text": "濡れたアスファルトに響く足音と静かなビート"
      },
      {
        "time": 135,
        "text": "♪ (雨音とともに穏やかにフェードアウト) ♪"
      }
    ],
    "fr": [
      {
        "time": 0,
        "text": "♪ (Crachotement de vinyle et douce pluie) ♪"
      },
      {
        "time": 15,
        "text": "♪ (Le doux riff de piano jazz commence) ♪"
      },
      {
        "time": 45,
        "text": "♪ (Entrée d’une batterie feutrée aux balais) ♪"
      },
      {
        "time": 75,
        "text": "Gouttes de pluie tombant sur les avenues éclairées de néons"
      },
      {
        "time": 105,
        "text": "Échos de pas et rythmes paisibles"
      },
      {
        "time": 135,
        "text": "♪ (La pluie s’estompe dans la sérénité) ♪"
      }
    ],
    "de": [
      {
        "time": 0,
        "text": "♪ (Vinylknistern und sanftes Regenrauschen) ♪"
      },
      {
        "time": 15,
        "text": "♪ (Sanftes Jazz-Klavier beginnt) ♪"
      },
      {
        "time": 45,
        "text": "♪ (Sanfter Besen-Schlagzeug-Groove setzt ein) ♪"
      },
      {
        "time": 75,
        "text": "Regentropfen fallen auf die Neonstraßen"
      },
      {
        "time": 105,
        "text": "Schritte verhallen zu leisen Beats"
      },
      {
        "time": 135,
        "text": "♪ (Regenklänge verklingen friedlich) ♪"
      }
    ],
    "ko": [
      {
        "time": 0,
        "text": "♪ (바이닐 노이즈와 잔잔한 빗소리 앰비언스) ♪"
      },
      {
        "time": 15,
        "text": "♪ (감미로운 재즈 피아노 선율이 시작됨) ♪"
      },
      {
        "time": 45,
        "text": "♪ (브러시 드럼의 나지막한 그루브 시작) ♪"
      },
      {
        "time": 75,
        "text": "네온 번쩍이는 거리에 떨어지는 빗방울들"
      },
      {
        "time": 105,
        "text": "발걸음의 메아리와 조용한 비트"
      },
      {
        "time": 135,
        "text": "♪ (빗소리가 평화 속으로 잦아듦) ♪"
      }
    ]
  },
  "song-starlight-glow": {
    "en": [
      {
        "time": 14.4,
        "text": "めぐる季節数えて"
      },
      {
        "time": 21.2,
        "text": "夜空に見つけた願いは星のように"
      },
      {
        "time": 34.2,
        "text": "これまでとこれからを照らし出す光"
      },
      {
        "time": 45.2,
        "text": "どこまでも行こう 聞こえたメロディー"
      },
      {
        "time": 53.4,
        "text": "歌にすれば 始まる未来"
      },
      {
        "time": 59.6,
        "text": "ほらね 煌く世界が待っているよ"
      },
      {
        "time": 67,
        "text": "まだ小さな一歩でもいい 信じよう"
      },
      {
        "time": 74.1,
        "text": "ねぇ飛べるよ"
      },
      {
        "time": 76.6,
        "text": "一人じゃないこと 教えてくれたね"
      },
      {
        "time": 86.9,
        "text": "歌声は彼方に響く"
      },
      {
        "time": 97.6,
        "text": "迷いながらの日々に"
      },
      {
        "time": 104.8,
        "text": "答えを求めて心は立ち止まっていた"
      },
      {
        "time": 117.5,
        "text": "雨上がりの空には虹が架かるから"
      },
      {
        "time": 128.6,
        "text": "どこまでも行こう 聞こえたメロディー"
      },
      {
        "time": 136.7,
        "text": "口ずさめば 始まる未来"
      },
      {
        "time": 142.7,
        "text": "ほらね 叶えたい夢がね待っているよ"
      },
      {
        "time": 150.3,
        "text": "まだ消えない願い胸にあるのなら"
      },
      {
        "time": 157.7,
        "text": "ねぇ飛べるよ"
      },
      {
        "time": 160.1,
        "text": "一人じゃないから 結んだ絆で"
      },
      {
        "time": 170.4,
        "text": "歌声よ彼方に響け"
      },
      {
        "time": 195,
        "text": "それぞれの違う色重ねたら"
      },
      {
        "time": 201.6,
        "text": "僕らの空に未来描こう"
      },
      {
        "time": 210.8,
        "text": "ほらね 煌く世界に出会えたよ"
      },
      {
        "time": 218.4,
        "text": "このときめき忘れないでいつまでも"
      },
      {
        "time": 225.7,
        "text": "ねぇ飛べたよ ここまで来れたよ"
      },
      {
        "time": 231.9,
        "text": "「ありがとう、好きだよ！」"
      },
      {
        "time": 238.4,
        "text": "歌声は彼方に あの空に響いたハーモニー"
      },
      {
        "time": 248.7,
        "text": "繋ごう 紡ごう 大切な今を"
      },
      {
        "time": 255.4,
        "text": "叶えよう 奏でよう 大切な夢を"
      },
      {
        "time": 262.2,
        "text": "出会えた奇跡は 重ねた音色は"
      },
      {
        "time": 269.1,
        "text": "Starlight Museum 星空になる"
      }
    ],
    "es": [
      {
        "time": 0,
        "text": "♪ (Brillante arpegio de sintetizador) ♪"
      },
      {
        "time": 10,
        "text": "Mira hacia arriba al techo de estrellas"
      },
      {
        "time": 16,
        "text": "Olvida quiénes somos"
      },
      {
        "time": 22,
        "text": "Esta noche el universo es nuestro"
      },
      {
        "time": 28,
        "text": "Bailando bajo el resplandor de las estrellas"
      },
      {
        "time": 34,
        "text": "Siente el ritmo tomar el control"
      },
      {
        "time": 40,
        "text": "A donde sea que queramos ir"
      },
      {
        "time": 46,
        "text": "Brillo estelar, resplandeciendo"
      },
      {
        "time": 52,
        "text": "¡La luz más brillante de toda esta ciudad!"
      }
    ],
    "tl": [
      {
        "time": 0,
        "text": "♪ (Kumukutikutap na synth arpeggio) ♪"
      },
      {
        "time": 10,
        "text": "Tumingala sa bubong ng mga bituin"
      },
      {
        "time": 16,
        "text": "Limutin kung sino man tayo"
      },
      {
        "time": 22,
        "text": "Ngayong gabi, atin ang sanlibutan"
      },
      {
        "time": 28,
        "text": "Sumasayaw sa kislap ng mga bituin"
      },
      {
        "time": 34,
        "text": "Damhin ang ritmo na nagpapasigla"
      },
      {
        "time": 40,
        "text": "Saan man natin naisin pumunta"
      },
      {
        "time": 46,
        "text": "Kislap ng bituin, bumababa sa atin"
      },
      {
        "time": 52,
        "text": "Pinakamaliwanag na ilaw sa buong bayan!"
      }
    ],
    "ja": [
      {
        "time": 0,
        "text": "♪ (きらめくシンセアルペジオ) ♪"
      },
      {
        "time": 10,
        "text": "星空の天井を見上げてごらん"
      },
      {
        "time": 16,
        "text": "自分が誰かなんて忘れてしまおう"
      },
      {
        "time": 22,
        "text": "今夜、宇宙は私たちのもの"
      },
      {
        "time": 28,
        "text": "星の光の輝きの中で踊ろう"
      },
      {
        "time": 34,
        "text": "リズムにすべてを委ねて"
      },
      {
        "time": 40,
        "text": "行きたい場所へどこまでも"
      },
      {
        "time": 46,
        "text": "降り注ぐ星あかりのグロウ"
      },
      {
        "time": 52,
        "text": "この街でいちばん眩しい光！"
      }
    ],
    "fr": [
      {
        "time": 0,
        "text": "♪ (Arpèges scintillants au synthétiseur) ♪"
      },
      {
        "time": 10,
        "text": "Lève les yeux vers ce dôme étoilé"
      },
      {
        "time": 16,
        "text": "Oublions qui nous sommes"
      },
      {
        "time": 22,
        "text": "Ce soir, l'univers nous appartient"
      },
      {
        "time": 28,
        "text": "Dansant sous la lueur des étoiles"
      },
      {
        "time": 34,
        "text": "Sens le rythme prendre les commandes"
      },
      {
        "time": 40,
        "text": "Partout où nous voulons voyager"
      },
      {
        "time": 46,
        "text": "Lueur des étoiles qui rayonne"
      },
      {
        "time": 52,
        "text": "La plus éclatante lumière de la ville !"
      }
    ],
    "de": [
      {
        "time": 0,
        "text": "♪ (Funkelndes Synth-Arpeggio) ♪"
      },
      {
        "time": 10,
        "text": "Blick hinauf zum Sternenhimmel"
      },
      {
        "time": 16,
        "text": "Vergiss, wer wir sind"
      },
      {
        "time": 22,
        "text": "Heute Nacht gehört das Universum uns"
      },
      {
        "time": 28,
        "text": "Wir tanzen im Glanz der Sterne"
      },
      {
        "time": 34,
        "text": "Spüre, wie der Rhythmus die Kontrolle übernimmt"
      },
      {
        "time": 40,
        "text": "Wohin auch immer wir wollen"
      },
      {
        "time": 46,
        "text": "Sternenlicht, das herabstrahlt"
      },
      {
        "time": 52,
        "text": "Das hellste Licht in der ganzen Stadt!"
      }
    ],
    "ko": [
      {
        "time": 0,
        "text": "♪ (반짝이는 신스 아르페지오) ♪"
      },
      {
        "time": 10,
        "text": "별들로 가득한 밤하늘을 올려다봐"
      },
      {
        "time": 16,
        "text": "우리가 누구인지는 잠시 잊어버려"
      },
      {
        "time": 22,
        "text": "오늘 밤 이 우주는 온전히 우리의 것"
      },
      {
        "time": 28,
        "text": "별빛의 찬란한 광채 속에 춤을 춰"
      },
      {
        "time": 34,
        "text": "리듬이 온몸을 이끌게 내버려 둬"
      },
      {
        "time": 40,
        "text": "우리가 원하는 그 어디로든"
      },
      {
        "time": 46,
        "text": "쏟아져 내리는 별빛의 찬란함"
      },
      {
        "time": 52,
        "text": "이 도시에서 가장 밝게 빛나는 빛!"
      }
    ]
  },
  "song-cyber-sunset": {
    "en": [
      {
        "time": 13.8,
        "text": "初めての電話は受話器を"
      },
      {
        "time": 17.1,
        "text": "持つ手が震えていた"
      },
      {
        "time": 20.7,
        "text": "2回目の電話はルスデンに"
      },
      {
        "time": 24.2,
        "text": "メッセージが残っていた"
      },
      {
        "time": 27.6,
        "text": "7回目の電話で"
      },
      {
        "time": 31.7,
        "text": "今から会おうよって"
      },
      {
        "time": 34.3,
        "text": "そんなふつうの毎日の中"
      },
      {
        "time": 38.7,
        "text": "始まった"
      },
      {
        "time": 54.9,
        "text": "10回目の電話でふたり"
      },
      {
        "time": 58.2,
        "text": "遠くへ出かけたよね"
      },
      {
        "time": 61.8,
        "text": "手をつないで歩こうとする"
      },
      {
        "time": 65,
        "text": "私に照れていたよね"
      },
      {
        "time": 68.5,
        "text": "それから何度目かの"
      },
      {
        "time": 72.7,
        "text": "夜を飛びこえて"
      },
      {
        "time": 75.5,
        "text": "帰りの車の中で"
      },
      {
        "time": 78.6,
        "text": "キスをしたよね"
      },
      {
        "time": 95.3,
        "text": "恋人達は とても幸せそうに"
      },
      {
        "time": 101.4,
        "text": "手をつないで歩いているからね"
      },
      {
        "time": 108.1,
        "text": "まるで全てのことが 上手く"
      },
      {
        "time": 112.6,
        "text": "いってるかのように 見えるよね"
      },
      {
        "time": 117.2,
        "text": "真実はふたりしか知らない"
      },
      {
        "time": 163.7,
        "text": "白く輝く 雪がとても大好きで"
      },
      {
        "time": 170.2,
        "text": "それでも 去年は離れていたよ"
      },
      {
        "time": 176.6,
        "text": "今年の冬はふたりして見れるかな"
      },
      {
        "time": 182.4,
        "text": "過ごせるかな 言えるかな"
      },
      {
        "time": 185.8,
        "text": "言えなかったメリークリスマスを"
      },
      {
        "time": 205.9,
        "text": "薬指に光った"
      },
      {
        "time": 209.9,
        "text": "指輪を一体"
      },
      {
        "time": 212.6,
        "text": "何度位はずそうとした？"
      },
      {
        "time": 216.8,
        "text": "私達"
      },
      {
        "time": 220.3,
        "text": "恋人達は とても幸せそうに"
      },
      {
        "time": 226.7,
        "text": "手をつないで歩いているからね"
      },
      {
        "time": 233,
        "text": "まるで全てのことが 上手く"
      },
      {
        "time": 237.3,
        "text": "いってるかのように 見えるよね"
      },
      {
        "time": 242.4,
        "text": "真実はふたりしか知らない"
      }
    ],
    "es": [
      {
        "time": 0,
        "text": "♪ (Pulso retro de sintetizador arcade) ♪"
      },
      {
        "time": 20,
        "text": "Cielos anaranjados sobre costas poligonales"
      },
      {
        "time": 50,
        "text": "Persiguiendo el sol tras puertas de neón"
      },
      {
        "time": 80,
        "text": "Sujeta el volante mientras la cuadrícula brilla"
      },
      {
        "time": 110,
        "text": "Nunca mires atrás, solo déjate llevar"
      }
    ],
    "tl": [
      {
        "time": 0,
        "text": "♪ (Retro synth pulse) ♪"
      },
      {
        "time": 20,
        "text": "Kulay kahel na langit sa ibabaw ng dalampasigan"
      },
      {
        "time": 50,
        "text": "Hinahabol ang araw sa likod ng mga pintuang neon"
      },
      {
        "time": 80,
        "text": "Hawakan ang manibela habang umiilaw ang kalsada"
      },
      {
        "time": 110,
        "text": "Huwag nang lilingon, sumabay lang sa agos"
      }
    ],
    "ja": [
      {
        "time": 0,
        "text": "♪ (レトロなアーケードシンセパルス) ♪"
      },
      {
        "time": 20,
        "text": "ポリゴンの海辺に広がるオレンジ色の空"
      },
      {
        "time": 50,
        "text": "ネオンの扉の向こう、沈む夕陽を追いかけて"
      },
      {
        "time": 80,
        "text": "グリッドラインが光る中、ハンドルを握りしめ"
      },
      {
        "time": 110,
        "text": "決して振り返らず、ただ風のままに進め"
      }
    ],
    "fr": [
      {
        "time": 0,
        "text": "♪ (Pulsations rétro arcade au synthétiseur) ♪"
      },
      {
        "time": 20,
        "text": "Ciels orangés sur des rives polygonales"
      },
      {
        "time": 50,
        "text": "Poursuivant le soleil derrière les portes néon"
      },
      {
        "time": 80,
        "text": "Tiens le volant tandis que brillent les lignes du tracé"
      },
      {
        "time": 110,
        "text": "Ne te retourne jamais, laisse simplement couler"
      }
    ],
    "de": [
      {
        "time": 0,
        "text": "♪ (Retro-Arcade-Synth-Impuls) ♪"
      },
      {
        "time": 20,
        "text": "Orangene Himmel über Polygon-Küsten"
      },
      {
        "time": 50,
        "text": "Wir jagen der Sonne hinter Neontüren nach"
      },
      {
        "time": 80,
        "text": "Halt das Steuer, während die Gitterlinien leuchten"
      },
      {
        "time": 110,
        "text": "Blick nie zurück, lass es einfach fließen"
      }
    ],
    "ko": [
      {
        "time": 0,
        "text": "♪ (레트로 아케이드 신스 펄스) ♪"
      },
      {
        "time": 20,
        "text": "폴리곤 해변 위로 번지는 오렌지빛 하늘"
      },
      {
        "time": 50,
        "text": "네온 문 뒤편으로 지는 태양을 쫓아"
      },
      {
        "time": 80,
        "text": "그리드 라인이 빛나는 동안 운전대를 굳게 잡아"
      },
      {
        "time": 110,
        "text": "뒤돌아보지 마, 그저 흘러가게 둬"
      }
    ]
  },
  "song-after-hours": {
    "en": [
      {
        "time": 15.1,
        "text": "There you stood behind your glasses"
      },
      {
        "time": 18.1,
        "text": "In a hazy yellow world"
      },
      {
        "time": 21,
        "text": "Alone enough for me to ask just"
      },
      {
        "time": 23,
        "text": "Alone enough to feel the hurt"
      },
      {
        "time": 27.4,
        "text": "Echoes weaving through the walls, yeah"
      },
      {
        "time": 30.3,
        "text": "Keeping secrets in the night"
      },
      {
        "time": 32.7,
        "text": "We are indivisible"
      },
      {
        "time": 35.3,
        "text": "Together we're a number prime"
      },
      {
        "time": 38.9,
        "text": "The glow of star-born eyes reflect the sky"
      },
      {
        "time": 47.2,
        "text": "Until I find I'm sinking into your"
      },
      {
        "time": 53.4,
        "text": "Yellow, yellow haze"
      },
      {
        "time": 56.8,
        "text": "Lingering as it pours"
      },
      {
        "time": 59.7,
        "text": "Yellow, yellow rain"
      },
      {
        "time": 62.7,
        "text": "What was it all for?"
      },
      {
        "time": 65.8,
        "text": "Hello, hello pain"
      },
      {
        "time": 68.8,
        "text": "Sinking into your"
      },
      {
        "time": 72,
        "text": "Yellow, yellow haze"
      },
      {
        "time": 75.7,
        "text": "Yellow, yellow"
      },
      {
        "time": 81.4,
        "text": "Yellow, yellow"
      },
      {
        "time": 87.5,
        "text": "Yellow, yellow haze"
      },
      {
        "time": 89.8,
        "text": "Reeling captive in your orbit"
      },
      {
        "time": 92.8,
        "text": "Seven circles round your sign"
      },
      {
        "time": 95.8,
        "text": "Trying to rise above the noise, I'm"
      },
      {
        "time": 98.6,
        "text": "Praying I will be your chosen one"
      },
      {
        "time": 102.1,
        "text": "Send a message through the ages"
      },
      {
        "time": 105.4,
        "text": "To the ends of space and time"
      },
      {
        "time": 107.6,
        "text": "We are indivisible"
      },
      {
        "time": 110,
        "text": "Together we're a number prime"
      },
      {
        "time": 113.8,
        "text": "The glow of star-born eyes reflect the sky"
      },
      {
        "time": 121.9,
        "text": "Until I find I'm sinking into your"
      },
      {
        "time": 128.4,
        "text": "Yellow, yellow haze"
      },
      {
        "time": 131.1,
        "text": "Drinking as you pour"
      },
      {
        "time": 131.3,
        "text": "Yellow, yellow rain"
      },
      {
        "time": 131.4,
        "text": "What was it all for?"
      },
      {
        "time": 140.7,
        "text": "Hello, hello pain"
      },
      {
        "time": 144.1,
        "text": "Sinking into your"
      },
      {
        "time": 147.1,
        "text": "Yellow, yellow haze"
      },
      {
        "time": 150.1,
        "text": "Yellow, yellow"
      },
      {
        "time": 156.2,
        "text": "Yellow, yellow"
      },
      {
        "time": 162,
        "text": "Yellow, yellow"
      },
      {
        "time": 165.8,
        "text": "Sinking into your"
      },
      {
        "time": 175.1,
        "text": "Yellow, yellow"
      }
    ],
    "es": [
      {
        "time": 0,
        "text": "♪ (Contrabajo sutil y batería de escobillas) ♪"
      },
      {
        "time": 30,
        "text": "La multitud se fue, el bar ha cerrado"
      },
      {
        "time": 60,
        "text": "Entre sombras de humo suavemente compuestas"
      },
      {
        "time": 90,
        "text": "Un último solo bajo la luz ámbar"
      },
      {
        "time": 120,
        "text": "Diciéndole adiós a otra noche"
      }
    ],
    "tl": [
      {
        "time": 0,
        "text": "♪ (Banayad na double bass at tambol) ♪"
      },
      {
        "time": 30,
        "text": "Umalis na ang mga tao, sarado na ang bar"
      },
      {
        "time": 60,
        "text": "Sa mausok na lilim ng katahimikan"
      },
      {
        "time": 90,
        "text": "Huling tugtugin sa ilalim ng dilaw na ilaw"
      },
      {
        "time": 120,
        "text": "Nagpapaalam sa isa na namang gabi"
      }
    ],
    "ja": [
      {
        "time": 0,
        "text": "♪ (ウッドベースとブラシアクションの優しい響き) ♪"
      },
      {
        "time": 30,
        "text": "客足は途絶え、バーの灯りは落ちた"
      },
      {
        "time": 60,
        "text": "煙の漂う影の中に紡がれる旋律"
      },
      {
        "time": 90,
        "text": "琥珀色の光の下、最後のソロ"
      },
      {
        "time": 120,
        "text": "またひとつの夜に別れを告げて"
      }
    ],
    "fr": [
      {
        "time": 0,
        "text": "♪ (Contrebasse subtile et caisse claire aux balais) ♪"
      },
      {
        "time": 30,
        "text": "La foule est partie, le bar est fermé"
      },
      {
        "time": 60,
        "text": "Dans les ombres brumeuses doucement composées"
      },
      {
        "time": 90,
        "text": "Un dernier solo sous une lueur ambrée"
      },
      {
        "time": 120,
        "text": "Faisant ses adieux à une autre nuit"
      }
    ],
    "de": [
      {
        "time": 0,
        "text": "♪ (Subtiler Kontrabass und Besen-Snare) ♪"
      },
      {
        "time": 30,
        "text": "Die Menge ist fort, die Bar schließt ihre Türen"
      },
      {
        "time": 60,
        "text": "In rauchigen Schatten sanft komponiert"
      },
      {
        "time": 90,
        "text": "Ein letztes Solo unter bernsteinfarbenem Schein"
      },
      {
        "time": 120,
        "text": "Abschied von einer weiteren Nacht"
      }
    ],
    "ko": [
      {
        "time": 0,
        "text": "♪ (은은한 콘트라베이스와 브러시 스네어) ♪"
      },
      {
        "time": 30,
        "text": "손님들은 모두 떠나고, 바의 문은 닫혔어"
      },
      {
        "time": 60,
        "text": "자욱한 담배 연기 속 나직이 흐르는 선율"
      },
      {
        "time": 90,
        "text": "호박빛 조명 아래 마지막 솔로 연주"
      },
      {
        "time": 120,
        "text": "또 하나의 깊은 밤에게 건네는 작별 인사"
      }
    ]
  },
  "song-study-session": {
    "en": [
      {
        "time": 6,
        "text": "♪ (Study Session - Maya Lin) ♪"
      },
      {
        "time": 15.2,
        "text": "Walking through the city with the music in my ears"
      },
      {
        "time": 24.4,
        "text": "Every beat that's dropping washes away the fears"
      },
      {
        "time": 33.6,
        "text": "Look into the distance, colors coming alive"
      },
      {
        "time": 42.8,
        "text": "Feel the rhythm moving, helping our souls survive"
      },
      {
        "time": 51.9,
        "text": "This is the moment, this is where we belong"
      },
      {
        "time": 61.1,
        "text": "Singing together to our favorite song"
      },
      {
        "time": 70.3,
        "text": "Feel the vibration, hold on to the light"
      },
      {
        "time": 79.5,
        "text": "We're dancing together all through the night"
      },
      {
        "time": 88.7,
        "text": "Never gonna let this feeling fade away"
      },
      {
        "time": 97.9,
        "text": "Tomorrow is coming with a brighter day"
      },
      {
        "time": 107.1,
        "text": "♪ (Study Session continues) ♪"
      },
      {
        "time": 116.3,
        "text": "Every little melody touching the heart inside"
      },
      {
        "time": 125.4,
        "text": "Nothing left to lose and nothing left to hide"
      },
      {
        "time": 134.6,
        "text": "We made it through the storm, we reached the other side"
      },
      {
        "time": 143.8,
        "text": "♪ (Outro fade) ♪"
      }
    ],
    "es": [
      {
        "time": 0,
        "text": "♪ (Bucle cálido de cinta y teclas suaves) ♪"
      },
      {
        "time": 25,
        "text": "El lápiz raspa sobre la página de papel"
      },
      {
        "time": 55,
        "text": "Los pensamientos se alejan lentamente"
      },
      {
        "time": 85,
        "text": "El café en la taza se está enfriando"
      },
      {
        "time": 115,
        "text": "Historias serenas esperando desplegarse"
      }
    ],
    "tl": [
      {
        "time": 0,
        "text": "♪ (Mainit na tape loop at malamyang tipa) ♪"
      },
      {
        "time": 25,
        "text": "Lapis na sumusulat sa pahina ng papel"
      },
      {
        "time": 55,
        "text": "Mga iniisip ay dahan-dahang lumulutang"
      },
      {
        "time": 85,
        "text": "Lumalamig na ang kape sa tasa"
      },
      {
        "time": 115,
        "text": "Payapang kwento na naghihintay magbukas"
      }
    ],
    "ja": [
      {
        "time": 0,
        "text": "♪ (温もりあるテープループと柔らかな鍵盤) ♪"
      },
      {
        "time": 25,
        "text": "ノートの上を走る鉛筆の音"
      },
      {
        "time": 55,
        "text": "思考はふわりと空へと漂い"
      },
      {
        "time": 85,
        "text": "マグカップのコーヒーは冷めていく"
      },
      {
        "time": 115,
        "text": "穏やかな物語が静かに開かれていく"
      }
    ],
    "fr": [
      {
        "time": 0,
        "text": "♪ (Boucle de bande chaude et touches feutrées) ♪"
      },
      {
        "time": 25,
        "text": "Le crayon glisse sur la feuille blanche"
      },
      {
        "time": 55,
        "text": "L'esprit s'évade au fil des heures"
      },
      {
        "time": 85,
        "text": "Le café dans la tasse commence à refroidir"
      },
      {
        "time": 115,
        "text": "De paisibles récits prêts à éclore"
      }
    ],
    "de": [
      {
        "time": 0,
        "text": "♪ (Warme Bandschleife und sanfte Tasten) ♪"
      },
      {
        "time": 25,
        "text": "Bleistift kratzt leise über das Papier"
      },
      {
        "time": 55,
        "text": "Gedanken schweifen friedlich davon"
      },
      {
        "time": 85,
        "text": "Der Kaffee in der Tasse wird langsam kalt"
      },
      {
        "time": 115,
        "text": "Ruhige Geschichten warten darauf, erzählt zu werden"
      }
    ],
    "ko": [
      {
        "time": 0,
        "text": "♪ (따스한 테이프 루프와 감미로운 건반) ♪"
      },
      {
        "time": 25,
        "text": "종이 위를 사각사각 스치는 연필 소리"
      },
      {
        "time": 55,
        "text": "생각들은 어느새 먼 곳으로 유영하고"
      },
      {
        "time": 85,
        "text": "머그잔 속 커피는 조금씩 식어가네"
      },
      {
        "time": 115,
        "text": "조용히 펼쳐지는 평화로운 이야기들"
      }
    ]
  },
  "song-ocean-breeze": {
    "en": [
      {
        "time": 6,
        "text": "♪ (Ocean Breeze - Luna & The Sol) ♪"
      },
      {
        "time": 17.8,
        "text": "Walking through the city with the music in my ears"
      },
      {
        "time": 29.6,
        "text": "Every beat that's dropping washes away the fears"
      },
      {
        "time": 41.4,
        "text": "Look into the distance, colors coming alive"
      },
      {
        "time": 53.3,
        "text": "Feel the rhythm moving, helping our souls survive"
      },
      {
        "time": 65.1,
        "text": "This is the moment, this is where we belong"
      },
      {
        "time": 76.9,
        "text": "Singing together to our favorite song"
      },
      {
        "time": 88.7,
        "text": "Feel the vibration, hold on to the light"
      },
      {
        "time": 100.5,
        "text": "We're dancing together all through the night"
      },
      {
        "time": 112.3,
        "text": "Never gonna let this feeling fade away"
      },
      {
        "time": 124.1,
        "text": "Tomorrow is coming with a brighter day"
      },
      {
        "time": 135.9,
        "text": "♪ (Ocean Breeze continues) ♪"
      },
      {
        "time": 147.8,
        "text": "Every little melody touching the heart inside"
      },
      {
        "time": 159.6,
        "text": "Nothing left to lose and nothing left to hide"
      },
      {
        "time": 171.4,
        "text": "We made it through the storm, we reached the other side"
      },
      {
        "time": 183.2,
        "text": "♪ (Outro fade) ♪"
      }
    ],
    "es": [
      {
        "time": 0,
        "text": "♪ (Olas suaves del océano rompiendo en la orilla) ♪"
      },
      {
        "time": 25,
        "text": "Sal en el aire, el viento en el cabello"
      },
      {
        "time": 55,
        "text": "Dejando atrás cada preocupación"
      },
      {
        "time": 85,
        "text": "Horizonte infinito pintado de azul"
      },
      {
        "time": 115,
        "text": "Todo se siente completamente nuevo"
      }
    ],
    "tl": [
      {
        "time": 0,
        "text": "♪ (Banayad na alon sa dalampasigan) ♪"
      },
      {
        "time": 25,
        "text": "Asin sa hangin, simoy sa buhok"
      },
      {
        "time": 55,
        "text": "Iniiwan ang bawat alalahanin"
      },
      {
        "time": 85,
        "text": "Walang hanggang abot-tanaw na kulay asul"
      },
      {
        "time": 115,
        "text": "Lahat ay tila bago at payapa"
      }
    ],
    "ja": [
      {
        "time": 0,
        "text": "♪ (寄せては返す穏やかな波音) ♪"
      },
      {
        "time": 25,
        "text": "潮風の香り、髪をなでる優しい風"
      },
      {
        "time": 55,
        "text": "すべての悩みごとを波間に残して"
      },
      {
        "time": 85,
        "text": "青一面に染まるどこまでも続く水平線"
      },
      {
        "time": 115,
        "text": "すべてが新しく生まれ変わっていく"
      }
    ],
    "fr": [
      {
        "time": 0,
        "text": "♪ (Douces vagues de l’océan caressant le rivage) ♪"
      },
      {
        "time": 25,
        "text": "L'odeur du sel, le vent dans les cheveux"
      },
      {
        "time": 55,
        "text": "Laissant derrière soi chaque souci"
      },
      {
        "time": 85,
        "text": "Un horizon infini peint d'azur"
      },
      {
        "time": 115,
        "text": "Tout semble renaître à nouveau"
      }
    ],
    "de": [
      {
        "time": 0,
        "text": "♪ (Sanfte Meereswellen brechen am Ufer) ♪"
      },
      {
        "time": 25,
        "text": "Salz in der Luft, Wind im Haar"
      },
      {
        "time": 55,
        "text": "Lassen jede einzelne Sorge hinter uns"
      },
      {
        "time": 85,
        "text": "Endloser Horizont in tiefem Blau"
      },
      {
        "time": 115,
        "text": "Alles fühlt sich völlig neu an"
      }
    ],
    "ko": [
      {
        "time": 0,
        "text": "♪ (해변가에 부서지는 잔잔한 파도 소리) ♪"
      },
      {
        "time": 25,
        "text": "공기 중에 밴 갯내음, 머리칼을 스치는 바람"
      },
      {
        "time": 55,
        "text": "모든 걱정과 시름은 저 뒤편에 둔 채"
      },
      {
        "time": 85,
        "text": "푸른빛으로 물든 끝없는 수평선"
      },
      {
        "time": 115,
        "text": "모든 것이 새롭게 태어난 듯 상쾌해"
      }
    ]
  },
  "song-whispering-pines": {
    "en": [
      {
        "time": 42.9,
        "text": "Deep into the night"
      },
      {
        "time": 46,
        "text": "With the moonlight as my guide"
      },
      {
        "time": 49,
        "text": "I go wander through the pines and make my way to nature's shrine"
      },
      {
        "time": 55.9,
        "text": "And I look up to the sky"
      },
      {
        "time": 58.9,
        "text": "And I know you're still alive"
      },
      {
        "time": 62.2,
        "text": "But I wonder where you are, I call your name into the dark"
      },
      {
        "time": 70.3,
        "text": "I wake up in the morning, oh, and I don't know where I've been"
      },
      {
        "time": 76.8,
        "text": "All alone on a mountainside and I'm huddled in the wind"
      },
      {
        "time": 83.1,
        "text": "And it feels like I've been away for an era but nothing has changed at all"
      },
      {
        "time": 89.4,
        "text": "And it feels like I've been with you, oh, but what did we do and where have you gone"
      },
      {
        "time": 110.1,
        "text": "On the night you disappeared"
      },
      {
        "time": 112.9,
        "text": "Oh, if I had seen it clear"
      },
      {
        "time": 116.2,
        "text": "But a strange light in the sky was shining right into my eyes"
      },
      {
        "time": 123.2,
        "text": "There was no one else in sight"
      },
      {
        "time": 126.6,
        "text": "Just the endless frozen pines"
      },
      {
        "time": 129.8,
        "text": "But I wonder all they know 'cause they don't die and they don't grow"
      },
      {
        "time": 138,
        "text": "I am ready to follow you even though I don't know where"
      },
      {
        "time": 144.7,
        "text": "I will wait in the night until you decide to take me there"
      },
      {
        "time": 150.5,
        "text": "'Cause I know I don't wanna stay here forever, it's time to be movin on"
      },
      {
        "time": 157.1,
        "text": "Oh I don't want to be the only one living when all of my friends are gone"
      },
      {
        "time": 179,
        "text": "I will be waiting for you, on the other side of the frozen pines"
      },
      {
        "time": 185,
        "text": "I'm gonna find a way through, there's another life beyond the line"
      },
      {
        "time": 191.8,
        "text": "I will be waiting for you, on the other side of the frozen pines"
      },
      {
        "time": 198.6,
        "text": "I'm gonna find a way through, there's another life beyond the line"
      }
    ],
    "es": [
      {
        "time": 0,
        "text": "♪ (Cálido arpegio acústico) ♪"
      },
      {
        "time": 25,
        "text": "La luz solar se filtra por la copa de los árboles"
      },
      {
        "time": 55,
        "text": "Caminando despacio en la armonía del bosque"
      },
      {
        "time": 85,
        "text": "Agujas de pino crujen suavemente bajo cada paso"
      },
      {
        "time": 115,
        "text": "Encontrando la paz que llevamos dentro"
      }
    ],
    "tl": [
      {
        "time": 0,
        "text": "♪ (Mainit na pagtugtog ng akustikong gitara) ♪"
      },
      {
        "time": 25,
        "text": "Sinag ng araw na tumatagos sa mga dahon"
      },
      {
        "time": 55,
        "text": "Mabagal na naglalakad sa himig ng kalikasan"
      },
      {
        "time": 85,
        "text": "Dahon ng pino sa ilalim ng bawat hakbang"
      },
      {
        "time": 115,
        "text": "Natatagpuan ang kapayapaan sa ating puso"
      }
    ],
    "ja": [
      {
        "time": 0,
        "text": "♪ (温かいアコースティックの指弾き) ♪"
      },
      {
        "time": 25,
        "text": "木漏れ日が梢の間から降り注ぐ"
      },
      {
        "time": 55,
        "text": "自然の調和の中、ゆっくりと歩みを進める"
      },
      {
        "time": 85,
        "text": "一歩ごとに優しく踏みしめる松の葉"
      },
      {
        "time": 115,
        "text": "心の中に眠っていた静けさを取り戻していく"
      }
    ],
    "fr": [
      {
        "time": 0,
        "text": "♪ (Arpèges acoustiques chaleureux aux doigts) ♪"
      },
      {
        "time": 25,
        "text": "La lumière du soleil filtre à travers la canopée"
      },
      {
        "time": 55,
        "text": "Marchant doucement dans l'harmonie de la nature"
      },
      {
        "time": 85,
        "text": "Aiguilles de pin sous chacun de nos pas"
      },
      {
        "time": 115,
        "text": "Retrouvant la paix que nous portons en nous"
      }
    ],
    "de": [
      {
        "time": 0,
        "text": "♪ (Warmes akustisches Fingerpicking) ♪"
      },
      {
        "time": 25,
        "text": "Sonnenlicht bricht durch das grüne Blätterdach"
      },
      {
        "time": 55,
        "text": "Langsam wandern im Einklang mit der Natur"
      },
      {
        "time": 85,
        "text": "Kiefernadeln federn sanft unter jedem Schritt"
      },
      {
        "time": 115,
        "text": "Den Frieden finden, den wir in uns tragen"
      }
    ],
    "ko": [
      {
        "time": 0,
        "text": "♪ (따스한 어쿠스틱 핑거피킹 인트로) ♪"
      },
      {
        "time": 25,
        "text": "초록빛 나뭇가지 사이로 스며드는 햇살"
      },
      {
        "time": 55,
        "text": "자연의 숨결 속을 천천히 걸어가"
      },
      {
        "time": 85,
        "text": "발걸음마다 사뿐히 밟히는 솔잎들"
      },
      {
        "time": 115,
        "text": "마음 깊은 곳에 품고 있던 평화를 마주하네"
      }
    ]
  },
  "song-dancing-alone": {
    "en": [
      {
        "time": 9.3,
        "text": "You dance like crazy"
      },
      {
        "time": 11.9,
        "text": "You dance alone"
      },
      {
        "time": 16.5,
        "text": "You can die here"
      },
      {
        "time": 21.2,
        "text": "If I stop the beat"
      },
      {
        "time": 23.3,
        "text": "You look like crazy"
      },
      {
        "time": 25.4,
        "text": "You look like Jay-Z"
      },
      {
        "time": 30.2,
        "text": "You can beat me"
      },
      {
        "time": 35.4,
        "text": "Let's go and stop, break"
      },
      {
        "time": 40.4,
        "text": "You can shout, fly"
      },
      {
        "time": 45.4,
        "text": "To my game"
      },
      {
        "time": 49.9,
        "text": "Just close your eyes"
      },
      {
        "time": 55.3,
        "text": "You dance like crazy"
      },
      {
        "time": 57.4,
        "text": "You dance alone"
      },
      {
        "time": 62.4,
        "text": "You will die here"
      },
      {
        "time": 67.1,
        "text": "If I stop the beat"
      },
      {
        "time": 69,
        "text": "Miss you like crazy"
      },
      {
        "time": 71.2,
        "text": "I'm dancing alone"
      },
      {
        "time": 76,
        "text": "Can you take me?"
      },
      {
        "time": 81.1,
        "text": "Let's go and stop, break"
      },
      {
        "time": 86.3,
        "text": "You can shout, fly"
      },
      {
        "time": 91,
        "text": "To my game"
      },
      {
        "time": 95.5,
        "text": "Just close your eyes"
      },
      {
        "time": 100.4,
        "text": "Stop, break"
      },
      {
        "time": 104.6,
        "text": "You can shout, fly"
      },
      {
        "time": 109.5,
        "text": "To my game"
      },
      {
        "time": 113.7,
        "text": "Just close your eyes"
      },
      {
        "time": 137.1,
        "text": "Stop, break"
      },
      {
        "time": 141.7,
        "text": "Shout, fly"
      },
      {
        "time": 146.2,
        "text": "My game"
      },
      {
        "time": 155.7,
        "text": "You dance like crazy"
      },
      {
        "time": 158.1,
        "text": "You dance alone"
      },
      {
        "time": 162.8,
        "text": "You can die here"
      },
      {
        "time": 167.7,
        "text": "If I stop the beat"
      },
      {
        "time": 169.5,
        "text": "You look like crazy"
      },
      {
        "time": 172,
        "text": "You look, like, through me"
      },
      {
        "time": 176.5,
        "text": "You can beat me"
      },
      {
        "time": 181.6,
        "text": "Let's go and stop, break"
      },
      {
        "time": 187,
        "text": "You can shout, fly"
      },
      {
        "time": 191.6,
        "text": "To my game"
      },
      {
        "time": 196.2,
        "text": "Just close your eyes"
      }
    ],
    "es": [
      {
        "time": 0,
        "text": "♪ (Batería con profunda reverberación y sintetizador) ♪"
      },
      {
        "time": 25,
        "text": "Las sombras se mecen en la pista vacía"
      },
      {
        "time": 55,
        "text": "Ya no necesito a nadie más"
      },
      {
        "time": 85,
        "text": "Girando en círculos en la niebla del atardecer"
      },
      {
        "time": 115,
        "text": "Perdido para siempre en un laberinto de ritmos"
      }
    ],
    "tl": [
      {
        "time": 0,
        "text": "♪ (Malalim na tambol at kumikinang na synth) ♪"
      },
      {
        "time": 25,
        "text": "Mga anino ay sumasayaw sa walang lamang sahig"
      },
      {
        "time": 55,
        "text": "Hindi na kailangan ng kahit sino pa"
      },
      {
        "time": 85,
        "text": "Umiikot sa hamog ng dapit-hapon"
      },
      {
        "time": 115,
        "text": "Naliligaw sa labirinto ng tugtugin"
      }
    ],
    "ja": [
      {
        "time": 0,
        "text": "♪ (深いリバーブのドラムと煌めくシンセ) ♪"
      },
      {
        "time": 25,
        "text": "誰もいないフロアに揺れる影"
      },
      {
        "time": 55,
        "text": "もう誰かの瞳を気にする必要はない"
      },
      {
        "time": 85,
        "text": "薄暮の霞の中でくるくると回り"
      },
      {
        "time": 115,
        "text": "リズムの迷宮へと溶けていく"
      }
    ],
    "fr": [
      {
        "time": 0,
        "text": "♪ (Batterie à profonde réverbération et synthé scintillant) ♪"
      },
      {
        "time": 25,
        "text": "Les ombres ondulent sur la piste déserte"
      },
      {
        "time": 55,
        "text": "Plus besoin de personne à présent"
      },
      {
        "time": 85,
        "text": "Tournoyant dans la brume du crépuscule"
      },
      {
        "time": 115,
        "text": "Égaré à jamais dans un dédale de rythmes"
      }
    ],
    "de": [
      {
        "time": 0,
        "text": "♪ (Tiefer Hall auf den Trommeln und schimmernder Synth) ♪"
      },
      {
        "time": 25,
        "text": "Schatten wiegen sich auf dem leeren Boden"
      },
      {
        "time": 55,
        "text": "Brauche niemanden mehr an meiner Seite"
      },
      {
        "time": 85,
        "text": "Drehe mich im Kreis im Zwielichtdunst"
      },
      {
        "time": 115,
        "text": "Für immer verloren im Rhythmus-Labyrinth"
      }
    ],
    "ko": [
      {
        "time": 0,
        "text": "♪ (깊은 리버브 드럼과 은은한 신스 선율) ♪"
      },
      {
        "time": 25,
        "text": "텅 빈 플로어 위로 일렁이는 그림자들"
      },
      {
        "time": 55,
        "text": "더 이상 그 누구도 필요치 않아"
      },
      {
        "time": 85,
        "text": "황혼의 아지랑이 속에서 빙글빙글 돌며"
      },
      {
        "time": 115,
        "text": "리듬의 미로 속에 영원히 빠져드네"
      }
    ]
  },
  "song-1788899851421": {
    "en": [
      {
        "time": 6,
        "text": "우린 필요 없어 다른 sign"
      },
      {
        "time": 9.4,
        "text": "Paint the town, 초록색의 lights"
      },
      {
        "time": 12.8,
        "text": "페달에 발을 올려, 마치 bike"
      },
      {
        "time": 16.1,
        "text": "I just gotta get it"
      },
      {
        "time": 19.5,
        "text": "Watch me go, go, go, go, go, go"
      },
      {
        "time": 22.9,
        "text": "I just gotta get it"
      },
      {
        "time": 26.3,
        "text": "Watch me go, go, go, go, go, go"
      },
      {
        "time": 29.7,
        "text": "I just gotta get it"
      },
      {
        "time": 33.1,
        "text": "가져와 new beat, 가져와 new hit"
      },
      {
        "time": 36.4,
        "text": "가져와 new sheet, 만들어 new shit"
      },
      {
        "time": 39.8,
        "text": "가져와 new beat, 가져와 new hit"
      },
      {
        "time": 43.2,
        "text": "가져와 new sheet, I'm on the new shit"
      },
      {
        "time": 46.6,
        "text": "(Yeah, shh) 바지 내려 입고 우린 studio로 가지 (uh, uh)"
      },
      {
        "time": 50,
        "text": "Drippy, 고장 난 듯 배수관이, yeah, yeah"
      },
      {
        "time": 53.4,
        "text": "불러와 new wave, Poseidon 같이 (uh, uh)"
      },
      {
        "time": 56.7,
        "text": "Martin (that's on fire), play that beat (that's on fire)"
      },
      {
        "time": 60.1,
        "text": "Yeah, 작업실에서 불을 피워, 밤도 대낮같이 (yeah)"
      },
      {
        "time": 63.5,
        "text": "우린 오늘 만들었지, and this track is so sick"
      },
      {
        "time": 66.9,
        "text": "레벨 좀 더 키워, 이 노래는 달려 도시를 (도시, yeah)"
      },
      {
        "time": 70.3,
        "text": "우린 필요 없어 다른 sign (okay, okay)"
      },
      {
        "time": 73.7,
        "text": "Paint the town, 초록색의 lights (yeah, lights)"
      },
      {
        "time": 77,
        "text": "페달에 발을 올려, 마치 bike (yeah, yeah)"
      },
      {
        "time": 80.4,
        "text": "I just gotta get it"
      },
      {
        "time": 83.8,
        "text": "Watch me go, go, go, go, go, go"
      },
      {
        "time": 87.2,
        "text": "I just gotta get it"
      },
      {
        "time": 90.6,
        "text": "Watch me go, go, go, go, go, go"
      },
      {
        "time": 94,
        "text": "I just gotta get it"
      },
      {
        "time": 97.3,
        "text": "어렸을 때부터 난 동네서 좀 특이했어 (pow, pow, pow, pow, pow)"
      },
      {
        "time": 100.7,
        "text": "Yeah, 맘은 이미 pop-star back at 중이 때 (yeah, yeah, yeah, yeah)"
      },
      {
        "time": 104.1,
        "text": "우린 모자 눌러쓰고 new era 추진해 (ay, ay)"
      },
      {
        "time": 107.5,
        "text": "우릴 보고 엄질 들어, 모든 구시대, yeah"
      },
      {
        "time": 110.9,
        "text": "Watch me, I'm gon' spit it, pop and pop, 난 지금 hit mode"
      },
      {
        "time": 114.3,
        "text": "Hitman 처럼, hit 만들고 싶어서 난 reload (reload)"
      },
      {
        "time": 117.6,
        "text": "치키치키, reload, uh-uh, reload (ay)"
      },
      {
        "time": 121,
        "text": "신호 주면 바로 던져넣어, 마치 free throw"
      },
      {
        "time": 124.4,
        "text": "우린 필요 없어 다른 sign"
      },
      {
        "time": 127.8,
        "text": "Paint the town, 초록색의 lights"
      },
      {
        "time": 131.2,
        "text": "페달에 발을 올려, 마치 bike"
      },
      {
        "time": 134.6,
        "text": "I just gotta get it"
      },
      {
        "time": 137.9,
        "text": "Watch me go, go, go, go, go, go"
      },
      {
        "time": 141.3,
        "text": "I just gotta get it"
      },
      {
        "time": 144.7,
        "text": "Watch me go, go, go, go, go, go"
      },
      {
        "time": 148.1,
        "text": "I just gotta get it"
      },
      {
        "time": 151.5,
        "text": "가져와 new beat, 가져와 new hit"
      },
      {
        "time": 154.9,
        "text": "가져와 new sheet, 만들어 new shit"
      },
      {
        "time": 158.2,
        "text": "가져와 new beat, 가져와 new hit"
      },
      {
        "time": 161.6,
        "text": "가져와 new sheet, I'm on the new shit"
      }
    ]
  },
  "song-1788899682641": {
    "en": [
      {
        "time": 6,
        "text": "Green, green"
      },
      {
        "time": 8.8,
        "text": "따바라 한 모금 sip (Ooh)"
      },
      {
        "time": 11.6,
        "text": "Caffeine 또 kickin' in"
      },
      {
        "time": 14.4,
        "text": "어젯밤에 만들던 beat"
      },
      {
        "time": 17.2,
        "text": "내 폰에다 담아서 거리로 나가서"
      },
      {
        "time": 20,
        "text": "다섯이 고개를 빙빙"
      },
      {
        "time": 22.8,
        "text": "입꼬린 올라가, 히히"
      },
      {
        "time": 25.6,
        "text": "핸드폰 바꿔 놔 D-N-D"
      },
      {
        "time": 28.4,
        "text": "Seeing all kinds of green, green"
      },
      {
        "time": 31.2,
        "text": "쉿, 한파에 (한파에)"
      },
      {
        "time": 34,
        "text": "I put my hands in my pocket (Pocket)"
      },
      {
        "time": 36.8,
        "text": "Outside, 한 밤에 (한 밤에)"
      },
      {
        "time": 39.6,
        "text": "사람 없는 스팟으로 빨리 (Brr)"
      },
      {
        "time": 42.4,
        "text": "I'll do that shit all with my team (Team)"
      },
      {
        "time": 45.2,
        "text": "누군가 싫어할 짓 (짓)"
      },
      {
        "time": 48,
        "text": "알 바가 아니여 get it, get it"
      },
      {
        "time": 50.8,
        "text": "신호등 바뀌었어 green, green"
      },
      {
        "time": 53.6,
        "text": "팔랑귀 팔랑귀 (That's red, red)"
      },
      {
        "time": 56.4,
        "text": "눈치나 살피기 (That's red, red)"
      },
      {
        "time": 59.2,
        "text": "도가니 사리기 (That's red, red)"
      },
      {
        "time": 62,
        "text": "넘어가 울타리 green, green"
      },
      {
        "time": 64.8,
        "text": "궁뎅이 가리기 (That's red, red)"
      },
      {
        "time": 67.6,
        "text": "주변을 살피기 (That's red, red)"
      },
      {
        "time": 70.4,
        "text": "쿨한 척 척하기 (That's red, red)"
      },
      {
        "time": 73.2,
        "text": "You should come mess with the team"
      },
      {
        "time": 76,
        "text": "내 친구들 전부 한 트럭에다 담아서"
      },
      {
        "time": 78.8,
        "text": "거리로 나가서 빙빙"
      },
      {
        "time": 81.6,
        "text": "거리서 돌다가 돌아가 studio"
      },
      {
        "time": 84.4,
        "text": "Cookin' up 'til we get stinky"
      },
      {
        "time": 87.2,
        "text": "팔랑귀 팔랑귀 (That's red, red)"
      },
      {
        "time": 90,
        "text": "눈치나 살피기 (That's red, red)"
      },
      {
        "time": 92.8,
        "text": "도가니 사리기 (That's red, red)"
      },
      {
        "time": 95.6,
        "text": "You should come mess with the team"
      },
      {
        "time": 98.4,
        "text": "They called me a freak, 홀린 듯이, yeah"
      },
      {
        "time": 101.2,
        "text": "만들던 tracks, yeah, 듣고 모인 friends, yeah"
      },
      {
        "time": 104,
        "text": "하루가 갈수록 늘어가 pack"
      },
      {
        "time": 106.8,
        "text": "진짜배기처럼 밟아가 step (Ah)"
      },
      {
        "time": 109.6,
        "text": "Screaming loud like yeah, yeah"
      },
      {
        "time": 112.4,
        "text": "고개 까딱여 like yeah, yeah"
      },
      {
        "time": 115.2,
        "text": "F1, 들지 마 red flag"
      },
      {
        "time": 118,
        "text": "You should come mess with the team (Tell me what's red)"
      },
      {
        "time": 120.8,
        "text": "차갑게 방치된 city (That's red)"
      },
      {
        "time": 123.6,
        "text": "먼지가 쌓인 그 CD (That's red)"
      },
      {
        "time": 126.4,
        "text": "정숙한 무대는 시시해"
      },
      {
        "time": 129.2,
        "text": "답답해 정수리 시뻘게지지 (That's red)"
      },
      {
        "time": 132,
        "text": "We gotta pop out to show how"
      },
      {
        "time": 134.8,
        "text": "다시 배워 봐, you gotta note down"
      },
      {
        "time": 137.6,
        "text": "불러와 버려 두 번째 혼란"
      },
      {
        "time": 140.4,
        "text": "신호등 바뀌었어 green, green"
      },
      {
        "time": 143.2,
        "text": "팔랑귀 팔랑귀 (That's red, red)"
      },
      {
        "time": 146,
        "text": "눈치나 살피기 (That's red, red)"
      },
      {
        "time": 148.8,
        "text": "도가니 사리기 (That's red, red)"
      },
      {
        "time": 151.6,
        "text": "넘어가 울타리 green, green"
      },
      {
        "time": 154.4,
        "text": "궁뎅이 가리기 (That's red, red)"
      },
      {
        "time": 157.2,
        "text": "주변을 살피기 (That's red, red)"
      },
      {
        "time": 160,
        "text": "쿨한 척 척하기 (That's red, red)"
      },
      {
        "time": 162.8,
        "text": "You should come mess with the team"
      },
      {
        "time": 165.6,
        "text": "Ayy (Yeah, yeah)"
      },
      {
        "time": 168.4,
        "text": "Turn it up, ayy"
      },
      {
        "time": 171.2,
        "text": "I told you to turn it up"
      },
      {
        "time": 174,
        "text": "I don't mess with no stupid red signs"
      },
      {
        "time": 176.8,
        "text": "신호등 바뀌었어 green, green"
      },
      {
        "time": 179.6,
        "text": "팔랑귀 팔랑귀 (That's red, red)"
      },
      {
        "time": 182.4,
        "text": "눈치나 살피기 (That's red, red)"
      },
      {
        "time": 185.2,
        "text": "도가니 사리기 (That's red, red)"
      },
      {
        "time": 188,
        "text": "넘어가 울타리 green, green"
      },
      {
        "time": 190.8,
        "text": "궁뎅이 가리기 (That's red, red)"
      },
      {
        "time": 193.6,
        "text": "주변을 살피기 (That's red, red)"
      },
      {
        "time": 196.4,
        "text": "쿨한 척 척하기 (That's red, red)"
      },
      {
        "time": 199.2,
        "text": "You should come mess with the team"
      },
      {
        "time": 202,
        "text": "내 친구들 전부 한 트럭에다 담아서"
      },
      {
        "time": 204.8,
        "text": "거리로 나가서 빙빙"
      },
      {
        "time": 207.6,
        "text": "거리서 돌다가 돌아가 studio"
      },
      {
        "time": 210.4,
        "text": "Cookin' up 'til we get stinky"
      },
      {
        "time": 213.2,
        "text": "팔랑귀 팔랑귀 (That's red, red)"
      },
      {
        "time": 216,
        "text": "눈치나 살피기 (That's red, red)"
      },
      {
        "time": 218.8,
        "text": "도가니 사리기 (That's red, red)"
      },
      {
        "time": 221.6,
        "text": "You should come mess with the team"
      }
    ]
  },
  "song-1788899572989": {
    "en": [
      {
        "time": 5.9,
        "text": "내 티, five bucks, 바지는 만원"
      },
      {
        "time": 9.1,
        "text": "My vision 몇 억s, 몇 조s, Bezos"
      },
      {
        "time": 12.1,
        "text": "동묘, what's up? 홍대, what's up? (워워)"
      },
      {
        "time": 15.2,
        "text": "I make 'em famous, I call that, \"Fashion\" (워워)"
      },
      {
        "time": 18.3,
        "text": "Fashion, fashion, fashion, fashion (워, let's go)"
      },
      {
        "time": 21.3,
        "text": "Fashion, fashion, fashion, fashion (what, what, what?)"
      },
      {
        "time": 24.5,
        "text": "내 티, five bucks, 바지는 만원"
      },
      {
        "time": 27.3,
        "text": "Let's get it (yeah), let's go, fashion, fashion (huh, huh)"
      },
      {
        "time": 30.3,
        "text": "안건호, 내가 산 옷 보고 뭐라고 말해도 지켜 내 고집 (yeah)"
      },
      {
        "time": 33.5,
        "text": "후르츠 찜해놓은 상품에 있었던 벨트는 now on my 허리, huh"
      },
      {
        "time": 36.6,
        "text": "Sorry, my granny, 요즘 왜 안 오니? 섭하신 동묘 할머니"
      },
      {
        "time": 39.9,
        "text": "여긴 비행기, huh, LA에서 앨범을 끝내고 멋있게 돌아와, back on my swag"
      },
      {
        "time": 43.6,
        "text": "Huh, huh, 외화 talk, huh, 환율 올라 매일 (빠빠)"
      },
      {
        "time": 47.4,
        "text": "구제 판, got me looking fresh (빠빠)"
      },
      {
        "time": 50.6,
        "text": "Pull up boys, 샥샥 긁어내 (skrrt, skrrt)"
      },
      {
        "time": 53.7,
        "text": "빈티지져스 (지져스)"
      },
      {
        "time": 55.6,
        "text": "동묘에서 모여 마치 세미나"
      },
      {
        "time": 58.8,
        "text": "홍대에서 모여 우린 set it off (set it off)"
      },
      {
        "time": 61.6,
        "text": "청-청-청담동 한가운데까지 spreading out (yeah, brr)"
      },
      {
        "time": 64.8,
        "text": "Squad is on the way, but we can't wrap it up (yeah)"
      },
      {
        "time": 67.9,
        "text": "내 티, five bucks, 바지는 만원"
      },
      {
        "time": 71,
        "text": "My vision 몇 억s, 몇 조s, Bezos"
      },
      {
        "time": 74.1,
        "text": "동묘, what's up? 홍대, what's up? (워워)"
      },
      {
        "time": 77.1,
        "text": "I make 'em famous, I call that, \"Fashion\" (워워)"
      },
      {
        "time": 80.3,
        "text": "Fashion, fashion, fashion, fashion (brr, let's go)"
      },
      {
        "time": 83.4,
        "text": "Fashion, fashion, fashion, fashion (what, what, what?)"
      },
      {
        "time": 86.5,
        "text": "내 티, five bucks, 바지는 만원 (yeah)"
      },
      {
        "time": 89.5,
        "text": "Let's get it, let's go (let's go), fashion, fashion"
      },
      {
        "time": 92.3,
        "text": "Yeah, 심장이 pop out, 첫눈에 바로 cop-cop"
      },
      {
        "time": 95.6,
        "text": "Okay, 구제 짬밥 삼만원짜리 잠바"
      },
      {
        "time": 98.7,
        "text": "Ay-yay-yay, feel like rock star, 확 met gala로 갈라, let's go"
      },
      {
        "time": 102.4,
        "text": "Top designers, 홍대 맛보고 환장 fashion"
      },
      {
        "time": 105.7,
        "text": "Come and try, 동묘 생활에서 난"
      },
      {
        "time": 108.3,
        "text": "체력을 많이 닦아놔, mosh pit 하는 법 배워놔"
      },
      {
        "time": 111.4,
        "text": "배워봐, 배워봐, 너도 빨리 배워봐"
      },
      {
        "time": 114.5,
        "text": "옷 무덤 속 다시 태어나, 빈티지져스 came alive"
      },
      {
        "time": 117.6,
        "text": "동묘에서 모여 마치 세미나"
      },
      {
        "time": 120.6,
        "text": "홍대에서 모여 우린 set it off (set it off)"
      },
      {
        "time": 123.3,
        "text": "청-청-청담동 한가운데까지 spreading out (yeah, brr)"
      },
      {
        "time": 126.7,
        "text": "Squad is on the way, but we can't wrap it up (yeah, skrrt)"
      },
      {
        "time": 129.6,
        "text": "내 티, five bucks, 바지는 만원"
      },
      {
        "time": 133,
        "text": "My vision 몇 억s, 몇 조s, Bezos"
      },
      {
        "time": 136,
        "text": "동묘, what's up? 홍대, what's up? (워워)"
      },
      {
        "time": 139.1,
        "text": "I make 'em famous, I call that, \"Fashion\""
      },
      {
        "time": 142.2,
        "text": "Fashion, fashion, fashion, fashion (워, let's go)"
      },
      {
        "time": 145.3,
        "text": "Fashion, fashion, fashion, fashion"
      },
      {
        "time": 148.3,
        "text": "Fashion, fashion, fashion, fashion (워, let's go)"
      },
      {
        "time": 151.6,
        "text": "Fashion, fashion, fashion, fashion (what, what?)"
      },
      {
        "time": 154.6,
        "text": "Fashion, fashion, fashion, fashion (let's go)"
      },
      {
        "time": 157.6,
        "text": "Fashion, fashion, fashion, fashion"
      },
      {
        "time": 160.8,
        "text": "Fashion, fashion, fashion, fashion (워, let's go)"
      },
      {
        "time": 163.9,
        "text": "Fashion, fashion, fashion, fashion (what? Fashion)"
      }
    ]
  },
  "song-1788899337733": {
    "en": [
      {
        "time": 15,
        "text": "갇혀 이 건물 속에 밤새"
      },
      {
        "time": 18.6,
        "text": "No sun, no sky, 얼굴은 창백 all day"
      },
      {
        "time": 22.3,
        "text": "미쳐 난 flipping 마치 fried eggs, pancakes"
      },
      {
        "time": 26.4,
        "text": "Bloodshot eyes tonight, 도망가 여길 벗어나"
      },
      {
        "time": 31,
        "text": "Cause, ooh"
      },
      {
        "time": 34.9,
        "text": "우리는 꿈꿔왔지 찰나의 해방"
      },
      {
        "time": 39.4,
        "text": "달려 부릉"
      },
      {
        "time": 42.4,
        "text": "트렁크에다 콜라 채워, 얼른 밟아 그 pedal"
      },
      {
        "time": 47.1,
        "text": "이 자릴 떠 지도는 집어치워 'cause we're on a joyride"
      },
      {
        "time": 52,
        "text": "더 세게 speed it up 지금 기분 so high"
      },
      {
        "time": 55.8,
        "text": "Driving so fast, 가로질러 긴 밤"
      },
      {
        "time": 59.6,
        "text": "Day to night, ride, we're on a joyride"
      },
      {
        "time": 64.6,
        "text": "Yeah, yeah, yeah, we're on a joyride"
      },
      {
        "time": 68.1,
        "text": "Yeah, yeah, yeah, we're on a joyride"
      },
      {
        "time": 71.8,
        "text": "Driving so fast, 가로질러 긴 밤"
      },
      {
        "time": 75.8,
        "text": "Day to night, ride, we're on a joyride"
      },
      {
        "time": 80.3,
        "text": "범생이는 나의 past tense"
      },
      {
        "time": 81.8,
        "text": "학교는 찍먹 아지트로 came back"
      },
      {
        "time": 83.8,
        "text": "인생이 폭풍이면 난"
      },
      {
        "time": 85.7,
        "text": "내 drip 아래 춰 rain dance"
      },
      {
        "time": 87.6,
        "text": "종일 뛰었었지"
      },
      {
        "time": 88.9,
        "text": "폭주는 내 personality"
      },
      {
        "time": 90.5,
        "text": "마치 MJ, ever since '23"
      },
      {
        "time": 92.7,
        "text": "Rat snakes, 담을 넘었지"
      },
      {
        "time": 94.8,
        "text": "Cause, ooh"
      },
      {
        "time": 99.2,
        "text": "우리는 꿈꿔왔지 찰나의 해방"
      },
      {
        "time": 103.2,
        "text": "달려 부릉"
      },
      {
        "time": 107,
        "text": "트렁크에다 콜라 채워, 얼른 밟아 그 pedal"
      },
      {
        "time": 111.4,
        "text": "이 자릴 떠 지도는 집어치워 'cause we're on a joyride"
      },
      {
        "time": 115.8,
        "text": "더 세게 speed it up 지금 기분 so high"
      },
      {
        "time": 119.8,
        "text": "Driving so fast, 가로질러 긴 밤"
      },
      {
        "time": 123.2,
        "text": "Day to night, ride, we're on a joyride"
      },
      {
        "time": 127.8,
        "text": "Yeah, yeah, yeah, we're on a joyride"
      },
      {
        "time": 131.9,
        "text": "Yeah, yeah, yeah, we're on a joyride"
      },
      {
        "time": 135.6,
        "text": "Driving so fast, 가로질러 긴 밤"
      },
      {
        "time": 139.3,
        "text": "Day to night, ride, we're on a joyride"
      }
    ]
  },
  "song-1788899185642": {
    "en": [
      {
        "time": 11.2,
        "text": "Crash, smash, rock, mash up"
      },
      {
        "time": 14.4,
        "text": "Ooh, take what you want"
      },
      {
        "time": 16.8,
        "text": "돈, 멋, 명예, love and what?"
      },
      {
        "time": 20,
        "text": "Ooh, take what you want"
      },
      {
        "time": 22.4,
        "text": "Life's too fast, 뭘 더 참아, 이젠 됐어 (what you want?)"
      },
      {
        "time": 27.7,
        "text": "I want to see the whole world, 도장 찍어, 나의 passport (what you want?)"
      },
      {
        "time": 32.8,
        "text": "Well, 이마에 피도 안 말랐을 때 계획한 행보 (what you want?)"
      },
      {
        "time": 38.9,
        "text": "바라던 걸 찾아, 집을 떠나 what we came for"
      },
      {
        "time": 45,
        "text": "Crash, smash, rock, mash up"
      },
      {
        "time": 48.1,
        "text": "Ooh, take what you want"
      },
      {
        "time": 50.6,
        "text": "돈, 멋, 명예, love and what?"
      },
      {
        "time": 53.8,
        "text": "Ooh, take what you want"
      },
      {
        "time": 56.8,
        "text": "적당히론 배가 차지 않아 (않아)"
      },
      {
        "time": 59.6,
        "text": "들이켜, yuh, 마치 하마 (하마)"
      },
      {
        "time": 62.3,
        "text": "Smelling like a teen, 마치 Nirvana (Nirvana)"
      },
      {
        "time": 65.2,
        "text": "소리쳐, yuh, 'cause we wanna"
      },
      {
        "time": 67.2,
        "text": "That's what we're all looking for"
      },
      {
        "time": 72.7,
        "text": "That's what we're all looking for"
      },
      {
        "time": 78.2,
        "text": "That's what we're all looking for"
      },
      {
        "time": 83.7,
        "text": "That's what we're all looking (one, two, three) for"
      },
      {
        "time": 89.6,
        "text": "난 걍 돌아갈 바엔 바로 넘어버려 담장 (what you want?)"
      },
      {
        "time": 95,
        "text": "난 원해 다시 뛰게 할 무언갈, 나의 심장 (what you want?)"
      },
      {
        "time": 100.7,
        "text": "야밤, 새벽 배송 같은 fresh song, I need that (what you want?)"
      },
      {
        "time": 106.2,
        "text": "I want the whole world to (wake up) and realize"
      },
      {
        "time": 111.5,
        "text": "Some people want (this), some people want (that)"
      },
      {
        "time": 114.3,
        "text": "나도 똑같아 17년 평 (생)"
      },
      {
        "time": 117.2,
        "text": "쫓았었던 love, 쫓았었던 fame"
      },
      {
        "time": 119.9,
        "text": "So now, I want the whole world to know my name"
      },
      {
        "time": 123.6,
        "text": "Crash, smash, rock, mash up"
      },
      {
        "time": 126.8,
        "text": "Ooh, take what you want"
      },
      {
        "time": 129.1,
        "text": "돈, 멋, 명예, love and what?"
      },
      {
        "time": 132.5,
        "text": "Ooh, take what you want"
      },
      {
        "time": 135.6,
        "text": "적당히론 배가 차지 않아 (않아)"
      },
      {
        "time": 138.3,
        "text": "들이켜, yuh, 마치 하마 (하마)"
      },
      {
        "time": 140.9,
        "text": "Smelling like a teen, 마치 Nirvana (Nirvana)"
      },
      {
        "time": 143.8,
        "text": "소리쳐, yuh, 'cause we wanna"
      },
      {
        "time": 145.7,
        "text": "That's what we're all looking for"
      },
      {
        "time": 151.3,
        "text": "That's what we're all looking for"
      },
      {
        "time": 156.7,
        "text": "(That's what we're all-) da-ra, da-ra-ra"
      },
      {
        "time": 160.2,
        "text": "(That's, that's, that's, that's what we're all-)"
      },
      {
        "time": 162.5,
        "text": "That's what we're all looking (one, two, three) for"
      },
      {
        "time": 167.4,
        "text": "What you want?"
      },
      {
        "time": 172.8,
        "text": "What you want?"
      },
      {
        "time": 178.5,
        "text": "What you want?"
      },
      {
        "time": 184.1,
        "text": "What you want?"
      },
      {
        "time": 189.8,
        "text": "What you want?"
      }
    ]
  },
  "song-1788899073299": {
    "en": [
      {
        "time": 0,
        "text": "Who is choking? I don't care"
      },
      {
        "time": 5.1,
        "text": "Who is choking? I don't care"
      },
      {
        "time": 6.6,
        "text": "Who is choking? I don't care"
      },
      {
        "time": 8.2,
        "text": "Who is choking? I don't care"
      },
      {
        "time": 9.8,
        "text": "Who is choking? I don't care (yeah)"
      },
      {
        "time": 11.4,
        "text": "Who is choking? I don't care (let's go)"
      },
      {
        "time": 13.2,
        "text": "벌컥, 벌컥, 땡겨, 땡겨, I just choke on açaí"
      },
      {
        "time": 16.1,
        "text": "한 잔 먹고 흥이 올라,흔들면 다 samba지"
      },
      {
        "time": 19.4,
        "text": "혓 속까지 보라색, 지니 마치 알라딘"
      },
      {
        "time": 22.7,
        "text": "All I want is, ah-yeah, ah-yeah, all I want is, ah-yeah, ah-yeah"
      },
      {
        "time": 26,
        "text": "Uh, uh, uh, uh, uh, 100 açaí"
      },
      {
        "time": 29.1,
        "text": "Uh, uh, uh, uh, uh, bring that açaí"
      },
      {
        "time": 32.3,
        "text": "벌컥, 벌컥, 땡겨, 땡겨, I just choke on açaí"
      },
      {
        "time": 35.4,
        "text": "내가 많이 좋아해, uh, uh, açaí"
      },
      {
        "time": 39,
        "text": "아쉬웠던 taste, 걷어 근본 없는 토핑"
      },
      {
        "time": 41.7,
        "text": "함 바꿔 보게 씬을, 마치 명배우의 액션"
      },
      {
        "time": 44.6,
        "text": "밤새서 세션, 새 호텔 체크인"
      },
      {
        "time": 48.6,
        "text": "그다음 날에 check out, 어깨 위에 짐을 올린"
      },
      {
        "time": 51.4,
        "text": "당나귀, 당나귀처럼 동서남북 지구 한 바퀴"
      },
      {
        "time": 54.8,
        "text": "한 바퀴 돌다 보면 순간 울려 ba, ra, ring"
      },
      {
        "time": 58.8,
        "text": "배꼽에 알람이 (brr)"
      },
      {
        "time": 60.7,
        "text": "It's time to açaí, it's time to açaí (yah, yah, yah)"
      },
      {
        "time": 64.3,
        "text": "벌컥, 벌컥, 땡겨, 땡겨, I just choke on açaí"
      },
      {
        "time": 67.4,
        "text": "한 잔 먹고 흥이 올라, 흔들면 다 samba지"
      },
      {
        "time": 70.6,
        "text": "혓 속까지 보라색, 지니 마치 알라딘"
      },
      {
        "time": 73.9,
        "text": "All I want is, ah-yeah, ah-yeah, all I want is, ah-yeah, ah-yeah"
      },
      {
        "time": 77.1,
        "text": "Uh, uh, uh, uh, uh, 100 açaí"
      },
      {
        "time": 80.2,
        "text": "(Let's go) bring that açaí"
      },
      {
        "time": 83.6,
        "text": "벌컥, 벌컥, 땡겨, 땡겨, I just choke on açaí"
      },
      {
        "time": 86.6,
        "text": "내가 많이 좋아해, uh, uh, açaí"
      },
      {
        "time": 89.9,
        "text": "Açaí 묻은 tee, açaí 묻은 pants"
      },
      {
        "time": 93.2,
        "text": "Açaí 묻은 album (what?), 만들어 버려 jam"
      },
      {
        "time": 96.7,
        "text": "난 키워 버려 trend, 다 묻혀 버려 SNS에"
      },
      {
        "time": 100.6,
        "text": "Stack 'n stack 'n stack"
      },
      {
        "time": 102.2,
        "text": "But I ain't tryna blend, 우린 진짜배기들 하고만 lock in"
      },
      {
        "time": 105.8,
        "text": "난 떠났어, 제대로 된 거 찾으러 삼만리"
      },
      {
        "time": 109,
        "text": "밤새서 세션, 새 호텔 체크인"
      },
      {
        "time": 112.2,
        "text": "그다음 날에 check out, 어깨 위에 짐을 올린"
      },
      {
        "time": 115.4,
        "text": "당나귀, 당나귀처럼 동서남북 지구 한 바퀴"
      },
      {
        "time": 119,
        "text": "한 바퀴 돌다 보면 순간 울려, ba, ra, ring"
      },
      {
        "time": 122.3,
        "text": "배꼽에 알람이 (brr)"
      },
      {
        "time": 124.4,
        "text": "It's time to açaí (brr), it's time to açaí"
      },
      {
        "time": 128.2,
        "text": "벌컥, 벌컥, 땡겨, 땡겨, I just choke on açaí"
      },
      {
        "time": 131.4,
        "text": "한 잔 먹고 흥이 올라, 흔들면 다 samba지"
      },
      {
        "time": 134.6,
        "text": "혓 속까지 보라색, 지니 마치 알라딘"
      },
      {
        "time": 137.9,
        "text": "All I want is, ah-yeah, ah-yeah, all I want is, ah-yeah, ah-yeah"
      },
      {
        "time": 140,
        "text": "Uh, uh, uh, uh, uh, 100 açaí"
      },
      {
        "time": 144.3,
        "text": "Uh, uh, uh, uh, uh, bring that açaí"
      },
      {
        "time": 147.4,
        "text": "벌컥, 벌컥, 땡겨, 땡겨, I just choke on açaí"
      },
      {
        "time": 150.6,
        "text": "내가 많이 좋아해, uh, uh, açaí"
      },
      {
        "time": 157.2,
        "text": "Açaí (let's go)"
      },
      {
        "time": 162.4,
        "text": "Eh, eh, eh, eh (let's go)"
      },
      {
        "time": 165.1,
        "text": "Eh, eh, eh, eh"
      },
      {
        "time": 167,
        "text": "Eh, eh-eh-eh (damn)"
      }
    ]
  },
  "song-1788898924195": {
    "en": [
      {
        "time": 18,
        "text": "I know I have good judgment, I know I have good taste"
      },
      {
        "time": 22.1,
        "text": "It's funny and it's ironic that only I feel that way"
      },
      {
        "time": 26.4,
        "text": "I promise 'em that you're different and everyone makes mistakes"
      },
      {
        "time": 31.1,
        "text": "But just don't"
      },
      {
        "time": 35.9,
        "text": "I heard that you're an actor, so act like a stand-up guy"
      },
      {
        "time": 40,
        "text": "Whatever devil's inside you, don't let him out tonight"
      },
      {
        "time": 44.4,
        "text": "I tell them it's just your culture and everyone rolls their eyes"
      },
      {
        "time": 49,
        "text": "Yeah, I know"
      },
      {
        "time": 52.3,
        "text": "All I'm asking, baby"
      },
      {
        "time": 54.1,
        "text": "Please, please, please"
      },
      {
        "time": 56.9,
        "text": "Don't prove I'm right"
      },
      {
        "time": 62.5,
        "text": "And please, please, please"
      },
      {
        "time": 65.9,
        "text": "Don't bring me to tears when I just did my makeup so nice"
      },
      {
        "time": 71.8,
        "text": "Heartbreak is one thing, my ego's another"
      },
      {
        "time": 76,
        "text": "I beg you, don't embarrass me, motherfucker"
      },
      {
        "time": 80.7,
        "text": "Ah, oh"
      },
      {
        "time": 84,
        "text": "Please, please, please (ah, ah, ah)"
      },
      {
        "time": 89.6,
        "text": "Well, I have a fun idea, babe (uh-huh), maybe just stay inside"
      },
      {
        "time": 93.6,
        "text": "I know you're craving some fresh air, but the ceiling fan is so nice (it's so nice, right?)"
      },
      {
        "time": 98.7,
        "text": "And we could live so happily if no one knows that you're with me"
      },
      {
        "time": 103,
        "text": "I'm just kidding, but really (kinda), really, really"
      },
      {
        "time": 107.6,
        "text": "Please, please, please (please don't prove I'm right)"
      },
      {
        "time": 110.8,
        "text": "Don't prove I'm right"
      },
      {
        "time": 116,
        "text": "And please, please, please"
      },
      {
        "time": 119.7,
        "text": "Don't bring me to tears when I just did my makeup so nice"
      },
      {
        "time": 125.5,
        "text": "Heartbreak is one thing (heartbreak is one thing), my ego's another (ego's another)"
      },
      {
        "time": 129.9,
        "text": "I beg you, don't embarrass me, motherfucker"
      },
      {
        "time": 134.7,
        "text": "Ah, oh"
      },
      {
        "time": 137.9,
        "text": "Please, please, please (ah, ah, ah)"
      },
      {
        "time": 143.6,
        "text": "If you wanna go and be stupid"
      },
      {
        "time": 148.3,
        "text": "Don't do it in front of me"
      },
      {
        "time": 153.1,
        "text": "If you don't wanna cry to my music"
      },
      {
        "time": 156.9,
        "text": "Don't make me hate you prolifically"
      },
      {
        "time": 161.7,
        "text": "Please, please, please (please)"
      },
      {
        "time": 165.5,
        "text": "Please, please, please (please)"
      },
      {
        "time": 167.4,
        "text": "Please (please), please (please), please"
      },
      {
        "time": 171.5,
        "text": "(Ah)"
      }
    ]
  },
  "song-1788898788705": {
    "en": [
      {
        "time": 2,
        "text": "Oh, boy"
      },
      {
        "time": 10.2,
        "text": "You said your phone was broken"
      },
      {
        "time": 12.3,
        "text": "Just forgot to charge it"
      },
      {
        "time": 14.4,
        "text": "Whole outfit you're wearing"
      },
      {
        "time": 15.9,
        "text": "God, I hope it's ironic"
      },
      {
        "time": 18.2,
        "text": "Did you just say you're finished?"
      },
      {
        "time": 19.8,
        "text": "Didn't know we started"
      },
      {
        "time": 22,
        "text": "It's all just so familiar"
      },
      {
        "time": 23.7,
        "text": "Baby, what do you call it?"
      },
      {
        "time": 27.9,
        "text": "Stupid"
      },
      {
        "time": 29.7,
        "text": "Or is it"
      },
      {
        "time": 31.4,
        "text": "Slow?"
      },
      {
        "time": 33.6,
        "text": "Maybe it's"
      },
      {
        "time": 35.8,
        "text": "Useless?"
      },
      {
        "time": 37.8,
        "text": "But there's a cuter word for it"
      },
      {
        "time": 39.7,
        "text": "I know"
      },
      {
        "time": 41.4,
        "text": "Manchild"
      },
      {
        "time": 45.4,
        "text": "Why you always come a-running to me?"
      },
      {
        "time": 49.2,
        "text": "Fuck my life"
      },
      {
        "time": 53.2,
        "text": "Won't you let an innocent woman be?"
      },
      {
        "time": 57.1,
        "text": "Never heard of self-care"
      },
      {
        "time": 61,
        "text": "Half your brain just ain't there"
      },
      {
        "time": 64.9,
        "text": "Manchild"
      },
      {
        "time": 68.8,
        "text": "Why you always come a running"
      },
      {
        "time": 71.2,
        "text": "Taking all my loving from me?"
      },
      {
        "time": 81.2,
        "text": "Why so sexy"
      },
      {
        "time": 83.2,
        "text": "If so dumb?"
      },
      {
        "time": 84.7,
        "text": "And how survive the earth so long?"
      },
      {
        "time": 88.6,
        "text": "If I'm not there, it won't get done"
      },
      {
        "time": 92.5,
        "text": "I choose to blame your mom"
      },
      {
        "time": 95.9,
        "text": "Manchild"
      },
      {
        "time": 100,
        "text": "Why you always come a-running to me?"
      },
      {
        "time": 103.8,
        "text": "Fuck my life"
      },
      {
        "time": 107.8,
        "text": "Won't you let an innocent woman be?"
      },
      {
        "time": 111.7,
        "text": "Never heard of self-care"
      },
      {
        "time": 115.6,
        "text": "Half your brain just ain't there"
      },
      {
        "time": 119.3,
        "text": "Manchild"
      },
      {
        "time": 123.4,
        "text": "Why you always come a-running"
      },
      {
        "time": 125.8,
        "text": "Taking all my loving from me?"
      },
      {
        "time": 127.9,
        "text": "Oh, I like my boys playing hard to get"
      },
      {
        "time": 131.2,
        "text": "And I like my men all incompetent"
      },
      {
        "time": 135.2,
        "text": "And I swear they choose me"
      },
      {
        "time": 137.5,
        "text": "I'm not choosing them"
      },
      {
        "time": 139.1,
        "text": "Amen"
      },
      {
        "time": 141.2,
        "text": "Hey, men!"
      },
      {
        "time": 142.9,
        "text": "Oh, I like my boys playing hard to get (play hard to get)"
      },
      {
        "time": 146.8,
        "text": "And I like my men all incompetent (incompetent)"
      },
      {
        "time": 150.8,
        "text": "And I swear they choose me"
      },
      {
        "time": 153.2,
        "text": "I'm not choosing them (not choosing them)"
      },
      {
        "time": 154.7,
        "text": "Amen (Amen)"
      },
      {
        "time": 156.7,
        "text": "Hey, men! (Hey, men!)"
      },
      {
        "time": 158.6,
        "text": "Manchild"
      },
      {
        "time": 162.4,
        "text": "Why you always come a-running to me? (Always come a-running to me)"
      },
      {
        "time": 166.3,
        "text": "Fuck my life"
      },
      {
        "time": 170.2,
        "text": "Won't you let an innocent woman be?"
      },
      {
        "time": 174.1,
        "text": "Oh, I like my boys playing hard to get"
      },
      {
        "time": 178,
        "text": "And I like my men all incompetent"
      },
      {
        "time": 182,
        "text": "And I swear they choose me"
      },
      {
        "time": 184.3,
        "text": "I'm not choosing them"
      },
      {
        "time": 185.9,
        "text": "Amen"
      },
      {
        "time": 188.2,
        "text": "Hey, men! (Hey, man)"
      },
      {
        "time": 190.1,
        "text": "(Yee-haw)"
      }
    ]
  },
  "song-1788898652202": {
    "en": [
      {
        "time": 8.8,
        "text": "Now he's thinkin' 'bout me every night, oh"
      },
      {
        "time": 12.3,
        "text": "Is it that sweet? I guess so"
      },
      {
        "time": 14.5,
        "text": "Say you can't sleep, baby, I know"
      },
      {
        "time": 16.9,
        "text": "That's that me espresso"
      },
      {
        "time": 19.1,
        "text": "Move it up, down, left, right, oh"
      },
      {
        "time": 21.5,
        "text": "Switch it up like Nintendo"
      },
      {
        "time": 23.8,
        "text": "Say you can't sleep, baby, I know"
      },
      {
        "time": 26.1,
        "text": "That's that me espresso"
      },
      {
        "time": 28.8,
        "text": "I can't relate to desperation"
      },
      {
        "time": 33.4,
        "text": "My give-a-fucks are on vacation"
      },
      {
        "time": 38.1,
        "text": "And I got this one boy, and he won't stop callin'"
      },
      {
        "time": 42.7,
        "text": "When they act this way, I know I got 'em"
      },
      {
        "time": 46.7,
        "text": "Too bad your ex don't do it for ya"
      },
      {
        "time": 49.1,
        "text": "Walked in and dream-came-trued it for ya"
      },
      {
        "time": 51.4,
        "text": "Soft skin and I perfumed it for ya"
      },
      {
        "time": 55.7,
        "text": "(Yes) I know, I Mountain Dew it for ya"
      },
      {
        "time": 57.9,
        "text": "(Yes) that morning coffee, brewed it for ya"
      },
      {
        "time": 60.3,
        "text": "(Yes) one touch and I brand-newed it for ya (oh)"
      },
      {
        "time": 64.2,
        "text": "Now he's thinkin' 'bout me every night, oh"
      },
      {
        "time": 67.7,
        "text": "Is it that sweet? I guess so"
      },
      {
        "time": 70,
        "text": "Say you can't sleep, baby, I know"
      },
      {
        "time": 72.4,
        "text": "That's that me espresso"
      },
      {
        "time": 74.5,
        "text": "Move it up, down, left, right, oh"
      },
      {
        "time": 76.9,
        "text": "Switch it up like Nintendo"
      },
      {
        "time": 79.1,
        "text": "Say you can't sleep, baby, I know"
      },
      {
        "time": 81.5,
        "text": "That's that me espresso"
      },
      {
        "time": 84.1,
        "text": "Holy shit"
      },
      {
        "time": 86.2,
        "text": "Is it that sweet? I guess so"
      },
      {
        "time": 88.9,
        "text": "I'm working late, 'cause I'm a singer"
      },
      {
        "time": 93.4,
        "text": "Oh, he looks so cute wrapped 'round my finger"
      },
      {
        "time": 98,
        "text": "My twisted humor makes him laugh so often"
      },
      {
        "time": 102.7,
        "text": "My honey bee, come and get this pollen"
      },
      {
        "time": 106.6,
        "text": "Too bad your ex don't do it for ya"
      },
      {
        "time": 108.9,
        "text": "Walked in and dream-came-trued it for ya"
      },
      {
        "time": 111.3,
        "text": "Soft skin and I perfumed it for ya"
      },
      {
        "time": 115.7,
        "text": "(Yes) I know, I Mountain Dew it for ya"
      },
      {
        "time": 117.9,
        "text": "(Yes) that morning coffee, brewed it for ya"
      },
      {
        "time": 120.1,
        "text": "(Yes) one touch and I brand-newed it for ya (stupid)"
      },
      {
        "time": 124.3,
        "text": "Now he's thinkin' 'bout me every night, oh"
      },
      {
        "time": 127.6,
        "text": "Is it that sweet? I guess so"
      },
      {
        "time": 130,
        "text": "Say you can't sleep, baby, I know"
      },
      {
        "time": 132.4,
        "text": "That's that me espresso"
      },
      {
        "time": 134.6,
        "text": "Move it up, down, left, right, oh"
      },
      {
        "time": 137,
        "text": "Switch it up like Nintendo"
      },
      {
        "time": 139.1,
        "text": "Say you can't sleep, baby, I know"
      },
      {
        "time": 141.6,
        "text": "That's that me espresso"
      },
      {
        "time": 143.9,
        "text": "Thinkin' 'bout me every night, oh"
      },
      {
        "time": 146.2,
        "text": "Is it that sweet? I guess so (yes)"
      },
      {
        "time": 148.4,
        "text": "Say you can't sleep, baby, I know"
      },
      {
        "time": 150.8,
        "text": "That's that me espresso (yes)"
      },
      {
        "time": 153.1,
        "text": "Move it up, down, left, right, oh"
      },
      {
        "time": 155.3,
        "text": "Switch it up like Nintendo (yes)"
      },
      {
        "time": 157.7,
        "text": "Say you can't sleep, baby, I know"
      },
      {
        "time": 160.1,
        "text": "That's that me espresso"
      },
      {
        "time": 164.7,
        "text": "Is it that sweet? I guess so, uh"
      },
      {
        "time": 169.1,
        "text": "That's that me espresso"
      }
    ]
  },
  "song-1788898531972": {
    "en": [
      {
        "time": 8.4,
        "text": "You, evergreen, the fire in my past"
      },
      {
        "time": 16.3,
        "text": "Can't run free if I keep looking back"
      },
      {
        "time": 23.8,
        "text": "It's a lost cause"
      },
      {
        "time": 25.9,
        "text": "It's a bad bet"
      },
      {
        "time": 28,
        "text": "It's a storm but, gotta face it"
      },
      {
        "time": 31.6,
        "text": "Oh, I"
      },
      {
        "time": 34.1,
        "text": "I love you but you let me down"
      },
      {
        "time": 38.7,
        "text": "Yeah, yeah, oh, I"
      },
      {
        "time": 41.3,
        "text": "I, I love you but you let me down"
      },
      {
        "time": 48.9,
        "text": "The last time for an eternity"
      },
      {
        "time": 57.1,
        "text": "You're only mine when I am on my feet"
      },
      {
        "time": 64.6,
        "text": "You're elusive, and it kills me"
      },
      {
        "time": 68.4,
        "text": "Inconclusive, never ending"
      },
      {
        "time": 72.2,
        "text": "Oh, I"
      },
      {
        "time": 73.7,
        "text": "I, I love you but you let me down"
      },
      {
        "time": 78.8,
        "text": "Yeah, yeah, oh, I"
      },
      {
        "time": 81.9,
        "text": "I, I love you but you let me down"
      },
      {
        "time": 88.9,
        "text": "And I'll go as fast as I can"
      },
      {
        "time": 91.9,
        "text": "No time for a moment to myself"
      },
      {
        "time": 96.8,
        "text": "And I'll go as fast as I can"
      },
      {
        "time": 100.2,
        "text": "I swear on my life, it's for the best"
      },
      {
        "time": 104.9,
        "text": "And I might call you, on your birthday"
      },
      {
        "time": 109.3,
        "text": "Cover words I wanted to say, with some small talk"
      },
      {
        "time": 115.4,
        "text": "And I'll tear up, but I'll go on"
      },
      {
        "time": 119.5,
        "text": "And I'll hang up before I can say"
      },
      {
        "time": 123.9,
        "text": "I love you, but you let me down, no, no"
      },
      {
        "time": 129.4,
        "text": "Oh, I, I"
      },
      {
        "time": 131.5,
        "text": "I, I love you but you let me down"
      },
      {
        "time": 137.9,
        "text": "And I'll go as fast as I can"
      },
      {
        "time": 140.9,
        "text": "No time for a moment to myself"
      },
      {
        "time": 145.8,
        "text": "And I'll go as fast as I can"
      },
      {
        "time": 149.1,
        "text": "I swear on my life it's for the best"
      },
      {
        "time": 153.9,
        "text": "Though our moment kept us waiting"
      },
      {
        "time": 157.8,
        "text": "I will keep it, keep it sacred"
      },
      {
        "time": 162.2,
        "text": "Like it's golden"
      },
      {
        "time": 164.1,
        "text": "Wish you nothing"
      },
      {
        "time": 166.2,
        "text": "But an exhale"
      },
      {
        "time": 168,
        "text": "And I'm hoping"
      },
      {
        "time": 169.8,
        "text": "You hear when I say"
      },
      {
        "time": 173,
        "text": "I never meant to let you down, oh"
      },
      {
        "time": 178.8,
        "text": "Oh, I"
      },
      {
        "time": 180.8,
        "text": "I love you but you let me down"
      }
    ]
  },
  "song-1788898362676": {
    "en": [
      {
        "time": 8.9,
        "text": "I live my day as if it was the last"
      },
      {
        "time": 11.6,
        "text": "Live my day as if there was no past"
      },
      {
        "time": 13.9,
        "text": "Doin' it all night, all summer"
      },
      {
        "time": 16.2,
        "text": "Doin' it the way I wanna"
      },
      {
        "time": 18.5,
        "text": "Yeah, I'ma dance my heart out 'til the dawn"
      },
      {
        "time": 21.1,
        "text": "But I won't be done when mornin' comes"
      },
      {
        "time": 23.8,
        "text": "Doin' it all night, all summer"
      },
      {
        "time": 26.2,
        "text": "Gonna spend it like no other"
      },
      {
        "time": 29.8,
        "text": "It was a crush, but I couldn't, couldn't get enough"
      },
      {
        "time": 34.5,
        "text": "It was a rush, but I gave it up"
      },
      {
        "time": 39.4,
        "text": "It was a crush, now I might've went and said too much"
      },
      {
        "time": 44.3,
        "text": "But that's all it was, so I gave it up"
      },
      {
        "time": 48.1,
        "text": "I live my day as if it was the last"
      },
      {
        "time": 50.6,
        "text": "Live my day as if there was no past"
      },
      {
        "time": 52.9,
        "text": "Doin' it all night, all summer"
      },
      {
        "time": 55.4,
        "text": "Doin' it the way I wanna"
      },
      {
        "time": 57.8,
        "text": "Yeah, I'ma dance my heart out 'til the dawn"
      },
      {
        "time": 60.4,
        "text": "But I won't be done when mornin' comes"
      },
      {
        "time": 62.8,
        "text": "Doin' it all night, all summer"
      },
      {
        "time": 65.4,
        "text": "Gonna spend it like no other"
      },
      {
        "time": 68.9,
        "text": "It was a crush, I kept sayin', \"I'ma stay in touch\""
      },
      {
        "time": 73.7,
        "text": "But that thing went bust, so I gave it up, ooh-ooh-ooh"
      },
      {
        "time": 78.7,
        "text": "No tricks, no bluff, I'm just better off without them cuffs"
      },
      {
        "time": 82.8,
        "text": "Yeah, the sun won't set on us, ooh-ooh-ooh, yeah, yeah"
      },
      {
        "time": 88.9,
        "text": "Went low, went high, still waters run dry"
      },
      {
        "time": 94.1,
        "text": "Gotta get back in the groove, I ain't ever worried"
      },
      {
        "time": 98.6,
        "text": "Went low, went high, what matters is now"
      },
      {
        "time": 103.8,
        "text": "Gettin' right back in the mood"
      },
      {
        "time": 106.8,
        "text": "I live my day as if it was the last"
      },
      {
        "time": 109.2,
        "text": "Live my day as if there was no past"
      },
      {
        "time": 111.8,
        "text": "Doin' it all night, all summer"
      },
      {
        "time": 114.4,
        "text": "Doin' it the way I wanna"
      },
      {
        "time": 116.5,
        "text": "Yeah, I'ma dance my heart out 'til the dawn"
      },
      {
        "time": 119.1,
        "text": "But I won't be done when mornin' comes"
      },
      {
        "time": 121.7,
        "text": "Doin' it all night, all summer"
      },
      {
        "time": 124,
        "text": "Gonna spend it like no other"
      },
      {
        "time": 127.4,
        "text": "Now I've found another crush"
      },
      {
        "time": 129.8,
        "text": "The lush life's given me a rush"
      },
      {
        "time": 132.2,
        "text": "Had one chance to make me blush"
      },
      {
        "time": 134.8,
        "text": "Second time is one too late"
      },
      {
        "time": 137.3,
        "text": "Now I've found another crush"
      },
      {
        "time": 139.4,
        "text": "The lush life's given me a rush"
      },
      {
        "time": 142.2,
        "text": "Had one chance to make me blush"
      },
      {
        "time": 144.5,
        "text": "Second time is one too late"
      },
      {
        "time": 146.4,
        "text": "Ooh-ooh"
      },
      {
        "time": 148.8,
        "text": "Ooh-ooh-ooh-whoa"
      },
      {
        "time": 151.3,
        "text": "Ooh-ooh"
      },
      {
        "time": 153.7,
        "text": "Ooh-ooh-ooh-whoa"
      },
      {
        "time": 155.7,
        "text": "I live my day as if it was the last"
      },
      {
        "time": 158.2,
        "text": "Live my day as if there was no past"
      },
      {
        "time": 160.7,
        "text": "Doin' it all night, all summer"
      },
      {
        "time": 163.2,
        "text": "Doin' it the way I wanna"
      },
      {
        "time": 165.6,
        "text": "Yeah, I'ma dance my heart out 'til the dawn"
      },
      {
        "time": 168.2,
        "text": "But I won't be done when mornin' comes"
      },
      {
        "time": 170.6,
        "text": "Doin' it all night, all summer"
      },
      {
        "time": 172.9,
        "text": "Gonna spend it like no other"
      },
      {
        "time": 176.3,
        "text": "Now I've found another crush"
      },
      {
        "time": 178.6,
        "text": "The lush life's given me a rush"
      },
      {
        "time": 181.2,
        "text": "Had one chance to make me blush"
      },
      {
        "time": 183.8,
        "text": "Second time is one too late"
      },
      {
        "time": 186,
        "text": "Now I've found another crush"
      },
      {
        "time": 188.5,
        "text": "The lush life's given me a rush"
      },
      {
        "time": 191,
        "text": "Had one chance to make me blush"
      },
      {
        "time": 193.4,
        "text": "Second time is one too late"
      }
    ]
  },
  "song-1788898241858": {
    "en": [
      {
        "time": 0.3,
        "text": "I'm mad at Disney, Disney"
      },
      {
        "time": 2.8,
        "text": "They tricked me, tricked me"
      },
      {
        "time": 4.7,
        "text": "Had me wishing on a shooting star"
      },
      {
        "time": 8.7,
        "text": "But now I'm twenty-something"
      },
      {
        "time": 11.2,
        "text": "I still know nothing"
      },
      {
        "time": 13.3,
        "text": "'Bout who I am or what I'm not"
      },
      {
        "time": 17.2,
        "text": "So call me a pessimist"
      },
      {
        "time": 19.6,
        "text": "But I don't believe in it"
      },
      {
        "time": 22,
        "text": "Finding a true love's kiss is bullsh-"
      },
      {
        "time": 25.2,
        "text": "'Cause I felt sad love, I felt bad love"
      },
      {
        "time": 29.7,
        "text": "Sometimes happy love (happy love)"
      },
      {
        "time": 31.8,
        "text": "Turns into giving up (giving up)"
      },
      {
        "time": 33.8,
        "text": "I felt hurt love 'bout the word love"
      },
      {
        "time": 38.2,
        "text": "What the hell is love supposed to feel like?"
      },
      {
        "time": 43.5,
        "text": "What the hell is love? What the hell is love?"
      },
      {
        "time": 46.7,
        "text": "What the hell is love supposed to feel like?"
      },
      {
        "time": 53.2,
        "text": "(Carry me away to a castle)"
      },
      {
        "time": 56.2,
        "text": "(Where we will live happily ever after)"
      },
      {
        "time": 59.2,
        "text": "My fairy grandma warned me"
      },
      {
        "time": 61.3,
        "text": "Cinderella's story only ended in a bad divorce"
      },
      {
        "time": 67.6,
        "text": "The prince ain't sleeping when he takes his sleeping beauty"
      },
      {
        "time": 72.1,
        "text": "To the motel on his snow white horse"
      },
      {
        "time": 76.1,
        "text": "So call me a pessimist"
      },
      {
        "time": 78.7,
        "text": "But I don't believe in it"
      },
      {
        "time": 80.8,
        "text": "Finding a true love's kiss is bullsh-"
      },
      {
        "time": 84.4,
        "text": "'Cause I felt sad love, I felt bad love"
      },
      {
        "time": 88.8,
        "text": "Sometimes happy love (happy love)"
      },
      {
        "time": 90.8,
        "text": "Turns into giving up (I'm giving up)"
      },
      {
        "time": 93.1,
        "text": "I felt hurt love 'bout the word love"
      },
      {
        "time": 97.3,
        "text": "What the hell is love supposed to feel like?"
      },
      {
        "time": 102.5,
        "text": "What the hell is love? What the hell is love?"
      },
      {
        "time": 105.5,
        "text": "What the hell is love supposed to feel like?"
      },
      {
        "time": 111,
        "text": "What the hell is love? What the hell is love?"
      },
      {
        "time": 114.1,
        "text": "What the hell is love supposed to feel like?"
      },
      {
        "time": 126.6,
        "text": "I'm mad at Disney, Disney"
      },
      {
        "time": 129,
        "text": "They tricked me, tricked me"
      },
      {
        "time": 131.1,
        "text": "No more wishing on a shooting star"
      }
    ]
  },
  "song-1788898077567": {
    "en": [
      {
        "time": 6.9,
        "text": "I didn't think you'd understand me"
      },
      {
        "time": 14.8,
        "text": "How could you ever even try?"
      },
      {
        "time": 22.9,
        "text": "I don't wanna tiptoe, but I don't wanna hide"
      },
      {
        "time": 27.2,
        "text": "But I don't wanna feed this monstrous fire"
      },
      {
        "time": 31.9,
        "text": "Just wanna let this story die"
      },
      {
        "time": 36,
        "text": "And I'll be alright"
      },
      {
        "time": 38.6,
        "text": "We can't be friends"
      },
      {
        "time": 41.7,
        "text": "But I'd like to just pretend"
      },
      {
        "time": 46.1,
        "text": "You cling to your papers and pens"
      },
      {
        "time": 50.1,
        "text": "Wait until you like me again"
      },
      {
        "time": 54.3,
        "text": "Wait for your love"
      },
      {
        "time": 57,
        "text": "Love, I'll wait for your love"
      },
      {
        "time": 64.7,
        "text": "Me and my truth, we sit in silence"
      },
      {
        "time": 72.7,
        "text": "Baby girl, it's just me and you"
      },
      {
        "time": 80.6,
        "text": "'Cause I don't wanna argue, but I don't wanna bite"
      },
      {
        "time": 85.2,
        "text": "My tongue, yeah, I think I'd rather die"
      },
      {
        "time": 89.8,
        "text": "You got me misunderstood, but at least I look this good"
      },
      {
        "time": 96.7,
        "text": "We can't be friends"
      },
      {
        "time": 99.7,
        "text": "But I'd like to just pretend"
      },
      {
        "time": 103.7,
        "text": "You cling to your papers and pens"
      },
      {
        "time": 108,
        "text": "Wait until you like me again"
      },
      {
        "time": 112.1,
        "text": "Wait for your love"
      },
      {
        "time": 115.1,
        "text": "Love, I'll wait for your love"
      },
      {
        "time": 119.5,
        "text": "I'll wait for your love"
      },
      {
        "time": 123.1,
        "text": "Love, I'll wait for your love"
      },
      {
        "time": 128.8,
        "text": "Know that you made me"
      },
      {
        "time": 132.7,
        "text": "I don't like how you paint me, yet I'm still here hanging"
      },
      {
        "time": 137.1,
        "text": "Not what you made me"
      },
      {
        "time": 141,
        "text": "It's something like a daydream"
      },
      {
        "time": 143.5,
        "text": "But I feel so seen in the night"
      },
      {
        "time": 147.8,
        "text": "So for now, it's only me"
      },
      {
        "time": 151.9,
        "text": "And maybe that's all I need"
      },
      {
        "time": 154.7,
        "text": "We can't be friends"
      },
      {
        "time": 157.5,
        "text": "But I'd like to just pretend"
      },
      {
        "time": 161.9,
        "text": "You cling to your papers and pens"
      },
      {
        "time": 165.9,
        "text": "Wait until you like me again"
      },
      {
        "time": 170.3,
        "text": "Wait for your love"
      },
      {
        "time": 172.9,
        "text": "Love, I'll wait for your love"
      },
      {
        "time": 177.7,
        "text": "I'll wait for your love"
      },
      {
        "time": 181.5,
        "text": "Love, I'll wait for your love"
      },
      {
        "time": 186.7,
        "text": "I'll wait for your love"
      },
      {
        "time": 190.1,
        "text": "I'll wait for your love"
      },
      {
        "time": 194.8,
        "text": "I'll wait for your love"
      },
      {
        "time": 198.8,
        "text": "I'll wait for your love"
      },
      {
        "time": 202.9,
        "text": "I'll wait for your love"
      }
    ]
  },
  "song-1788897827937": {
    "en": [
      {
        "time": 9.2,
        "text": "I was a liar"
      },
      {
        "time": 10.7,
        "text": "I gave in to the fire"
      },
      {
        "time": 12.6,
        "text": "I know I should've fought it"
      },
      {
        "time": 14.5,
        "text": "At least I'm bein' honest"
      },
      {
        "time": 16.9,
        "text": "Feel like a failure"
      },
      {
        "time": 18.4,
        "text": "'Cause I know that I failed you"
      },
      {
        "time": 20.3,
        "text": "I should've done you better"
      },
      {
        "time": 22.2,
        "text": "'Cause you don't want a liar"
      },
      {
        "time": 24.1,
        "text": "And I know"
      },
      {
        "time": 24.7,
        "text": "And I know"
      },
      {
        "time": 25.2,
        "text": "And I know she gives you everything"
      },
      {
        "time": 27,
        "text": "But boy, I couldn't give it to you"
      },
      {
        "time": 31.7,
        "text": "And I know"
      },
      {
        "time": 32.2,
        "text": "And I know"
      },
      {
        "time": 32.7,
        "text": "And I know that you got everything"
      },
      {
        "time": 34.7,
        "text": "But I got nothin' here without you"
      },
      {
        "time": 39.5,
        "text": "So one last time"
      },
      {
        "time": 42.4,
        "text": "I need to be the one who takes you home"
      },
      {
        "time": 47.4,
        "text": "One more time"
      },
      {
        "time": 50,
        "text": "I promise after that"
      },
      {
        "time": 52.7,
        "text": "I'll let you go"
      },
      {
        "time": 55.3,
        "text": "Baby, I don't care if you got her in your heart"
      },
      {
        "time": 59.1,
        "text": "All I really care is you wake up in my arms"
      },
      {
        "time": 62.8,
        "text": "One last time"
      },
      {
        "time": 65.4,
        "text": "I need to be the one who takes you home"
      },
      {
        "time": 70.6,
        "text": "I don't deserve it"
      },
      {
        "time": 72.1,
        "text": "I know I don't deserve it"
      },
      {
        "time": 74.1,
        "text": "But stay with me a minute"
      },
      {
        "time": 76,
        "text": "I swear I'll make it worth it"
      },
      {
        "time": 78.4,
        "text": "Can't you forgive me?"
      },
      {
        "time": 79.8,
        "text": "At least just temporarily"
      },
      {
        "time": 81.7,
        "text": "I know that this is my fault"
      },
      {
        "time": 83.7,
        "text": "I should've been more careful"
      },
      {
        "time": 85.6,
        "text": "And I know"
      },
      {
        "time": 86,
        "text": "And I know"
      },
      {
        "time": 86.6,
        "text": "And I know she gives you everything"
      },
      {
        "time": 88.4,
        "text": "But boy, I couldn't give it to you"
      },
      {
        "time": 93.2,
        "text": "And I know"
      },
      {
        "time": 93.7,
        "text": "And I know"
      },
      {
        "time": 94.2,
        "text": "And I know that you got everything"
      },
      {
        "time": 96.1,
        "text": "But I got nothin' here without you, baby"
      },
      {
        "time": 100.9,
        "text": "So one last time"
      },
      {
        "time": 103.7,
        "text": "I need to be the one who takes you home"
      },
      {
        "time": 108.8,
        "text": "One more time"
      },
      {
        "time": 111.5,
        "text": "I promise after that"
      },
      {
        "time": 114.1,
        "text": "I'll let you go"
      },
      {
        "time": 116.7,
        "text": "Baby, I don't care if you got her in your heart"
      },
      {
        "time": 120.6,
        "text": "All I really care is you wake up in my arms"
      },
      {
        "time": 124.2,
        "text": "One last time"
      },
      {
        "time": 126.8,
        "text": "I need to be the one who takes you home"
      },
      {
        "time": 133.2,
        "text": "(Yeah)"
      },
      {
        "time": 135.5,
        "text": "I know I should've fought it"
      },
      {
        "time": 137.4,
        "text": "At least I'm bein' honest, yeah"
      },
      {
        "time": 143.1,
        "text": "But stay with me a minute"
      },
      {
        "time": 145.1,
        "text": "I swear I'll make it worth it, yeah"
      },
      {
        "time": 149.9,
        "text": "'Cause I don't wanna be without you"
      },
      {
        "time": 154.6,
        "text": "So one last time"
      },
      {
        "time": 157.5,
        "text": "I need to be the one who takes you home (babe)"
      },
      {
        "time": 162.6,
        "text": "One more time"
      },
      {
        "time": 165.3,
        "text": "I promise after that"
      },
      {
        "time": 168,
        "text": "I'll let you go"
      },
      {
        "time": 170.5,
        "text": "Baby, I don't care if you got her in your heart (babe)"
      },
      {
        "time": 174.4,
        "text": "All I really care is you wake up in my arms"
      },
      {
        "time": 178,
        "text": "One last time"
      },
      {
        "time": 180.6,
        "text": "I need to be the one who takes you home, yeah"
      },
      {
        "time": 185.7,
        "text": "One last time"
      },
      {
        "time": 188.2,
        "text": "I need to be the one who takes you home"
      }
    ]
  },
  "song-1788897630185": {
    "en": [
      {
        "time": 0.4,
        "text": "Don't stay awake for too long"
      },
      {
        "time": 3.5,
        "text": "Don't go to bed"
      },
      {
        "time": 5.7,
        "text": "I'll make a cup of coffee for your head"
      },
      {
        "time": 8.8,
        "text": "I'll get you up and going out of bed"
      },
      {
        "time": 12.3,
        "text": "Yeah, I don't wanna fall asleep"
      },
      {
        "time": 14.5,
        "text": "I don't wanna pass away"
      },
      {
        "time": 16.2,
        "text": "I've been thinking of our future 'cause I'll never see those days"
      },
      {
        "time": 19.5,
        "text": "I don't know why this has happened, but I probably deserve it"
      },
      {
        "time": 23.1,
        "text": "I tried to do my best, but you know that I'm not perfect"
      },
      {
        "time": 26.3,
        "text": "I've been praying for forgiveness, you've been praying for my health"
      },
      {
        "time": 29.6,
        "text": "When I leave this earth, hoping you'll find someone else"
      },
      {
        "time": 32.6,
        "text": "'Cause, yeah, we're still young, there's so much we haven't done"
      },
      {
        "time": 36.2,
        "text": "Getting married, start a family, watch your husband with his son"
      },
      {
        "time": 39.5,
        "text": "I wish it could be me, but I won't make it off this bed"
      },
      {
        "time": 43,
        "text": "I hope I go to heaven, so I see you once again"
      },
      {
        "time": 46.3,
        "text": "My life was kinda short, but I got so many blessings"
      },
      {
        "time": 49.7,
        "text": "Happy you were mine, it sucks that it's all ending"
      },
      {
        "time": 53.3,
        "text": "Don't stay awake for too long"
      },
      {
        "time": 56.5,
        "text": "Don't go to bed"
      },
      {
        "time": 59,
        "text": "I'll make a cup of coffee for your head"
      },
      {
        "time": 62.1,
        "text": "I'll get you up and going out of bed, yeah"
      },
      {
        "time": 66.1,
        "text": "And I, don't stay awake for too long"
      },
      {
        "time": 70.1,
        "text": "Don't go to bed"
      },
      {
        "time": 72.3,
        "text": "I'll make a cup of coffee for your head"
      },
      {
        "time": 75.3,
        "text": "I'll get you up and going out of bed"
      },
      {
        "time": 78.9,
        "text": "Yeah, I'm happy that you're here with me"
      },
      {
        "time": 81.8,
        "text": "I'm sorry if I tear up"
      },
      {
        "time": 83.3,
        "text": "When me and you were younger, you would always make me cheer up"
      },
      {
        "time": 86.3,
        "text": "Taking goofy videos while walking through the park"
      },
      {
        "time": 89.7,
        "text": "You would jump into my arms every time you heard a bark"
      },
      {
        "time": 93.1,
        "text": "Cuddle in your sheets, sang me sound asleep"
      },
      {
        "time": 96.4,
        "text": "And sneak out through your kitchen at exactly 1:03"
      },
      {
        "time": 99.7,
        "text": "Sundays went to church, on Mondays watched a movie"
      },
      {
        "time": 103.3,
        "text": "Soon you'll be alone, sorry that you have to lose me"
      },
      {
        "time": 106.4,
        "text": "Don't stay awake for too long"
      },
      {
        "time": 109.9,
        "text": "Don't go to bed"
      },
      {
        "time": 112.2,
        "text": "I'll make a cup of coffee for your head"
      },
      {
        "time": 115.5,
        "text": "I'll get you up and going out of bed"
      },
      {
        "time": 119.2,
        "text": "And I, don't stay awake for too long"
      },
      {
        "time": 123.3,
        "text": "Don't go to bed"
      },
      {
        "time": 126.2,
        "text": "I'll make a cup of coffee for your head"
      },
      {
        "time": 129.3,
        "text": "I'll get you up and going out of bed"
      },
      {
        "time": 132.8,
        "text": "Don't stay awake for too long"
      },
      {
        "time": 136.6,
        "text": "Don't go to bed"
      },
      {
        "time": 139,
        "text": "I'll make a cup of coffee for your head"
      },
      {
        "time": 142.3,
        "text": "I'll get you up and going out of bed"
      },
      {
        "time": 145.8,
        "text": "And I, don't stay awake for too long"
      },
      {
        "time": 149.9,
        "text": "Don't go to bed"
      },
      {
        "time": 152.4,
        "text": "I'll make a cup of coffee for your head"
      },
      {
        "time": 155.7,
        "text": "I'll get you up and going out of bed"
      },
      {
        "time": 159.3,
        "text": "And I, don't stay awake for too long"
      },
      {
        "time": 163.4,
        "text": "Don't go to bed"
      },
      {
        "time": 165.7,
        "text": "I'll make a cup of coffee for your head"
      },
      {
        "time": 168.7,
        "text": "I'll get you up and going out of bed"
      }
    ]
  },
  "song-1788896867234": {
    "en": [
      {
        "time": 15.3,
        "text": "So I never really knew you"
      },
      {
        "time": 17.9,
        "text": "God, I really tried to"
      },
      {
        "time": 19.8,
        "text": "Blindsided, addicted"
      },
      {
        "time": 23.8,
        "text": "Felt we could really do this"
      },
      {
        "time": 25.8,
        "text": "But really I was foolish"
      },
      {
        "time": 27.7,
        "text": "Hindsight, it's obvious"
      },
      {
        "time": 31.9,
        "text": "Talking with my lawyer"
      },
      {
        "time": 33.4,
        "text": "She said, \"Where'd you find this guy?\""
      },
      {
        "time": 35.4,
        "text": "I said, \"Young people fall in love"
      },
      {
        "time": 37.7,
        "text": "With the wrong people sometimes\""
      },
      {
        "time": 40.4,
        "text": "Some mistakes get made"
      },
      {
        "time": 42,
        "text": "That's alright, that's okay"
      },
      {
        "time": 44.1,
        "text": "You can think that you're in love"
      },
      {
        "time": 45.9,
        "text": "When you're really just in pain"
      },
      {
        "time": 48.4,
        "text": "Some mistakes get made"
      },
      {
        "time": 49.8,
        "text": "That's alright, that's okay"
      },
      {
        "time": 51.8,
        "text": "In the end, it's better for me"
      },
      {
        "time": 53.8,
        "text": "That's the moral of the story, babe"
      },
      {
        "time": 56.7,
        "text": "(Oh-oh, oh-oh)"
      },
      {
        "time": 60.9,
        "text": "(Oh-oh, oh-oh)"
      },
      {
        "time": 64.4,
        "text": "It's funny how a memory"
      },
      {
        "time": 66.3,
        "text": "Turns into a bad dream"
      },
      {
        "time": 68.2,
        "text": "When running wild turns volatile"
      },
      {
        "time": 72.5,
        "text": "Remember how we painted our house"
      },
      {
        "time": 74.1,
        "text": "Just like my grandparents did?"
      },
      {
        "time": 75.7,
        "text": "So romantic, but we fought the whole time"
      },
      {
        "time": 78.6,
        "text": "Should have seen the signs, yeah"
      },
      {
        "time": 80.6,
        "text": "Talking with my mother"
      },
      {
        "time": 82,
        "text": "She said, \"Where'd you find this guy?\""
      },
      {
        "time": 84,
        "text": "Said, \"Some people fall in love"
      },
      {
        "time": 86.4,
        "text": "With the wrong people sometimes\""
      },
      {
        "time": 88.9,
        "text": "Some mistakes get made"
      },
      {
        "time": 90.5,
        "text": "That's alright, that's okay"
      },
      {
        "time": 92.5,
        "text": "You can think that you're in love"
      },
      {
        "time": 94.6,
        "text": "When you're really just in pain"
      },
      {
        "time": 97,
        "text": "Some mistakes get made"
      },
      {
        "time": 98.7,
        "text": "That's alright, that's okay"
      },
      {
        "time": 100.5,
        "text": "In the end it's better for me"
      },
      {
        "time": 102.7,
        "text": "That's the moral of the story, babe"
      },
      {
        "time": 105.5,
        "text": "(Oh-oh, oh-oh)"
      },
      {
        "time": 109.6,
        "text": "(Oh-oh, oh-oh)"
      },
      {
        "time": 113.5,
        "text": "(Oh-oh, oh-oh)"
      },
      {
        "time": 117.5,
        "text": "(Oh-oh, oh-oh)"
      },
      {
        "time": 120.2,
        "text": "They say it's better to have loved and lost"
      },
      {
        "time": 124.7,
        "text": "Than never to have loved at all"
      },
      {
        "time": 128.9,
        "text": "That could be a load of shit"
      },
      {
        "time": 132.8,
        "text": "But I just need to tell you all"
      },
      {
        "time": 138.6,
        "text": "Some mistakes get made"
      },
      {
        "time": 140.6,
        "text": "That's alright, that's okay"
      },
      {
        "time": 142.6,
        "text": "You can think that you're in love"
      },
      {
        "time": 144.5,
        "text": "When you're really just engaged"
      },
      {
        "time": 147.2,
        "text": "Some mistakes get made"
      },
      {
        "time": 148.7,
        "text": "That's alright, that's okay"
      },
      {
        "time": 150.5,
        "text": "In the end it's better for me"
      },
      {
        "time": 152.7,
        "text": "That's the moral of this story"
      },
      {
        "time": 155.1,
        "text": "Some mistakes get made"
      },
      {
        "time": 156.7,
        "text": "That's alright, that's okay"
      },
      {
        "time": 158.8,
        "text": "You can think that you're in love"
      },
      {
        "time": 160.7,
        "text": "When you're really just in pain"
      },
      {
        "time": 163.1,
        "text": "Some mistakes get made"
      },
      {
        "time": 164.5,
        "text": "That's alright, that's okay"
      },
      {
        "time": 166.6,
        "text": "In the end it's better for me"
      },
      {
        "time": 168.8,
        "text": "That's the moral of the story, babe"
      },
      {
        "time": 171.7,
        "text": "(Oh-oh, oh-oh)"
      },
      {
        "time": 175.7,
        "text": "(Oh-oh, oh-oh)"
      },
      {
        "time": 179.6,
        "text": "(Oh-oh, oh-oh)"
      },
      {
        "time": 183.6,
        "text": "Oh-oh, oh-oh (that's the moral of the story, that's the-)"
      },
      {
        "time": 187.7,
        "text": "(Oh-oh, oh-oh)"
      },
      {
        "time": 191.7,
        "text": "(Oh-oh, oh-oh)"
      }
    ]
  },
  "song-1788896720348": {
    "en": [
      {
        "time": 4.4,
        "text": "We broke up a month ago"
      },
      {
        "time": 8.1,
        "text": "Your friends are mine, you know, I know"
      },
      {
        "time": 12.1,
        "text": "You've moved on, found someone new"
      },
      {
        "time": 16.1,
        "text": "One more girl who brings out the better in you"
      },
      {
        "time": 21.2,
        "text": "And I thought my heart was detached"
      },
      {
        "time": 25.2,
        "text": "From all the sunlight of our past"
      },
      {
        "time": 29.5,
        "text": "But she's so sweet, she's so pretty"
      },
      {
        "time": 33.9,
        "text": "Does she mean you forgot about me?"
      },
      {
        "time": 37.6,
        "text": "Oh, I hope you're happy"
      },
      {
        "time": 42.1,
        "text": "But not like how you were with me"
      },
      {
        "time": 46.4,
        "text": "I'm selfish, I know, I can't let you go"
      },
      {
        "time": 50.6,
        "text": "So find someone great, but don't find no one better"
      },
      {
        "time": 55.2,
        "text": "I hope you're happy, but don't be happier"
      },
      {
        "time": 61.5,
        "text": "And do you tell her she's the most beautiful girl you've ever seen?"
      },
      {
        "time": 66.7,
        "text": "An eternal love bullshit you know you'll never mean"
      },
      {
        "time": 71.2,
        "text": "Remember when I believed you meant it when you said it first to me?"
      },
      {
        "time": 78.3,
        "text": "And now I'm picking her apart"
      },
      {
        "time": 82.5,
        "text": "Like cuttin' her down will make you miss my wretched heart"
      },
      {
        "time": 86.4,
        "text": "But she's beautiful, she looks kind"
      },
      {
        "time": 91,
        "text": "She probably gives you butterflies"
      },
      {
        "time": 95.5,
        "text": "I hope you're happy"
      },
      {
        "time": 99.5,
        "text": "But not like how you were with me"
      },
      {
        "time": 103.8,
        "text": "I'm selfish, I know, I can't let you go"
      },
      {
        "time": 108.1,
        "text": "So find someone great but don't find no one better"
      },
      {
        "time": 112.3,
        "text": "I hope you're happy"
      },
      {
        "time": 116.5,
        "text": "I wish you all the best, really"
      },
      {
        "time": 120.8,
        "text": "Say you love her, baby, just not like you loved me"
      },
      {
        "time": 125.1,
        "text": "And think of me fondly when your hands are on her"
      },
      {
        "time": 129.5,
        "text": "I hope you're happy, but don't be happier"
      },
      {
        "time": 135.6,
        "text": "Ooh, ooh-ooh"
      },
      {
        "time": 139.3,
        "text": "Ooh, ooh-ooh"
      },
      {
        "time": 146.5,
        "text": "Ooh-ooh, ooh, ooh, ooh"
      },
      {
        "time": 151.5,
        "text": "I hope you're happy"
      },
      {
        "time": 156,
        "text": "Just not like how you were with me"
      },
      {
        "time": 160.1,
        "text": "I'm selfish, I know, can't let you go"
      },
      {
        "time": 164.5,
        "text": "So find someone great, but don't find no one better"
      },
      {
        "time": 168.8,
        "text": "I hope you're happy, but don't be happier"
      }
    ]
  },
  "song-1788896607277": {
    "en": [
      {
        "time": 0,
        "text": "good 4 u (Explicit) - Olivia Rodrigo"
      },
      {
        "time": 2.2,
        "text": "Lyrics by：Daniel Nigro/Olivia Rodrigo"
      },
      {
        "time": 4.4,
        "text": "Composed by：Daniel Nigro/Olivia Rodrigo"
      },
      {
        "time": 6.6,
        "text": "Well good for you I guess you moved on really easily"
      },
      {
        "time": 9.4,
        "text": "You found a new girl and it only took a couple weeks"
      },
      {
        "time": 12.2,
        "text": "Remember when you said that you wanted to give me the world"
      },
      {
        "time": 17.8,
        "text": "And good for you I guess that you've been working on yourself"
      },
      {
        "time": 20.7,
        "text": "I guess that therapist I found for you she really helped"
      },
      {
        "time": 23.6,
        "text": "Now you can be a better man for your brand new girl"
      },
      {
        "time": 29.6,
        "text": "Well good for you"
      },
      {
        "time": 30.9,
        "text": "You look happy and healthy not me"
      },
      {
        "time": 33.4,
        "text": "If you ever cared to ask"
      },
      {
        "time": 35.5,
        "text": "Good for you"
      },
      {
        "time": 36.6,
        "text": "You're doing great out there without me baby"
      },
      {
        "time": 39.2,
        "text": "God I wish that I could do that"
      },
      {
        "time": 41.1,
        "text": "I've lost my mind"
      },
      {
        "time": 42.4,
        "text": "I've spent the night"
      },
      {
        "time": 43.8,
        "text": "Crying on the floor of my bathroom"
      },
      {
        "time": 46.8,
        "text": "But you're so unaffected I really don't get it"
      },
      {
        "time": 49.8,
        "text": "But I guess good for you"
      },
      {
        "time": 58.3,
        "text": "Well good for you I guess you're getting everything you want"
      },
      {
        "time": 61,
        "text": "You bought a new car and your career's really taking off"
      },
      {
        "time": 63.9,
        "text": "It's like we never even happened baby"
      },
      {
        "time": 65.7,
        "text": "What the fuck is up with that"
      },
      {
        "time": 69.5,
        "text": "And good for you it's like you never even met me"
      },
      {
        "time": 72.3,
        "text": "Remember when you swore to God I was the only"
      },
      {
        "time": 75,
        "text": "Person who ever got you"
      },
      {
        "time": 76.3,
        "text": "Well screw that and screw you"
      },
      {
        "time": 77.9,
        "text": "You will never have to hurt the way you know that I do"
      },
      {
        "time": 81.3,
        "text": "Well good for you"
      },
      {
        "time": 82.4,
        "text": "You look happy and healthy not me"
      },
      {
        "time": 84.9,
        "text": "If you ever cared to ask"
      },
      {
        "time": 87.1,
        "text": "Good for you"
      },
      {
        "time": 88.1,
        "text": "You're doing great out there without me baby"
      },
      {
        "time": 90.7,
        "text": "God I wish that I could do that"
      },
      {
        "time": 92.7,
        "text": "I've lost my mind"
      },
      {
        "time": 94,
        "text": "I've spent the night"
      },
      {
        "time": 95.4,
        "text": "Crying on the floor of my bathroom"
      },
      {
        "time": 98.4,
        "text": "But you're so unaffected I really don't get it"
      },
      {
        "time": 101.6,
        "text": "But I guess good for you"
      },
      {
        "time": 121.4,
        "text": "Maybe I'm too emotional"
      },
      {
        "time": 123.9,
        "text": "But your apathy's like a wound in salt"
      },
      {
        "time": 127,
        "text": "Maybe I'm too emotional"
      },
      {
        "time": 129.8,
        "text": "Or maybe you never cared at all"
      },
      {
        "time": 132.8,
        "text": "Maybe I'm too emotional"
      },
      {
        "time": 135.3,
        "text": "Your apathy's like a wound in salt"
      },
      {
        "time": 138.5,
        "text": "Maybe I'm too emotional"
      },
      {
        "time": 141.3,
        "text": "Or maybe you never cared at all"
      },
      {
        "time": 145.3,
        "text": "Well good for you"
      },
      {
        "time": 146,
        "text": "You look happy and healthy not me"
      },
      {
        "time": 148.6,
        "text": "If you ever cared to ask"
      },
      {
        "time": 150.7,
        "text": "Good for you"
      },
      {
        "time": 151.8,
        "text": "You're doing great out there without me baby"
      },
      {
        "time": 154.4,
        "text": "Like a damn sociopath"
      },
      {
        "time": 156.5,
        "text": "I've lost my mind"
      },
      {
        "time": 157.6,
        "text": "I've spent the night"
      },
      {
        "time": 159.1,
        "text": "Crying on the floor of my bathroom"
      },
      {
        "time": 162.1,
        "text": "But you're so unaffected I really don't get it"
      },
      {
        "time": 165.3,
        "text": "But I guess good for you"
      },
      {
        "time": 173.5,
        "text": "Well good for you I guess you moved on really easily"
      }
    ]
  },
  "song-1788896485158": {
    "en": [
      {
        "time": 19.2,
        "text": "Took a long vacation, no makeup, just JAY-Z"
      },
      {
        "time": 23.8,
        "text": "You were balls deep, now we beefin', had me butt-naked at the MGM"
      },
      {
        "time": 28.7,
        "text": "So wasted screamin', \"Fuck that,\" love me now, but I'm anythin'"
      },
      {
        "time": 33.6,
        "text": "Hurry now, baby, stick it in 'fore the memories get to kickin' in"
      },
      {
        "time": 38.1,
        "text": "It's too late, I don't wanna lose what's left of you"
      },
      {
        "time": 44.3,
        "text": "How am I supposed to deal with it?"
      },
      {
        "time": 46.7,
        "text": "I don't wanna see you with anyone but me"
      },
      {
        "time": 50.6,
        "text": "Nobody gets me like you"
      },
      {
        "time": 54,
        "text": "How am I supposed to let you go?"
      },
      {
        "time": 56.7,
        "text": "Only like myself when I'm with you"
      },
      {
        "time": 60.8,
        "text": "Nobody gets me, you do (do)"
      },
      {
        "time": 67.1,
        "text": "You do, nobody gets me, you do (do)"
      },
      {
        "time": 76.5,
        "text": "You do, nobody gets me, you do"
      },
      {
        "time": 86.2,
        "text": "You do, nobody gets me, you do"
      },
      {
        "time": 92,
        "text": "Took me out to the ballet"
      },
      {
        "time": 93.1,
        "text": "You proposеd, I went on the road"
      },
      {
        "time": 95.7,
        "text": "You was feelin' empty, so you lеft me"
      },
      {
        "time": 97.8,
        "text": "Now I'm stuck, dealin' with a deadbeat"
      },
      {
        "time": 100.6,
        "text": "If I'm real, I deserve less"
      },
      {
        "time": 103.1,
        "text": "If I was you, I wouldn't take me back"
      },
      {
        "time": 105.6,
        "text": "I pretend when I'm winnin' madness to you"
      },
      {
        "time": 109.1,
        "text": "And I know that it's too late"
      },
      {
        "time": 111.6,
        "text": "I don't wanna lose what's left of you"
      },
      {
        "time": 116.6,
        "text": "How am I supposed to deal with it?"
      },
      {
        "time": 119.1,
        "text": "I don't wanna see you with anyone but me"
      },
      {
        "time": 123,
        "text": "Nobody gets me like you"
      },
      {
        "time": 126.6,
        "text": "How am I supposed to let you go?"
      },
      {
        "time": 129,
        "text": "Only like myself when I'm with you"
      },
      {
        "time": 132.1,
        "text": "Nobody gets me, you do (do)"
      },
      {
        "time": 138.5,
        "text": "You do, nobody gets me, you do (do)"
      },
      {
        "time": 148.8,
        "text": "You do, nobody gets me, you do (do, ooh)"
      },
      {
        "time": 158.7,
        "text": "You do, nobody gets me, you do (do, ooh)"
      },
      {
        "time": 171,
        "text": "Nobody gets me, you do"
      }
    ]
  },
  "song-1788896348161": {
    "en": [
      {
        "time": 6.4,
        "text": "There's blood on the side of the mountain"
      },
      {
        "time": 10,
        "text": "There's writing all over the wall"
      },
      {
        "time": 13.5,
        "text": "Shadows of us are still dancin'"
      },
      {
        "time": 16.9,
        "text": "In every room and every hall"
      },
      {
        "time": 20.1,
        "text": "There's snow fallin' over the city"
      },
      {
        "time": 23.6,
        "text": "You thought that it would wash away"
      },
      {
        "time": 27.2,
        "text": "The bitter taste of my fury"
      },
      {
        "time": 30.2,
        "text": "And all of the messes you made"
      },
      {
        "time": 33.7,
        "text": "Yeah, you think that you got away"
      },
      {
        "time": 36.9,
        "text": "But I'm in the trees, I'm in the breeze"
      },
      {
        "time": 40.3,
        "text": "My footsteps on the ground"
      },
      {
        "time": 43.6,
        "text": "You see my face in every place"
      },
      {
        "time": 47.2,
        "text": "But you can't catch me now"
      },
      {
        "time": 50.4,
        "text": "Through wading grass, the months will pass"
      },
      {
        "time": 53.8,
        "text": "You'll feel it all around"
      },
      {
        "time": 57,
        "text": "I'm here, I'm there, I'm everywhеre"
      },
      {
        "time": 60.7,
        "text": "But you can't catch me now"
      },
      {
        "time": 64.1,
        "text": "No, you can't catch me now"
      },
      {
        "time": 71.2,
        "text": "Bеt you thought I'd never do it"
      },
      {
        "time": 74.4,
        "text": "Thought it'd go over my head"
      },
      {
        "time": 78.1,
        "text": "I bet you figured I'd pass with the winter"
      },
      {
        "time": 81,
        "text": "Be somethin' easy to forget"
      },
      {
        "time": 84.3,
        "text": "Oh, you think I'm gone 'cause I left"
      },
      {
        "time": 87.6,
        "text": "But I'm in the trees, I'm in the breeze"
      },
      {
        "time": 91,
        "text": "My footsteps on the ground"
      },
      {
        "time": 94.3,
        "text": "You see my face in every place"
      },
      {
        "time": 97.8,
        "text": "But you can't catch me now"
      },
      {
        "time": 101,
        "text": "Through wading grass, the months will pass"
      },
      {
        "time": 104.5,
        "text": "You'll feel it all around"
      },
      {
        "time": 107.8,
        "text": "I'm here, I'm there, I'm everywhere"
      },
      {
        "time": 111.4,
        "text": "But you can't catch me now"
      },
      {
        "time": 115,
        "text": "No, you can't catch me now"
      },
      {
        "time": 121.1,
        "text": "Ooh-ooh-ooh"
      },
      {
        "time": 124.3,
        "text": "Ooh-ooh-ooh"
      },
      {
        "time": 127.8,
        "text": "Ooh-ooh-ooh"
      },
      {
        "time": 131,
        "text": "Ooh-ooh-ooh-ooh-ooh-ooh-ooh"
      },
      {
        "time": 136.2,
        "text": "You can't, you can't catch me now"
      },
      {
        "time": 139.4,
        "text": "I'm comin' like a storm into your town"
      },
      {
        "time": 143,
        "text": "You can't, you can't catch me now"
      },
      {
        "time": 145.9,
        "text": "I'm higher than the hopes that you brought down"
      },
      {
        "time": 149.7,
        "text": "You can't, you can't catch me now"
      },
      {
        "time": 152.9,
        "text": "I'm comin' like a storm into your town"
      },
      {
        "time": 156.4,
        "text": "You can't, you can't catch me now"
      },
      {
        "time": 159.6,
        "text": "I'm higher than the hopes that you brought down"
      },
      {
        "time": 163.2,
        "text": "You can't, you can't catch me now"
      },
      {
        "time": 166.5,
        "text": "I'm comin' like a storm into your town"
      },
      {
        "time": 169.9,
        "text": "You can't, you can't catch me now"
      },
      {
        "time": 173.5,
        "text": "You can't, you can't, you can't"
      },
      {
        "time": 182.4,
        "text": "There's blood on the side of the mountain"
      },
      {
        "time": 185.8,
        "text": "It's turnin' a new shade of red"
      },
      {
        "time": 189.2,
        "text": "Yeah, sometimes the fire you founded"
      },
      {
        "time": 192.9,
        "text": "Don't burn the way you'd expect"
      },
      {
        "time": 196,
        "text": "Yeah, you thought that this was the end"
      }
    ]
  },
  "song-1788896183728": {
    "en": [
      {
        "time": 9,
        "text": "I said I wanted Thin Mints and you said you knew a guy"
      },
      {
        "time": 15.5,
        "text": "You showed up with a boombox and stars in your eyes"
      },
      {
        "time": 21.6,
        "text": "Who knew cuddling on trampolines could be so reckless?"
      },
      {
        "time": 28.3,
        "text": "We bonded over Black Eyed Peas and complicated exes"
      },
      {
        "time": 34.3,
        "text": "Fell so deeply into it"
      },
      {
        "time": 37.6,
        "text": "It was all so innocent"
      },
      {
        "time": 41.6,
        "text": "Now I'm a homewrecker, I'm a-"
      },
      {
        "time": 45,
        "text": "I got death threats filling up semi trucks"
      },
      {
        "time": 48.8,
        "text": "Tell me who I am, guess I don't have a choice"
      },
      {
        "time": 52,
        "text": "All because I liked-"
      },
      {
        "time": 54.8,
        "text": "I'm the hot topic on your tongue"
      },
      {
        "time": 58.1,
        "text": "I'm a rebound gettin' 'round stealin' from the young"
      },
      {
        "time": 61.9,
        "text": "Tell me who I am, guess I don't have a choice"
      },
      {
        "time": 65.2,
        "text": "All because I liked a boy"
      },
      {
        "time": 75.4,
        "text": "I'm not catastrophizing, everything's derailing"
      },
      {
        "time": 81.9,
        "text": "Was only tryna hold you close while your heart was failing"
      },
      {
        "time": 87.9,
        "text": "It's not internet illusion, just two kids going through it"
      },
      {
        "time": 93.9,
        "text": "You said, \"I'm too late to be your first love, but I'll always be your favorite\""
      },
      {
        "time": 102.1,
        "text": "Now I'm a homewrecker, I'm a-"
      },
      {
        "time": 105,
        "text": "I got death threats filling up semi trucks"
      },
      {
        "time": 108.6,
        "text": "Tell me who I am, guess I don't have a choice"
      },
      {
        "time": 112.2,
        "text": "All because I liked-"
      },
      {
        "time": 114.9,
        "text": "I'm the hot topic on your tongue"
      },
      {
        "time": 118,
        "text": "I'm a rebound gettin' 'round stealin' from the young"
      },
      {
        "time": 121.8,
        "text": "Tell me who I am, guess I don't have a choice"
      },
      {
        "time": 125.2,
        "text": "All because I liked a boy"
      },
      {
        "time": 138.3,
        "text": "All because I liked a boy"
      },
      {
        "time": 141.4,
        "text": "Fell so deeply into it"
      },
      {
        "time": 144.7,
        "text": "It was all so innocent"
      },
      {
        "time": 147.8,
        "text": "Dating boys with exes"
      },
      {
        "time": 150.9,
        "text": "No, I wouldn't recommend it"
      },
      {
        "time": 153.8,
        "text": "I'm a homewrecker, I'm a-"
      },
      {
        "time": 157.2,
        "text": "I got death threats filling up semi trucks"
      },
      {
        "time": 160.7,
        "text": "Tell me who I am, guess I don't have a choice"
      },
      {
        "time": 163.8,
        "text": "All because I liked a boy"
      },
      {
        "time": 168.2,
        "text": "And all of this, for what?"
      },
      {
        "time": 170.3,
        "text": "When everything went down"
      },
      {
        "time": 171.6,
        "text": "We'd already broken up"
      },
      {
        "time": 173.1,
        "text": "Please, tell me who I am, guess I don't have a choice"
      },
      {
        "time": 176.8,
        "text": "All because I liked a boy"
      },
      {
        "time": 180.9,
        "text": "Ah-ah (a boy)"
      },
      {
        "time": 184.3,
        "text": "Ah-ah (a boy)"
      },
      {
        "time": 187.6,
        "text": "Ah"
      },
      {
        "time": 189.8,
        "text": "All because I liked a boy"
      }
    ]
  },
  "song-1788895968953": {
    "en": [
      {
        "time": 14.5,
        "text": "I hate to give the satisfaction askin' how you're doin' now"
      },
      {
        "time": 18.4,
        "text": "How's the castle built off people you pretend to care about?"
      },
      {
        "time": 21.8,
        "text": "Just what you wanted"
      },
      {
        "time": 24.7,
        "text": "Look at you, cool guy, you got it"
      },
      {
        "time": 28.9,
        "text": "I see the parties and the diamonds sometimes when I close my eyes"
      },
      {
        "time": 32.3,
        "text": "Six months of torture you sold as some forbidden paradise"
      },
      {
        "time": 36,
        "text": "I loved you truly"
      },
      {
        "time": 38.8,
        "text": "You gotta laugh at the stupidity"
      },
      {
        "time": 41.5,
        "text": "'Cause I've made some real big mistakes"
      },
      {
        "time": 44.9,
        "text": "But you make the worst one look fine"
      },
      {
        "time": 48.7,
        "text": "I should've known it was strange"
      },
      {
        "time": 52.3,
        "text": "You only come out at night"
      },
      {
        "time": 55.9,
        "text": "I used to think I was smart"
      },
      {
        "time": 59.1,
        "text": "But you made me look so naïve"
      },
      {
        "time": 63,
        "text": "The way you sold me for parts"
      },
      {
        "time": 66.3,
        "text": "As you sunk your teeth into me, oh"
      },
      {
        "time": 71.2,
        "text": "Bloodsucker, fame-fucker"
      },
      {
        "time": 75.1,
        "text": "Bleedin' me dry like a goddamn vampire"
      },
      {
        "time": 78.4,
        "text": "♪"
      },
      {
        "time": 82.1,
        "text": "And every girl I ever talked to, told me you were bad, bad news"
      },
      {
        "time": 85.9,
        "text": "You called them crazy, God, I hate the way I called them crazy too"
      },
      {
        "time": 89.2,
        "text": "You're so convincin'"
      },
      {
        "time": 91.8,
        "text": "How do you lie without flinchin'? (How do you lie? How do you lie? How do you lie?)"
      },
      {
        "time": 95.7,
        "text": "Ooh, what a mesmerizin', paralyzin', fucked-up little thrill"
      },
      {
        "time": 99.7,
        "text": "Can't figure out just how you do it, and God knows I never will"
      },
      {
        "time": 103.3,
        "text": "Went for me, and not her"
      },
      {
        "time": 106,
        "text": "'Cause girls your age know better"
      },
      {
        "time": 108.7,
        "text": "I've made some real big mistakes"
      },
      {
        "time": 111.9,
        "text": "But you make the worst one look fine"
      },
      {
        "time": 115.6,
        "text": "I should've known it was strange"
      },
      {
        "time": 118.9,
        "text": "You only come out at night"
      },
      {
        "time": 122.6,
        "text": "I used to think I was smart"
      },
      {
        "time": 125.7,
        "text": "But you made me look so naïve"
      },
      {
        "time": 129.4,
        "text": "The way you sold me for parts"
      },
      {
        "time": 132.8,
        "text": "As you sunk your teeth into me, oh"
      },
      {
        "time": 137.5,
        "text": "Bloodsucker, fame-fucker"
      },
      {
        "time": 141.2,
        "text": "Bleedin' me dry like a goddamn vampire"
      },
      {
        "time": 145.8,
        "text": "♪"
      },
      {
        "time": 151.9,
        "text": "You said it was true love, but wouldn't that be hard?"
      },
      {
        "time": 155.1,
        "text": "You can't love anyone, 'cause that would mean you had a heart"
      },
      {
        "time": 158.9,
        "text": "I tried you help you out, now I know that I can't"
      },
      {
        "time": 162.2,
        "text": "'Cause how you think's the kind of thing I'll never understand"
      },
      {
        "time": 167.8,
        "text": "♪"
      },
      {
        "time": 171.1,
        "text": "I've made some real big mistakes"
      },
      {
        "time": 174,
        "text": "But you make the worst one look fine"
      },
      {
        "time": 178.1,
        "text": "I should've known it was strange"
      },
      {
        "time": 181.4,
        "text": "You only come out at night"
      },
      {
        "time": 184.9,
        "text": "I used to think I was smart"
      },
      {
        "time": 188.1,
        "text": "But you made me look so naïve"
      },
      {
        "time": 191.6,
        "text": "The way you sold me for parts"
      },
      {
        "time": 194.9,
        "text": "As you sunk your teeth into me, oh"
      },
      {
        "time": 199.6,
        "text": "Bloodsucker, fame-fucker"
      },
      {
        "time": 203.5,
        "text": "Bleedin' me dry like a goddamn vampire"
      }
    ]
  },
  "song-1788895797269": {
    "en": [
      {
        "time": 15.9,
        "text": "I know that the bar closes at 11"
      },
      {
        "time": 23.4,
        "text": "I hope you never finish that beer"
      },
      {
        "time": 30.8,
        "text": "You know all the words to “Just Like Heaven”"
      },
      {
        "time": 36.2,
        "text": "And I know why he wrote them"
      },
      {
        "time": 38.9,
        "text": "Now that you’re standing right here"
      },
      {
        "time": 44.7,
        "text": "Ohh"
      },
      {
        "time": 45.6,
        "text": "One night I was bored in bed"
      },
      {
        "time": 48.9,
        "text": "And stalked you on the internet"
      },
      {
        "time": 52.7,
        "text": "It’s feminine intuition"
      },
      {
        "time": 56.2,
        "text": "‘Cuz I always had a vision of us standing like this"
      },
      {
        "time": 60.1,
        "text": "All pressed up in the bathroom line"
      },
      {
        "time": 63.7,
        "text": "You’re looking like an angel on the walls of Versailles"
      },
      {
        "time": 67.4,
        "text": "The most alive I’ve ever been"
      },
      {
        "time": 71.2,
        "text": "But kiss me and I might drop dead"
      },
      {
        "time": 82.7,
        "text": "And I feel like I might throw up"
      },
      {
        "time": 84.4,
        "text": "Left hook, right punch to the gut"
      },
      {
        "time": 86.3,
        "text": "You’re so so pretty boy"
      },
      {
        "time": 87.7,
        "text": "I’m paranoid I made you up"
      },
      {
        "time": 89.8,
        "text": "Yeah I’d love it if you walked me home"
      },
      {
        "time": 91.8,
        "text": "If you promised we could go real slow"
      },
      {
        "time": 93.8,
        "text": "‘Cuz I got chewing gum"
      },
      {
        "time": 95.3,
        "text": "And a bunch of stuff I’d like to know"
      },
      {
        "time": 96.9,
        "text": "Like, have you ever been to Japan?"
      },
      {
        "time": 99,
        "text": "Or taken that Eurostar to France?"
      },
      {
        "time": 101,
        "text": "I’ve been dropping hints all night"
      },
      {
        "time": 102.3,
        "text": "That I’d love it if you held my hand, goddamn"
      },
      {
        "time": 104.8,
        "text": "And then maybe we could make-makeout"
      },
      {
        "time": 106.6,
        "text": "Clothes off and fall to the ground"
      },
      {
        "time": 108.3,
        "text": "Let’s go steady"
      },
      {
        "time": 109.1,
        "text": "Let’s go out"
      },
      {
        "time": 110.1,
        "text": "And tell the whole damn world how"
      },
      {
        "time": 112,
        "text": "One night I was bored in bed"
      },
      {
        "time": 115.2,
        "text": "And stalked you on the internet"
      },
      {
        "time": 118.9,
        "text": "It’s feminine intuition"
      },
      {
        "time": 122.5,
        "text": "‘Cuz I always had a vision of us standing like this"
      },
      {
        "time": 126.2,
        "text": "All pressed up in the bathroom line"
      },
      {
        "time": 129.9,
        "text": "You’re looking like an angel on the walls of Versailles"
      },
      {
        "time": 133.6,
        "text": "The most alive I’ve ever been"
      },
      {
        "time": 137.3,
        "text": "But kiss me and I might"
      },
      {
        "time": 141.5,
        "text": "Pisces and a Gemini"
      },
      {
        "time": 144.7,
        "text": "But I think we might go really nice together"
      },
      {
        "time": 148.7,
        "text": "If you let me stay the night"
      },
      {
        "time": 152,
        "text": "Well I think I might just have to stay forever"
      },
      {
        "time": 156.2,
        "text": "Pisces and a Gemini"
      },
      {
        "time": 159.4,
        "text": "But I think we might go really nice together"
      },
      {
        "time": 163.5,
        "text": "If you let me stay the night"
      },
      {
        "time": 166.8,
        "text": "Well I think I might just have to stay forever"
      },
      {
        "time": 184.6,
        "text": "Ohh"
      },
      {
        "time": 185.8,
        "text": "One night I was bored in bed"
      },
      {
        "time": 189.1,
        "text": "And stalked you on the internet"
      },
      {
        "time": 192.9,
        "text": "It’s feminine intuition"
      },
      {
        "time": 196.4,
        "text": "‘Cuz I always had a vision of us standing like this"
      },
      {
        "time": 200.2,
        "text": "All pressed up in the bathroom line"
      },
      {
        "time": 203.9,
        "text": "You’re looking like an angel on the walls of Versailles"
      },
      {
        "time": 207.7,
        "text": "The most alive I’ve ever been"
      },
      {
        "time": 211,
        "text": "But kiss me and I might"
      },
      {
        "time": 215,
        "text": "Kiss me and I might"
      },
      {
        "time": 219,
        "text": "Kiss me and I might drop dead"
      }
    ]
  },
  "song-1788895623496": {
    "en": [
      {
        "time": 10.7,
        "text": "Car rides to Malibu"
      },
      {
        "time": 15.1,
        "text": "Strawberry ice cream, one spoon for two"
      },
      {
        "time": 20.4,
        "text": "And tradin' jackets"
      },
      {
        "time": 23.9,
        "text": "Laughin' 'bout how small it looks on you"
      },
      {
        "time": 27.6,
        "text": "(Ha-ha, ha-ha, ha-ha, ha-ha-ha, ha-ha, ha-ha)"
      },
      {
        "time": 32.1,
        "text": "Watchin' reruns of Glee"
      },
      {
        "time": 36.4,
        "text": "Bein' annoyin', singin' in harmony"
      },
      {
        "time": 41.8,
        "text": "I bet she's braggin'"
      },
      {
        "time": 45.2,
        "text": "To all her friends, sayin' you're so unique, hm"
      },
      {
        "time": 51.7,
        "text": "So when you gonna tell her that we did that, too?"
      },
      {
        "time": 57.5,
        "text": "She thinks it's special, but it's all reused"
      },
      {
        "time": 62.7,
        "text": "That was our place, I found it first"
      },
      {
        "time": 65.3,
        "text": "I made the jokes you tell to her when she's with you"
      },
      {
        "time": 71.4,
        "text": "Do you get déjà vu when she's with you?"
      },
      {
        "time": 76.7,
        "text": "Do you get déjà vu? Ah, hm"
      },
      {
        "time": 82.2,
        "text": "Do you get déjà vu, huh?"
      },
      {
        "time": 95.1,
        "text": "Do you call her, almost say my name?"
      },
      {
        "time": 99.8,
        "text": "'Cause let's be honest, we kinda do sound the same"
      },
      {
        "time": 105.1,
        "text": "Another actress"
      },
      {
        "time": 108.5,
        "text": "I hate to think that I was just your type"
      },
      {
        "time": 115.8,
        "text": "And I bet that she knows Billy Joel"
      },
      {
        "time": 119,
        "text": "'Cause you played her \"Uptown Girl\""
      },
      {
        "time": 121.6,
        "text": "You're singin' it together"
      },
      {
        "time": 123.9,
        "text": "Now I bet you even tell her how you love her"
      },
      {
        "time": 129.7,
        "text": "In between the chorus and the verse (ooh) (I love you)"
      },
      {
        "time": 136.4,
        "text": "So when you gonna tell her that we did that, too?"
      },
      {
        "time": 142,
        "text": "She thinks it's special, but it's all reused"
      },
      {
        "time": 147.3,
        "text": "That was the show we talked about"
      },
      {
        "time": 150.2,
        "text": "Played you the song she's singing now when she's with you"
      },
      {
        "time": 156.3,
        "text": "Do you get déjà vu when she's with you?"
      },
      {
        "time": 161.6,
        "text": "Do you get déjà vu? (Oh-oh)"
      },
      {
        "time": 166.8,
        "text": "Do you get déjà vu?"
      },
      {
        "time": 169.6,
        "text": "Strawberry ice cream in Malibu"
      },
      {
        "time": 172.1,
        "text": "Don't act like we didn't do all that too"
      },
      {
        "time": 174.9,
        "text": "You're tradin' jackets like we used to do"
      },
      {
        "time": 177.3,
        "text": "(Yeah, everything is all reused)"
      },
      {
        "time": 180.2,
        "text": "Play her piano, but she doesn't know (oh-oh)"
      },
      {
        "time": 182.7,
        "text": "That I was the one who taught you, Billy Joel"
      },
      {
        "time": 185.4,
        "text": "A different girl now, but there's nothing new"
      },
      {
        "time": 188.2,
        "text": "I know you get déjà vu"
      },
      {
        "time": 198.8,
        "text": "I know you get déjà vu"
      },
      {
        "time": 209.4,
        "text": "I know you get déjà vu"
      }
    ]
  },
  "song-1788895511563": {
    "en": [
      {
        "time": 21,
        "text": "When I was younger, I saw my daddy cry"
      },
      {
        "time": 27.3,
        "text": "And curse at the wind"
      },
      {
        "time": 31.4,
        "text": "He broke his own heart and I watched"
      },
      {
        "time": 35.5,
        "text": "As he tried to reassemble it"
      },
      {
        "time": 41.7,
        "text": "And my momma swore"
      },
      {
        "time": 44.1,
        "text": "That she would never let herself forget"
      },
      {
        "time": 52.4,
        "text": "And that was the day that I promised"
      },
      {
        "time": 56.2,
        "text": "I'd never sing of love if it does not exist"
      },
      {
        "time": 61.6,
        "text": "But darling, you are the only exception"
      },
      {
        "time": 67.8,
        "text": "You are the only exception"
      },
      {
        "time": 73.2,
        "text": "You are the only exception"
      },
      {
        "time": 78.3,
        "text": "You are the only exception"
      },
      {
        "time": 89.2,
        "text": "Maybe I know somewhere deep in my soul"
      },
      {
        "time": 95.2,
        "text": "That love never lasts"
      },
      {
        "time": 99.2,
        "text": "And we've got to find other ways to make it alone"
      },
      {
        "time": 105.5,
        "text": "Or keep a straight face"
      },
      {
        "time": 109.7,
        "text": "And I've always lived like this"
      },
      {
        "time": 113.6,
        "text": "Keeping a comfortable distance"
      },
      {
        "time": 120.3,
        "text": "And up until now I had sworn to myself"
      },
      {
        "time": 124.8,
        "text": "That I'm content with loneliness"
      },
      {
        "time": 130.2,
        "text": "Because none of it was ever worth the risk"
      },
      {
        "time": 133.2,
        "text": "But you are the only exception"
      },
      {
        "time": 138.3,
        "text": "You are the only exception"
      },
      {
        "time": 143.5,
        "text": "You are the only exception"
      },
      {
        "time": 149,
        "text": "You are the only exception"
      },
      {
        "time": 174.4,
        "text": "I've got a tight grip on reality"
      },
      {
        "time": 177.8,
        "text": "But I can't let go of what's in front of me here"
      },
      {
        "time": 185,
        "text": "I know you're leaving in the morning when you wake up"
      },
      {
        "time": 190.2,
        "text": "Leave me with some kind of proof it's not a dream"
      },
      {
        "time": 201.2,
        "text": "You are the only exception"
      },
      {
        "time": 206.2,
        "text": "You are the only exception"
      },
      {
        "time": 211.3,
        "text": "You are the only exception"
      },
      {
        "time": 216.5,
        "text": "You are the only exception"
      },
      {
        "time": 221.9,
        "text": "You are the only exception"
      },
      {
        "time": 227.1,
        "text": "You are the only exception"
      },
      {
        "time": 232.5,
        "text": "You are the only exception"
      },
      {
        "time": 237.5,
        "text": "You are the only exception"
      },
      {
        "time": 242.9,
        "text": "And I'm on my way to believing"
      },
      {
        "time": 252.2,
        "text": "Oh, and I'm on my way to believing"
      }
    ]
  },
  "song-1788895392534": {
    "en": [
      {
        "time": 9.6,
        "text": "Ooh-ooh"
      },
      {
        "time": 14.4,
        "text": "Hey"
      },
      {
        "time": 19.2,
        "text": "Closed off from love, I didn't need the pain"
      },
      {
        "time": 23.9,
        "text": "Once or twice was enough and it was all in vain"
      },
      {
        "time": 28.2,
        "text": "Time starts to pass, before you know it you're frozen, ooh"
      },
      {
        "time": 37.1,
        "text": "But something happened for the very first time with you"
      },
      {
        "time": 42,
        "text": "My heart melted to the ground found somethin' true"
      },
      {
        "time": 46.6,
        "text": "And everyone's looking 'round thinking I'm going crazy, ooh I"
      },
      {
        "time": 56,
        "text": "But I don't care what they say"
      },
      {
        "time": 58.3,
        "text": "I'm in love with you"
      },
      {
        "time": 60.5,
        "text": "They try to pull me away"
      },
      {
        "time": 63.1,
        "text": "But they don't know the truth"
      },
      {
        "time": 65.4,
        "text": "My heart's crippled by the vein that I keep on closing"
      },
      {
        "time": 72,
        "text": "You cut me open and I"
      },
      {
        "time": 74.6,
        "text": "Keep bleeding"
      },
      {
        "time": 76.2,
        "text": "Keep, keep bleeding love"
      },
      {
        "time": 79,
        "text": "I keep bleeding"
      },
      {
        "time": 80.4,
        "text": "I keep, keep bleeding love"
      },
      {
        "time": 83.4,
        "text": "Keep bleeding"
      },
      {
        "time": 85.2,
        "text": "Keep, keep bleeding love"
      },
      {
        "time": 90.5,
        "text": "You cut me open"
      },
      {
        "time": 96.9,
        "text": "Trying hard not to hear, but they talk so loud"
      },
      {
        "time": 101.9,
        "text": "Their piercing sounds fill my ears, try to fill me with doubt"
      },
      {
        "time": 106.5,
        "text": "Yet I know that their goal is to keep me from falling, hey yeah, mmh"
      },
      {
        "time": 115.7,
        "text": "But nothing's greater than the risk that comes with your embrace"
      },
      {
        "time": 120.3,
        "text": "And in this world of loneliness, I see your face"
      },
      {
        "time": 125.2,
        "text": "Yet everyone around me thinks that I'm going crazy"
      },
      {
        "time": 131.1,
        "text": "Maybe, maybe"
      },
      {
        "time": 134.2,
        "text": "But I don't care what they say"
      },
      {
        "time": 137.1,
        "text": "I'm in love with you"
      },
      {
        "time": 138.9,
        "text": "They try to pull me away"
      },
      {
        "time": 141.1,
        "text": "But they don't know the truth"
      },
      {
        "time": 143.2,
        "text": "My heart's crippled by the vein that I keep on closing"
      },
      {
        "time": 150.6,
        "text": "You cut me open and I"
      },
      {
        "time": 153,
        "text": "Keep bleeding"
      },
      {
        "time": 154.4,
        "text": "Keep, keep bleeding love"
      },
      {
        "time": 157.3,
        "text": "I keep bleeding"
      },
      {
        "time": 158.6,
        "text": "I keep, keep bleeding love"
      },
      {
        "time": 162.3,
        "text": "Keep bleeding"
      },
      {
        "time": 163.1,
        "text": "Keep, keep bleeding love"
      },
      {
        "time": 169,
        "text": "You cut me open, mmh"
      },
      {
        "time": 172.8,
        "text": "And it's draining all of me"
      },
      {
        "time": 177.5,
        "text": "Though they find it hard to believe"
      },
      {
        "time": 181.8,
        "text": "I'll be wearing these scars for everyone to see"
      },
      {
        "time": 189.9,
        "text": "I don't care what they say"
      },
      {
        "time": 192.2,
        "text": "I'm in love with you"
      },
      {
        "time": 194.6,
        "text": "They try to pull me away"
      },
      {
        "time": 196.7,
        "text": "But they don't know the truth"
      },
      {
        "time": 199.1,
        "text": "My heart's crippled by the vein that I keep on closing"
      },
      {
        "time": 205.5,
        "text": "Ooh, you cut me open and I"
      },
      {
        "time": 208.7,
        "text": "Keep bleeding"
      },
      {
        "time": 210,
        "text": "Keep, keep bleeding love"
      },
      {
        "time": 212.7,
        "text": "I keep bleeding"
      },
      {
        "time": 214.3,
        "text": "I keep, keep bleeding love"
      },
      {
        "time": 217.3,
        "text": "Keep bleeding"
      },
      {
        "time": 218.6,
        "text": "Keep, keep bleeding love"
      },
      {
        "time": 223.4,
        "text": "Oh, you cut me open and I"
      },
      {
        "time": 227,
        "text": "Keep bleeding"
      },
      {
        "time": 228.3,
        "text": "Keep, keep bleeding love"
      },
      {
        "time": 231.2,
        "text": "I keep bleeding"
      },
      {
        "time": 232.6,
        "text": "I keep, keep bleeding love (I keep bleeding in love)"
      },
      {
        "time": 236.3,
        "text": "Keep bleeding"
      },
      {
        "time": 237.7,
        "text": "Keep, keep bleeding love"
      },
      {
        "time": 242.6,
        "text": "Ooh, you cut me open and I"
      },
      {
        "time": 245.5,
        "text": "Keep bleeding"
      },
      {
        "time": 247.4,
        "text": "Keep, keep bleeding love"
      }
    ]
  },
  "song-1788895254830": {
    "en": [
      {
        "time": 1,
        "text": "(Ah, ah, ah-ah-ah-ah-ah)"
      },
      {
        "time": 6.2,
        "text": "(Ah-ah, ah-ah-ah-ah-ah)"
      },
      {
        "time": 9.4,
        "text": "(Ah, ah, ah-ah-ah-ah-ah)"
      },
      {
        "time": 14.7,
        "text": "(Ah-ah, ah-ah-ah-ah-ah)"
      },
      {
        "time": 17.9,
        "text": "I was listenin' to the ocean"
      },
      {
        "time": 21.8,
        "text": "I saw a face in the sand"
      },
      {
        "time": 25.4,
        "text": "But when I picked it up"
      },
      {
        "time": 27.7,
        "text": "Then it vanished away from my hands, dah"
      },
      {
        "time": 34.4,
        "text": "I had a dream, I was seven"
      },
      {
        "time": 38.2,
        "text": "Climbin' my way in a tree"
      },
      {
        "time": 42,
        "text": "I saw a piece of Heaven"
      },
      {
        "time": 44.7,
        "text": "Waitin' in patience for me, dah"
      },
      {
        "time": 51,
        "text": "And I was runnin' far away"
      },
      {
        "time": 53.2,
        "text": "Would I run off the world someday?"
      },
      {
        "time": 55.7,
        "text": "Nobody knows, nobody knows"
      },
      {
        "time": 59.3,
        "text": "And I was dancing in the rain"
      },
      {
        "time": 61.6,
        "text": "I felt alive and I can't complain"
      },
      {
        "time": 64.1,
        "text": "But no, take me home"
      },
      {
        "time": 65.7,
        "text": "Take me home where I belong"
      },
      {
        "time": 70.2,
        "text": "I can't take it anymore"
      },
      {
        "time": 76.2,
        "text": "I was painting a picture"
      },
      {
        "time": 80.3,
        "text": "The picture was a painting of you"
      },
      {
        "time": 82.9,
        "text": "And for a moment I thought you were here"
      },
      {
        "time": 86.9,
        "text": "But then again, it wasn't true, dah"
      },
      {
        "time": 92.6,
        "text": "And all this time I have been lyin'"
      },
      {
        "time": 96.2,
        "text": "Oh, lyin' in secret to myself"
      },
      {
        "time": 100.5,
        "text": "I've been putting sorrow on the farthest place on my shelf"
      },
      {
        "time": 106.2,
        "text": "La-di-da"
      },
      {
        "time": 109.5,
        "text": "And I was runnin' far away"
      },
      {
        "time": 111.5,
        "text": "Would I run off the world someday?"
      },
      {
        "time": 114,
        "text": "Nobody knows, nobody knows"
      },
      {
        "time": 117.5,
        "text": "And I was dancing in the rain"
      },
      {
        "time": 119.7,
        "text": "I felt alive and I can't complain"
      },
      {
        "time": 122.3,
        "text": "But no, take me home"
      },
      {
        "time": 124.4,
        "text": "Take me home where I belong"
      },
      {
        "time": 128.2,
        "text": "I got no other place to go"
      },
      {
        "time": 130.9,
        "text": "No, take me home"
      },
      {
        "time": 132.8,
        "text": "Take me home where I belong"
      },
      {
        "time": 136.3,
        "text": "I got no other place to go"
      },
      {
        "time": 139.4,
        "text": "No, take me home"
      },
      {
        "time": 141.3,
        "text": "Take me home where I belong"
      },
      {
        "time": 145.4,
        "text": "I can't take it anymore"
      },
      {
        "time": 150.3,
        "text": "But I kept runnin' for a soft place to fall"
      },
      {
        "time": 158.9,
        "text": "And I kept runnin' for a soft place to fall"
      },
      {
        "time": 167.4,
        "text": "And I kept runnin' for a soft place to fall"
      },
      {
        "time": 175.7,
        "text": "And I kept runnin' for a soft place to fall"
      },
      {
        "time": 184.4,
        "text": "And I was runnin' far away"
      },
      {
        "time": 186.7,
        "text": "Would I run off the world someday?"
      },
      {
        "time": 189.4,
        "text": "But no, take me home"
      },
      {
        "time": 191.3,
        "text": "Take me home where I belong"
      },
      {
        "time": 194.8,
        "text": "I got no other place to go"
      },
      {
        "time": 197.7,
        "text": "No, take me home"
      },
      {
        "time": 199.6,
        "text": "Take me home where I belong"
      },
      {
        "time": 203.4,
        "text": "I got no other place to go"
      },
      {
        "time": 206,
        "text": "No, take me home, home where I belong, no, no"
      },
      {
        "time": 214.4,
        "text": "No, take me home, home where I belong, oh, oh, oh"
      },
      {
        "time": 222.7,
        "text": "No, take me home, home where I belong, no, no"
      },
      {
        "time": 231.1,
        "text": "No, take me home, home where I belong"
      },
      {
        "time": 237.1,
        "text": "I can't take it anymore"
      }
    ]
  },
  "song-1788894989657": {
    "en": [
      {
        "time": 9.9,
        "text": "I hopped off the plane at LAX"
      },
      {
        "time": 12.3,
        "text": "With a dream and my cardigan"
      },
      {
        "time": 14.7,
        "text": "Welcome to the land of fame excess (woah)"
      },
      {
        "time": 17.6,
        "text": "Am I gonna fit in?"
      },
      {
        "time": 19.5,
        "text": "Jumped in the cab, here I am for the first time"
      },
      {
        "time": 22.8,
        "text": "Look to my right, and I see the Hollywood sign"
      },
      {
        "time": 25.1,
        "text": "This is all so crazy"
      },
      {
        "time": 27.5,
        "text": "Everybody seems so famous"
      },
      {
        "time": 29.9,
        "text": "My tummy's turnin' and I'm feelin' kinda homesick"
      },
      {
        "time": 32.7,
        "text": "Too much pressure and I'm nervous"
      },
      {
        "time": 34.7,
        "text": "That's when the taxi man turned on the radio"
      },
      {
        "time": 37.2,
        "text": "And a Jay-Z song was on"
      },
      {
        "time": 39.9,
        "text": "And a Jay-Z song was on"
      },
      {
        "time": 42.5,
        "text": "And a Jay-Z song was on"
      },
      {
        "time": 44.3,
        "text": "So I put my hands up"
      },
      {
        "time": 45.9,
        "text": "They're playin' my song, the butterflies fly away"
      },
      {
        "time": 49.6,
        "text": "I'm noddin' my head like, yeah"
      },
      {
        "time": 52.4,
        "text": "Movin' my hips like, yeah"
      },
      {
        "time": 54.8,
        "text": "I got my hands up, they're playin' my song"
      },
      {
        "time": 57.3,
        "text": "They know I'm gonna be okay"
      },
      {
        "time": 60.1,
        "text": "Yeah, it's a party in the U.S.A."
      },
      {
        "time": 65.3,
        "text": "Yeah, it's a party in the U.S.A."
      },
      {
        "time": 70.2,
        "text": "Get to the club in my taxi cab"
      },
      {
        "time": 72.3,
        "text": "Everybody's looking at me now"
      },
      {
        "time": 74.4,
        "text": "Like, \"Who's that chick that's rockin' kicks?"
      },
      {
        "time": 77.3,
        "text": "She gotta be from out of town\""
      },
      {
        "time": 80,
        "text": "So hard with my girls not around me"
      },
      {
        "time": 82.6,
        "text": "It's definitely not a Nashville party"
      },
      {
        "time": 85.1,
        "text": "'Cause all I see are stilettos"
      },
      {
        "time": 87.8,
        "text": "I guess I never got the memo"
      },
      {
        "time": 89.9,
        "text": "My tummy's turnin' and I'm feelin' kinda homesick"
      },
      {
        "time": 92.8,
        "text": "Too much pressure and I'm nervous"
      },
      {
        "time": 94.5,
        "text": "That's when the DJ dropped my favorite tune"
      },
      {
        "time": 97.2,
        "text": "And a Britney song was on"
      },
      {
        "time": 99.5,
        "text": "And a Britney song was on"
      },
      {
        "time": 102.2,
        "text": "And a Britney song was on"
      },
      {
        "time": 104.3,
        "text": "So I put my hands up"
      },
      {
        "time": 106.1,
        "text": "They're playin' my song, the butterflies fly away"
      },
      {
        "time": 109.8,
        "text": "I'm noddin' my head like, yeah"
      },
      {
        "time": 112.5,
        "text": "Movin' my hips like, yeah"
      },
      {
        "time": 114.5,
        "text": "I got my hands up, they're playin' my song"
      },
      {
        "time": 117.5,
        "text": "They know I'm gonna be okay"
      },
      {
        "time": 119.9,
        "text": "Yeah, it's a party in the U.S.A."
      },
      {
        "time": 124.9,
        "text": "Yeah, it's a party in the U.S.A."
      },
      {
        "time": 130.6,
        "text": "Feel like hoppin' on a flight (on a flight)"
      },
      {
        "time": 135,
        "text": "Back to my hometown tonight (town tonight)"
      },
      {
        "time": 140.6,
        "text": "Something stops me every time (every time)"
      },
      {
        "time": 144.8,
        "text": "The DJ plays my song and I feel alright"
      },
      {
        "time": 149.3,
        "text": "So I put my hands up"
      },
      {
        "time": 151.1,
        "text": "They're playin' my song, the butterflies fly away"
      },
      {
        "time": 154.6,
        "text": "I'm noddin' my head like, yeah (noddin' my head)"
      },
      {
        "time": 157.3,
        "text": "Movin' my hips like, yeah (ooh, yeah)"
      },
      {
        "time": 159.5,
        "text": "I got my hands up, they're playin' my song"
      },
      {
        "time": 162.3,
        "text": "They know I'm gonna be okay (gonna be okay)"
      },
      {
        "time": 165,
        "text": "Yeah, it's a party in the U.S.A."
      },
      {
        "time": 169.9,
        "text": "Yeah, it's a party in the U.S.A."
      },
      {
        "time": 174.7,
        "text": "So I put my hands up"
      },
      {
        "time": 176,
        "text": "They're playin' my song, the butterflies fly away (flying away)"
      },
      {
        "time": 179.6,
        "text": "I'm noddin' my head like, yeah (noddin' my head like, yeah)"
      },
      {
        "time": 182.7,
        "text": "Movin' my hips like, yeah (movin' my hips like, yeah)"
      },
      {
        "time": 184.7,
        "text": "I got my hands up, they're playin' my song"
      },
      {
        "time": 187,
        "text": "They know I'm gonna be okay (I'm gonna be okay)"
      },
      {
        "time": 189.6,
        "text": "Yeah, it's a party in the U.S.A."
      },
      {
        "time": 194.9,
        "text": "Yeah (ha-ha-ha-ha), it's a party in the U.S.A."
      }
    ]
  },
  "song-1788894738763": {
    "en": [
      {
        "time": 1.7,
        "text": "Hm-mm-mm"
      },
      {
        "time": 4.2,
        "text": "Woah-oh-oh"
      },
      {
        "time": 5.8,
        "text": "It's always a good time"
      },
      {
        "time": 7.8,
        "text": "Woah-oh-oh"
      },
      {
        "time": 9.5,
        "text": "It's always a good time"
      },
      {
        "time": 15.8,
        "text": "Woke up on the right side of the bed"
      },
      {
        "time": 19.7,
        "text": "What's up with this Prince song inside my head?"
      },
      {
        "time": 23.4,
        "text": "Hands up if you're down to get down tonight (hm-mm-mm)"
      },
      {
        "time": 28.4,
        "text": "'Cause it's always a good time"
      },
      {
        "time": 31,
        "text": "Slept in all my clothes, like I didn't care"
      },
      {
        "time": 34.8,
        "text": "Hopped into a cab, take me anywhere"
      },
      {
        "time": 38.8,
        "text": "I'm in if you're down to get down tonight"
      },
      {
        "time": 43.6,
        "text": "'Cause it's always a good time"
      },
      {
        "time": 46.5,
        "text": "Good morning and good night"
      },
      {
        "time": 50.3,
        "text": "I wake up at twilight"
      },
      {
        "time": 54.2,
        "text": "It's gonna be alright"
      },
      {
        "time": 57.2,
        "text": "We don't even have to try"
      },
      {
        "time": 59,
        "text": "It's always a good time (whoo)"
      },
      {
        "time": 61.3,
        "text": "Woah-oh-oh-oh-oh, woah-oh"
      },
      {
        "time": 66.7,
        "text": "It's always a good time"
      },
      {
        "time": 68.8,
        "text": "Woah-oh-oh-oh-oh"
      },
      {
        "time": 72.3,
        "text": "We don't even have to try"
      },
      {
        "time": 74.3,
        "text": "It's always a good time"
      },
      {
        "time": 78.1,
        "text": "It's always a good time"
      },
      {
        "time": 80.4,
        "text": "Woah-oh-oh"
      },
      {
        "time": 84.3,
        "text": "Freaked out dropped my phone in the pool again"
      },
      {
        "time": 88.2,
        "text": "Checked out of my room, hit the ATM"
      },
      {
        "time": 91.7,
        "text": "Let's hang out if you're down to get down tonight"
      },
      {
        "time": 96.9,
        "text": "'Cause it's always a good time"
      },
      {
        "time": 99.8,
        "text": "Good morning and good night"
      },
      {
        "time": 103.7,
        "text": "I wake up at twilight"
      },
      {
        "time": 107.6,
        "text": "It's gonna be alright"
      },
      {
        "time": 110.5,
        "text": "We don't even have to try"
      },
      {
        "time": 112.5,
        "text": "It's always a good time (whoo)"
      },
      {
        "time": 114.6,
        "text": "Woah-oh-oh-oh-oh, woah-oh"
      },
      {
        "time": 120.1,
        "text": "It's always a good time"
      },
      {
        "time": 122.2,
        "text": "Woah-oh-oh-oh-oh"
      },
      {
        "time": 125.8,
        "text": "We don't even have to try"
      },
      {
        "time": 127.6,
        "text": "It's always a good time"
      },
      {
        "time": 129.8,
        "text": "Woah-oh-oh-oh-oh, woah-oh"
      },
      {
        "time": 135.4,
        "text": "It's always a good time"
      },
      {
        "time": 137.6,
        "text": "Woah-oh-oh-oh-oh"
      },
      {
        "time": 140.9,
        "text": "We don't even have to try"
      },
      {
        "time": 142.8,
        "text": "It's always a good time"
      },
      {
        "time": 144.6,
        "text": "Doesn't matter when"
      },
      {
        "time": 146.8,
        "text": "It's always a good time then"
      },
      {
        "time": 148.6,
        "text": "Doesn't matter where"
      },
      {
        "time": 150.6,
        "text": "It's always a good time there"
      },
      {
        "time": 152.6,
        "text": "Doesn't matter when"
      },
      {
        "time": 154.5,
        "text": "It's always a good time then"
      },
      {
        "time": 158.2,
        "text": "(It's always a good time)"
      },
      {
        "time": 160.2,
        "text": "Woah-oh-oh-oh-oh, woah-oh"
      },
      {
        "time": 165.8,
        "text": "It's always a good time"
      },
      {
        "time": 167.8,
        "text": "Woah-oh-oh-oh-oh"
      },
      {
        "time": 171.4,
        "text": "We don't even have to try"
      },
      {
        "time": 173.3,
        "text": "It's always a good time"
      },
      {
        "time": 175.4,
        "text": "Woah-oh-oh-oh-oh (doesn't matter where), woah-oh"
      },
      {
        "time": 181,
        "text": "It's always a good time"
      },
      {
        "time": 183,
        "text": "Woah-oh-oh-oh-oh (doesn't matter where)"
      },
      {
        "time": 186.8,
        "text": "We don't even have to try"
      },
      {
        "time": 188.7,
        "text": "It's always a good time"
      },
      {
        "time": 190.8,
        "text": "(Woah-oh-oh-oh-oh, oh-oh-oh)"
      },
      {
        "time": 196.3,
        "text": "(It's always a good time)"
      },
      {
        "time": 198.6,
        "text": "(Woah-oh-oh-oh-oh)"
      },
      {
        "time": 201.9,
        "text": "(We don't even have to try)"
      }
    ]
  },
  "song-1788894554955": {
    "en": [
      {
        "time": 21.5,
        "text": "You would not believe your eyes"
      },
      {
        "time": 24.3,
        "text": "If ten million fireflies"
      },
      {
        "time": 26.8,
        "text": "Lit up the world as I fell asleep"
      },
      {
        "time": 31.8,
        "text": "'Cause they fill the open air"
      },
      {
        "time": 34.7,
        "text": "And leave teardrops everywhere"
      },
      {
        "time": 36.9,
        "text": "You'd think me rude but I would just stand and stare"
      },
      {
        "time": 43.1,
        "text": "I'd like to make myself believe"
      },
      {
        "time": 46.8,
        "text": "That planet Earth turns slowly"
      },
      {
        "time": 52.7,
        "text": "It's hard to say that I'd rather stay awake when I'm asleep"
      },
      {
        "time": 57.7,
        "text": "'Cause everything is never as it seems"
      },
      {
        "time": 64.3,
        "text": "'Cause I'd get a thousand hugs"
      },
      {
        "time": 66.8,
        "text": "From ten thousand lightning bugs"
      },
      {
        "time": 69.5,
        "text": "As they tried to teach me how to dance"
      },
      {
        "time": 74.5,
        "text": "A foxtrot above my head"
      },
      {
        "time": 77.5,
        "text": "A sock hop beneath my bed"
      },
      {
        "time": 79.8,
        "text": "A disco ball is just hanging by a thread (thread, thread)"
      },
      {
        "time": 85.2,
        "text": "I'd like to make myself believe"
      },
      {
        "time": 89.8,
        "text": "That planet Earth turns slowly"
      },
      {
        "time": 95.9,
        "text": "It's hard to say that I'd rather stay awake when I'm asleep"
      },
      {
        "time": 101,
        "text": "'Cause everything is never as it seems (when I fall asleep)"
      },
      {
        "time": 109.9,
        "text": "Leave my door open just a crack"
      },
      {
        "time": 111.9,
        "text": "Please take me away from here"
      },
      {
        "time": 114.6,
        "text": "'Cause I feel like such an insomniac"
      },
      {
        "time": 117.4,
        "text": "Please take me away from here"
      },
      {
        "time": 120.5,
        "text": "Why do I tire of counting sheep?"
      },
      {
        "time": 122.9,
        "text": "Please take me away from here"
      },
      {
        "time": 125.5,
        "text": "When I'm far too tired to fall asleep"
      },
      {
        "time": 131.1,
        "text": "To ten million fireflies"
      },
      {
        "time": 133.7,
        "text": "I'm weird 'cause I hate goodbyes"
      },
      {
        "time": 136.2,
        "text": "I got misty eyes as they said, \"Farewell\" (they said farewell)"
      },
      {
        "time": 141,
        "text": "But I'll know where several are"
      },
      {
        "time": 144.1,
        "text": "If my dreams get real bizarre"
      },
      {
        "time": 146.4,
        "text": "'Cause I saved a few and I keep them in a jar (jar, jar, jar)"
      },
      {
        "time": 151.7,
        "text": "I'd like to make myself believe"
      },
      {
        "time": 155.9,
        "text": "That planet Earth turns slowly"
      },
      {
        "time": 162.1,
        "text": "It's hard to say that I'd rather stay awake when I'm asleep"
      },
      {
        "time": 167.9,
        "text": "'Cause everything is never as it seems (when I fall asleep)"
      },
      {
        "time": 173.8,
        "text": "I'd like to make myself believe"
      },
      {
        "time": 177.4,
        "text": "That planet Earth turns slowly"
      },
      {
        "time": 183.9,
        "text": "It's hard to say that I'd rather stay awake when I'm asleep"
      },
      {
        "time": 189.2,
        "text": "'Cause everything is never as it seems (when I fall asleep)"
      },
      {
        "time": 195,
        "text": "I'd like to make myself believe"
      },
      {
        "time": 198.8,
        "text": "That planet Earth turns slowly"
      },
      {
        "time": 204.7,
        "text": "It's hard to say that I'd rather stay awake when I'm asleep"
      },
      {
        "time": 210.6,
        "text": "Because my dreams are bursting at the seams"
      }
    ]
  },
  "song-1788894392275": {
    "en": [
      {
        "time": 19.1,
        "text": "Your morning eyes, I could stare like watching stars"
      },
      {
        "time": 26.3,
        "text": "I could walk you by, and I'll tell without a thought"
      },
      {
        "time": 32.9,
        "text": "You'd be mine"
      },
      {
        "time": 35,
        "text": "Would you mind if i took your hand tonight"
      },
      {
        "time": 40.4,
        "text": "Know you're all that I want this life"
      },
      {
        "time": 48.2,
        "text": "I'll imagine we fell in love"
      },
      {
        "time": 50.7,
        "text": "I'll nap under moonlight skies with you"
      },
      {
        "time": 54.6,
        "text": "I think I'll picture us, you with the waves"
      },
      {
        "time": 58.3,
        "text": "The oceans colors on your face"
      },
      {
        "time": 62.2,
        "text": "I'll leave my heart with your air"
      },
      {
        "time": 66.3,
        "text": "So let me fly with you"
      },
      {
        "time": 69.8,
        "text": "Will you be forever with me"
      },
      {
        "time": 77.5,
        "text": "♫♫♫"
      },
      {
        "time": 106.9,
        "text": "My love will always stay by you"
      },
      {
        "time": 112.5,
        "text": "I'll keep it safe so don't you worry a thing, I'll tell you i love you more"
      },
      {
        "time": 121.4,
        "text": "It's stuck with you forever so promise you won't let it go"
      },
      {
        "time": 128.2,
        "text": "I'll trust the universe will always bring me to you"
      },
      {
        "time": 136.7,
        "text": "I'll imagine we fell in love"
      },
      {
        "time": 139.3,
        "text": "I'll nap under moonlight skies with you"
      },
      {
        "time": 143.1,
        "text": "I think I'll picture us, you with the waves"
      },
      {
        "time": 146.7,
        "text": "The oceans colors on your face"
      },
      {
        "time": 150.4,
        "text": "I'll leave my heart with your air"
      },
      {
        "time": 154.8,
        "text": "So let me fly with you"
      },
      {
        "time": 158.1,
        "text": "Will you be forever with me"
      },
      {
        "time": 163,
        "text": "♫♫♫"
      }
    ]
  },
  "song-1788894254727": {
    "en": [
      {
        "time": 11.3,
        "text": "I found a guy, told me I was a star"
      },
      {
        "time": 16.7,
        "text": "He held the door held my hand in the dark"
      },
      {
        "time": 22,
        "text": "And he's perfect on paper"
      },
      {
        "time": 24.9,
        "text": "But he's lying to my face"
      },
      {
        "time": 27.9,
        "text": "Does he think that I'm the kinda girl"
      },
      {
        "time": 31.2,
        "text": "Who needs to be saved?"
      },
      {
        "time": 40,
        "text": "And there's one more boy, he's from my past"
      },
      {
        "time": 45.8,
        "text": "We fell in love, but it didn't last"
      },
      {
        "time": 51.1,
        "text": "'Cause the second I figured it out"
      },
      {
        "time": 53.9,
        "text": "He pushes me away"
      },
      {
        "time": 57,
        "text": "And I won't fight for love"
      },
      {
        "time": 59.7,
        "text": "If you won't meet me halfway"
      },
      {
        "time": 63.7,
        "text": "And I say that I'm through"
      },
      {
        "time": 65.9,
        "text": "But this song's still for you"
      },
      {
        "time": 70.5,
        "text": "All I want is love that lasts"
      },
      {
        "time": 73.5,
        "text": "Is all I want too much to ask?"
      },
      {
        "time": 76.7,
        "text": "Is it something wrong with me?"
      },
      {
        "time": 82.7,
        "text": "All I want is a good guy"
      },
      {
        "time": 85.4,
        "text": "Are my expectations far too high?"
      },
      {
        "time": 88.8,
        "text": "Try my best, but what can I say?"
      },
      {
        "time": 91.4,
        "text": "All I have is myself at the end of the day"
      },
      {
        "time": 96.7,
        "text": "But shouldn't that be enough for me?"
      },
      {
        "time": 105.9,
        "text": "Ooh-ooh-ooh-ooh-ooh-ooh"
      },
      {
        "time": 111.4,
        "text": "And I miss the days"
      },
      {
        "time": 113,
        "text": "When I was young and naive"
      },
      {
        "time": 116.8,
        "text": "I thought the perfect guy would come and find me"
      },
      {
        "time": 122.4,
        "text": "Now happy ever after, it don't come so easily"
      },
      {
        "time": 130.7,
        "text": "All I want is love that lasts"
      },
      {
        "time": 133.9,
        "text": "Is all I want too much to ask?"
      },
      {
        "time": 137.2,
        "text": "Is it something wrong with me? Oh-ooh"
      },
      {
        "time": 143.1,
        "text": "All I want is a good guy"
      },
      {
        "time": 145.7,
        "text": "Are my expectations far too high?"
      },
      {
        "time": 149.3,
        "text": "Try my best, but what can I say?"
      },
      {
        "time": 151.6,
        "text": "All I have is myself at the end of the day"
      },
      {
        "time": 157,
        "text": "And all I want is for that to be okay"
      }
    ]
  },
  "song-1788894095229": {
    "en": [
      {
        "time": 8.3,
        "text": "I'm jealous, I'm overzealous"
      },
      {
        "time": 12.6,
        "text": "When I'm down I get real down"
      },
      {
        "time": 14.8,
        "text": "When I'm high I don't come down"
      },
      {
        "time": 16.7,
        "text": "But I get angry, baby, believe me"
      },
      {
        "time": 21,
        "text": "I could love you just like that"
      },
      {
        "time": 23,
        "text": "And I can leave you just as fast"
      },
      {
        "time": 25.4,
        "text": "But you don't judge me"
      },
      {
        "time": 29,
        "text": "'Cause if you did, baby, I would judge you too"
      },
      {
        "time": 33.7,
        "text": "No, you don't judge me"
      },
      {
        "time": 37.5,
        "text": "'Cause if you did, baby, I would judge you too"
      },
      {
        "time": 41.7,
        "text": "'Cause I got issues, but you got 'em too"
      },
      {
        "time": 45.8,
        "text": "So give 'em all to me and I'll give mine to you"
      },
      {
        "time": 50,
        "text": "Bask in the glory of all our problems"
      },
      {
        "time": 54.5,
        "text": "'Cause we got the kind of love it takes to solve 'em"
      },
      {
        "time": 58.6,
        "text": "Yeah, I got issues"
      },
      {
        "time": 61.7,
        "text": "And one of them is how bad I need you"
      },
      {
        "time": 64.6,
        "text": "You do sh- on purpose"
      },
      {
        "time": 67.2,
        "text": "You get mad and you break things"
      },
      {
        "time": 69.3,
        "text": "Feel bad, try to fix things"
      },
      {
        "time": 71.3,
        "text": "But you're perfect, poorly wired circuit"
      },
      {
        "time": 75.5,
        "text": "And got hands like an ocean"
      },
      {
        "time": 77.8,
        "text": "Push you out, pull you back in"
      },
      {
        "time": 80.1,
        "text": "'Cause you don't judge me"
      },
      {
        "time": 83.9,
        "text": "'Cause if you did, baby, I would judge you too"
      },
      {
        "time": 88.5,
        "text": "No, you don't judge me"
      },
      {
        "time": 92.3,
        "text": "'Cause you see it from the same point of view"
      },
      {
        "time": 96.4,
        "text": "'Cause I got issues, but you got 'em too"
      },
      {
        "time": 100.6,
        "text": "So give 'em all to me and I'll give mine to you"
      },
      {
        "time": 104.7,
        "text": "Bask in the glory of all our problems"
      },
      {
        "time": 109.1,
        "text": "'Cause we got the kind of love it takes to solve 'em"
      },
      {
        "time": 113.2,
        "text": "Yeah, I got issues"
      },
      {
        "time": 116.5,
        "text": "And one of them is how bad I need you"
      },
      {
        "time": 118.7,
        "text": "(I got issues, you got 'em too)"
      },
      {
        "time": 124.9,
        "text": "And one of them is how bad I need you"
      },
      {
        "time": 126.9,
        "text": "(I got issues, you got 'em too)"
      },
      {
        "time": 134.2,
        "text": "'Cause I got issues, but you got 'em too (I got)"
      },
      {
        "time": 138.3,
        "text": "So give 'em all to me, and I'll give mine to you (you got 'em too)"
      },
      {
        "time": 142.4,
        "text": "Bask in the glory (I got issues)"
      },
      {
        "time": 144.7,
        "text": "Of all our problems"
      },
      {
        "time": 147,
        "text": "'Cause we got the kind of love it takes to solve 'em (you got 'em too)"
      },
      {
        "time": 151.3,
        "text": "Yeah, I got issues (I got)"
      },
      {
        "time": 154.4,
        "text": "And one of them is how bad I need you (you got 'em too)"
      },
      {
        "time": 159.5,
        "text": "Yeah, I got issues (I got issues)"
      },
      {
        "time": 163,
        "text": "And one of them is how bad I need you (you got 'em too)"
      },
      {
        "time": 167.9,
        "text": "Yeah, I got issues (I got)"
      },
      {
        "time": 171,
        "text": "And one of them is how bad I need you"
      }
    ]
  },
  "song-1788893935427": {
    "en": [
      {
        "time": 10,
        "text": "All those days watching from the windows"
      },
      {
        "time": 15,
        "text": "All those years outside looking in"
      },
      {
        "time": 19.8,
        "text": "All that time never even knowing"
      },
      {
        "time": 24.8,
        "text": "Just how blind I've been"
      },
      {
        "time": 29.9,
        "text": "Now I'm here blinking in the starlight"
      },
      {
        "time": 34.9,
        "text": "Now I'm here suddenly I see"
      },
      {
        "time": 39.6,
        "text": "Standing here it's all so clear"
      },
      {
        "time": 44.4,
        "text": "I'm where I'm meant to be"
      },
      {
        "time": 48.6,
        "text": "And at last I see the light"
      },
      {
        "time": 53.4,
        "text": "And it's like the fog has lifted"
      },
      {
        "time": 58.1,
        "text": "And at last I see the light"
      },
      {
        "time": 62.7,
        "text": "And it's like the sky is new"
      },
      {
        "time": 67.5,
        "text": "And it's warm and real and bright"
      },
      {
        "time": 72.4,
        "text": "And the world has somehow shifted"
      },
      {
        "time": 80.9,
        "text": "All at once everything looks different"
      },
      {
        "time": 85.6,
        "text": "Now that I see you"
      },
      {
        "time": 120.9,
        "text": "All those days chasing down a daydream"
      },
      {
        "time": 125.8,
        "text": "All those years living in the blur"
      },
      {
        "time": 130,
        "text": "All that time never truly seeing"
      },
      {
        "time": 134.8,
        "text": "Things, the way they were"
      },
      {
        "time": 139.6,
        "text": "Now she's here shining in the starlight"
      },
      {
        "time": 144.9,
        "text": "Now she's here suddenly I know"
      },
      {
        "time": 149.4,
        "text": "If she's here it's crystal clear"
      },
      {
        "time": 154.1,
        "text": "I'm where I'm meant to go"
      },
      {
        "time": 158.6,
        "text": "And at last I see the light"
      },
      {
        "time": 162.8,
        "text": "And it's like the fog has lifted"
      },
      {
        "time": 167.1,
        "text": "And at last I see the light"
      },
      {
        "time": 171.3,
        "text": "And it's like the sky is new"
      },
      {
        "time": 176,
        "text": "And it's warm and real and bright"
      },
      {
        "time": 180.4,
        "text": "And the world has somehow shifted"
      },
      {
        "time": 189,
        "text": "All at once everything looks different"
      },
      {
        "time": 193.9,
        "text": "Now that I see you"
      }
    ]
  },
  "song-1788893721833": {
    "en": [
      {
        "time": 10.5,
        "text": "All of my life, I thought I was right"
      },
      {
        "time": 16,
        "text": "Looking for something new"
      },
      {
        "time": 20.9,
        "text": "Stuck in my ways like old-fashioned days"
      },
      {
        "time": 26,
        "text": "But all the roads led me to you"
      },
      {
        "time": 31.3,
        "text": "The house that you live in don't make it a home"
      },
      {
        "time": 36.5,
        "text": "But feeling lonely don't mean you're alone"
      },
      {
        "time": 41.6,
        "text": "People in life, they will come, and they'll leave"
      },
      {
        "time": 46.5,
        "text": "But if I had a choice, I know where I would be"
      },
      {
        "time": 55.3,
        "text": "Through the lows and the highs"
      },
      {
        "time": 58.1,
        "text": "I will stay by your side"
      },
      {
        "time": 60.7,
        "text": "There's no need for goodbyes"
      },
      {
        "time": 63,
        "text": "Now, I'm seeing the light"
      },
      {
        "time": 65.8,
        "text": "When the sky turns to grey"
      },
      {
        "time": 68.2,
        "text": "And there's nothing to say"
      },
      {
        "time": 71.3,
        "text": "At the end of the day"
      },
      {
        "time": 74.5,
        "text": "I choose you"
      },
      {
        "time": 78.1,
        "text": "Now, I found the strength to make a change"
      },
      {
        "time": 83.3,
        "text": "And look at the magic I found"
      },
      {
        "time": 88.6,
        "text": "No matter the name or where you came from"
      },
      {
        "time": 93.8,
        "text": "'Cause no one has much figured out"
      },
      {
        "time": 99.1,
        "text": "The house that you live in don't make it a home"
      },
      {
        "time": 104.5,
        "text": "But feeling lonely don't mean you're alone"
      },
      {
        "time": 109.5,
        "text": "I finally found where I feel I belong"
      },
      {
        "time": 114.9,
        "text": "And I know you'll be there with wide open arms"
      },
      {
        "time": 123.2,
        "text": "Through the lows and the highs"
      },
      {
        "time": 125.7,
        "text": "I will stay by your side"
      },
      {
        "time": 128.3,
        "text": "There's no need for goodbyes"
      },
      {
        "time": 130.9,
        "text": "Now, I'm seeing the light"
      },
      {
        "time": 133.8,
        "text": "When the sky turns to grey"
      },
      {
        "time": 136.2,
        "text": "And there's nothing to say"
      },
      {
        "time": 139.3,
        "text": "At the end of the day"
      },
      {
        "time": 142.3,
        "text": "I choose you"
      },
      {
        "time": 164.9,
        "text": "Through the lows and the highs"
      },
      {
        "time": 167.8,
        "text": "I will stay by your side"
      },
      {
        "time": 170.4,
        "text": "There's no need for goodbyes"
      },
      {
        "time": 172.6,
        "text": "Now, I'm seeing the light"
      },
      {
        "time": 175.5,
        "text": "Through the lows and the highs"
      },
      {
        "time": 177.8,
        "text": "I will stay by your side"
      },
      {
        "time": 180.7,
        "text": "There's no need for goodbyes"
      },
      {
        "time": 183.2,
        "text": "Now, I'm seeing the light"
      },
      {
        "time": 185.8,
        "text": "When the sky turns to grey"
      },
      {
        "time": 188.5,
        "text": "And there's nothing to say"
      },
      {
        "time": 191.3,
        "text": "At the end of the day"
      },
      {
        "time": 194.6,
        "text": "I choose you"
      },
      {
        "time": 199.3,
        "text": "Oh, I choose you"
      },
      {
        "time": 210.5,
        "text": "I choose you"
      }
    ]
  },
  "song-1788893525204": {
    "en": [
      {
        "time": 8.5,
        "text": "I got my driver's license last week"
      },
      {
        "time": 12,
        "text": "Just like we always talked about"
      },
      {
        "time": 15.3,
        "text": "'Cause you were so excited for me"
      },
      {
        "time": 18.3,
        "text": "To finally drive up to your house"
      },
      {
        "time": 21.9,
        "text": "But today, I drove through the suburbs"
      },
      {
        "time": 24.7,
        "text": "Crying 'cause you weren't around"
      },
      {
        "time": 31.5,
        "text": "And you're probably with that blonde girl"
      },
      {
        "time": 35,
        "text": "Who always made me doubt"
      },
      {
        "time": 38.2,
        "text": "She's so much older than me"
      },
      {
        "time": 40.9,
        "text": "She's everything I'm insecure about"
      },
      {
        "time": 44.2,
        "text": "Yeah, today, I drove through the suburbs"
      },
      {
        "time": 47.5,
        "text": "'Cause how could I ever love someone else?"
      },
      {
        "time": 54.4,
        "text": "And I know we weren't perfect, but I've never felt this way for no one"
      },
      {
        "time": 64.4,
        "text": "And I just can't imagine how you could be so okay now that I'm gone"
      },
      {
        "time": 74.2,
        "text": "Guess you didn't mean what you wrote in that song about me"
      },
      {
        "time": 81.1,
        "text": "'Cause you said forever, now I drive alone past your street"
      },
      {
        "time": 86,
        "text": "♪"
      },
      {
        "time": 88.5,
        "text": "And all my friends are tired"
      },
      {
        "time": 91.5,
        "text": "Of hearing how much I miss you, but"
      },
      {
        "time": 95.3,
        "text": "I kinda feel sorry for them"
      },
      {
        "time": 97.7,
        "text": "'Cause they'll never know you the way that I do"
      },
      {
        "time": 100.7,
        "text": "Yeah, today, I drove through the suburbs"
      },
      {
        "time": 104.4,
        "text": "And pictured I was driving home to you"
      },
      {
        "time": 110.9,
        "text": "And I know we weren't perfect, but I've never felt this way for no one, oh"
      },
      {
        "time": 121,
        "text": "And I just can't imagine how you could be so okay now that I'm gone"
      },
      {
        "time": 130.5,
        "text": "I guess you didn't mean what you wrote in that song about me"
      },
      {
        "time": 137.8,
        "text": "'Cause you said forever, now I drive alone past your street"
      },
      {
        "time": 144.7,
        "text": "Red lights, stop signs"
      },
      {
        "time": 147.6,
        "text": "I still see your face in the white cars front yards"
      },
      {
        "time": 154.6,
        "text": "Can't drive past the places we used to go to"
      },
      {
        "time": 161.1,
        "text": "'Cause I still fucking love you, babe (ooh, ooh-ooh, ooh, ooh-ooh)"
      },
      {
        "time": 171.2,
        "text": "Sidewalks we crossed"
      },
      {
        "time": 174.3,
        "text": "I still hear your voice in the traffic, we're laughing"
      },
      {
        "time": 181.3,
        "text": "Over all the noise"
      },
      {
        "time": 183.6,
        "text": "God, I'm so blue, know we're through"
      },
      {
        "time": 187.6,
        "text": "But I still fucking love you, babe (ooh, ooh-ooh, ooh, ooh-ooh)"
      },
      {
        "time": 198,
        "text": "I know we weren't perfect, but I've never felt this way for no one"
      },
      {
        "time": 207.8,
        "text": "And I just can't imagine how you could be so okay now that I'm gone"
      },
      {
        "time": 217.5,
        "text": "Guess you didn't mean what you wrote in that song about me"
      },
      {
        "time": 224.4,
        "text": "'Cause you said forever, now I drive alone past your street"
      },
      {
        "time": 231.1,
        "text": "Yeah, you said forever, now I drive alone past your street"
      }
    ]
  },
  "song-1788893380248": {
    "en": [
      {
        "time": 19.1,
        "text": "Brown guilty eyes and little white lies, yeah"
      },
      {
        "time": 23.6,
        "text": "I played dumb, but I always knew"
      },
      {
        "time": 28.5,
        "text": "That you talked to her, maybe did even worse"
      },
      {
        "time": 32.9,
        "text": "I kept quiet so I could keep you"
      },
      {
        "time": 37.3,
        "text": "And ain't it funny how you ran to her"
      },
      {
        "time": 42.9,
        "text": "The second that we called it quits?"
      },
      {
        "time": 47.2,
        "text": "And ain't it funny how you said you were friends?"
      },
      {
        "time": 52.3,
        "text": "Now it sure as hell don't look like it"
      },
      {
        "time": 56.9,
        "text": "You betrayed me"
      },
      {
        "time": 59.9,
        "text": "And I know that you'll never feel sorry for the way I hurt, yeah"
      },
      {
        "time": 67.1,
        "text": "You talked to her when we were together"
      },
      {
        "time": 71.5,
        "text": "Loved you at your worst, but that didn't matter"
      },
      {
        "time": 76.5,
        "text": "It took you two weeks to go off and date her"
      },
      {
        "time": 81,
        "text": "Guess you didn't cheat, but you're still a traitor"
      },
      {
        "time": 90.3,
        "text": "Now you bring her around just to shut me down"
      },
      {
        "time": 95.3,
        "text": "Show her off like she's a new trophyㅤ"
      },
      {
        "time": 99.8,
        "text": "And I know if you were true, there's no damn way that you"
      },
      {
        "time": 104.8,
        "text": "Could fall in love with somebody that quickly"
      },
      {
        "time": 109.6,
        "text": "Ain't it funny? All the twisted games"
      },
      {
        "time": 114.5,
        "text": "All the questions you used to avoid"
      },
      {
        "time": 119.1,
        "text": "Ain't it funny? Remember I brought her up"
      },
      {
        "time": 124.1,
        "text": "And you told me I was paranoid?"
      },
      {
        "time": 128.6,
        "text": "You betrayed me"
      },
      {
        "time": 131.8,
        "text": "And I know that you'll never feel sorry for the way I hurt, yeah"
      },
      {
        "time": 139,
        "text": "You talked to her when we were together"
      },
      {
        "time": 143.6,
        "text": "Loved you at your worst, but that didn't matter"
      },
      {
        "time": 148.6,
        "text": "It took you two weeks to go off and date her"
      },
      {
        "time": 153.2,
        "text": "Guess you didn't cheat, but you're still a traitor"
      },
      {
        "time": 159.5,
        "text": "(Ah-ah-ah) God, I wish that you had thought this through"
      },
      {
        "time": 165.4,
        "text": "Before I went and fell in love with you"
      },
      {
        "time": 169.1,
        "text": "(Ah-ah-ah) when she's sleepin' in the bed, we made"
      },
      {
        "time": 174.7,
        "text": "Don't you dare forget about the way"
      },
      {
        "time": 177,
        "text": "You betrayed me"
      },
      {
        "time": 179.9,
        "text": "'Cause I know that you'll never feel sorry for the way I hurt, yeah"
      },
      {
        "time": 187.2,
        "text": "You talked to her when we were together"
      },
      {
        "time": 191.8,
        "text": "You gave me your word, but that didn't matter"
      },
      {
        "time": 196.3,
        "text": "It took you two weeks to go off and date her"
      },
      {
        "time": 201.2,
        "text": "Guess you didn't cheat"
      },
      {
        "time": 203.8,
        "text": "But you're still, you're still a traitor (ah-ah-ah)"
      },
      {
        "time": 213.2,
        "text": "Yeah, you're still a traitor"
      },
      {
        "time": 217.2,
        "text": "Ooh-ooh-ooh"
      },
      {
        "time": 220.7,
        "text": "God, I wish that you had thought this through"
      },
      {
        "time": 223.1,
        "text": "Before I went and fell in love with you"
      }
    ]
  },
  "song-1788893185929": {
    "en": [
      {
        "time": 3.6,
        "text": "You change your mind like a girl changes clothes"
      },
      {
        "time": 10.4,
        "text": "Yeah, you PMS like a bitch, I would know"
      },
      {
        "time": 17.8,
        "text": "And you overthink, always speak cryptically"
      },
      {
        "time": 24.5,
        "text": "I should know that you're no good for me"
      },
      {
        "time": 32,
        "text": "'Cause you're hot, then you're cold"
      },
      {
        "time": 33.9,
        "text": "You're yes, then you're no"
      },
      {
        "time": 35.7,
        "text": "You're in, then you're out"
      },
      {
        "time": 37.7,
        "text": "You're up, then you're down"
      },
      {
        "time": 39.6,
        "text": "You're wrong when it's right"
      },
      {
        "time": 41.2,
        "text": "It's black, and it's white"
      },
      {
        "time": 43,
        "text": "We fight, we break up"
      },
      {
        "time": 44.9,
        "text": "We kiss, we make up"
      },
      {
        "time": 47.2,
        "text": "(You) you don't really wanna stay, no"
      },
      {
        "time": 50.7,
        "text": "(You) but you don't really wanna go, oh"
      },
      {
        "time": 54,
        "text": "You're hot, then you're cold"
      },
      {
        "time": 55.7,
        "text": "You're yes, then you're no"
      },
      {
        "time": 57.7,
        "text": "You're in, then you're out"
      },
      {
        "time": 59.5,
        "text": "You're up, then you're down"
      },
      {
        "time": 62.3,
        "text": "♪"
      },
      {
        "time": 69.1,
        "text": "We used to be just like twins, so in sync"
      },
      {
        "time": 75.8,
        "text": "The same energy now's a dead battery"
      },
      {
        "time": 82.9,
        "text": "Used to laugh (used to laugh) 'bout nothing ('bout nothing)"
      },
      {
        "time": 86.4,
        "text": "Now you're plain (now you're plain) boring (boring)"
      },
      {
        "time": 90.2,
        "text": "I should know (I should know) that you're not gonna change"
      },
      {
        "time": 97.6,
        "text": "'Cause you're hot, then you're cold"
      },
      {
        "time": 99.5,
        "text": "You're yes, then you're no"
      },
      {
        "time": 101.2,
        "text": "You're in, then you're out"
      },
      {
        "time": 103.1,
        "text": "You're up, then you're down"
      },
      {
        "time": 104.9,
        "text": "You're wrong when it's right"
      },
      {
        "time": 106.6,
        "text": "It's black, and it's white"
      },
      {
        "time": 108.6,
        "text": "We fight, we break up"
      },
      {
        "time": 110.3,
        "text": "We kiss, we make up"
      },
      {
        "time": 112.4,
        "text": "(You) you don't really wanna stay, no (oh)"
      },
      {
        "time": 116.1,
        "text": "(You) but you don't really wanna go, oh (oh)"
      },
      {
        "time": 119.3,
        "text": "You're hot, then you're cold"
      },
      {
        "time": 121.2,
        "text": "You're yes, then you're no"
      },
      {
        "time": 123.2,
        "text": "You're in, then you're out"
      },
      {
        "time": 125.1,
        "text": "You're up, then you're down (down)"
      },
      {
        "time": 128.1,
        "text": "♪"
      },
      {
        "time": 142.5,
        "text": "Someone call the doctor"
      },
      {
        "time": 145.7,
        "text": "Got a case of a love bipolar"
      },
      {
        "time": 149.4,
        "text": "Stuck on a rollercoaster"
      },
      {
        "time": 152.7,
        "text": "Can't get off this ride"
      },
      {
        "time": 158.1,
        "text": "You change your mind like a girl changes clothes"
      },
      {
        "time": 166.9,
        "text": "'Cause you're hot, then you're cold"
      },
      {
        "time": 168.6,
        "text": "You're yes, then you're no"
      },
      {
        "time": 170.4,
        "text": "You're in, then you're out"
      },
      {
        "time": 172.2,
        "text": "You're up, then you're down"
      },
      {
        "time": 174.1,
        "text": "You're wrong when it's right"
      },
      {
        "time": 175.7,
        "text": "It's black, and it's white"
      },
      {
        "time": 177.8,
        "text": "We fight, we break up"
      },
      {
        "time": 179.5,
        "text": "We kiss, we make up"
      },
      {
        "time": 181.3,
        "text": "You're hot, then you're cold"
      },
      {
        "time": 183.1,
        "text": "You're yes, then you're no"
      },
      {
        "time": 185.1,
        "text": "You're in, then you're out"
      },
      {
        "time": 186.7,
        "text": "You're up, then you're down"
      },
      {
        "time": 188.3,
        "text": "You're wrong when it's right"
      },
      {
        "time": 190.3,
        "text": "It's black, and it's white"
      },
      {
        "time": 192.1,
        "text": "We fight, we break up"
      },
      {
        "time": 194,
        "text": "We kiss, we make up"
      },
      {
        "time": 196.1,
        "text": "(You) you don't really wanna stay, no (oh)"
      },
      {
        "time": 199.7,
        "text": "(You) but you don't really wanna go, oh (oh)"
      },
      {
        "time": 203,
        "text": "You're hot, then you're cold"
      },
      {
        "time": 204.9,
        "text": "You're yes, then you're no"
      },
      {
        "time": 206.6,
        "text": "You're in, then you're out"
      },
      {
        "time": 208.6,
        "text": "You're up, then you're down"
      }
    ]
  },
  "song-1788892957736": {
    "en": [
      {
        "time": 4.1,
        "text": "Hey, hey"
      },
      {
        "time": 5.8,
        "text": "Hey-hey, hey-hey"
      },
      {
        "time": 8.2,
        "text": "Hey-hey, hey-hey"
      },
      {
        "time": 11.6,
        "text": "Your lipstick stains"
      },
      {
        "time": 15.2,
        "text": "On the front lobe of my left side brains"
      },
      {
        "time": 20.2,
        "text": "I knew I wouldn't forget you"
      },
      {
        "time": 23.1,
        "text": "And so I went and let you blow my mind"
      },
      {
        "time": 31.4,
        "text": "Your sweet moonbeam"
      },
      {
        "time": 34.5,
        "text": "The smell of you in every single dream I dream"
      },
      {
        "time": 40,
        "text": "I knew when we collided"
      },
      {
        "time": 42.3,
        "text": "You're the one I have decided who's one of my kind"
      },
      {
        "time": 51.5,
        "text": "Hey, soul sister"
      },
      {
        "time": 53.6,
        "text": "Ain't that Mr. Mister on the radio, stereo"
      },
      {
        "time": 58.5,
        "text": "The way you move ain't fair, you know"
      },
      {
        "time": 61.4,
        "text": "Hey, soul sister"
      },
      {
        "time": 63.7,
        "text": "I don't wanna miss a single thing you do tonight"
      },
      {
        "time": 73.2,
        "text": "Hey, hey"
      },
      {
        "time": 74.9,
        "text": "Hey-hey, hey-hey"
      },
      {
        "time": 77.6,
        "text": "Hey-hey, hey-hey"
      },
      {
        "time": 81.2,
        "text": "Just in time"
      },
      {
        "time": 84.5,
        "text": "I'm so glad you have a one-track mind like me"
      },
      {
        "time": 90,
        "text": "You gave my life direction"
      },
      {
        "time": 92.4,
        "text": "A game show love connection we can't deny"
      },
      {
        "time": 100.9,
        "text": "I'm so obsessed"
      },
      {
        "time": 104,
        "text": "My heart is bound to beat right out my untrimmed chest"
      },
      {
        "time": 109.2,
        "text": "I believe in you, like a virgin, you're Madonna"
      },
      {
        "time": 114.3,
        "text": "And I'm always gonna wanna blow your mind"
      },
      {
        "time": 121,
        "text": "Hey, soul sister"
      },
      {
        "time": 123.3,
        "text": "Ain't that Mr. Mister on the radio, stereo"
      },
      {
        "time": 128,
        "text": "The way you move ain't fair, you know"
      },
      {
        "time": 130.8,
        "text": "Hey, soul sister"
      },
      {
        "time": 132.9,
        "text": "I don't wanna miss a single thing you do tonight"
      },
      {
        "time": 140.8,
        "text": "The way you can cut a rug"
      },
      {
        "time": 143.1,
        "text": "Watching you is the only drug I need"
      },
      {
        "time": 145.9,
        "text": "So gangsta, I'm so thug"
      },
      {
        "time": 147.9,
        "text": "You're the only one I'm dreaming of"
      },
      {
        "time": 150.5,
        "text": "You see, I can be myself now finally"
      },
      {
        "time": 153.3,
        "text": "In fact, there's nothing I can't be"
      },
      {
        "time": 156.4,
        "text": "I want the world to see you'll be with me"
      },
      {
        "time": 160.4,
        "text": "Hey, soul sister"
      },
      {
        "time": 162.7,
        "text": "Ain't that Mr. Mister on the radio, stereo"
      },
      {
        "time": 167.4,
        "text": "The way you move ain't fair, you know"
      },
      {
        "time": 170.4,
        "text": "Hey, soul sister"
      },
      {
        "time": 172.5,
        "text": "I don't wanna miss a single thing you do tonight"
      },
      {
        "time": 180.2,
        "text": "Hey, soul sister"
      },
      {
        "time": 182.5,
        "text": "I don't wanna miss a single thing you do tonight"
      },
      {
        "time": 191.9,
        "text": "Hey, hey"
      },
      {
        "time": 193.9,
        "text": "Hey-hey, hey-hey"
      },
      {
        "time": 196.5,
        "text": "Hey-hey, hey-hey (tonight)"
      },
      {
        "time": 202.1,
        "text": "Hey, hey"
      },
      {
        "time": 203.9,
        "text": "Hey-hey, hey-hey"
      },
      {
        "time": 206.3,
        "text": "Hey-hey, hey-hey (tonight)"
      }
    ]
  },
  "song-1788892787408": {
    "en": [
      {
        "time": 5.2,
        "text": "There's a fire starting in my heart"
      },
      {
        "time": 9.7,
        "text": "Reaching a fever pitch, it's bringing me out the dark"
      },
      {
        "time": 14.2,
        "text": "Finally I can see you crystal clear"
      },
      {
        "time": 19.1,
        "text": "Go ahead and sell me out and I'll lay your ship bare"
      },
      {
        "time": 23.4,
        "text": "See how I'll leave with every piece of you"
      },
      {
        "time": 27.9,
        "text": "Don't underestimate the things that I will do"
      },
      {
        "time": 32.6,
        "text": "There's a fire starting in my heart"
      },
      {
        "time": 37.2,
        "text": "Reaching a fever pitch and it's bringing me out the dark"
      },
      {
        "time": 42.8,
        "text": "The scars of your love remind me of us"
      },
      {
        "time": 47.2,
        "text": "They keep me thinking that we almost had it all"
      },
      {
        "time": 51.8,
        "text": "The scars of your love they leave me breathless"
      },
      {
        "time": 56.3,
        "text": "I can't help feeling"
      },
      {
        "time": 58.8,
        "text": "We could've had it all (you're gonna wish you)"
      },
      {
        "time": 62.3,
        "text": "(Never had met me)"
      },
      {
        "time": 63.6,
        "text": "Rolling in the deep (tears are gonna fall)"
      },
      {
        "time": 67,
        "text": "(Rolling in the deep)"
      },
      {
        "time": 67.9,
        "text": "You had my heart inside (you're gonna wish you)"
      },
      {
        "time": 70.7,
        "text": "Of your hands (never had met me)"
      },
      {
        "time": 72.9,
        "text": "And you played it (tears are gonna fall)"
      },
      {
        "time": 75.3,
        "text": "To the beat (rolling in the deep)"
      },
      {
        "time": 78.3,
        "text": "Baby, I have no story to be told"
      },
      {
        "time": 82.7,
        "text": "But I've heard one on you, now I'm gonna make your head burn"
      },
      {
        "time": 87.6,
        "text": "Think of me in the depths of your despair"
      },
      {
        "time": 92,
        "text": "Make a home down there, as mine sure won't be shared"
      },
      {
        "time": 96.6,
        "text": "(You're gonna wish you)"
      },
      {
        "time": 97.6,
        "text": "The scars of your love (never had met me)"
      },
      {
        "time": 100,
        "text": "Remind me of us (tears are gonna fall)"
      },
      {
        "time": 102.2,
        "text": "They keep me thinking (rolling in the deep)"
      },
      {
        "time": 104.3,
        "text": "That we almost had it all (you're gonna wish you)"
      },
      {
        "time": 107,
        "text": "The scars of your love (never had met me)"
      },
      {
        "time": 109.1,
        "text": "They leave me breathless (tears are gonna fall)"
      },
      {
        "time": 111.4,
        "text": "I can't help feeling (rolling in the deep)"
      },
      {
        "time": 113.5,
        "text": "We could've had it all (you're gonna wish you)"
      },
      {
        "time": 117.2,
        "text": "(Never had met me)"
      },
      {
        "time": 118.6,
        "text": "Rolling in the deep (tears are gonna fall)"
      },
      {
        "time": 122.1,
        "text": "(Rolling in the deep)"
      },
      {
        "time": 122.8,
        "text": "You had my heart inside (you're gonna wish you)"
      },
      {
        "time": 125.7,
        "text": "Of your hands (never had met me)"
      },
      {
        "time": 127.8,
        "text": "And you played it (tears are gonna fall)"
      },
      {
        "time": 130.1,
        "text": "To the beat (rolling in the deep)"
      },
      {
        "time": 132,
        "text": "We could've had it all"
      },
      {
        "time": 136.5,
        "text": "Rolling in the deep"
      },
      {
        "time": 141.1,
        "text": "You had my heart inside of your hand"
      },
      {
        "time": 146.2,
        "text": "But you played it with a beating"
      },
      {
        "time": 151.8,
        "text": "Throw your soul through every open door (whoa)"
      },
      {
        "time": 156.2,
        "text": "Count your blessings to find what you look for (whoa)"
      },
      {
        "time": 160.7,
        "text": "Turn my sorrow into treasured gold (whoa)"
      },
      {
        "time": 165.1,
        "text": "You pay me back in kind and reap just what you've sown"
      },
      {
        "time": 170,
        "text": "(You're gonna wish you never had met me)"
      },
      {
        "time": 173.3,
        "text": "We could've had it all (tears are gonna fall, rolling in the deep)"
      },
      {
        "time": 177.7,
        "text": "We could've had it all (you're gonna wish you never had met me)"
      },
      {
        "time": 183.3,
        "text": "It all, it all, it all (tears are gonna fall, rolling in the deep)"
      },
      {
        "time": 187,
        "text": "We could've had it all (you're gonna wish you)"
      },
      {
        "time": 190.4,
        "text": "(Never had met me)"
      },
      {
        "time": 191.6,
        "text": "Rolling in the deep (tears are gonna fall)"
      },
      {
        "time": 194.8,
        "text": "(Rolling in the deep)"
      },
      {
        "time": 196,
        "text": "You had my heart inside (you're gonna wish you)"
      },
      {
        "time": 198.8,
        "text": "Of your hands (never had met me)"
      },
      {
        "time": 201.2,
        "text": "And you played it (tears are gonna fall)"
      },
      {
        "time": 203.1,
        "text": "To the beat (rolling in the deep)"
      },
      {
        "time": 205.2,
        "text": "Could've had it all (you're gonna wish you)"
      },
      {
        "time": 208.6,
        "text": "(Never had met me)"
      },
      {
        "time": 209.9,
        "text": "Rolling in the deep (tears are gonna fall)"
      },
      {
        "time": 213.4,
        "text": "(Rolling in the deep)"
      },
      {
        "time": 214.2,
        "text": "You had my heart inside (you're gonna wish you)"
      },
      {
        "time": 216.9,
        "text": "Of your hands (never had met me)"
      },
      {
        "time": 219.5,
        "text": "But you played it, you played it, you played it"
      },
      {
        "time": 222.9,
        "text": "You played it to the beat"
      }
    ]
  },
  "song-1788892572221": {
    "en": [
      {
        "time": 92,
        "text": "I got my ticket for the long way 'round"
      },
      {
        "time": 95.6,
        "text": "Two bottle of whiskey for the way"
      },
      {
        "time": 98.3,
        "text": "And I sure would like some sweet company"
      },
      {
        "time": 102,
        "text": "And I'm leaving tomorrow, what do you say?"
      },
      {
        "time": 105.7,
        "text": "When I'm gone"
      },
      {
        "time": 107.2,
        "text": "When I'm gone"
      },
      {
        "time": 109.7,
        "text": "You're gonna miss me when I'm gone"
      },
      {
        "time": 112.7,
        "text": "You're gonna miss me by my hair"
      },
      {
        "time": 115.3,
        "text": "You're gonna miss me everywhere, oh"
      },
      {
        "time": 117.1,
        "text": "You're gonna miss me when I'm gone"
      },
      {
        "time": 143.2,
        "text": "I got my ticket for the long way 'round"
      },
      {
        "time": 147,
        "text": "The one with the prettiest of views"
      },
      {
        "time": 149.9,
        "text": "It's got mountains, it's got rivers, it's got sights to give you shivers"
      },
      {
        "time": 155.1,
        "text": "But it sure would be prettier with you"
      },
      {
        "time": 157.2,
        "text": "When I'm gone"
      },
      {
        "time": 159,
        "text": "When I'm gone"
      },
      {
        "time": 161.1,
        "text": "You're gonna miss me when I'm gone"
      },
      {
        "time": 164.2,
        "text": "You're gonna miss me by my walk"
      },
      {
        "time": 166.7,
        "text": "You're gonna miss me by my talk, oh"
      },
      {
        "time": 168.8,
        "text": "You're gonna miss me when I'm gone"
      }
    ]
  },
  "song-1788892347352": {
    "en": [
      {
        "time": 6,
        "text": "Maybe it's the way you say my name"
      },
      {
        "time": 9.7,
        "text": "Maybe it's the way you play your game"
      },
      {
        "time": 13.4,
        "text": "But it's so good"
      },
      {
        "time": 17.1,
        "text": "I've never known anybody like you"
      },
      {
        "time": 20.8,
        "text": "But it's so good"
      },
      {
        "time": 24.5,
        "text": "I've never dreamed of nobody like you"
      },
      {
        "time": 28.2,
        "text": "And I've heard of a love that comes once in a lifetime"
      },
      {
        "time": 31.9,
        "text": "And I'm pretty sure that you are that love of mine"
      },
      {
        "time": 35.6,
        "text": "'Cause I'm in a field of dandelions"
      },
      {
        "time": 39.3,
        "text": "Wishing on every one that you'd be mine, mine"
      },
      {
        "time": 43,
        "text": "And I see forever in your eyes"
      },
      {
        "time": 46.7,
        "text": "I feel okay when I see you smile, smile"
      },
      {
        "time": 50.4,
        "text": "Wishing on dandelions all of the time"
      },
      {
        "time": 54.1,
        "text": "Praying to God that one day you'll be mine"
      },
      {
        "time": 57.8,
        "text": "Wishing on dandelions all of the time, all of the time"
      },
      {
        "time": 61.5,
        "text": "I think that you are the one for me"
      },
      {
        "time": 65.2,
        "text": "'Cause it gets so hard to breathe"
      },
      {
        "time": 68.9,
        "text": "When you're looking at me"
      },
      {
        "time": 72.6,
        "text": "I've never felt so alive and free"
      },
      {
        "time": 76.3,
        "text": "When you're looking at me"
      },
      {
        "time": 80,
        "text": "I've never felt so happy"
      },
      {
        "time": 83.7,
        "text": "And I've heard of a love that comes once in a lifetime"
      },
      {
        "time": 87.3,
        "text": "And I'm pretty sure that you are that love of mine"
      },
      {
        "time": 91,
        "text": "'Cause I'm in a field of dandelions"
      },
      {
        "time": 94.7,
        "text": "Wishing on every one that you'd be mine, mine"
      },
      {
        "time": 98.4,
        "text": "And I see forever in your eyes"
      },
      {
        "time": 102.1,
        "text": "I feel okay when I see you smile, smile"
      },
      {
        "time": 105.8,
        "text": "Wishing on dandelions all of the time"
      },
      {
        "time": 109.5,
        "text": "Praying to God that one day you'll be mine"
      },
      {
        "time": 113.2,
        "text": "Wishing on dandelions all of the time, all of the time"
      },
      {
        "time": 116.9,
        "text": "Dandelion, into the wind you go"
      },
      {
        "time": 120.6,
        "text": "Won't you let my darling know?"
      },
      {
        "time": 124.3,
        "text": "Dandelion, into the wind you go"
      },
      {
        "time": 128,
        "text": "Won't you let my darling know that"
      },
      {
        "time": 131.7,
        "text": "I'm in a field of dandelions"
      },
      {
        "time": 135.4,
        "text": "Wishing on every one that you'd be mine, mine"
      },
      {
        "time": 139.1,
        "text": "And I see forever in your eyes"
      },
      {
        "time": 142.8,
        "text": "I feel okay when I see you smile, smile"
      },
      {
        "time": 146.5,
        "text": "Wishing on dandelions all of the time"
      },
      {
        "time": 150.2,
        "text": "Praying to God that one day you'll be mine"
      },
      {
        "time": 153.9,
        "text": "Wishing on dandelions all of the time, all of the time"
      },
      {
        "time": 157.6,
        "text": "I'm in a field of dandelions"
      },
      {
        "time": 161.3,
        "text": "Wishing on every one that you'd be mine, mine"
      }
    ]
  },
  "song-1788892162979": {
    "en": [
      {
        "time": 8.3,
        "text": "There was a time when I was alone"
      },
      {
        "time": 11.6,
        "text": "Nowhere to go and no place to call home"
      },
      {
        "time": 15.4,
        "text": "My only friend was the man in the Moon"
      },
      {
        "time": 18.9,
        "text": "And even, sometimes, he would go away, too"
      },
      {
        "time": 23.3,
        "text": "Then one night, as I closed my eyes"
      },
      {
        "time": 27.5,
        "text": "I saw a shadow flying high"
      },
      {
        "time": 31.1,
        "text": "He came to me with the sweetest smile"
      },
      {
        "time": 34.8,
        "text": "Told me he wanted to talk for a while"
      },
      {
        "time": 37.9,
        "text": "He said, \"Peter Pan, that's what they call me"
      },
      {
        "time": 43.3,
        "text": "I promise that you'll never be lonely\""
      },
      {
        "time": 46.8,
        "text": "And ever since that day"
      },
      {
        "time": 54.7,
        "text": "I am a Lost Boy from Neverland"
      },
      {
        "time": 57.8,
        "text": "Usually hanging out with Peter Pan"
      },
      {
        "time": 62.3,
        "text": "And when we're bored, we play in the woods"
      },
      {
        "time": 66.2,
        "text": "Always on the run from Captain Hook"
      },
      {
        "time": 69.7,
        "text": "\"Run, run, Lost Boy\", they say to me"
      },
      {
        "time": 76.7,
        "text": "\"Away from all of reality\""
      },
      {
        "time": 85.4,
        "text": "Neverland is home to Lost Boys like me"
      },
      {
        "time": 88.8,
        "text": "And Lost Boys like me are free"
      },
      {
        "time": 92.9,
        "text": "Neverland is home to Lost Boys like me"
      },
      {
        "time": 96.9,
        "text": "And Lost Boys like me are free"
      },
      {
        "time": 100.8,
        "text": "He sprinkled me in pixie dust and told me to believe"
      },
      {
        "time": 104.4,
        "text": "Believe in him and believe in me"
      },
      {
        "time": 108,
        "text": "Together, we will fly away in a cloud of green"
      },
      {
        "time": 113.1,
        "text": "To your beautiful destiny"
      },
      {
        "time": 115.3,
        "text": "As we soared above the town that never loved me"
      },
      {
        "time": 120,
        "text": "I realized I finally had a family"
      },
      {
        "time": 123.9,
        "text": "Soon enough, we reached Neverland"
      },
      {
        "time": 127.5,
        "text": "Peacefully, my feet hit the sand"
      },
      {
        "time": 132.2,
        "text": "And ever since that day"
      },
      {
        "time": 140.2,
        "text": "I am a Lost Boy from Neverland"
      },
      {
        "time": 143,
        "text": "Usually hanging out with Peter Pan"
      },
      {
        "time": 147.1,
        "text": "And when we're bored, we play in the woods"
      },
      {
        "time": 151.7,
        "text": "Always on the run from Captain Hook"
      },
      {
        "time": 155.1,
        "text": "\"Run, run, Lost Boy\", they say to me"
      },
      {
        "time": 162.5,
        "text": "\"Away from all of reality\""
      },
      {
        "time": 170.9,
        "text": "Neverland is home to Lost Boys like me"
      },
      {
        "time": 174.2,
        "text": "And Lost Boys like me are free"
      },
      {
        "time": 178.3,
        "text": "Neverland is home to Lost Boys like me"
      },
      {
        "time": 181.6,
        "text": "And Lost Boys like me are free"
      },
      {
        "time": 186,
        "text": "Peter Pan, Tinker Bell, Wendy Darling"
      },
      {
        "time": 189.4,
        "text": "Even Captain Hook, you are my perfect storybook"
      },
      {
        "time": 193.8,
        "text": "Neverland, I love you so"
      },
      {
        "time": 196.1,
        "text": "You are now my home sweet home"
      },
      {
        "time": 197.7,
        "text": "Forever a Lost Boy at last"
      },
      {
        "time": 201.1,
        "text": "Peter Pan, Tinker Bell, Wendy Darling"
      },
      {
        "time": 206.1,
        "text": "Even Captain Hook, you are my perfect storybook"
      },
      {
        "time": 208.7,
        "text": "Neverland, I love you so"
      },
      {
        "time": 210.1,
        "text": "You are now my home sweet home"
      },
      {
        "time": 213.1,
        "text": "Forever a Lost Boy at last"
      },
      {
        "time": 216.4,
        "text": "And for always, I will say"
      },
      {
        "time": 225.8,
        "text": "I am a Lost Boy from Neverland"
      },
      {
        "time": 228.8,
        "text": "Usually hanging out with Peter Pan"
      },
      {
        "time": 232.9,
        "text": "And when we're bored, we play in the woods"
      },
      {
        "time": 237.1,
        "text": "Always on the run from Captain Hook"
      },
      {
        "time": 239.7,
        "text": "\"Run, run, Lost Boy\", they say to me"
      },
      {
        "time": 247.9,
        "text": "\"Away from all of reality\""
      },
      {
        "time": 256.4,
        "text": "Neverland is home to Lost Boys like me"
      },
      {
        "time": 259.6,
        "text": "And Lost Boys like me are free"
      },
      {
        "time": 263.7,
        "text": "Neverland is home to Lost Boys like me"
      },
      {
        "time": 267.2,
        "text": "And Lost Boys like me are free"
      }
    ]
  },
  "song-1788891985145": {
    "en": [
      {
        "time": 3.1,
        "text": "If I were a boy, even just for a day"
      },
      {
        "time": 12,
        "text": "I'd roll outta bed in the mornin'"
      },
      {
        "time": 17.1,
        "text": "And throw on what I wanted, then go"
      },
      {
        "time": 24.1,
        "text": "Drink beer with the guys"
      },
      {
        "time": 29.1,
        "text": "And chase after girls"
      },
      {
        "time": 35.1,
        "text": "I'd kick it with who I wanted"
      },
      {
        "time": 39.1,
        "text": "And I'd never get confronted for it"
      },
      {
        "time": 42,
        "text": "'Cause they'd stick up for me"
      },
      {
        "time": 44,
        "text": "If I were a boy"
      },
      {
        "time": 50,
        "text": "I think I could understand"
      },
      {
        "time": 57.1,
        "text": "How it feels to love a girl"
      },
      {
        "time": 60,
        "text": "I swear I'd be a better man"
      },
      {
        "time": 66,
        "text": "I'd listen to her"
      },
      {
        "time": 71,
        "text": "'Cause I know how it hurts"
      },
      {
        "time": 78,
        "text": "When you lose the one you wanted"
      },
      {
        "time": 81.1,
        "text": "'Cause he's taken you for granted"
      },
      {
        "time": 84.1,
        "text": "And everything you had got destroyed"
      },
      {
        "time": 88.1,
        "text": "If I were a boy"
      },
      {
        "time": 93.1,
        "text": "I would turn off my phone"
      },
      {
        "time": 100,
        "text": "Tell everyone it's broken"
      },
      {
        "time": 103.1,
        "text": "So they'd think that I was sleepin' alone"
      },
      {
        "time": 109.1,
        "text": "I'd put myself first"
      },
      {
        "time": 114.1,
        "text": "And make the rules as I go"
      },
      {
        "time": 121,
        "text": "'Cause I know that she'd be faithful"
      },
      {
        "time": 124.1,
        "text": "Waitin' for me to come home, to come home"
      },
      {
        "time": 131,
        "text": "If I were a boy"
      },
      {
        "time": 135,
        "text": "I think I could understand"
      },
      {
        "time": 142.1,
        "text": "How it feels to love a girl"
      },
      {
        "time": 145.1,
        "text": "I swear I'd be a better man"
      },
      {
        "time": 152,
        "text": "I'd listen to her"
      },
      {
        "time": 157.1,
        "text": "'Cause I know how it hurts"
      },
      {
        "time": 163.1,
        "text": "When you lose the one you wanted (wanted)"
      },
      {
        "time": 167,
        "text": "'Cause he's taken you for granted (granted)"
      },
      {
        "time": 170,
        "text": "And everything you had got destroyed"
      },
      {
        "time": 176,
        "text": "It's a little too late for you to come back"
      },
      {
        "time": 182.1,
        "text": "Say it's just a mistake"
      },
      {
        "time": 183.1,
        "text": "Think I'd forgive you like that"
      },
      {
        "time": 186.1,
        "text": "If you thought I would wait for you"
      },
      {
        "time": 190.1,
        "text": "You thought wrong"
      },
      {
        "time": 196,
        "text": "But you're just a boy"
      },
      {
        "time": 201,
        "text": "You don't understand"
      },
      {
        "time": 204.1,
        "text": "Yeah, you don't understand, oh"
      },
      {
        "time": 208.1,
        "text": "How it feels to love a girl, someday"
      },
      {
        "time": 211,
        "text": "You'll wish you were a better man"
      },
      {
        "time": 217,
        "text": "You don't listen to her"
      },
      {
        "time": 222.1,
        "text": "You don't care how it hurts"
      },
      {
        "time": 228,
        "text": "Until you lose the one you wanted"
      },
      {
        "time": 232.1,
        "text": "'Cause you've taken her for granted"
      },
      {
        "time": 235.1,
        "text": "And everything you have got destroyed"
      },
      {
        "time": 241,
        "text": "But you're just a boy"
      }
    ]
  },
  "song-1788891740529": {
    "en": [
      {
        "time": 2.7,
        "text": "Da da da da"
      },
      {
        "time": 9.9,
        "text": "The smell of your skin lingers on me now"
      },
      {
        "time": 16.4,
        "text": "You're probably on your flight back to your home town"
      },
      {
        "time": 23.6,
        "text": "I need some shelter of my own protection, baby"
      },
      {
        "time": 33.6,
        "text": "To be with myself and center"
      },
      {
        "time": 38.1,
        "text": "Clarity, peace, serenity"
      },
      {
        "time": 43.5,
        "text": "I hope you know, I hope you know"
      },
      {
        "time": 48.9,
        "text": "That this has nothing to do with you"
      },
      {
        "time": 51.7,
        "text": "It's personal, myself and I"
      },
      {
        "time": 58.1,
        "text": "We've got some straightenin' out to do"
      },
      {
        "time": 60.7,
        "text": "And I'm gonna miss you like a child misses their blanket"
      },
      {
        "time": 65.2,
        "text": "But I've got to get a move on with my life"
      },
      {
        "time": 69,
        "text": "It's time to be a big girl now"
      },
      {
        "time": 75.2,
        "text": "And big girls don't cry"
      },
      {
        "time": 79.8,
        "text": "Don't cry"
      },
      {
        "time": 82.5,
        "text": "Don't cry"
      },
      {
        "time": 84.3,
        "text": "Don't cry"
      },
      {
        "time": 87,
        "text": "The path that I'm walking"
      },
      {
        "time": 90.6,
        "text": "I must go alone"
      },
      {
        "time": 94.3,
        "text": "I must take the baby steps till I'm full grown, full grown"
      },
      {
        "time": 102.5,
        "text": "Fairy tales don't always have a happy ending, do they?"
      },
      {
        "time": 111.5,
        "text": "And I foresee the dark ahead if I stay"
      },
      {
        "time": 118.7,
        "text": "I hope you know, I hope you know"
      },
      {
        "time": 125,
        "text": "That this has nothing to do with you"
      },
      {
        "time": 127.9,
        "text": "It's personal, myself and I"
      },
      {
        "time": 133.2,
        "text": "We've got some straightenin' out to do"
      },
      {
        "time": 136.9,
        "text": "And I'm gonna miss you like a child misses their blanket"
      },
      {
        "time": 141.4,
        "text": "But I've got to get a move on with my life"
      },
      {
        "time": 145.1,
        "text": "It's time to be a big girl now"
      },
      {
        "time": 151.3,
        "text": "And big girls don't cry"
      },
      {
        "time": 154.1,
        "text": "Like the little school mate in the school yard"
      },
      {
        "time": 157.7,
        "text": "We'll play jacks and Uno cards"
      },
      {
        "time": 162.4,
        "text": "I'll be your best friend, and you'll be mine"
      },
      {
        "time": 166.1,
        "text": "Valentine"
      },
      {
        "time": 171.4,
        "text": "Yes, you can hold my hand if you want to"
      },
      {
        "time": 175.1,
        "text": "'Cause I want to hold yours too"
      },
      {
        "time": 178.8,
        "text": "We'll be playmates and lovers, and share our secret worlds"
      },
      {
        "time": 185.9,
        "text": "But it's time for me to go home"
      },
      {
        "time": 193.3,
        "text": "It's getting late and dark outside"
      },
      {
        "time": 198.6,
        "text": "I need to be with myself and center"
      },
      {
        "time": 203.2,
        "text": "Clarity, peace, serenity"
      },
      {
        "time": 206.8,
        "text": "I hope you know, I hope you know"
      },
      {
        "time": 213.1,
        "text": "That this has nothing to do with you"
      },
      {
        "time": 215.9,
        "text": "It's personal, myself and I"
      },
      {
        "time": 221.4,
        "text": "We've got some straightenin' out to do"
      },
      {
        "time": 224.9,
        "text": "And I'm gonna miss you like a child misses their blanket"
      },
      {
        "time": 229.4,
        "text": "But I've got to get a move on with my life"
      },
      {
        "time": 233.1,
        "text": "It's time to be a big girl now"
      },
      {
        "time": 239.5,
        "text": "And big girls don't cry"
      },
      {
        "time": 244,
        "text": "Don't cry"
      },
      {
        "time": 246.7,
        "text": "Don't cry"
      },
      {
        "time": 247.6,
        "text": "Don't cry"
      },
      {
        "time": 251.2,
        "text": "La da da da da da"
      }
    ]
  },
  "song-1788891497848": {
    "en": [
      {
        "time": 36.4,
        "text": "Picture perfect memories"
      },
      {
        "time": 38.8,
        "text": "Scattered all around the floor"
      },
      {
        "time": 45.5,
        "text": "Reaching for the phone cause"
      },
      {
        "time": 47.8,
        "text": "I can't fight it anymore"
      },
      {
        "time": 53.3,
        "text": "And I wonder if I ever cross your mind"
      },
      {
        "time": 61.9,
        "text": "For me it happens all the time"
      },
      {
        "time": 67.2,
        "text": "It's a quarter after one"
      },
      {
        "time": 69.6,
        "text": "I'm all alone and I need you now"
      },
      {
        "time": 76.2,
        "text": "Said I wouldn't call, but I lost all control"
      },
      {
        "time": 80.2,
        "text": "And I need you now"
      },
      {
        "time": 84.7,
        "text": "And I don't know how I can do without"
      },
      {
        "time": 89.6,
        "text": "I just need you now"
      },
      {
        "time": 100.7,
        "text": "Another shot of whisky"
      },
      {
        "time": 103.3,
        "text": "Can't stop looking at the door"
      },
      {
        "time": 109.9,
        "text": "Wishing you'd come sweeping in the way you did before"
      },
      {
        "time": 117.7,
        "text": "And I wonder if I ever cross your mind"
      },
      {
        "time": 126.3,
        "text": "For me it happens all the time"
      },
      {
        "time": 131.6,
        "text": "It's a quarter after one"
      },
      {
        "time": 134,
        "text": "I'm a little drunk and I need you now"
      },
      {
        "time": 140.6,
        "text": "Said I wouldn't call, but I lost all control"
      },
      {
        "time": 144.5,
        "text": "And I need you now"
      },
      {
        "time": 149,
        "text": "And I don't know how I can do without"
      },
      {
        "time": 154,
        "text": "I just need you now"
      },
      {
        "time": 164.7,
        "text": "(Whoa-whoa)"
      },
      {
        "time": 173.3,
        "text": "Guess I rather hurt than feel nothing at all"
      },
      {
        "time": 182.4,
        "text": "It's a quarter after one"
      },
      {
        "time": 185,
        "text": "I'm all alone and I need you now"
      },
      {
        "time": 190.6,
        "text": "And I said I wouldn't call"
      },
      {
        "time": 193.5,
        "text": "But I'm a little drunk and I need you now"
      },
      {
        "time": 199.8,
        "text": "And I don't know how I can do without"
      },
      {
        "time": 205.2,
        "text": "I just need you now"
      },
      {
        "time": 213,
        "text": "I just need you now"
      },
      {
        "time": 231.5,
        "text": "Oh, baby, I need you now"
      }
    ]
  },
  "song-1788891323626": {
    "en": [
      {
        "time": 1.5,
        "text": "Ooh, ooh, ooh"
      },
      {
        "time": 14.7,
        "text": "I will not make the same mistakes that you did"
      },
      {
        "time": 20.5,
        "text": "I will not let myself cause my heart so much misery"
      },
      {
        "time": 28.5,
        "text": "I will not break the way you did, you fell so hard"
      },
      {
        "time": 35.3,
        "text": "I've learned the hard way to never let it get that far"
      },
      {
        "time": 42.4,
        "text": "Because of you"
      },
      {
        "time": 44,
        "text": "I never stray too far from the sidewalk"
      },
      {
        "time": 49,
        "text": "Because of you"
      },
      {
        "time": 50.6,
        "text": "I learned to play on the safe side, so I don't get hurt"
      },
      {
        "time": 56.1,
        "text": "Because of you"
      },
      {
        "time": 57.4,
        "text": "I find it hard to trust not only me, but everyone around me"
      },
      {
        "time": 63.1,
        "text": "Because of you, I am afraid"
      },
      {
        "time": 71.5,
        "text": "I lose my way"
      },
      {
        "time": 74.1,
        "text": "And it's not too long before you point it out"
      },
      {
        "time": 78.2,
        "text": "I cannot cry"
      },
      {
        "time": 81,
        "text": "Because I know that's weakness in your eyes"
      },
      {
        "time": 85,
        "text": "I'm forced to fake a smile, a laugh, every day of my life"
      },
      {
        "time": 91.9,
        "text": "My heart can't possibly break"
      },
      {
        "time": 94.6,
        "text": "When it wasn't even whole to start with"
      },
      {
        "time": 98.8,
        "text": "Because of you"
      },
      {
        "time": 100.6,
        "text": "I never stray too far from the sidewalk"
      },
      {
        "time": 105.6,
        "text": "Because of you"
      },
      {
        "time": 107.1,
        "text": "I learned to play on the safe side, so I don't get hurt"
      },
      {
        "time": 112.4,
        "text": "Because of you"
      },
      {
        "time": 114,
        "text": "I find it hard to trust not only me, but everyone around me"
      },
      {
        "time": 119.6,
        "text": "Because of you"
      },
      {
        "time": 122.9,
        "text": "I am afraid"
      },
      {
        "time": 126.5,
        "text": "I watched you die, I heard you cry every night in your sleep (I watched you die, in your sleep)"
      },
      {
        "time": 133,
        "text": "I was so young, you should have known better than to lean on me (I was too young for you to lean on me)"
      },
      {
        "time": 139.8,
        "text": "You never thought of anyone else, you just saw your pain (You never saw me)"
      },
      {
        "time": 146.8,
        "text": "And now I cry in the middle of the night"
      },
      {
        "time": 150.4,
        "text": "For the same damn thing"
      },
      {
        "time": 157.2,
        "text": "Because of you"
      },
      {
        "time": 159,
        "text": "I never stray too far from the sidewalk"
      },
      {
        "time": 164,
        "text": "Because of you"
      },
      {
        "time": 165.5,
        "text": "I learned to play on the safe side, so I don't get hurt"
      },
      {
        "time": 170.8,
        "text": "Because of you"
      },
      {
        "time": 172.4,
        "text": "I try my hardest just to forget everything"
      },
      {
        "time": 177.7,
        "text": "Because of you"
      },
      {
        "time": 179.3,
        "text": "I don't know how to let anyone else in"
      },
      {
        "time": 184.7,
        "text": "Because of you"
      },
      {
        "time": 186.3,
        "text": "I'm ashamed of my life, because it's empty"
      },
      {
        "time": 191.6,
        "text": "Because of you"
      },
      {
        "time": 193.5,
        "text": "I am afraid"
      },
      {
        "time": 198.5,
        "text": "Because of you (ooh)"
      },
      {
        "time": 205.4,
        "text": "Because of you (ooh, ooh)"
      }
    ]
  },
  "song-1788891136665": {
    "en": [
      {
        "time": 5.5,
        "text": "Was there a lifetime waiting for us in a world where I was yours?"
      },
      {
        "time": 14.4,
        "text": "Paper planes and porcelain"
      },
      {
        "time": 19.8,
        "text": "Smell of rain through the window pane"
      },
      {
        "time": 24.9,
        "text": "And the sight of you"
      },
      {
        "time": 28.4,
        "text": "Oh, you were a good dream"
      },
      {
        "time": 33.2,
        "text": "I was scared to lose you then"
      },
      {
        "time": 38.5,
        "text": "But secrets turn into regrets"
      },
      {
        "time": 43.2,
        "text": "Buried feelings grow"
      },
      {
        "time": 47.1,
        "text": "Oh, you were a good dream"
      },
      {
        "time": 53.1,
        "text": "Was there a lifetime waiting for us in a world where I was yours?"
      },
      {
        "time": 63.7,
        "text": "Was it the wrong time, what if we tried giving in a little more"
      },
      {
        "time": 72,
        "text": "To the warmth we had before?"
      },
      {
        "time": 81.3,
        "text": "Tangled with another's eyes"
      },
      {
        "time": 86.8,
        "text": "Never mind, you were never mine"
      },
      {
        "time": 92.1,
        "text": "Glimpse of me and you"
      },
      {
        "time": 95,
        "text": "Oh, you were a good dream"
      },
      {
        "time": 98.7,
        "text": "Was there a lifetime waiting for us in a world where I was yours?"
      },
      {
        "time": 109,
        "text": "Was it the wrong time, what if we tried giving in a little more?"
      },
      {
        "time": 117.4,
        "text": "I'd spend a lifetime waiting in vain just to go back to the way we were before"
      },
      {
        "time": 130.6,
        "text": "Was it the wrong time, what if we tried giving in a little more"
      },
      {
        "time": 138.6,
        "text": "To the warmth we had before?"
      },
      {
        "time": 144.1,
        "text": "Is there a lifetime waiting for us?"
      },
      {
        "time": 150.7,
        "text": "All this time, I have been yours"
      }
    ]
  },
  "song-1788890965772": {
    "en": [
      {
        "time": 12,
        "text": "And I'd give up forever to touch you"
      },
      {
        "time": 16.4,
        "text": "'Cause I know that you feel me somehow"
      },
      {
        "time": 21,
        "text": "You're the closest to heaven that I'll ever be"
      },
      {
        "time": 25.8,
        "text": "And I don't want to go home right now"
      },
      {
        "time": 30.8,
        "text": "And all I can taste is this moment"
      },
      {
        "time": 35.6,
        "text": "And all I can breathe is your life"
      },
      {
        "time": 40.1,
        "text": "And sooner or later, it's over"
      },
      {
        "time": 44.5,
        "text": "I just don't wanna miss you tonight"
      },
      {
        "time": 49.2,
        "text": "And I don't want the world to see me"
      },
      {
        "time": 53.9,
        "text": "'Cause I don't think that they'd understand"
      },
      {
        "time": 58.8,
        "text": "When everything's made to be broken"
      },
      {
        "time": 63.3,
        "text": "I just want you to know who I am"
      },
      {
        "time": 79.9,
        "text": "And you can't fight the tears that ain't coming"
      },
      {
        "time": 84.2,
        "text": "Or the moment of truth in your lies"
      },
      {
        "time": 89.4,
        "text": "When everything feels like the movies"
      },
      {
        "time": 93.8,
        "text": "Yeah, you bleed just to know, you're alive"
      },
      {
        "time": 98.8,
        "text": "And I don't want the world to see me"
      },
      {
        "time": 103.4,
        "text": "'Cause I don't think that they'd understand"
      },
      {
        "time": 108.3,
        "text": "When everything's made to be broken"
      },
      {
        "time": 112.8,
        "text": "I just want you to know who I am"
      },
      {
        "time": 210.5,
        "text": "And I don't want the world to see me"
      },
      {
        "time": 215.2,
        "text": "'Cause I don't think that they'd understand"
      },
      {
        "time": 220.2,
        "text": "When everything's made to be broken"
      },
      {
        "time": 224.5,
        "text": "I just want you to know who I am"
      },
      {
        "time": 231.4,
        "text": "And I don't want the world to see me"
      },
      {
        "time": 236,
        "text": "'Cause I don't think that they'd understand"
      },
      {
        "time": 240.6,
        "text": "When everything's made to be broken"
      },
      {
        "time": 245,
        "text": "I just want you to know who I am"
      },
      {
        "time": 249.5,
        "text": "I just want you to know who I am"
      },
      {
        "time": 254.1,
        "text": "I just want you to know who I am"
      },
      {
        "time": 258.9,
        "text": "I just want you to know who I am"
      }
    ]
  },
  "song-1788890683979": {
    "en": [
      {
        "time": 10.5,
        "text": "Making my way downtown"
      },
      {
        "time": 12.3,
        "text": "Walking fast, faces pass and I'm homebound"
      },
      {
        "time": 20.7,
        "text": "Staring blankly ahead"
      },
      {
        "time": 22.3,
        "text": "Just making my way"
      },
      {
        "time": 23.6,
        "text": "Making a way through the crowd"
      },
      {
        "time": 32,
        "text": "And I need you"
      },
      {
        "time": 34.6,
        "text": "And I miss you"
      },
      {
        "time": 37.6,
        "text": "And now I wonder"
      },
      {
        "time": 40.6,
        "text": "If I could fall into the sky"
      },
      {
        "time": 45.9,
        "text": "Do you think time would pass me by?"
      },
      {
        "time": 50.8,
        "text": "'Cause you know I'd walk a thousand miles"
      },
      {
        "time": 55.5,
        "text": "If I could just see you tonight"
      },
      {
        "time": 66.3,
        "text": "It's always times like these when I think of you"
      },
      {
        "time": 69.2,
        "text": "And wonder if you ever think of me"
      },
      {
        "time": 76.2,
        "text": "'Cause everything's so wrong, and I don't belong"
      },
      {
        "time": 79,
        "text": "Living in your precious memory"
      },
      {
        "time": 87.5,
        "text": "'Cause I need you"
      },
      {
        "time": 90.3,
        "text": "And I miss you"
      },
      {
        "time": 93,
        "text": "And now I wonder"
      },
      {
        "time": 96.1,
        "text": "If I could fall into the sky"
      },
      {
        "time": 101,
        "text": "Do you think time would pass me by?"
      },
      {
        "time": 105.7,
        "text": "Oh, 'cause you know I'd walk a thousand miles"
      },
      {
        "time": 110.5,
        "text": "If I could just see you tonight"
      },
      {
        "time": 126.3,
        "text": "And I, I don't wanna let you know"
      },
      {
        "time": 131.5,
        "text": "I, I drown in your memory"
      },
      {
        "time": 136.7,
        "text": "I, I don't wanna let this go"
      },
      {
        "time": 141.9,
        "text": "I, I don't"
      },
      {
        "time": 147.2,
        "text": "Making my way downtown"
      },
      {
        "time": 149.4,
        "text": "Walking fast, faces pass and I'm homebound"
      },
      {
        "time": 157.4,
        "text": "Staring blankly ahead, just making my way"
      },
      {
        "time": 160.4,
        "text": "Making a way through the crowd"
      },
      {
        "time": 168.4,
        "text": "And I still need you"
      },
      {
        "time": 170.8,
        "text": "And I still miss you"
      },
      {
        "time": 174,
        "text": "And now I wonder"
      },
      {
        "time": 178.2,
        "text": "If I could fall into the sky"
      },
      {
        "time": 183.5,
        "text": "Do you think time would pass us by?"
      },
      {
        "time": 188.6,
        "text": "'Cause you know I'd walk a thousand miles"
      },
      {
        "time": 193,
        "text": "If I could just see you, oh-oh"
      },
      {
        "time": 199.1,
        "text": "If I could fall into the sky"
      },
      {
        "time": 203.6,
        "text": "Do you think time would pass me by?"
      },
      {
        "time": 208.4,
        "text": "'Cause you know I'd walk a thousand miles"
      },
      {
        "time": 213.5,
        "text": "If I could just see you"
      },
      {
        "time": 218.9,
        "text": "If I could just hold you tonight"
      }
    ]
  },
  "song-1788890431663": {
    "en": [
      {
        "time": 2.1,
        "text": "Uh-huh, life's like this"
      },
      {
        "time": 6.8,
        "text": "Uh-huh, uh-huh, that's the way it is"
      },
      {
        "time": 16.7,
        "text": "'Cause life's like this"
      },
      {
        "time": 19.4,
        "text": "Uh-huh, uh-huh, that's the way it is"
      },
      {
        "time": 23.6,
        "text": "Chill out, what you yelling for?"
      },
      {
        "time": 28.8,
        "text": "Lay back, it's all been done before"
      },
      {
        "time": 32.5,
        "text": "And if you could only let it be"
      },
      {
        "time": 35.9,
        "text": "You would see"
      },
      {
        "time": 38.4,
        "text": "I like you the way you are"
      },
      {
        "time": 41.6,
        "text": "When we're driving in your car"
      },
      {
        "time": 44.4,
        "text": "And you're talking to me, one on one"
      },
      {
        "time": 48.6,
        "text": "But you've become"
      },
      {
        "time": 50.9,
        "text": "Somebody else 'round everyone else"
      },
      {
        "time": 53.4,
        "text": "You're watching your back like you can't relax"
      },
      {
        "time": 57,
        "text": "You're trying to be cool"
      },
      {
        "time": 58.8,
        "text": "You look like a fool to me"
      },
      {
        "time": 61.6,
        "text": "Tell me"
      },
      {
        "time": 63.3,
        "text": "Why do you have to go and make things so complicated?"
      },
      {
        "time": 67.1,
        "text": "I see the way you're acting like you're somebody else"
      },
      {
        "time": 71.4,
        "text": "Gets me frustrated"
      },
      {
        "time": 73.3,
        "text": "Life's like this, you"
      },
      {
        "time": 75.6,
        "text": "You fall, and you crawl, and you break"
      },
      {
        "time": 77.7,
        "text": "And you take what you get, and you turn it into"
      },
      {
        "time": 80.4,
        "text": "Honesty and promise me I'm never gonna find you fake it"
      },
      {
        "time": 85.4,
        "text": "No, no, no"
      },
      {
        "time": 90.9,
        "text": "You come over unannounced"
      },
      {
        "time": 94.1,
        "text": "Dressed up like you're something else"
      },
      {
        "time": 97.2,
        "text": "Where you are and where it's at you see"
      },
      {
        "time": 100.6,
        "text": "You're making me"
      },
      {
        "time": 103,
        "text": "Laugh out, when you strike your pose"
      },
      {
        "time": 106.2,
        "text": "Take off all your preppy clothes"
      },
      {
        "time": 109.2,
        "text": "You know you're not fooling anyone"
      },
      {
        "time": 113,
        "text": "When you become"
      },
      {
        "time": 115.2,
        "text": "Somebody else 'round everyone else"
      },
      {
        "time": 118.2,
        "text": "You're watching your back like you can't relax"
      },
      {
        "time": 121,
        "text": "You're trying to be cool"
      },
      {
        "time": 123.2,
        "text": "You look like a fool to me"
      },
      {
        "time": 125.9,
        "text": "Tell me"
      },
      {
        "time": 127.8,
        "text": "Why do you have to go and make things so complicated?"
      },
      {
        "time": 132,
        "text": "I see the way you're acting like you're somebody else"
      },
      {
        "time": 135.7,
        "text": "Gets me frustrated"
      },
      {
        "time": 138.2,
        "text": "Life's like this, you"
      },
      {
        "time": 140.4,
        "text": "You fall, and you crawl, and you break"
      },
      {
        "time": 142.4,
        "text": "And you take what you get, and you turn it into"
      },
      {
        "time": 145.4,
        "text": "Honesty and promise me I'm never gonna find you fake it"
      },
      {
        "time": 149.4,
        "text": "No, no, no (no, no)"
      },
      {
        "time": 154.8,
        "text": "No, no, no (no, no)"
      },
      {
        "time": 157.4,
        "text": "No, no, no (no, no)"
      },
      {
        "time": 160.5,
        "text": "No, no, no (no, no)"
      },
      {
        "time": 164.6,
        "text": "Chill out, what you yelling for?"
      },
      {
        "time": 167.9,
        "text": "Lay back, it's all been done before"
      },
      {
        "time": 170.8,
        "text": "And if you could only let it be"
      },
      {
        "time": 175.2,
        "text": "You would see"
      },
      {
        "time": 176.9,
        "text": "Somebody else 'round everyone else"
      },
      {
        "time": 179.6,
        "text": "You're watching your back like you can't relax"
      },
      {
        "time": 182.5,
        "text": "You're trying to be cool"
      },
      {
        "time": 184.5,
        "text": "You look like a fool to me"
      },
      {
        "time": 187.6,
        "text": "Tell me"
      },
      {
        "time": 189.4,
        "text": "Why do you have to go and make things so complicated?"
      },
      {
        "time": 193.1,
        "text": "I see the way you're acting like you're somebody else"
      },
      {
        "time": 197,
        "text": "Gets me frustrated"
      },
      {
        "time": 199.8,
        "text": "Life's like this, you"
      },
      {
        "time": 201.9,
        "text": "You fall, and you crawl, and you break"
      },
      {
        "time": 204.1,
        "text": "And you take what you get, and you turn it into"
      },
      {
        "time": 207.6,
        "text": "Honesty and promise me I'm never gonna find you fake it"
      },
      {
        "time": 212.3,
        "text": "No, no"
      },
      {
        "time": 213.9,
        "text": "Why do you have to go and make things so complicated?"
      },
      {
        "time": 218.2,
        "text": "I see the way you're acting like you're somebody else"
      },
      {
        "time": 221.8,
        "text": "Gets me frustrated"
      },
      {
        "time": 224.6,
        "text": "Life's like this, you"
      },
      {
        "time": 226.5,
        "text": "You fall, and you crawl, and you break"
      },
      {
        "time": 228.7,
        "text": "And you take what you get, and you turn it into"
      },
      {
        "time": 232.2,
        "text": "Honesty and promise me I'm never gonna find you fake it"
      },
      {
        "time": 236.7,
        "text": "No, no, no"
      }
    ]
  },
  "song-1788889272275": {
    "en": [
      {
        "time": 2.4,
        "text": "Mmm, mmm, mmm"
      },
      {
        "time": 8.2,
        "text": "Flowers in hand, waiting for me"
      },
      {
        "time": 12.5,
        "text": "Every word in poetry"
      },
      {
        "time": 16.3,
        "text": "Won't call me by name, only \"baby\""
      },
      {
        "time": 20.2,
        "text": "The more that you give, the less that I need"
      },
      {
        "time": 24,
        "text": "Everyone says I look happy"
      },
      {
        "time": 29,
        "text": "When it feels right"
      },
      {
        "time": 33,
        "text": "I know that you're wrong for me"
      },
      {
        "time": 36.8,
        "text": "Gonna wish we never met on the day I leave"
      },
      {
        "time": 41,
        "text": "I brought you down to your knees"
      },
      {
        "time": 44.7,
        "text": "'Cause they say that misery loves company"
      },
      {
        "time": 48.7,
        "text": "It's not your fault I ruin everything"
      },
      {
        "time": 52.3,
        "text": "And it's not your fault I can't be what you need"
      },
      {
        "time": 55.9,
        "text": "Baby, angels like you can't fly down hell with me"
      },
      {
        "time": 62.4,
        "text": "I'm everything they said I would be"
      },
      {
        "time": 67.5,
        "text": "La-la-la"
      },
      {
        "time": 70.1,
        "text": "I'm everything they said I would be"
      },
      {
        "time": 73.6,
        "text": "I'll put you down slow, love you goodbye"
      },
      {
        "time": 77.6,
        "text": "Before you let go, just one more time"
      },
      {
        "time": 81.4,
        "text": "Take off your clothes, pretend that it's fine"
      },
      {
        "time": 85.2,
        "text": "A little more hurt won't kill you"
      },
      {
        "time": 87.9,
        "text": "Tonight, mother says, \"You don't look happy\""
      },
      {
        "time": 93.9,
        "text": "Close your eyes"
      },
      {
        "time": 98,
        "text": "I know that you're wrong for me"
      },
      {
        "time": 101.6,
        "text": "Gonna wish we never met on the day I leave"
      },
      {
        "time": 105.9,
        "text": "I brought you down to your knees"
      },
      {
        "time": 109.6,
        "text": "'Cause they say that misery loves company"
      },
      {
        "time": 113.6,
        "text": "It's not your fault I ruin everything"
      },
      {
        "time": 117.3,
        "text": "And it's not your fault I can't be what you need"
      },
      {
        "time": 121,
        "text": "Baby, angels like you can't fly down hell with me"
      },
      {
        "time": 127.3,
        "text": "I'm everything they said I would be"
      },
      {
        "time": 131.6,
        "text": "♪"
      },
      {
        "time": 153,
        "text": "I know that you're wrong for me"
      },
      {
        "time": 156.9,
        "text": "Gonna wish we never met on the day I leave"
      },
      {
        "time": 161.1,
        "text": "I brought you down to your knees"
      },
      {
        "time": 164.8,
        "text": "'Cause they say that misery loves company"
      },
      {
        "time": 168.8,
        "text": "It's not your fault I ruin everything (everything)"
      },
      {
        "time": 172.6,
        "text": "And it's not your fault I can't be what you need"
      },
      {
        "time": 176.1,
        "text": "Baby, angels like you can't fly down hell with me, oh"
      },
      {
        "time": 184.6,
        "text": "Angels like you can't fly down hell with me"
      }
    ]
  },
  "song-1788889000506": {
    "en": [
      {
        "time": 3.4,
        "text": "Summer after high school, when we first met"
      },
      {
        "time": 7.1,
        "text": "We'd make out in your Mustang to Radiohead"
      },
      {
        "time": 10.6,
        "text": "And on my 18th birthday, we got matching tattoos"
      },
      {
        "time": 17.7,
        "text": "Used to steal your parents' liquor and climb to the roof"
      },
      {
        "time": 21.6,
        "text": "Talk about our future like we had a clue"
      },
      {
        "time": 25.1,
        "text": "Never planned that one day, I'd be losing you"
      },
      {
        "time": 30.8,
        "text": "In another life"
      },
      {
        "time": 34.1,
        "text": "I would be your girl"
      },
      {
        "time": 37.6,
        "text": "We'd keep all our promises"
      },
      {
        "time": 41,
        "text": "Be us against the world"
      },
      {
        "time": 45,
        "text": "In another life"
      },
      {
        "time": 48.6,
        "text": "I would make you stay"
      },
      {
        "time": 51.7,
        "text": "So I don't have to say you were"
      },
      {
        "time": 55.3,
        "text": "The one that got away"
      },
      {
        "time": 59,
        "text": "The one that got away"
      },
      {
        "time": 62.6,
        "text": "I was June, and you were my Johnny Cash"
      },
      {
        "time": 66.1,
        "text": "Never one without the other, we made a pact"
      },
      {
        "time": 70,
        "text": "Sometimes when I miss you, I put those records on, whoa"
      },
      {
        "time": 77.1,
        "text": "Someone said you had your tattoo removed"
      },
      {
        "time": 80.8,
        "text": "Saw you downtown singing the blues"
      },
      {
        "time": 84.3,
        "text": "It's time to face the music, I'm no longer your muse"
      },
      {
        "time": 89.6,
        "text": "But in another life"
      },
      {
        "time": 93.4,
        "text": "I would be your girl"
      },
      {
        "time": 96.8,
        "text": "We'd keep all our promises"
      },
      {
        "time": 99.9,
        "text": "Be us against the world"
      },
      {
        "time": 104.1,
        "text": "In another life"
      },
      {
        "time": 107.5,
        "text": "I would make you stay"
      },
      {
        "time": 111,
        "text": "So I don't have to say you were"
      },
      {
        "time": 114.4,
        "text": "The one that got away"
      },
      {
        "time": 118.3,
        "text": "The one that got away"
      },
      {
        "time": 121.7,
        "text": "The one"
      },
      {
        "time": 125.2,
        "text": "The one"
      },
      {
        "time": 128.9,
        "text": "The one"
      },
      {
        "time": 132.4,
        "text": "The one that got away"
      },
      {
        "time": 136,
        "text": "All this money can't buy me a time machine, no"
      },
      {
        "time": 143.4,
        "text": "Can't replace you with a million rings, no"
      },
      {
        "time": 150.4,
        "text": "I should've told you what you meant to me, whoa"
      },
      {
        "time": 157.6,
        "text": "'Cause now I pay the price"
      },
      {
        "time": 161.4,
        "text": "In another life"
      },
      {
        "time": 164.9,
        "text": "I would be your girl"
      },
      {
        "time": 168.6,
        "text": "We'd keep all our promises"
      },
      {
        "time": 171.8,
        "text": "Be us against the world"
      },
      {
        "time": 175.8,
        "text": "In another life"
      },
      {
        "time": 179.3,
        "text": "I would make you stay"
      },
      {
        "time": 182.5,
        "text": "So I don't have to say you were"
      },
      {
        "time": 186.1,
        "text": "The one that got away"
      },
      {
        "time": 189.9,
        "text": "The one that got away"
      },
      {
        "time": 193.4,
        "text": "The one (the one)"
      },
      {
        "time": 196.9,
        "text": "The one (the one)"
      },
      {
        "time": 200.5,
        "text": "The one (the one)"
      },
      {
        "time": 204.1,
        "text": "In another life"
      },
      {
        "time": 207.8,
        "text": "I would make you stay"
      },
      {
        "time": 211.1,
        "text": "So I don't have to say you were"
      },
      {
        "time": 214.6,
        "text": "The one that got away"
      },
      {
        "time": 218.5,
        "text": "The one that got away"
      }
    ]
  },
  "song-1788888793595": {
    "en": [
      {
        "time": 4.5,
        "text": "You think I'm pretty without any makeup on"
      },
      {
        "time": 8.4,
        "text": "You think I'm funny when I tell the punch line wrong"
      },
      {
        "time": 12.4,
        "text": "I know you get me, so I let my walls come down, down"
      },
      {
        "time": 20.4,
        "text": "Before you met me"
      },
      {
        "time": 22.2,
        "text": "I was alright, but things were kinda heavy"
      },
      {
        "time": 25.9,
        "text": "You brought me to life, now every February"
      },
      {
        "time": 30,
        "text": "You'll be my Valentine, Valentine"
      },
      {
        "time": 35.2,
        "text": "Let's go all the way tonight"
      },
      {
        "time": 39.3,
        "text": "No regrets, just love"
      },
      {
        "time": 43.2,
        "text": "We can dance, until we die"
      },
      {
        "time": 47.4,
        "text": "You and I, will be young forever"
      },
      {
        "time": 52.3,
        "text": "You make me"
      },
      {
        "time": 54.4,
        "text": "Feel like I'm livin' a teenage dream"
      },
      {
        "time": 58.5,
        "text": "The way you turn me on, I can't sleep"
      },
      {
        "time": 62.5,
        "text": "Let's run away and don't ever look back, don't ever look back"
      },
      {
        "time": 68.1,
        "text": "My heart stops"
      },
      {
        "time": 70.6,
        "text": "When you look at me, just one touch"
      },
      {
        "time": 74.3,
        "text": "Now, baby, I believe this is real"
      },
      {
        "time": 78.3,
        "text": "So take a chance and don't ever look back, don't ever look back"
      },
      {
        "time": 84.4,
        "text": "We drove to Cali and got drunk on the beach"
      },
      {
        "time": 88.4,
        "text": "Got a motel and built a fort out of sheets"
      },
      {
        "time": 92.5,
        "text": "I finally found you, my missing puzzle piece"
      },
      {
        "time": 97.5,
        "text": "I'm complete"
      },
      {
        "time": 99.2,
        "text": "Let's go all the way tonight"
      },
      {
        "time": 103.5,
        "text": "No regrets, just love"
      },
      {
        "time": 107.2,
        "text": "We can dance until we die"
      },
      {
        "time": 111.4,
        "text": "You and I, will be young forever"
      },
      {
        "time": 116.1,
        "text": "You make me"
      },
      {
        "time": 118.3,
        "text": "Feel like I'm livin' a teenage dream"
      },
      {
        "time": 122.5,
        "text": "The way you turn me on, I can't sleep"
      },
      {
        "time": 126.4,
        "text": "Let's run away and don't ever look back, don't ever look back"
      },
      {
        "time": 132.1,
        "text": "My heart stops"
      },
      {
        "time": 134.6,
        "text": "When you look at me, just one touch"
      },
      {
        "time": 138.3,
        "text": "Now baby I believe this is real"
      },
      {
        "time": 142.4,
        "text": "So take a chance and don't ever look back, don't ever look back"
      },
      {
        "time": 147.3,
        "text": "I'ma get your heart racing in my skin-tight jeans"
      },
      {
        "time": 151.7,
        "text": "Be your teenage dream tonight"
      },
      {
        "time": 155.2,
        "text": "Let you put your hands on me in my skin-tight jeans"
      },
      {
        "time": 159.6,
        "text": "Be your teenage dream tonight"
      },
      {
        "time": 164,
        "text": "(Tonight, tonight, tonight, tonight, tonight, tonight)"
      },
      {
        "time": 172.8,
        "text": "(You make me feel) You make me"
      },
      {
        "time": 173.7,
        "text": "Feel like I'm livin' a teenage dream"
      },
      {
        "time": 178.4,
        "text": "The way you turn me on, I can't sleep"
      },
      {
        "time": 182.4,
        "text": "Let's run away and don't ever look back, don't ever look back (no)"
      },
      {
        "time": 187.6,
        "text": "My heart stops"
      },
      {
        "time": 190.6,
        "text": "When you look at me, just one touch"
      },
      {
        "time": 194.4,
        "text": "Now, baby, I believe this is real (oh)"
      },
      {
        "time": 198.4,
        "text": "So take a chance and don't ever look back, don't ever look back"
      },
      {
        "time": 203.4,
        "text": "I'ma get your heart racing in my skin-tight jeans"
      },
      {
        "time": 207.7,
        "text": "Be your teenage dream tonight"
      },
      {
        "time": 211.2,
        "text": "Let you put your hands on me in my skin-tight jeans"
      },
      {
        "time": 215.6,
        "text": "Be your teenage dream tonight"
      },
      {
        "time": 220,
        "text": "(Tonight, tonight, tonight, tonight, tonight, tonight)"
      }
    ]
  },
  "song-1788888585117": {
    "en": [
      {
        "time": 0.8,
        "text": "When we're out in a crowd laughing loud"
      },
      {
        "time": 5.2,
        "text": "And nobody knows why"
      },
      {
        "time": 12.7,
        "text": "When we're lost at a club, getting drunk"
      },
      {
        "time": 17.3,
        "text": "And you give me that smile"
      },
      {
        "time": 24.7,
        "text": "Going home in the back of a car"
      },
      {
        "time": 29.2,
        "text": "And your hand touches mine"
      },
      {
        "time": 36.6,
        "text": "When we're done making love"
      },
      {
        "time": 39.7,
        "text": "And you look up and give me those eyes"
      },
      {
        "time": 48,
        "text": "'Cause all of the small things that you do"
      },
      {
        "time": 54.2,
        "text": "Are what remind me why I fell for you"
      },
      {
        "time": 59.9,
        "text": "And when we're apart, and I'm missing you"
      },
      {
        "time": 65.9,
        "text": "I close my eyes and all I see is you"
      },
      {
        "time": 71.7,
        "text": "And the small things you do"
      },
      {
        "time": 84.6,
        "text": "When you call me at night while you're out"
      },
      {
        "time": 89.1,
        "text": "Getting high with your friends (high with your friends)"
      },
      {
        "time": 96.6,
        "text": "Every \"hi\", every \"bye\", every \"I love you\" you've ever said"
      },
      {
        "time": 105.2,
        "text": "(You've ever said)"
      },
      {
        "time": 108,
        "text": "'Cause all of the small things that you do"
      },
      {
        "time": 114,
        "text": "Are what remind me why I fell for you"
      },
      {
        "time": 119.8,
        "text": "And when we're apart, and I'm missing you"
      },
      {
        "time": 126.1,
        "text": "I close my eyes and all I see is you"
      },
      {
        "time": 131.8,
        "text": "And the small things you do"
      },
      {
        "time": 156.5,
        "text": "When we're done making love"
      },
      {
        "time": 159.5,
        "text": "And you look up and give me those eyes"
      },
      {
        "time": 168,
        "text": "'Cause all of the small things that you do"
      },
      {
        "time": 174.1,
        "text": "Are what remind me why I fell for you"
      },
      {
        "time": 179.7,
        "text": "And when we're apart, and I'm missing you"
      },
      {
        "time": 186.1,
        "text": "I close my eyes and all I see is you"
      },
      {
        "time": 191.7,
        "text": "And the small things you do"
      },
      {
        "time": 203.4,
        "text": "All the small things you do"
      }
    ]
  },
  "song-1788888397607": {
    "en": [
      {
        "time": 19.5,
        "text": "Anxiety"
      },
      {
        "time": 20.8,
        "text": "Keep on trying me"
      },
      {
        "time": 22.6,
        "text": "I feel it quietly"
      },
      {
        "time": 24.4,
        "text": "Tryna silence me"
      },
      {
        "time": 26.8,
        "text": "My anxiety"
      },
      {
        "time": 28.4,
        "text": "Can't shake it off of me"
      },
      {
        "time": 30,
        "text": "Somebody's watching me"
      },
      {
        "time": 31.7,
        "text": "And my anxiety"
      },
      {
        "time": 49,
        "text": "Solo, no mojo"
      },
      {
        "time": 50.5,
        "text": "I bounce back, no pogo"
      },
      {
        "time": 52.3,
        "text": "Unhappy, no homo"
      },
      {
        "time": 54,
        "text": "New brands, no logos"
      },
      {
        "time": 56,
        "text": "Money on my juggla, a natural hustler"
      },
      {
        "time": 58.2,
        "text": "Think I need a smuggler up in Russia"
      },
      {
        "time": 60.2,
        "text": "You could be the butler, shine my cutla'"
      },
      {
        "time": 61.9,
        "text": "Shout out to Oyenda, that's the guzzler"
      },
      {
        "time": 64,
        "text": "Okay, next thing, my life is a wet dream"
      },
      {
        "time": 65.5,
        "text": "I call it a sex scene, the bag is a nice tease"
      },
      {
        "time": 67.5,
        "text": "I tried to escape, my life is an X-rate"
      },
      {
        "time": 69.3,
        "text": "I'm sorry, a sex tape, you only get one take"
      },
      {
        "time": 71.1,
        "text": "Quiet on the set, please"
      },
      {
        "time": 72.7,
        "text": "Okay, rolling Anxiety, three, two, one"
      },
      {
        "time": 78.8,
        "text": "Anxiety keep on trying me"
      },
      {
        "time": 81.8,
        "text": "I feel it quietly, tryna silence me, yeah"
      },
      {
        "time": 86,
        "text": "Anxiety, shake it off of me"
      },
      {
        "time": 89.2,
        "text": "Somebody's watching me, it's my anxiety"
      },
      {
        "time": 93,
        "text": "Anxiety, anxie—"
      },
      {
        "time": 94.4,
        "text": "Oh, I feel it tryin'"
      },
      {
        "time": 96.5,
        "text": "Keep it tryin', keep it tryin', oh, I feel the silence"
      },
      {
        "time": 100.4,
        "text": "Keep it quiet, keep it tired, oh, somebody's touching me"
      },
      {
        "time": 104,
        "text": "Anxiety, anxie—"
      },
      {
        "time": 105.7,
        "text": "Oh, I feel anxiety"
      },
      {
        "time": 107.7,
        "text": "My anxie—, my anxie— (It's my anxiety)"
      },
      {
        "time": 109.7,
        "text": "Oh, I feel it tryin' (Can't let it conquer me)"
      },
      {
        "time": 111.3,
        "text": "Keep it tryin', keep it tryin'"
      },
      {
        "time": 113.1,
        "text": "Oh, I feel the silence (It's my anxiety, gotta keep it off of me)"
      },
      {
        "time": 115.7,
        "text": "Keep it quiet, keep it quiet"
      },
      {
        "time": 117,
        "text": "Oh, somebody's watching me (It's my anxiety, can't shake it off of me)"
      },
      {
        "time": 119,
        "text": "Anxiety, anxie— oh, I feel anxiety"
      },
      {
        "time": 120.5,
        "text": "(It's my anxiety, gotta keep it off of me)"
      },
      {
        "time": 122.8,
        "text": "Anxie—, my anxie—"
      },
      {
        "time": 123.5,
        "text": "Oh, I feel it tryin'"
      },
      {
        "time": 126.1,
        "text": "Keep it tryin', keep it tryin'"
      },
      {
        "time": 127.9,
        "text": "Oh, I feel the silence"
      },
      {
        "time": 129.8,
        "text": "Keep it quiet, keep it quiet"
      },
      {
        "time": 131.6,
        "text": "Oh, somebody's watching me"
      },
      {
        "time": 133.8,
        "text": "Anxiety, anxie— oh, I feel anxiety"
      },
      {
        "time": 138.3,
        "text": "Court order from Florida"
      },
      {
        "time": 139.7,
        "text": "What's in that clear blue water?"
      },
      {
        "time": 141.5,
        "text": "No limits no boarders"
      },
      {
        "time": 143.2,
        "text": "What's in that new world order?"
      },
      {
        "time": 145.1,
        "text": "Marco (Marco), Polo (Polo)"
      },
      {
        "time": 147.4,
        "text": "Negro run from popo (Popo)"
      },
      {
        "time": 148.8,
        "text": "That blue light and that rojo (Rojo)"
      },
      {
        "time": 155.3,
        "text": "I just feel like this tightness in my chest"
      },
      {
        "time": 159.2,
        "text": "Like an elephant is standing on me"
      },
      {
        "time": 164.2,
        "text": "Just relax and let it do its thing"
      },
      {
        "time": 168.3,
        "text": "Anxiety keeps on trying me"
      },
      {
        "time": 174.4,
        "text": "Anxiety keeps on trying me"
      },
      {
        "time": 182.1,
        "text": "My anxie—, my anxie—"
      },
      {
        "time": 183.9,
        "text": "Oh, I feel it tryin'"
      },
      {
        "time": 185.4,
        "text": "Keep it tryin', keep it tryin'"
      },
      {
        "time": 187.2,
        "text": "Oh, I feel the silence"
      },
      {
        "time": 189.1,
        "text": "Keep it quiet, keep it quiet"
      },
      {
        "time": 191,
        "text": "Oh, somebody's watching me"
      },
      {
        "time": 192.9,
        "text": "Anxiety, anxie—, oh, I feel anxiety"
      },
      {
        "time": 196.5,
        "text": "It's my anxiety, can't shake it off of me"
      },
      {
        "time": 200.3,
        "text": "It's my anxiety, can't shake it off of me"
      },
      {
        "time": 204.2,
        "text": "It's my anxiety, can't shake it off of me"
      },
      {
        "time": 208.1,
        "text": "It's my anxiety, can't shake it off of me"
      },
      {
        "time": 212.1,
        "text": "Can't shake it off of me, shake, shake it off of me"
      },
      {
        "time": 215.3,
        "text": "Can't shake it off of me, shake, shake it off of me"
      },
      {
        "time": 220.1,
        "text": "Can't shake it off of me, shake, shake it off of me"
      },
      {
        "time": 223.2,
        "text": "Can't shake it off of me, shake, shake it off of me"
      },
      {
        "time": 224.4,
        "text": "It's my anxiety, can't shake it off of me"
      },
      {
        "time": 226.7,
        "text": "It's my anxiety, can't shake it off of me"
      },
      {
        "time": 227.6,
        "text": "It's my anxiety, can't shake it off of me"
      },
      {
        "time": 228.8,
        "text": "It's my anxiety, can't shake it off of me"
      }
    ]
  },
  "song-1788888170738": {
    "en": [
      {
        "time": 0,
        "text": "I'm at a payphone trying to call home"
      },
      {
        "time": 4.3,
        "text": "All of my change I spent on you"
      },
      {
        "time": 8.8,
        "text": "Where have the times gone?"
      },
      {
        "time": 10.9,
        "text": "Baby, it's all wrong"
      },
      {
        "time": 13.1,
        "text": "Where are the plans we made for two?"
      },
      {
        "time": 17.6,
        "text": "Yeah, I, I know it's hard to remember"
      },
      {
        "time": 21.1,
        "text": "The people we used to be"
      },
      {
        "time": 23.2,
        "text": "It's even harder to picture"
      },
      {
        "time": 25.3,
        "text": "That you're not here next to me"
      },
      {
        "time": 27.6,
        "text": "You say it's too late to make it"
      },
      {
        "time": 29.9,
        "text": "But is it too late to try?"
      },
      {
        "time": 32,
        "text": "And in our time that you wasted"
      },
      {
        "time": 33.8,
        "text": "All of our bridges burned down"
      },
      {
        "time": 36.4,
        "text": "I've wasted my nights"
      },
      {
        "time": 38.6,
        "text": "You turned out the lights"
      },
      {
        "time": 40.6,
        "text": "Now I'm paralyzed"
      },
      {
        "time": 43.1,
        "text": "Still stuck in that time, when we called it love"
      },
      {
        "time": 47.4,
        "text": "But even the sun sets in paradise"
      },
      {
        "time": 52.5,
        "text": "I'm at a payphone, trying to call home"
      },
      {
        "time": 56.7,
        "text": "All of my change I spent on you"
      },
      {
        "time": 60.9,
        "text": "Where have the times gone?"
      },
      {
        "time": 63,
        "text": "Baby, it's all wrong"
      },
      {
        "time": 65.5,
        "text": "Where are the plans we made for two?"
      },
      {
        "time": 69.5,
        "text": "If \"happy ever after\" did exist"
      },
      {
        "time": 73.9,
        "text": "I would still be holding you like this"
      },
      {
        "time": 78.3,
        "text": "All those fairy tales are full of shit"
      },
      {
        "time": 82.9,
        "text": "One more fucking love song, I'll be sick, oh"
      },
      {
        "time": 88.8,
        "text": "You turned your back on tomorrow"
      },
      {
        "time": 90.2,
        "text": "'Cause you forgot yesterday"
      },
      {
        "time": 93.4,
        "text": "I gave you my love to borrow"
      },
      {
        "time": 95.6,
        "text": "But you just gave it away"
      },
      {
        "time": 97.3,
        "text": "You can't expect me to be fine"
      },
      {
        "time": 99.7,
        "text": "I don't expect you to care"
      },
      {
        "time": 101.8,
        "text": "I know I've said it before"
      },
      {
        "time": 103.5,
        "text": "But all of our bridges burned down"
      },
      {
        "time": 106.3,
        "text": "I've wasted my nights"
      },
      {
        "time": 108.6,
        "text": "You turned out the lights"
      },
      {
        "time": 110.6,
        "text": "Now I'm paralyzed"
      },
      {
        "time": 112.8,
        "text": "Still stuck in that time"
      },
      {
        "time": 114.9,
        "text": "When we called it love"
      },
      {
        "time": 117.1,
        "text": "But even the sun sets in paradise"
      },
      {
        "time": 122.2,
        "text": "I'm at a payphone trying to call home"
      },
      {
        "time": 126.4,
        "text": "All of my change I spent on you"
      },
      {
        "time": 130.6,
        "text": "Where have the times gone?"
      },
      {
        "time": 133.1,
        "text": "Baby, it's all wrong"
      },
      {
        "time": 135.1,
        "text": "Where are the plans we made for two?"
      },
      {
        "time": 139.1,
        "text": "If \"happy ever after\" did exist"
      },
      {
        "time": 143.9,
        "text": "I would still be holding you like this"
      },
      {
        "time": 148.2,
        "text": "And all those fairy tales are full of shit"
      },
      {
        "time": 152.6,
        "text": "One more fucking love song, I'll be sick"
      },
      {
        "time": 156.6,
        "text": "Now I'm at a payphone"
      },
      {
        "time": 159.1,
        "text": "Man, fuck that shit"
      },
      {
        "time": 160.2,
        "text": "I'll be out spending all this money while you sitting round"
      },
      {
        "time": 162.7,
        "text": "Wondering why wasn't you who came up from nothing"
      },
      {
        "time": 164.6,
        "text": "Made it from the bottom, now when you see me I'm strutting"
      },
      {
        "time": 167.2,
        "text": "And all of my cars start with a push of a button"
      },
      {
        "time": 169.1,
        "text": "Telling me the chances I blew up or whatever you call it"
      },
      {
        "time": 171.3,
        "text": "Switched the number to my phone so you never could call it"
      },
      {
        "time": 173.7,
        "text": "Don't need my name on my show you can tell it I'm ballin'"
      },
      {
        "time": 175.9,
        "text": "Swish, what a shame could have got picked"
      },
      {
        "time": 178.1,
        "text": "Had a really good game but you missed your last shot"
      },
      {
        "time": 180.2,
        "text": "So you talk about who you see at the top"
      },
      {
        "time": 182.1,
        "text": "Or what you could have saw, but sad to say it's over for"
      },
      {
        "time": 184.7,
        "text": "Phantom pulled valet open doors"
      },
      {
        "time": 186.9,
        "text": "Wiz like go away got what you was looking for"
      },
      {
        "time": 189.3,
        "text": "Now it's me who they want, so you can go"
      },
      {
        "time": 190.5,
        "text": "And take that little piece of shit with you"
      },
      {
        "time": 192.2,
        "text": "I'm at a payphone, trying to call home"
      },
      {
        "time": 196.4,
        "text": "All of my change I spent on you"
      },
      {
        "time": 200.6,
        "text": "Where have the times gone?"
      },
      {
        "time": 203,
        "text": "Baby, it's all wrong"
      },
      {
        "time": 205.2,
        "text": "Where are the plans we made for two?"
      },
      {
        "time": 209.2,
        "text": "If \"happy ever after\" did exist"
      },
      {
        "time": 214,
        "text": "I would still be holding you like this"
      },
      {
        "time": 218,
        "text": "All those fairy tales are full of shit"
      },
      {
        "time": 222.6,
        "text": "One more fucking love song, I'll be sick"
      },
      {
        "time": 226.8,
        "text": "Now I'm at a payphone"
      }
    ]
  },
  "song-1788887954632": {
    "en": [
      {
        "time": 13.3,
        "text": "I don't like the way he's looking at you"
      },
      {
        "time": 18.3,
        "text": "I'm starting to think you want him too"
      },
      {
        "time": 23.4,
        "text": "Am I crazy? Have I lost ya?"
      },
      {
        "time": 26,
        "text": "Even though I know you love me, can't help it"
      },
      {
        "time": 30.2,
        "text": "I turn my chin music up"
      },
      {
        "time": 33.4,
        "text": "And I'm puffing my chest"
      },
      {
        "time": 35.5,
        "text": "I'm getting red in the face"
      },
      {
        "time": 38.1,
        "text": "You can call me obsessed"
      },
      {
        "time": 40.7,
        "text": "It's not your fault that they hover"
      },
      {
        "time": 43.6,
        "text": "I mean no disrespect"
      },
      {
        "time": 45.9,
        "text": "It's my right to be hellish"
      },
      {
        "time": 49,
        "text": "I still get jealous"
      },
      {
        "time": 51.9,
        "text": "'Cause you're too sexy, beautiful"
      },
      {
        "time": 54.5,
        "text": "And everybody wants a taste"
      },
      {
        "time": 56.7,
        "text": "That's why (that's why)"
      },
      {
        "time": 59.6,
        "text": "I still get jealous"
      },
      {
        "time": 62.1,
        "text": "'Cause you're too sexy, beautiful"
      },
      {
        "time": 64.9,
        "text": "And everybody wants a taste"
      },
      {
        "time": 66.9,
        "text": "That's why (that's why)"
      },
      {
        "time": 69.7,
        "text": "I still get jealous"
      },
      {
        "time": 75.3,
        "text": "I wish you didn't have to post it all"
      },
      {
        "time": 80.1,
        "text": "I wish you'd save a little bit just for me"
      },
      {
        "time": 85.2,
        "text": "Protective or possessive, yeah"
      },
      {
        "time": 90.5,
        "text": "Call it passive or aggressive"
      },
      {
        "time": 92.4,
        "text": "I turn my chin music up"
      },
      {
        "time": 95.2,
        "text": "And I'm puffing my chest"
      },
      {
        "time": 97.6,
        "text": "I'm getting red in the face"
      },
      {
        "time": 100.2,
        "text": "You can call me obsessed"
      },
      {
        "time": 102.9,
        "text": "It's not your fault that they hover"
      },
      {
        "time": 105.8,
        "text": "I mean no disrespect"
      },
      {
        "time": 107.8,
        "text": "It's my right to be hellish"
      },
      {
        "time": 111.1,
        "text": "I still get jealous"
      },
      {
        "time": 113.7,
        "text": "'Cause you're too sexy, beautiful"
      },
      {
        "time": 116.6,
        "text": "And everybody wants a taste"
      },
      {
        "time": 118.6,
        "text": "That's why (that's why)"
      },
      {
        "time": 121.5,
        "text": "I still get jealous"
      },
      {
        "time": 124.1,
        "text": "'Cause you're too sexy, beautiful"
      },
      {
        "time": 126.9,
        "text": "And everybody wants a taste"
      },
      {
        "time": 128.8,
        "text": "That's why (that's why)"
      },
      {
        "time": 131.7,
        "text": "I still get jealous"
      },
      {
        "time": 136.8,
        "text": "You're the only one invited"
      },
      {
        "time": 141.8,
        "text": "I said there's no one else for you"
      },
      {
        "time": 147.1,
        "text": "'Cause you know I get excited, yeah"
      },
      {
        "time": 152.3,
        "text": "When you get jealous too"
      },
      {
        "time": 154.4,
        "text": "I turn my chin music up"
      },
      {
        "time": 157.1,
        "text": "And I'm puffing my chest"
      },
      {
        "time": 159.4,
        "text": "I'm turning red in the face"
      },
      {
        "time": 162,
        "text": "You can call me obsessed"
      },
      {
        "time": 164.6,
        "text": "It's not your fault that they hover"
      },
      {
        "time": 167.8,
        "text": "I mean no disrespect"
      },
      {
        "time": 169.8,
        "text": "It's my right to be hellish"
      },
      {
        "time": 173,
        "text": "I still get jealous"
      },
      {
        "time": 175.8,
        "text": "'Cause you're too sexy, beautiful"
      },
      {
        "time": 178.3,
        "text": "And everybody wants a taste"
      },
      {
        "time": 180.5,
        "text": "That's why (that's why)"
      },
      {
        "time": 183.6,
        "text": "I still get jealous"
      },
      {
        "time": 185.9,
        "text": "'Cause you're too sexy, beautiful"
      },
      {
        "time": 188.7,
        "text": "And everybody wants a taste"
      },
      {
        "time": 190.7,
        "text": "That's why (that's why)"
      },
      {
        "time": 193.6,
        "text": "I still get jealous"
      },
      {
        "time": 198.8,
        "text": "Oh (that's why)"
      },
      {
        "time": 203.9,
        "text": "I still get jealous"
      },
      {
        "time": 209.3,
        "text": "Oh (that's why)"
      },
      {
        "time": 214.4,
        "text": "I still get jealous"
      }
    ]
  },
  "song-1788887740014": {
    "en": [
      {
        "time": 19,
        "text": "Now and then, I think of when we were together"
      },
      {
        "time": 26,
        "text": "Like when you said you felt so happy you could die"
      },
      {
        "time": 33.9,
        "text": "Told myself that you were right for me"
      },
      {
        "time": 37.3,
        "text": "But felt so lonely in your company"
      },
      {
        "time": 41.2,
        "text": "But that was love, and it's an ache I still remember"
      },
      {
        "time": 47.5,
        "text": "♪"
      },
      {
        "time": 63.1,
        "text": "You can get addicted to a certain kinda sadness"
      },
      {
        "time": 70.9,
        "text": "Like resignation to the end, always the end"
      },
      {
        "time": 78.2,
        "text": "So when we found that we could not make sense"
      },
      {
        "time": 82.2,
        "text": "Well, you said that we would still be friends"
      },
      {
        "time": 85.8,
        "text": "But I'll admit that I was glad it was over"
      },
      {
        "time": 93.5,
        "text": "But you didn't have to cut me off"
      },
      {
        "time": 97.1,
        "text": "Make out like it never happened and that we were nothin'"
      },
      {
        "time": 101.3,
        "text": "And I don't even need your love"
      },
      {
        "time": 103.6,
        "text": "But you treat me like a stranger, and that feels so rough"
      },
      {
        "time": 108.2,
        "text": "No, you didn't have to stoop so low"
      },
      {
        "time": 112,
        "text": "Have your friends collect your records and then change your number"
      },
      {
        "time": 116.2,
        "text": "Guess that I don't need that, though"
      },
      {
        "time": 118.9,
        "text": "Now you're just somebody that I used to know"
      },
      {
        "time": 126.5,
        "text": "Now you're just somebody that I used to know"
      },
      {
        "time": 133.7,
        "text": "Now you're just somebody that I used to know"
      },
      {
        "time": 139.1,
        "text": "♪"
      },
      {
        "time": 152.9,
        "text": "Now and then, I think of all the times you screwed me over"
      },
      {
        "time": 159.8,
        "text": "But had me believin' it was always somethin' that I'd done"
      },
      {
        "time": 168.3,
        "text": "But I don't wanna live that way"
      },
      {
        "time": 171.6,
        "text": "Readin' into every word you say"
      },
      {
        "time": 175.5,
        "text": "You said that you could let it go"
      },
      {
        "time": 178.3,
        "text": "And I wouldn't catch you hung up on somebody that you used to know"
      },
      {
        "time": 182.6,
        "text": "But you didn't have to cut me off"
      },
      {
        "time": 186.3,
        "text": "Make out like it never happened and that we were nothin' (ah)"
      },
      {
        "time": 190.5,
        "text": "And I don't even need your love"
      },
      {
        "time": 193,
        "text": "But you treat me like a stranger, and that feels so rough (ah)"
      },
      {
        "time": 197.4,
        "text": "No, you didn't have to stoop so low"
      },
      {
        "time": 201.3,
        "text": "Have your friends collect your records and then change your number (ah)"
      },
      {
        "time": 205.5,
        "text": "Guess that I don't need that, though"
      },
      {
        "time": 208.3,
        "text": "Now you're just somebody that I used to know"
      },
      {
        "time": 211.6,
        "text": "Somebody I used to know"
      },
      {
        "time": 215.1,
        "text": "Somebody (now you're just somebody that I used to know)"
      },
      {
        "time": 219,
        "text": "Somebody I used to know"
      },
      {
        "time": 222.6,
        "text": "Somebody (now you're just somebody that I used to know)"
      },
      {
        "time": 228.6,
        "text": "I used to know"
      },
      {
        "time": 232.1,
        "text": "That I used to know"
      },
      {
        "time": 235.9,
        "text": "I used to know somebody"
      }
    ]
  },
  "song-1788887469206": {
    "en": [
      {
        "time": 6,
        "text": "All the pretty girls in the foreground of my mind"
      },
      {
        "time": 8.8,
        "text": "I thought I'd done enough, but they keep moving the line"
      },
      {
        "time": 11.6,
        "text": "I thought I found the antidote this time"
      },
      {
        "time": 14.4,
        "text": "I thought I found the antidote this time"
      },
      {
        "time": 17.2,
        "text": "All the nights I spend fighting bad thoughts in my room"
      },
      {
        "time": 20,
        "text": "Feeling so alone, might as well be on the moon"
      },
      {
        "time": 22.8,
        "text": "I thought I found the antidote with you"
      },
      {
        "time": 25.6,
        "text": "I thought I found the antidote with you"
      },
      {
        "time": 28.4,
        "text": "But my head is full of poison"
      },
      {
        "time": 31.2,
        "text": "And my heart is full of doubt"
      },
      {
        "time": 34,
        "text": "I got toxins in my bloodstream"
      },
      {
        "time": 36.8,
        "text": "You tried hard to suck them out"
      },
      {
        "time": 39.6,
        "text": "And it feels like medication"
      },
      {
        "time": 42.4,
        "text": "And it's good for me, I'm sure"
      },
      {
        "time": 45.2,
        "text": "But it don't matter how your love feels anymore"
      },
      {
        "time": 48,
        "text": "It'll never be the cure"
      },
      {
        "time": 50.8,
        "text": "It'll never be the cure"
      },
      {
        "time": 53.6,
        "text": "Used to play a game in my head when I'd date a guy"
      },
      {
        "time": 56.4,
        "text": "Tally up the girls that he fucked till I start to cry"
      },
      {
        "time": 59.2,
        "text": "I thought I found the antidote this time"
      },
      {
        "time": 62,
        "text": "I thought I found the antidote this time"
      },
      {
        "time": 64.8,
        "text": "But I'm unraveled"
      },
      {
        "time": 67.6,
        "text": "I'm unraveled"
      },
      {
        "time": 70.4,
        "text": "I'm unraveled"
      },
      {
        "time": 73.2,
        "text": "I'm unraveled"
      },
      {
        "time": 76,
        "text": "I'm unraveled"
      },
      {
        "time": 78.8,
        "text": "I'm unraveled"
      },
      {
        "time": 81.6,
        "text": "I'm unraveled"
      },
      {
        "time": 84.4,
        "text": "I'm unraveled"
      },
      {
        "time": 87.2,
        "text": "And my head is full of poison"
      },
      {
        "time": 90,
        "text": "And my heart is full of doubt"
      },
      {
        "time": 92.8,
        "text": "I got toxins in my bloodstream"
      },
      {
        "time": 95.6,
        "text": "You tried hard to suck them out"
      },
      {
        "time": 98.4,
        "text": "And it feels like medication"
      },
      {
        "time": 101.2,
        "text": "And it's good for me, I'm sure"
      },
      {
        "time": 104,
        "text": "But it don't matter how your love feels anymore"
      },
      {
        "time": 106.8,
        "text": "It'll never be the cure"
      },
      {
        "time": 109.6,
        "text": "It'll never be the cure"
      },
      {
        "time": 112.4,
        "text": "Oh, 'cause baby, I'm unraveled"
      },
      {
        "time": 115.2,
        "text": "I'm unraveled"
      },
      {
        "time": 118,
        "text": "I'm unraveled"
      },
      {
        "time": 120.8,
        "text": "I'm unraveled"
      },
      {
        "time": 123.6,
        "text": "I'm unraveled"
      },
      {
        "time": 126.4,
        "text": "I'm unraveled"
      },
      {
        "time": 129.2,
        "text": "I'm unraveled"
      },
      {
        "time": 132,
        "text": "I'm unraveled"
      },
      {
        "time": 134.8,
        "text": "I'm unraveled"
      },
      {
        "time": 137.6,
        "text": "Why can't you come stitch me up?"
      },
      {
        "time": 140.4,
        "text": "Why can't it ever be enough?"
      },
      {
        "time": 143.2,
        "text": "Why can't you come stitch me up?"
      },
      {
        "time": 146,
        "text": "Why can't it ever be enough?"
      },
      {
        "time": 148.8,
        "text": "It's not enough"
      },
      {
        "time": 151.6,
        "text": "Oh, because my head is full of poison"
      },
      {
        "time": 154.4,
        "text": "And my heart is full of doubt"
      },
      {
        "time": 157.2,
        "text": "I got toxins in my bloodstream"
      },
      {
        "time": 160,
        "text": "You tried so hard to suck out"
      },
      {
        "time": 162.8,
        "text": "And it feels like medication"
      },
      {
        "time": 165.6,
        "text": "And it's good for me, I'm sure"
      },
      {
        "time": 168.4,
        "text": "But it don't matter how your love feels anymore"
      },
      {
        "time": 171.2,
        "text": "It'll never be the cure"
      },
      {
        "time": 174,
        "text": "It'll never be the cure"
      },
      {
        "time": 176.8,
        "text": "It'll never be"
      }
    ]
  },
  "song-1788887228393": {
    "en": [
      {
        "time": 10.3,
        "text": "i can't tell you why"
      },
      {
        "time": 13.3,
        "text": "but something inside"
      },
      {
        "time": 16.3,
        "text": "is dancing with fire"
      },
      {
        "time": 19.8,
        "text": "eyes lit like the sky"
      },
      {
        "time": 23.4,
        "text": "turned tears into diamonds"
      },
      {
        "time": 25.9,
        "text": "got good at goodbyes"
      },
      {
        "time": 28.1,
        "text": "just know that i will find my way from you"
      },
      {
        "time": 32.1,
        "text": "like flowers from a tomb"
      },
      {
        "time": 34.7,
        "text": "while you decide who you are"
      },
      {
        "time": 38.3,
        "text": "and i can see right through"
      },
      {
        "time": 42.5,
        "text": "like shadows on the moon"
      },
      {
        "time": 44.6,
        "text": "and it's all bad news"
      },
      {
        "time": 47.9,
        "text": "yeah i i i"
      },
      {
        "time": 50.2,
        "text": "hate that i made you love me"
      },
      {
        "time": 54.9,
        "text": "sorry if i made me your type"
      },
      {
        "time": 58.5,
        "text": "yeah i i hate that i made you love me"
      },
      {
        "time": 64.3,
        "text": "cause i barely tried"
      },
      {
        "time": 70,
        "text": "what's happening now?"
      },
      {
        "time": 73.3,
        "text": "you studied my crown"
      },
      {
        "time": 75.9,
        "text": "and borrowed my body"
      },
      {
        "time": 79.8,
        "text": "warm, kissed by the sun"
      },
      {
        "time": 83.6,
        "text": "then cold like the wind"
      },
      {
        "time": 85.9,
        "text": "a bee stuck in honey"
      },
      {
        "time": 88.3,
        "text": "know that i will find my way from you"
      },
      {
        "time": 92.3,
        "text": "i guess it's kinda cute"
      },
      {
        "time": 94.6,
        "text": "how you like me where you are"
      },
      {
        "time": 98.4,
        "text": "but i can see right through"
      },
      {
        "time": 102.4,
        "text": "just don't eclipse the moon"
      },
      {
        "time": 104.6,
        "text": "cause it's all bad news"
      },
      {
        "time": 107.9,
        "text": "yeah i i i"
      },
      {
        "time": 110,
        "text": "hate that i made you love me"
      },
      {
        "time": 114.8,
        "text": "sorry if i made me your type"
      },
      {
        "time": 118.9,
        "text": "yeah i i hate that i made you love me"
      },
      {
        "time": 124.2,
        "text": "cause i barely tried"
      },
      {
        "time": 129.5,
        "text": "♪"
      },
      {
        "time": 133,
        "text": "i've held your projections when you've felt so insecure"
      },
      {
        "time": 136.8,
        "text": "tell me why is it this way"
      },
      {
        "time": 138.9,
        "text": "why you so hate to see women endure"
      },
      {
        "time": 142.3,
        "text": "is it really my fault"
      },
      {
        "time": 143.4,
        "text": "you all gave me your hearts"
      },
      {
        "time": 144.8,
        "text": "of your own accord?"
      },
      {
        "time": 147.4,
        "text": "i don't really think so"
      },
      {
        "time": 151.4,
        "text": "i i i"
      },
      {
        "time": 152.6,
        "text": "hate that i made you love me"
      },
      {
        "time": 157.4,
        "text": "sorry if i made me your type"
      },
      {
        "time": 160.9,
        "text": "yeah i i hate that i made you love me"
      },
      {
        "time": 166.7,
        "text": "cause i barely tried"
      },
      {
        "time": 170.7,
        "text": "i i i"
      },
      {
        "time": 172.8,
        "text": "hate that i made you love me"
      },
      {
        "time": 177.3,
        "text": "sorry if i made me your type"
      },
      {
        "time": 181.1,
        "text": "yeah i i hate that i made you love me"
      },
      {
        "time": 186.5,
        "text": "cause i barely tried"
      },
      {
        "time": 190.4,
        "text": "yeah i i i"
      }
    ]
  }
};

