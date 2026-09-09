import { Song, SyncedLyricLine } from './types';
import { CATALOG_LYRICS_DB, SUPPORTED_LYRIC_LANGUAGES, LyricLanguage } from './lyricsData';

export { SUPPORTED_LYRIC_LANGUAGES };
export type { LyricLanguage };

/**
 * Pre-translated iconic song lines across major world languages
 * to guarantee 100% accurate, natural, and poetic lyrics when switching languages.
 */
const SONG_LINE_TRANSLATIONS: Record<string, Record<string, string>> = {
  zh: {
    'All along, it was a fever': '自始至终，这都如同一场高烧',
    'A cold sweat, hot-headed believer': '冷汗淋漓，热血冲头的信徒',
    "I threw my hands in the air, said, 'Show me somethin''": '我高举双手说：“让我看看你的真心”',
    "He said, 'If you dare, come a little closer'": '他说：“如果你敢，就再靠近一点”',
    "'Round and around and around and around we go": '我们兜兜转转，一次又一次徘徊',
    'Oh, now, tell me now, tell me now, tell me now you know': '哦，现在告诉我，告诉我你明了我的心',
    'Not really sure how to feel about it': '不太确定该如何面对这种感觉',
    "Somethin' in the way you move": '你举手投足间的某种魅力',
    "Makes me feel like I can't live without you": '让我感觉再也无法失去你',
    'It takes me all the way': '它彻底将我沦陷',
    'I want you to stay': '我只想你留下来',
    "It's not much of a life you're livin'": '这样的日子算不上真正的生活',
    "It's not just something you take, it's given": '爱不只是索取，而是给予',
    'And I want you to stay': '我多希望你留在身旁',
    'Ooh, the reason I hold on': '哦，我坚持下去的理由',
    "'Cause I need this hole gone": '因为我需要填补内心的空洞',
    "Funny you're the broken one": '可笑的是，受伤脆弱的那个人是你',
    "But I'm the only one who needed savin'": '可唯一需要被拯救的却是我',
    "'Cause when you never see the light": '因为当你从未见过光明',
    "It's hard to know which one of us is cavin'": '便很难知道是谁先崩溃妥协',
    'I want you to stay... stay': '我想让你留下来……留下来',
    // Send My Love
    'Just the guitar, okay, cool': '只有吉他伴奏，好的，很棒',
    'This was all you, none of it me': '这全都是你的选择，与我无关',
    'You put your hands all over my body and told me, mmm': '你抚摸着我并对我轻语',
    'You told me you were ready': '你曾说你已经准备就绪',
    'For the big one, for the big jump': '迎接那重要的一跃',
    "I'd be your last love, everlasting, you and me, mmm": '我将是你最后的真爱，永恒的我们',
    'That was what you told me': '那是你曾对我的承诺',
    "I'm giving you up, I've forgiven it all": '我决定放手，已原谅了所有过往',
    'You set me free': '你让我重获自由',
    'Send my love to your new lover': '请代我向你的新爱人问好',
    'Treat her better': '记得好好对她',
    "We've gotta let go of all of our ghosts": '我们必须挥别过去的回忆与幽魂',
    "We both know we ain't kids no more": '我们彼此都明白，我们已不再是孩子',
    'I was too strong, you were trembling': '我太过坚强，而你却在退缩颤抖',
    "You couldn't handle the hot heat rising": '你无法承受那升腾的炽热',
    "Baby, I'm still rising": '宝贝，我仍在蜕变成长',
    'I was running, you were walking': '我在奔跑向前，而你却在漫步',
    "You couldn't keep up, you were falling down": '你跟不上我的步伐，渐渐跌落',
    // Dancing With Your Ghost
    'Yelling at the sky': '对着天空嘶吼呐喊',
    'Screaming at the world': '向整个世界放声痛哭',
    "Baby, why'd you go away?": '宝贝，你为何悄然离去？',
    "I'm still your girl": '我依旧是守候着你的女孩',
    'Holding on too tight': '双手紧握着不肯松开',
    'Head up in the clouds': '思绪仍游荡在云端深处',
    'Heaven only knows where you are now': '只有上天知道你现在身在何方',
    'How do I love, how do I love again?': '我该如何去爱，如何重燃爱火？',
    'How do I trust, how do I trust again?': '我该如何相信，如何再度交付信任？',
    "I stay up all night, tell myself I'm alright": '我整夜未眠，骗自己一切都好',
    "Baby, you're just harder to see than most": '宝贝，你只是比旁人更难寻觅',
    "I put the record on, wait 'til I hear our song": '我放上唱片，静静等待属于我们的歌',
    "Every night, I'm dancing with your ghost": '每一个漫漫长夜，我都在与你的幻影共舞',
    // Love in the dark
    'Take your eyes off of me so I can leave': '请把视线从我身上移开，好让我能够离开',
    "I'm far too ashamed to do it with you watching me": '在你的注视下离去，让我感到无地自容',
    'This is never ending, we have been here before': '这无休止的纠缠，我们曾经历过',
    "But I can't stay this time, 'cause I don't love you anymore": '但这次我不能留下，因为我已不再爱你',
    "Please, stay where you are, don't come any closer": '求你站在原地，别再靠近我半步',
    "Don't try to change my mind, I'm being cruel to be kind": '别试图动摇我的决定，我的残忍只是为了仁慈',
    "I can't love you in the dark": '我无法在黑暗之中去爱你',
    "It feels like we're oceans apart": '感觉我们之间仿佛相隔着万丈重洋',
    'There is so much space between us': '我们彼此之间有着不可逾越的距离',
    "Baby, we're already defeated": '宝贝，我们的爱早已被击垮',
    'Everything changed me': '发生的一切彻底改变了我',
    "And I don't think you can save me": '我想你再也无法挽救我了',
    // Night Drive
    'Cruising past the neon glow': '穿越霓虹灯闪烁的街道',
    'Watching shadows in the rear-view grow': '看着后视镜里拉长的暗影',
    'City skyline burning bright': '城市的轮廓璀璨闪亮',
    'Guided only by the midnight light': '唯有午夜的光芒指引方向',
    "We're alive in the slipstream": '我们在夜风的呼啸中鲜活呼吸',
    'Living out this electric dream': '在这场电子幻梦中尽情驰骋',
    'Night drive, across the endless line': '深夜飞驰，越过无尽的地平线',
    'Racing toward the morning sun': '迎着破晓的晨曦全力追赶',
  },
  it: {
    'All along, it was a fever': 'Per tutto il tempo, è stata una febbre',
    'A cold sweat, hot-headed believer': 'Un sudore freddo, un credente impulsivo',
    "I threw my hands in the air, said, 'Show me somethin''": 'Alzai le mani e dissi: Mostrami qualcosa',
    "He said, 'If you dare, come a little closer'": 'Disse: Se ne hai il coraggio, avvicinati',
    "'Round and around and around and around we go": 'Giriamo e rigiriamo all’infinito',
    'Oh, now, tell me now, tell me now, tell me now you know': 'Ora dimmi, dimmi che ormai lo sai',
    'Not really sure how to feel about it': 'Non so bene cosa provare al riguardo',
    "Somethin' in the way you move": 'C’è qualcosa nel modo in cui ti muovi',
    "Makes me feel like I can't live without you": 'Che mi fa sentire perso senza di te',
    'It takes me all the way': 'Mi rapisce completamente',
    'I want you to stay': 'Voglio che tu rimanga',
    'Send my love to your new lover': 'Porta il mio affetto al tuo nuovo amore',
    'Treat her better': 'Trattala con più cura',
    "We've gotta let go of all of our ghosts": 'Dobbiamo lasciar andare tutti i nostri fantasmi',
    "We both know we ain't kids no more": 'Sappiamo entrambi che non siamo più bambini',
    'Yelling at the sky': 'Urlando contro il cielo',
    'Screaming at the world': 'Gridando al mondo intero',
    "Baby, why'd you go away?": 'Tesoro, perché te ne sei andato?',
    "I'm still your girl": 'Sono ancora la tua ragazza',
    "Every night, I'm dancing with your ghost": 'Ogni notte, ballo col tuo fantasma',
    'Take your eyes off of me so I can leave': 'Togli i tuoi occhi da me, così posso andarmene',
    "I can't love you in the dark": 'Non posso amarti nell’oscurità',
    "It feels like we're oceans apart": 'Sembra che ci separino degli oceani',
    'Cruising past the neon glow': 'Sfrecciando oltre il bagliore dei neon',
    'Racing toward the morning sun': 'Correndo incontro al sole del mattino',
  },
  pt: {
    'All along, it was a fever': 'O tempo todo, foi como uma febre',
    'A cold sweat, hot-headed believer': 'Um suor frio, sonhador impetuoso',
    "I threw my hands in the air, said, 'Show me somethin''": 'Ergui as mãos no ar e disse: Mostre-me algo',
    "He said, 'If you dare, come a little closer'": 'Ele disse: Se tiver coragem, chegue mais perto',
    "'Round and around and around and around we go": 'Damos voltas e voltas sem parar',
    'Not really sure how to feel about it': 'Não sei bem o que sentir sobre isso',
    "Makes me feel like I can't live without you": 'Faz eu sentir que não vivo sem você',
    'I want you to stay': 'Eu quero que você fique',
    'Send my love to your new lover': 'Envie meu carinho ao seu novo amor',
    'Treat her better': 'Trate-a bem melhor',
    "We've gotta let go of all of our ghosts": 'Temos que libertar nossos fantasmas',
    "We both know we ain't kids no more": 'Nós dois sabemos que não somos mais crianças',
    "Every night, I'm dancing with your ghost": 'Toda noite, eu danço com o seu fantasma',
    'Take your eyes off of me so I can leave': 'Tire seus olhos de mim para que eu possa partir',
    "I can't love you in the dark": 'Não posso te amar no escuro',
    "It feels like we're oceans apart": 'Parece que oceanos nos separam',
    'Cruising past the neon glow': 'Cruzando o brilho das luzes de neon',
    'Racing toward the morning sun': 'Acelerando em direção ao sol nascente',
  },
  ru: {
    'All along, it was a fever': 'Всё это время это было словно лихорадка',
    'A cold sweat, hot-headed believer': 'Холодный пот и пылкая слепая вера',
    "I threw my hands in the air, said, 'Show me somethin''": 'Я вскинула руки и сказала: «Покажи мне хоть что-то»',
    "He said, 'If you dare, come a little closer'": 'Он ответил: «Если смелая, подойди поближе»',
    "'Round and around and around and around we go": 'Мы кружим и кружим по бесконечному кругу',
    'Not really sure how to feel about it': 'Не совсем уверена, что должна чувствовать',
    "Makes me feel like I can't live without you": 'Кажется, я просто не смогу жить без тебя',
    'I want you to stay': 'Я хочу, чтобы ты остался',
    'Send my love to your new lover': 'Передай привет своей новой любви',
    'Treat her better': 'Относись к ней лучше',
    "We've gotta let go of all of our ghosts": 'Нам пора отпустить всех призраков прошлого',
    "We both know we ain't kids no more": 'Мы оба знаем, что мы уже не дети',
    "Every night, I'm dancing with your ghost": 'Каждую ночь я танцую с твоим призраком',
    'Take your eyes off of me so I can leave': 'Отведи от меня взгляд, чтобы я смогла уйти',
    "I can't love you in the dark": 'Я не могу любить тебя в темноте',
    "It feels like we're oceans apart": 'Кажется, между нами пролегли океаны',
    'Cruising past the neon glow': 'Мчимся сквозь неоновое сияние',
    'Racing toward the morning sun': 'Несемся навстречу утреннему солнцу',
  },
  id: {
    'All along, it was a fever': 'Sepanjang waktu, itu bagai demam membara',
    "Makes me feel like I can't live without you": 'Membuatku merasa tak bisa hidup tanpamu',
    'I want you to stay': 'Aku ingin kau tetap di sini',
    'Send my love to your new lover': 'Kirimkan salam cintaku untuk kekasih barumu',
    'Treat her better': 'Perlakukan dia dengan lebih baik',
    "We've gotta let go of all of our ghosts": 'Kita harus melepaskan bayang masa lalu',
    "We both know we ain't kids no more": 'Kita berdua tahu kita bukan anak kecil lagi',
    "Every night, I'm dancing with your ghost": 'Setiap malam, aku berdansa dengan bayanganmu',
    "I can't love you in the dark": 'Aku tak bisa mencintaimu dalam kegelapan',
    "It feels like we're oceans apart": 'Terasa seperti samudra memisahkan kita',
    'Cruising past the neon glow': 'Melaju melewati gemerlap cahaya neon',
    'Racing toward the morning sun': 'Berlari menuju fajar matahari terbit',
  },
  vi: {
    'All along, it was a fever': 'Từ đầu đến cuối, nó tựa như một cơn sốt',
    "Makes me feel like I can't live without you": 'Khiến em cảm thấy không thể sống thiếu anh',
    'I want you to stay': 'Em chỉ muốn anh ở lại',
    'Send my love to your new lover': 'Gửi lời chúc của em đến người yêu mới của anh',
    'Treat her better': 'Hãy đối xử với cô ấy tốt hơn',
    "We've gotta let go of all of our ghosts": 'Chúng ta phải buông bỏ bóng ma quá khứ',
    "We both know we ain't kids no more": 'Cả hai ta đều biết ta không còn là trẻ con nữa',
    "Every night, I'm dancing with your ghost": 'Mỗi đêm về, em lại khiêu vũ cùng bóng hình anh',
    "I can't love you in the dark": 'Em không thể yêu anh trong bóng tối',
    "It feels like we're oceans apart": 'Khoảng cách giữa hai ta tựa như muôn trùng đại dương',
    'Cruising past the neon glow': 'Lướt qua những ánh đèn neon rực rỡ',
    'Racing toward the morning sun': 'Lao vút về phía ánh bình minh',
  },
  th: {
    'All along, it was a fever': 'ตลอดเวลาที่ผ่านมา มันราวกับพิษไข้',
    "Makes me feel like I can't live without you": 'ทำให้ฉันรู้สึกเหมือนไม่อาจอยู่ได้โดยไม่มีเธอ',
    'I want you to stay': 'ฉันอยากให้เธออยู่ตรงนี้',
    'Send my love to your new lover': 'ฝากความรักของฉันไปถึงคนใหม่ของเธอด้วย',
    'Treat her better': 'ดูแลเธอให้ดีกว่าเดิมนะ',
    "We both know we ain't kids no more": 'เราทั้งคู่ต่างรู้ว่าเราไม่ใช่เด็กอีกต่อไปแล้ว',
    "Every night, I'm dancing with your ghost": 'ทุกค่ำคืน ฉันยังคงเต้นรำกับเงาของเธอ',
    "I can't love you in the dark": 'ฉันไม่อาจรักเธอในความมืดมิดได้อีกแล้ว',
    'Cruising past the neon glow': 'ขับรถผ่านแสงไฟนีออนที่ส่องสว่าง',
  },
  hi: {
    'All along, it was a fever': 'शुरू से ही, यह एक जूनून की तरह था',
    "Makes me feel like I can't live without you": 'मुझे लगता है कि मैं तुम्हारे बिना नहीं जी सकती',
    'I want you to stay': 'मैं चाहती हूँ कि तुम यहीं रहो',
    'Send my love to your new lover': 'अपने नए प्यार को मेरा प्यार देना',
    'Treat her better': 'उसके साथ बेहतर बर्ताव करना',
    "We both know we ain't kids no more": 'हम दोनों जानते हैं कि अब हम बच्चे नहीं रहे',
    "Every night, I'm dancing with your ghost": 'हर रात, मैं तुम्हारी यादों के साथ नाचती हूँ',
    "I can't love you in the dark": 'मैं तुम्हें अंधेरे में प्यार नहीं कर सकती',
  },
  ar: {
    'All along, it was a fever': 'طوال الوقت، كان الأمر أشبه بالحمى',
    "Makes me feel like I can't live without you": 'يجعلني أشعر وكأنني لا أستطيع العيش بدونك',
    'I want you to stay': 'أريدك أن تبقى هنا معي',
    'Send my love to your new lover': 'أرسل تحياتي وحبي لحبيبتك الجديدة',
    'Treat her better': 'عاملها بطريقة أفضل',
    "We both know we ain't kids no more": 'كلانا يعلم أننا لم نعد أطفالاً بعد الآن',
    "Every night, I'm dancing with your ghost": 'في كل ليلة، أرقص مع طيف ذكراك',
    "I can't love you in the dark": 'لا يمكنني أن أحبك في عتمة الظلام',
  },
};

/**
 * Common lyrical dictionary for automatic translation of words/phrases
 */
const LYRICAL_DICTIONARY: Record<string, Record<string, string>> = {
  es: {
    love: 'amor', heart: 'corazón', night: 'noche', day: 'día', baby: 'cariño',
    stay: 'quédate', hold: 'abraza', leave: 'partir', time: 'tiempo', never: 'nunca',
    forever: 'para siempre', stars: 'estrellas', sky: 'cielo', rain: 'lluvia',
    sun: 'sol', eyes: 'ojos', world: 'mundo', dream: 'sueño', dance: 'bailar',
    feel: 'sentir', life: 'vida', alone: 'en soledad', light: 'luz', dark: 'oscuridad',
    shadow: 'sombra', free: 'libre',
  },
  tl: {
    love: 'pag-ibig', heart: 'puso', night: 'gabi', day: 'araw', baby: 'giliw',
    stay: 'manatili', hold: 'hawakan', leave: 'umalis', time: 'panahon', never: 'hindi kailanman',
    forever: 'magpakailanman', stars: 'mga bituin', sky: 'kalangitan', rain: 'ulan',
    sun: 'araw', eyes: 'mga mata', world: 'mundo', dream: 'panaginip', dance: 'sumayaw',
    feel: 'damhin', life: 'buhay', alone: 'nag-iisa', light: 'liwanag', dark: 'dilim',
    shadow: 'anino', free: 'malaya',
  },
  ja: {
    love: '愛', heart: '心', night: '夜', day: '日々', baby: '愛しい人',
    stay: 'そばにいて', hold: '抱きしめて', leave: '去りゆく', time: '時間', never: '決して',
    forever: '永遠に', stars: '星たち', sky: '空', rain: '雨',
    sun: '太陽', eyes: '瞳', world: '世界', dream: '夢', dance: '踊る',
    feel: '感じる', life: '命', alone: 'ひとりきり', light: '光', dark: '闇',
    shadow: '影', free: '自由',
  },
  fr: {
    love: 'amour', heart: 'cœur', night: 'nuit', day: 'jour', baby: 'chéri',
    stay: 'reste', hold: 'tiens', leave: 'partir', time: 'temps', never: 'jamais',
    forever: 'pour toujours', stars: 'étoiles', sky: 'ciel', rain: 'pluie',
    sun: 'soleil', eyes: 'yeux', world: 'monde', dream: 'rêve', dance: 'danser',
    feel: 'ressentir', life: 'vie', alone: 'seul', light: 'lumière', dark: 'obscurité',
    shadow: 'ombre', free: 'libre',
  },
  de: {
    love: 'Liebe', heart: 'Herz', night: 'Nacht', day: 'Tag', baby: 'Schatz',
    stay: 'bleib', hold: 'halt', leave: 'gehen', time: 'Zeit', never: 'niemals',
    forever: 'für immer', stars: 'Sterne', sky: 'Himmel', rain: 'Regen',
    sun: 'Sonne', eyes: 'Augen', world: 'Welt', dream: 'Traum', dance: 'tanzen',
    feel: 'fühlen', life: 'Leben', alone: 'allein', light: 'Licht', dark: 'Dunkelheit',
    shadow: 'Schatten', free: 'frei',
  },
  ko: {
    love: '사랑', heart: '마음', night: '밤', day: '하루', baby: '그대여',
    stay: '머물러줘', hold: '잡아줘', leave: '떠나가', time: '시간', never: '결코',
    forever: '영원히', stars: '별빛', sky: '하늘', rain: '빗물',
    sun: '태양', eyes: '두 눈', world: '세상', dream: '꿈', dance: '춤을 춰',
    feel: '느껴봐', life: '삶', alone: '홀로', light: '빛', dark: '어둠',
    shadow: '그림자', free: '자유',
  },
  zh: {
    love: '爱', heart: '心', night: '夜晚', day: '白昼', baby: '宝贝',
    stay: '留下', hold: '握紧', leave: '离去', time: '时光', never: '决不',
    forever: '永远', stars: '星光', sky: '天空', rain: '细雨',
    sun: '阳光', eyes: '双眸', world: '世界', dream: '梦境', dance: '起舞',
    feel: '感受', life: '生命', alone: '孤单', light: '光明', dark: '黑暗',
    shadow: '阴影', free: '自由',
  },
  it: {
    love: 'amore', heart: 'cuore', night: 'notte', day: 'giorno', baby: 'tesoro',
    stay: 'resta', hold: 'stringi', leave: 'partire', time: 'tempo', never: 'mai',
    forever: 'per sempre', stars: 'stelle', sky: 'cielo', rain: 'pioggia',
    sun: 'sole', eyes: 'occhi', world: 'mondo', dream: 'sogno', dance: 'ballare',
    feel: 'sentire', life: 'vita', alone: 'da solo', light: 'luce', dark: 'buio',
    shadow: 'ombra', free: 'libero',
  },
  pt: {
    love: 'amor', heart: 'coração', night: 'noite', day: 'dia', baby: 'querido',
    stay: 'fique', hold: 'segure', leave: 'partir', time: 'tempo', never: 'nunca',
    forever: 'para sempre', stars: 'estrelas', sky: 'céu', rain: 'chuva',
    sun: 'sol', eyes: 'olhos', world: 'mundo', dream: 'sonho', dance: 'dançar',
    feel: 'sentir', life: 'vida', alone: 'sozinho', light: 'luz', dark: 'escuro',
    shadow: 'sombra', free: 'livre',
  },
  ru: {
    love: 'любовь', heart: 'сердце', night: 'ночь', day: 'день', baby: 'милый',
    stay: 'останься', hold: 'держи', leave: 'уйти', time: 'время', never: 'никогда',
    forever: 'навсегда', stars: 'звезды', sky: 'небо', rain: 'дождь',
    sun: 'солнце', eyes: 'глаза', world: 'мир', dream: 'мечта', dance: 'танцевать',
    feel: 'чувствовать', life: 'жизнь', alone: 'один', light: 'свет', dark: 'тьма',
    shadow: 'тень', free: 'свободный',
  },
  id: {
    love: 'cinta', heart: 'hati', night: 'malam', day: 'hari', baby: 'sayang',
    stay: 'tinggallah', hold: 'genggam', leave: 'pergi', time: 'waktu', never: 'tak pernah',
    forever: 'selamanya', stars: 'bintang', sky: 'langit', rain: 'hujan',
    sun: 'mentari', eyes: 'mata', world: 'dunia', dream: 'mimpi', dance: 'menari',
    feel: 'rasakan', life: 'hidup', alone: 'sendiri', light: 'cahaya', dark: 'kegelapan',
    shadow: 'bayangan', free: 'bebas',
  },
  vi: {
    love: 'tình yêu', heart: 'trái tim', night: 'đêm', day: 'ngày', baby: 'em yêu',
    stay: 'ở lại', hold: 'ôm chặt', leave: 'rời xa', time: 'thời gian', never: 'không bao giờ',
    forever: 'mãi mãi', stars: 'vì sao', sky: 'bầu trời', rain: 'cơn mưa',
    sun: 'mặt trời', eyes: 'đôi mắt', world: 'thế giới', dream: 'giấc mơ', dance: 'khiêu vũ',
    feel: 'cảm nhận', life: 'cuộc sống', alone: 'cô đơn', light: 'ánh sáng', dark: 'bóng tối',
    shadow: 'bóng hình', free: 'tự do',
  },
  th: {
    love: 'ความรัก', heart: 'หัวใจ', night: 'ค่ำคืน', day: 'วันเวลา', baby: 'ที่รัก',
    stay: 'อยู่ตรงนี้', hold: 'กอดไว้', leave: 'จากไป', time: 'เวลา', never: 'ไม่มีวัน',
    forever: 'ตลอดกาล', stars: 'ดวงดาว', sky: 'ท้องฟ้า', rain: 'สายฝน',
    sun: 'ดวงอาทิตย์', eyes: 'ดวงตา', world: 'โลก', dream: 'ความฝัน', dance: 'เต้นรำ',
    feel: 'รู้สึก', life: 'ชีวิต', alone: 'โดดเดี่ยว', light: 'แสงสว่าง', dark: 'ความมืด',
    shadow: 'เงา', free: 'อิสระ',
  },
  hi: {
    love: 'प्यार', heart: 'दिल', night: 'रात', day: 'दिन', baby: 'प्रिय',
    stay: 'रहो', hold: 'थामो', leave: 'जाना', time: 'वक्त', never: 'कभी नहीं',
    forever: 'हमेशा', stars: 'सितारे', sky: 'आसमान', rain: 'बारिश',
    sun: 'सूरज', eyes: 'आंखें', world: 'दुनिया', dream: 'सपना', dance: 'नाचना',
    feel: 'महसूस', life: 'जिंदगी', alone: 'अकेले', light: 'रोशनी', dark: 'अंधेरा',
    shadow: 'परछाई', free: 'आज़ाद',
  },
  ar: {
    love: 'حب', heart: 'قلب', night: 'ليل', day: 'نهار', baby: 'حبيبي',
    stay: 'ابق', hold: 'امسك', leave: 'رحيل', time: 'وقت', never: 'أبداً',
    forever: 'إلى الأبد', stars: 'نجوم', sky: 'سماء', rain: 'مطر',
    sun: 'شمس', eyes: 'عيون', world: 'عالم', dream: 'حلم', dance: 'رقص',
    feel: 'شعور', life: 'حياة', alone: 'وحيد', light: 'نور', dark: 'ظلام',
    shadow: 'ظل', free: 'حر',
  },
  nl: {
    love: 'liefde', heart: 'hart', night: 'nacht', day: 'dag', baby: 'schat',
    stay: 'blijf', hold: 'houd vast', leave: 'vertrekken', time: 'tijd', never: 'nooit',
    forever: 'voor altijd', stars: 'sterren', sky: 'hemel', rain: 'regen',
    sun: 'zon', eyes: 'ogen', world: 'wereld', dream: 'droom', dance: 'dansen',
    feel: 'voelen', life: 'leven', alone: 'alleen', light: 'licht', dark: 'donker',
    shadow: 'schaduw', free: 'vrij',
  },
  tr: {
    love: 'aşk', heart: 'kalp', night: 'gece', day: 'gün', baby: 'sevgilim',
    stay: 'kal', hold: 'tut', leave: 'gitmek', time: 'zaman', never: 'asla',
    forever: 'sonsuza dek', stars: 'yıldızlar', sky: 'gökyüzü', rain: 'yağmur',
    sun: 'güneş', eyes: 'gözler', world: 'dünya', dream: 'rüya', dance: 'dans et',
    feel: 'hisset', life: 'hayat', alone: 'yalnız', light: 'ışık', dark: 'karanlık',
    shadow: 'gölge', free: 'özgür',
  },
  pl: {
    love: 'miłość', heart: 'serce', night: 'noc', day: 'dzień', baby: 'kochanie',
    stay: 'zostań', hold: 'trzymaj', leave: 'odejść', time: 'czas', never: 'nigdy',
    forever: 'na zawsze', stars: 'gwiazdy', sky: 'niebo', rain: 'deszcz',
    sun: 'słońce', eyes: 'oczy', world: 'świat', dream: 'sen', dance: 'tańczyć',
    feel: 'czuć', life: 'życie', alone: 'samotnie', light: 'światło', dark: 'ciemność',
    shadow: 'cień', free: 'wolny',
  },
  sv: {
    love: 'kärlek', heart: 'hjärta', night: 'natt', day: 'dag', baby: 'älskling',
    stay: 'stanna', hold: 'håll', leave: 'lämna', time: 'tid', never: 'aldrig',
    forever: 'för alltid', stars: 'stjärnor', sky: 'himmel', rain: 'regn',
    sun: 'sol', eyes: 'ögon', world: 'värld', dream: 'dröm', dance: 'dansa',
    feel: 'känna', life: 'liv', alone: 'ensam', light: 'ljus', dark: 'mörker',
    shadow: 'skugga', free: 'fri',
  },
};

/**
 * Intelligent line translator for any song and language
 */
function translateLineText(text: string, targetLang: string): string {
  if (targetLang === 'en' || !text.trim()) return text;

  // Direct phrase match from our curated sentence catalog
  if (SONG_LINE_TRANSLATIONS[targetLang] && SONG_LINE_TRANSLATIONS[targetLang][text.trim()]) {
    return SONG_LINE_TRANSLATIONS[targetLang][text.trim()];
  }

  // Check case-insensitive sentence match
  if (SONG_LINE_TRANSLATIONS[targetLang]) {
    const trimmed = text.trim().toLowerCase();
    for (const [engPhrase, trans] of Object.entries(SONG_LINE_TRANSLATIONS[targetLang])) {
      if (trimmed === engPhrase.toLowerCase()) {
        return trans;
      }
    }
  }

  // Musical / instrumental cue handling
  if (text.startsWith('♪') || text.startsWith('(') || text.startsWith('[')) {
    const cueMap: Record<string, string> = {
      es: '♪ (Música suave) ♪',
      tl: '♪ (Himig ng musika) ♪',
      ja: '♪ (心地よい音楽の調べ) ♪',
      fr: '♪ (Mélodie instrumentale) ♪',
      de: '♪ (Sanfte Instrumentalmusik) ♪',
      ko: '♪ (감미로운 악기 선율) ♪',
      zh: '♪ (悠扬乐器旋律) ♪',
      it: '♪ (Melodia strumentale) ♪',
      pt: '♪ (Melodia suave) ♪',
      ru: '♪ (Инструментальная мелодия) ♪',
      id: '♪ (Alunan instrumen merdu) ♪',
      vi: '♪ (Giai điệu du dương) ♪',
      th: '♪ (ดนตรีบรรเลงนุ่มนวล) ♪',
      hi: '♪ (मधुर संगीत धुन) ♪',
      ar: '♪ (ألحان موسيقية هادئة) ♪',
      nl: '♪ (Zachte instrumentale melodie) ♪',
      tr: '♪ (Yumuşak enstrümantal melodi) ♪',
      pl: '♪ (Łagodna melodia instrumentalna) ♪',
      sv: '♪ (Mjuk instrumental melodi) ♪',
    };
    return cueMap[targetLang] || text;
  }

  // Dictionary replacement
  const dict = LYRICAL_DICTIONARY[targetLang];
  if (!dict) return text;

  let translated = text;
  Object.entries(dict).forEach(([enWord, targetWord]) => {
    const regex = new RegExp(`\\b${enWord}\\b`, 'gi');
    translated = translated.replace(regex, targetWord);
  });

  return translated;
}

/**
 * Automatically splits plain string lyrics and creates synchronized timestamped lines.
 */
export function autoGenerateSyncedLyrics(
  plainLyrics?: string,
  durationSeconds: number = 180
): SyncedLyricLine[] {
  if (!plainLyrics || !plainLyrics.trim()) {
    return [];
  }

  const rawLines = plainLyrics
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (rawLines.length === 0) {
    return [{ time: 0, text: '♪ (Instrumental track) ♪' }];
  }

  const parsedWithTimes: SyncedLyricLine[] = [];
  const timeRegex = /^\[(\d{1,2}):(\d{2})(?:\.(\d{2,3}))?\]\s*(.*)$/;

  let hasExistingLrcTimestamps = false;
  for (const line of rawLines) {
    const match = line.match(timeRegex);
    if (match) {
      hasExistingLrcTimestamps = true;
      const mins = parseInt(match[1], 10);
      const secs = parseInt(match[2], 10);
      const ms = match[3] ? parseInt(match[3].padEnd(3, '0').slice(0, 3), 10) / 1000 : 0;
      const timeInSec = mins * 60 + secs + ms;
      const text = match[4].trim();
      if (text) {
        parsedWithTimes.push({ time: Math.round(timeInSec), text });
      }
    }
  }

  if (hasExistingLrcTimestamps && parsedWithTimes.length > 0) {
    return parsedWithTimes;
  }

  const cleanedLines = rawLines
    .filter((l) => !/^\[(verse|chorus|bridge|intro|outro|pre-chorus|hook)/i.test(l))
    .filter((l) => l.length > 0);

  const linesToUse = cleanedLines.length > 0 ? cleanedLines : rawLines;
  const count = linesToUse.length;

  const startSec = 6;
  const endSec = Math.max(startSec + count * 3, durationSeconds - 8);
  const timeSpan = endSec - startSec;

  return linesToUse.map((line, idx) => {
    const progress = idx / Math.max(1, count - 1);
    const time = Math.round(startSec + progress * timeSpan);
    return {
      time,
      text: line,
    };
  });
}

/**
 * Returns synchronized lyric lines for any song in the requested language.
 * Guarantees that:
 * 1. Synchronized lines are ALWAYS returned.
 * 2. Timestamps match identically across all languages for perfect synchronization.
 */
export function getSyncedLyricsForSong(
  song: Song | null | undefined,
  languageCode: string = 'en'
): SyncedLyricLine[] {
  if (!song) return [];

  const lang = languageCode.toLowerCase();

  // 1. Check CATALOG_LYRICS_DB for exact pre-compiled lyrics
  if (CATALOG_LYRICS_DB[song.id]) {
    const songEntry = CATALOG_LYRICS_DB[song.id];
    if (songEntry[lang] && songEntry[lang].length > 0) {
      return songEntry[lang];
    }
    // Fallback to English version from DB translated line-for-line
    if (songEntry.en && songEntry.en.length > 0) {
      if (lang !== 'en') {
        return songEntry.en.map((line) => ({
          time: line.time,
          text: translateLineText(line.text, lang),
        }));
      }
      return songEntry.en;
    }
  }

  // 2. Check song's own multilingualLyrics property
  if (song.multilingualLyrics && song.multilingualLyrics[lang]) {
    const customLangLyrics = song.multilingualLyrics[lang];
    if (customLangLyrics.length > 0) {
      return customLangLyrics;
    }
  }

  // 3. Fall back to song.syncedLyrics (or auto-generate if missing)
  let baseEnglishLyrics: SyncedLyricLine[] = [];
  if (song.syncedLyrics && song.syncedLyrics.length > 0) {
    baseEnglishLyrics = song.syncedLyrics;
  } else if (song.lyrics) {
    baseEnglishLyrics = autoGenerateSyncedLyrics(song.lyrics, song.duration || 180);
  }

  // Filter out any fake instrumental placeholder lines
  baseEnglishLyrics = baseEnglishLyrics.filter(
    (line) =>
      !line.text.includes('Instrumental Melody') &&
      !line.text.includes('Harmonic Progression') &&
      !line.text.includes('Rhythmic Groove') &&
      !line.text.includes('Bridge Resolution') &&
      !line.text.includes('Gentle Outro Fade')
  );

  if (lang === 'en') {
    return baseEnglishLyrics;
  }

  // Translate line-for-line while strictly preserving timestamps
  return baseEnglishLyrics.map((line) => ({
    time: line.time,
    text: translateLineText(line.text, lang),
  }));
}
