import * as fs from 'fs';
import * as path from 'path';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedFollowUps?: string[];
  suggestAdminHandoff?: boolean;
}

export interface ChatContext {
  userName?: string;
  userId?: string;
  history: ChatMessage[];
}

export interface SonoraStats {
  artistCount: number;
  albumCount: number;
  songCount: number;
  genres: string[];
}

// ---------------------------------------------------------------------------
// 1. Dynamic SONORA Catalog Cache & Indexing
// ---------------------------------------------------------------------------
let cachedDb: any = null;
let lastDbLoadTime = 0;

function getSonoraDb() {
  const now = Date.now();
  if (!cachedDb || now - lastDbLoadTime > 30000) {
    try {
      const dbPath = path.join(process.cwd(), 'data', 'sonora.json');
      if (fs.existsSync(dbPath)) {
        cachedDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        lastDbLoadTime = now;
      }
    } catch (e) {
      console.error('Error reading sonora.json in ariaAiBrain:', e);
    }
  }
  return cachedDb || { artists: [], albums: [], songs: [], genres: [] };
}

export function getSonoraCatalogStats(): SonoraStats {
  const db = getSonoraDb();
  return {
    artistCount: db.artists?.length || 0,
    albumCount: db.albums?.length || 0,
    songCount: db.songs?.length || 0,
    genres: (db.genres || []).map((g: any) => g.name || g.slug)
  };
}

export function searchSonoraCatalog(query: string) {
  const db = getSonoraDb();
  const q = query.toLowerCase().trim();
  if (!q) return null;

  // 1. Search Artists
  const matchedArtists = (db.artists || []).filter((a: any) => {
    const aName = a.name?.toLowerCase();
    const aSlug = a.slug?.toLowerCase();
    if (!aName || aName.length < 2) return false;
    return aName.includes(q) || q.includes(aName) || (aSlug && q.includes(aSlug));
  });

  // Prioritize exact or longer artist name matches
  matchedArtists.sort((x: any, y: any) => (y.name?.length || 0) - (x.name?.length || 0));

  // 2. Search Albums
  const matchedAlbums = (db.albums || []).filter((a: any) => {
    const aTitle = a.title?.toLowerCase();
    if (!aTitle) return false;
    return aTitle.includes(q) || (aTitle.length > 3 && q.includes(aTitle)) || (a.artistName && q.includes(a.artistName.toLowerCase()));
  });

  // 3. Search Songs
  const matchedSongs = (db.songs || []).filter((s: any) => {
    const sTitle = s.title?.toLowerCase();
    if (!sTitle) return false;
    return sTitle.includes(q) || (sTitle.length > 3 && q.includes(sTitle)) || (s.artistName && q.includes(s.artistName.toLowerCase()));
  });

  return {
    artists: matchedArtists.slice(0, 5),
    albums: matchedAlbums.slice(0, 5),
    songs: matchedSongs.slice(0, 8)
  };
}

// ---------------------------------------------------------------------------
// 2. Advanced Multi-Language Detection Engine
// Supported: English, Cebuano/Bisaya, Tagalog/Filipino, Spanish, Japanese,
// Korean, Chinese, French, German, Portuguese, Indonesian/Malay, Arabic, Hindi.
// ---------------------------------------------------------------------------
export type SupportedLang =
  | 'en'
  | 'ceb'
  | 'fil'
  | 'es'
  | 'ja'
  | 'ko'
  | 'zh'
  | 'fr'
  | 'de'
  | 'pt'
  | 'id_ms'
  | 'ar'
  | 'hi';

export function detectLanguage(text: string): SupportedLang {
  const lower = text.toLowerCase().trim();

  // 1. Script-based detections
  // Japanese: Hiragana or Katakana present
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja';

  // Korean: Hangul syllables or jamo
  if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(text)) return 'ko';

  // Arabic script
  if (/[\u0600-\u06FF\u0750-\u077F]/.test(text)) return 'ar';

  // Hindi (Devanagari script)
  if (/[\u0900-\u097F]/.test(text)) return 'hi';

  // Chinese: Han characters without Japanese Kana
  if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';

  // 2. Cebuano / Bisaya indicators (colloquial, slang, regional words & contractions)
  const cebPatterns = [
    /\bunsaon\b/, /\bngano\b/, /\bnganong\b/, /\bunsay\b/, /\bdili\b/, /\bdli\b/,
    /\bwala\b/, /\bwla\b/, /\bderia\b/, /\bkaron\b/, /\bkinsa\b/, /\basa\b/,
    /\bkaayo\b/, /\bnako\b/, /\bnimo\b/, /\bakong\b/, /\bimong\b/, /\bgusto\b/,
    /\bganahan\b/, /\bmotokar\b/, /\btukar\b/, /\bpaminaw\b/, /\bpalihog\b/,
    /\bsugyot\b/, /\btudloi\b/, /\bunya\b/, /\bpud\b/, /\bpod\b/, /\blagi\b/,
    /\bgyud\b/, /\bgud\b/, /\bjud\b/, /\bba\b/, /\bmaka\b/, /\bman\b/,
    /\bin-ani\b/, /\bngari\b/, /\bdiri\b/, /\bkani\b/, /\bkini\b/, /\bilaha\b/,
    /\bilang\b/, /\bnila\b/, /\bsila\b/, /\btabang\b/, /\btsada\b/, /\bnindot\b/
  ];
  let cebScore = 0;
  for (const pat of cebPatterns) {
    if (pat.test(lower)) cebScore += 1;
  }

  // 3. Tagalog / Filipino indicators (including Taglish, slang & abbreviations)
  const filPatterns = [
    /\bpaano\b/, /\bpano\b/, /\bbakit\b/, /\bbkit\b/, /\bhindi\b/, /\bndi\b/,
    /\bayaw\b/, /\bsino\b/, /\bsaan\b/, /\bsan\b/, /\bkasi\b/, /\bnaman\b/,
    /\bpaki\b/, /\btumutugtog\b/, /\btugtog\b/, /\bayusin\b/, /\bpwede\b/,
    /\bpwede ba\b/, /\bpakinggan\b/, /\bano\b/, /\bmeron\b/, /\baking\b/,
    /\biyong\b/, /\bkanilang\b/, /\bsila\b/, /\bnila\b/, /\bito\b/, /\byan\b/,
    /\byon\b/, /\bgusto ko\b/, /\btulong\b/, /\btulungan\b/, /\bmagkano\b/,
    /\bkamusta\b/, /\bkumusta\b/, /\blodi\b/, /\bpetmalu\b/, /\bwerpa\b/
  ];
  let filScore = 0;
  for (const pat of filPatterns) {
    if (pat.test(lower)) filScore += 1;
  }

  // Check Cebuano vs Tagalog
  if (cebScore >= 1 && cebScore >= filScore) return 'ceb';
  if (filScore >= 1) return 'fil';

  // 4. Spanish indicators
  const esPatterns = [
    /\b(hola|cómo|como|canción|canciones|álbum|álbumes|artista|artistas|escuchar|letra|letras|ecualizador|reproducir|reproducción|problema|ayuda|gracias|buenos|buenas|por favor|sonido|música)\b/
  ];
  if (esPatterns.some(p => p.test(lower))) return 'es';

  // 5. French indicators
  const frPatterns = [
    /\b(bonjour|salut|comment|chanson|chansons|album|albums|artiste|artistes|écouter|paroles|égaliseur|lecture|problème|aide|merci|s'il vous plaît|musique)\b/
  ];
  if (frPatterns.some(p => p.test(lower))) return 'fr';

  // 6. German indicators
  const dePatterns = [
    /\b(hallo|guten|wie|lied|lieder|alben|album|künstler|hören|songtexte|equalizer|wiedergabe|problem|hilfe|danke|bitte|musik)\b/
  ];
  if (dePatterns.some(p => p.test(lower))) return 'de';

  // 7. Portuguese indicators
  const ptPatterns = [
    /\b(olá|como|música|músicas|álbum|álbuns|artista|artistas|ouvir|letras|equalizador|reprodução|tocar|problema|ajuda|obrigado|obrigada|por favor)\b/
  ];
  if (ptPatterns.some(p => p.test(lower))) return 'pt';

  // 8. Indonesian / Malay indicators
  const idPatterns = [
    /\b(halo|hai|bagaimana|cara|lagu|album|artis|mendengarkan|lirik|pemutar|putar|masalah|bantuan|terima kasih|tolong|musik)\b/
  ];
  if (idPatterns.some(p => p.test(lower))) return 'id_ms';

  return 'en';
}

// ---------------------------------------------------------------------------
// 3. Conversational Context & Entity Resolution (Pronouns / Anaphora)
// Resolves: "they", "them", "their", "sila", "nila", "ilang", "kini", "ito", "sus", "her", "his"
// ---------------------------------------------------------------------------
export function resolveEntityFromHistory(userPrompt: string, history: ChatMessage[]): string | null {
  const lower = userPrompt.toLowerCase();
  const pronounPatterns = [
    /\b(they|them|their|theirs|he|she|him|her|his)\b/,
    /\b(sila|nila|kanila|kanilang|ito|iyan|iyon)\b/,
    /\b(sila|nila|ilaha|ilang|kani|kini|ana)\b/,
    /\b(ellos|ellas|sus|su|él|ella)\b/,
    /\b(ils|elles|leur|leurs|lui)\b/,
    /\b(sie|ihre|ihren|ihrem)\b/,
    /\b(eles|elas|seu|sua|seus|suas)\b/,
    /\b(mereka|dia|ia)\b/,
    /\b(彼女|彼|彼ら|それ|その)\b/,
    /\b(그들|그녀|그|그들의)\b/
  ];

  const hasPronoun = pronounPatterns.some(p => p.test(lower));
  if (!hasPronoun && history.length === 0) return null;

  const db = getSonoraDb();
  const artists: any[] = db.artists || [];

  // Look backwards in history for the most recent artist match
  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i];
    const contentLower = msg.content.toLowerCase();

    for (const art of artists) {
      const artName = art.name.toLowerCase();
      if (artName.length > 2 && contentLower.includes(artName)) {
        return art.name;
      }
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// 4. Dynamic Recommendation Engine from Live Sonora Database
// ---------------------------------------------------------------------------
export function getFeaturedRecommendations(genreFilter?: string) {
  const db = getSonoraDb();
  let candidateSongs: any[] = db.songs || [];

  if (genreFilter) {
    const gLower = genreFilter.toLowerCase();
    const filtered = candidateSongs.filter((s: any) =>
      s.genreName?.toLowerCase().includes(gLower) || s.genreSlug?.toLowerCase().includes(gLower)
    );
    if (filtered.length > 0) candidateSongs = filtered;
  }

  // Shuffle candidate list pseudo-randomly
  const shuffled = [...candidateSongs].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5);
}

// ---------------------------------------------------------------------------
// 5. Multilingual Localization Strings & Templates
// ---------------------------------------------------------------------------
const LOCALIZED_COPY: Record<SupportedLang, any> = {
  en: {
    artistPresent: 'is officially cataloged in SONORA!',
    genre: 'Genre',
    country: 'Country/Region',
    listeners: 'Monthly Listeners',
    officialAlbums: 'Official Albums & EPs',
    popularTracks: 'Popular Songs & Soundtracks',
    viewProfilePrompt: 'You can explore their full discography and listen anytime at',
    recommendTitle: 'Here are handpicked songs from our library you will love:',
    recommendFooter: 'Just tap any song title in SONORA or press Spacebar to play instantly!',
    lyricsTitle: 'Lyrics & Multilingual Translation in SONORA',
    lyricsSteps: [
      '**Open Now Playing:** Click the album artwork or current track banner in the bottom player bar.',
      '**Toggle Lyrics:** Click the **Lyrics** (microphone/document) icon to show synchronized or static lyrics.',
      '**Translate to 20+ Languages:** Click the **Translation dropdown** to read lyrics in English, Tagalog, Cebuano, Spanish, Japanese, Korean, and more.',
      '**Adjust Font Size:** Click **A-** or **A+** to scale the lyrics typography for comfortable reading on any screen.'
    ],
    equalizerTitle: 'Master 10-Band Audio Equalizer in SONORA',
    equalizerSteps: [
      '**Locate EQ Button:** In the bottom player bar, click the **EQ (sliders)** icon next to the volume control.',
      '**Choose Studio Presets:** Select from **Acoustic, Bass Boost, Bass Reducer, Classical, Electronic, Hip-Hop, Pop, Rock, or Vocal Enhancer**.',
      '**Fine-tune 10 Bands:** Adjust sliders from 32 Hz (deep sub-bass) up to 16 kHz (crystal highs).',
      '**Instant Memory:** Your custom audio curves save automatically in your browser profile.'
    ],
    troubleshootTitle: 'Playback & Audio Troubleshooting Guide',
    troubleshootSteps: [
      '**Play/Pause Toggle:** Press **Spacebar** or click the center Play button.',
      '**Audio Permissions:** Check that your web browser tab is not muted and has sound permissions granted.',
      '**Volume Sliders:** Confirm both the SONORA player slider and your device master volume are turned up.',
      '**Connection & Cache:** If a stream buffers, refresh the page (`Ctrl + F5`) or switch to another track.',
      '**Device Output:** Ensure your headphones or Bluetooth speaker are connected as the active audio output.'
    ],
    adminTitle: 'Live Human Support Escalation',
    adminText: 'Need specialized help or want to speak with a human administrator? Click the **Admin Inbox** tab right here in Messages or visit the Contact page.',
    musicRequestTitle: 'Request Missing Music or Report Metadata',
    musicRequestText: 'Cannot find your favorite artist, album, or soundtrack? Click your profile icon and open **Request Song** or **Report Issue** to notify our curators directly.',
    helpPrompt: 'How can I assist your musical journey in SONORA today?',
    notFound: 'is currently not in our library. You can submit a request via the Request Song modal!'
  },
  ceb: {
    artistPresent: 'anaa na sa atong opisyal nga library sa SONORA!',
    genre: 'Kategoriya / Genre',
    country: 'Nasod / Rehiyon',
    listeners: 'Binulan nga Tigpaminaw',
    officialAlbums: 'Opisyal nga mga Album ug EPs',
    popularTracks: 'Sikat nga mga Kanta ug Soundtracks',
    viewProfilePrompt: 'Mahimo nimong paminawon ang ilang tibuok discography sa',
    recommendTitle: 'Ania ang pinili nga mga nindot nga kanta gikan sa SONORA:',
    recommendFooter: 'Pindota lang ang titulo sa kanta o pislita ang Spacebar aron motokar dayon!',
    lyricsTitle: 'Lyrics ug Pag-translate sa SONORA',
    lyricsSteps: [
      '**Ablihi ang Now Playing:** Pindota ang album cover o ang kanta sa ubos nga player bar.',
      '**I-on ang Lyrics:** I-click ang **Lyrics** icon (mikropono/papel) aron makita ang titik sa kanta.',
      '**Pilia ang Pinulongan (Translation):** Pindota ang Translation dropdown aron ma-translate ang lyrics sa Bisaya, Tagalog, English, Japanese, ug kapin 20 pa ka lengguwahe.',
      '**Usba ang Font Size:** Pislita ang **A-** o **A+** aron padak-on o pagamyon ang teksto sa lyrics.'
    ],
    equalizerTitle: '10-Band Audio Equalizer sa SONORA',
    equalizerSteps: [
      '**Pangitaa ang EQ Button:** Sa ubos nga player tapad sa volume, i-click ang **EQ (sliders)** icon.',
      '**Pili og Presets:** Naay Bass Boost, Vocal Enhancer, Acoustic, Rock, Pop, ug uban pa.',
      '**I-adjust ang 10 Frequency Bands:** Pwede nimo pausbon ang bass (32Hz) hangtod sa tin-aw nga treble (16kHz).',
      '**Auto-Save:** Awtomatiko kining ma-save sa imong browser para sa tanan nimong paminawon.'
    ],
    troubleshootTitle: 'Pagsulbad sa Problema sa Playback ug Tingog',
    troubleshootSteps: [
      '**Play/Pause:** Pislita ang **Spacebar** sa keyboard o ang Play button sa player.',
      '**Volume sa Browser:** Siguroha nga wala naka-mute ang tab sa imong browser o ang device volume.',
      '**Pagsusi sa Audio Output:** Siguroha nga konektado ang imong headphones o Bluetooth speaker.',
      '**I-refresh ang Pahina:** Kung mag-buffering, i-reload ang page (`Ctrl + F5`).',
      '**Human Support:** Kung dili gihapon motukar, i-message ang atong Admin sa pikas tab.'
    ],
    adminTitle: 'Pakig-istorya sa Admin Support',
    adminText: 'Gusto ba kang makig-istorya sa opisyal nga administrator sa SONORA? I-click lang ang **Admin Inbox** tab sa ibabaw aron magbilin og direktang mensahe.',
    musicRequestTitle: 'Paghangyo og Kanta o Pag-report og Sayop',
    musicRequestText: 'Wala ba nimo makita ang imong paboritong kanta o album? Gamita ang **Request Song** o **Report Issue** button aron madugang sa atong curators.',
    helpPrompt: 'Unsa pa akong matabang kanimo kabahin sa SONORA karon, higala?',
    notFound: 'wala pa karon sa atong database. Pwede nimo kining ihangyo pinaagi sa Request Song modal!'
  },
  fil: {
    artistPresent: 'ay opisyal nang nasa ating SONORA music library!',
    genre: 'Genre / Uri ng Musika',
    country: 'Bansa / Rehiyon',
    listeners: 'Buwanang Tagapakinig',
    officialAlbums: 'Opisyal na mga Album at EPs',
    popularTracks: 'Sikat na mga Awitin at Soundtracks',
    viewProfilePrompt: 'Maaari mong pakinggan ang kanilang buong discography sa',
    recommendTitle: 'Narito ang ilang magagandang awitin mula sa SONORA na magugustuhan mo:',
    recommendFooter: 'Pindutin lamang ang pamagat ng kanta o pindutin ang Spacebar upang magpatugtog agad!',
    lyricsTitle: 'Lyrics at Pagsasalin (Translation) sa SONORA',
    lyricsSteps: [
      '**Buksan ang Now Playing:** I-click ang cover art o title sa player bar sa ibaba.',
      '**I-activate ang Lyrics:** Pindutin ang **Lyrics** icon upang lumabas ang titik ng kanta.',
      '**Isalin sa Ibang Wika:** Gamitin ang Translation selector para isalin sa Tagalog, Bisaya, English, Japanese, at 20+ pang wika.',
      '**Baguhin ang Laki ng Font:** I-click ang **A-** o **A+** para mas madaling basahin.'
    ],
    equalizerTitle: '10-Band Equalizer sa SONORA',
    equalizerSteps: [
      '**Hanapin ang EQ:** Sa bottom player malapit sa volume, i-click ang **EQ sliders** icon.',
      '**Pumili ng Presets:** Pumili mula sa Bass Boost, Vocal, Acoustic, Rock, Pop, at iba pa.',
      '**I-tono ang 10 Frequency Sliders:** I-adjust mula 32Hz hanggang 16kHz para sa perpektong tunog.',
      '**Kusang Naka-save:** Tandaan ng browser ang iyong sound profile.'
    ],
    troubleshootTitle: 'Gabay sa Pag-aayos ng Playback at Audio',
    troubleshootSteps: [
      '**Play/Pause:** Pindutin ang **Spacebar** o ang gitnang Play button.',
      '**Volume at Permissions:** Siguraduhing hindi naka-mute ang browser tab at nakataas ang volume.',
      '**Headphones / Speaker:** Tiyaking nakakabit nang maayos ang iyong audio output device.',
      '**I-refresh ang Pahina:** Kung nag-stuck o buffering, pindutin ang `Ctrl + F5`.',
      '**Admin Escalation:** Kung kailangan ng karagdagang tulong, lumipat sa Admin Inbox tab.'
    ],
    adminTitle: 'Makipag-usap sa Human Admin',
    adminText: 'Kailangan mo ba ng tulong mula sa opisyal na admin ng SONORA? I-click lamang ang **Admin Inbox** tab sa itaas upang mag-iwan ng mensahe.',
    musicRequestTitle: 'Humiling ng Kanta o Mag-ulat ng Mali',
    musicRequestText: 'Wala ba ang iyong paboritong kanta o album? Gamitin ang **Request Song** o **Report Issue** modal upang madagdagan agad.',
    helpPrompt: 'Ano pa ang maaari kong maitulong sa iyo rito sa SONORA, kaibigan?',
    notFound: 'ay wala pa sa kasalukuyan sa aming library. Maaari mo itong i-request sa Request Song form!'
  },
  es: {
    artistPresent: '¡está disponible oficialmente en la biblioteca de SONORA!',
    genre: 'Género',
    country: 'País / Región',
    listeners: 'Oyentes Mensuales',
    officialAlbums: 'Álbumes y EPs Oficiales',
    popularTracks: 'Canciones y Bandas Sonoras Populares',
    viewProfilePrompt: 'Puedes explorar su discografía completa y escuchar en',
    recommendTitle: 'Aquí tienes canciones destacadas de nuestra biblioteca que te encantarán:',
    recommendFooter: '¡Haz clic en cualquier título o presiona la barra espaciadora para reproducir!',
    lyricsTitle: 'Letras y Traducción Multilingüe en SONORA',
    lyricsSteps: [
      '**Abrir Reproductor:** Haz clic en la portada del álbum en la barra inferior.',
      '**Activar Letras:** Pulsa el icono de **Letras** para ver la letra sincronizada.',
      '**Traducir a más de 20 idiomas:** Usa el menú desplegable para traducir al español, inglés, etc.',
      '**Ajustar Tamaño de Letra:** Haz clic en **A-** o **A+** para cambiar el tamaño de fuente.'
    ],
    equalizerTitle: 'Ecualizador de 10 Bandas en SONORA',
    equalizerSteps: [
      '**Abrir EQ:** En la barra inferior junto al volumen, haz clic en el icono de **Ecualizador**.',
      '**Elegir Ajuste:** Selecciona Bass Boost, Vocal, Acústico, Rock, Pop o Electrónica.',
      '**Ajustar Frecuencias:** Personaliza las 10 bandas desde 32Hz hasta 16kHz.',
      '**Guardado Automático:** Tus configuraciones se guardan en tu perfil de navegador.'
    ],
    troubleshootTitle: 'Solución de Problemas de Reproducción y Audio',
    troubleshootSteps: [
      '**Reproducir/Pausar:** Presiona la **barra espaciadora** o el botón Play.',
      '**Comprobar Volumen:** Asegúrate de que la pestaña del navegador y el dispositivo no estén silenciados.',
      '**Salida de Audio:** Verifica que tus auriculares o altavoces Bluetooth estén conectados.',
      '**Recargar:** Si se detiene la carga, recarga la página (`Ctrl + F5`).',
      '**Contactar Soporte:** Cambia a la pestaña de Administrador si necesitas asistencia humana.'
    ],
    adminTitle: 'Asistencia con Administrador Humano',
    adminText: '¿Necesitas ayuda especializada? Haz clic en la pestaña **Admin Inbox** aquí en Mensajes.',
    musicRequestTitle: 'Solicitar Música o Notificar Error',
    musicRequestText: '¿Falta tu artista o canción favorita? Usa la opción **Request Song** o **Report Issue** en tu perfil.',
    helpPrompt: '¿En qué más te puedo ayudar hoy en SONORA?',
    notFound: 'no se encuentra actualmente en nuestro catálogo. ¡Puedes solicitarlo mediante el formulario de solicitud!'
  },
  ja: {
    artistPresent: 'はSONORA公式ライブラリに収録されています！',
    genre: 'ジャンル',
    country: '国・地域',
    listeners: '月間リスナー数',
    officialAlbums: '公式アルバム＆EP',
    popularTracks: '人気曲＆サウンドトラック',
    viewProfilePrompt: 'いつでも全ディスコグラフィーを試聴できます：',
    recommendTitle: 'SONORAライブラリからのおすすめ楽曲はこちらです：',
    recommendFooter: '曲名をタップするかスペースキーを押すだけで今すぐ再生できます！',
    lyricsTitle: 'SONORAの歌詞表示と多言語翻訳機能',
    lyricsSteps: [
      '**再生画面を開く:** 画面下部のプレイヤーバーでジャケット画像をクリックします。',
      '**歌詞を表示:** マイク/歌詞アイコンをクリックして同期歌詞を表示します。',
      '**20以上の言語に翻訳:** 翻訳ドロップダウンから日本語、英語、韓国語などに即時翻訳できます。',
      '**文字サイズ変更:** **A-** または **A+** をクリックしてお好みの文字サイズに調整できます。'
    ],
    equalizerTitle: '10バンド・オーディオイコライザー',
    equalizerSteps: [
      '**EQを開く:** 画面下部の音量横にあるスライダーアイコンをクリックします。',
      '**プリセット選択:** Bass Boost、ボーカル強調、ロック、ポップ、アコースティック等から選べます。',
      '**10バンド微調整:** 32Hzの重低音から16kHzの繊細な高音まで自在に調整可能です。',
      '**自動保存:** 設定はブラウザプロファイルに自動的に保存されます。'
    ],
    troubleshootTitle: '再生トラブルシューティング',
    troubleshootSteps: [
      '**再生/一時停止:** **スペースキー** または中央の再生ボタンを押してください。',
      '**音量設定:** ブラウザのタブや端末の音量がミュートになっていないか確認してください。',
      '**出力機器:** イヤホンやBluetoothスピーカーが正しく接続されているか確認してください。',
      '**ページの再読み込み:** 再生が途切れる場合はページを再読み込み（Ctrl + F5）してください。',
      '**管理者サポート:** 解決しない場合は「Admin Inbox」タブから直接お問い合わせください。'
    ],
    adminTitle: '管理者サポートへのお問い合わせ',
    adminText: '人間のサポートが必要な場合は、上部の「Admin Inbox」タブからメッセージを送信してください。',
    musicRequestTitle: '楽曲リクエスト・不具合報告',
    musicRequestText: 'お探しのアーティストや曲が見つからない場合は、「Request Song」や「Report Issue」機能からリクエストをお送りください。',
    helpPrompt: '本日SONORAについて何かお手伝いできることはありますか？',
    notFound: 'は現在ライブラリに登録されていません。リクエスト機能から追加申請が可能です！'
  },
  ko: {
    artistPresent: '님은 현재 SONORA 공식 라이브러리에 등록되어 있습니다!',
    genre: '장르',
    country: '국가/지역',
    listeners: '월간 청취자',
    officialAlbums: '공식 앨범 및 EP',
    popularTracks: '인기 곡 및 사운드트랙',
    viewProfilePrompt: '다음 링크에서 전체 음반을 바로 감상하실 수 있습니다:',
    recommendTitle: '회원님을 위한 SONORA 추천 곡 목록입니다:',
    recommendFooter: '곡 제목을 클릭하거나 스페이스바를 누르면 즉시 재생됩니다!',
    lyricsTitle: 'SONORA 가사 및 다국어 실시간 번역 안내',
    lyricsSteps: [
      '**재생창 열기:** 하단 플레이어 바에서 앨범 아트를 클릭합니다.',
      '**가사 켜기:** 가사 아이콘을 눌러 실시간 동기화 가사를 확인합니다.',
      '**20개 이상 언어 번역:** 번역 옵션에서 한국어, 영어, 일본어 등으로 즉시 번역합니다.',
      '**글꼴 크기 조절:** **A-** 또는 **A+** 버튼으로 편안한 크기로 맞춥니다.'
    ],
    equalizerTitle: '10밴드 고음질 오디오 이퀄라이저',
    equalizerSteps: [
      '**EQ 열기:** 플레이어 볼륨 옆의 **EQ 슬라이더** 아이콘을 클릭합니다.',
      '**프리셋 선택:** 베이스 부스트, 보컬 강조, 록, 팝, 전자 음악 등을 선택합니다.',
      '**10개 대역 조절:** 32Hz 서브베이스부터 16kHz 초고음까지 세밀하게 설정합니다.',
      '**자동 저장:** 브라우저에 설정값이 즉시 저장됩니다.'
    ],
    troubleshootTitle: '오디오 및 스트리밍 문제 해결 가이드',
    troubleshootSteps: [
      '**재생/일시정지:** 키보드 **스페이스바** 또는 재생 버튼을 누릅니다.',
      '**음소거 확인:** 브라우저 탭 및 기기 자체 볼륨이 켜져 있는지 확인합니다.',
      '**오디오 출력 기기:** 이어폰 또는 블루투스 스피커 연결 상태를 점검합니다.',
      '**페이지 새로고침:** 로딩이 지연되면 `Ctrl + F5`로 새로고침합니다.',
      '**관리자 문의:** 문제가 지속되면 상단의 Admin Inbox 탭을 이용해 주세요.'
    ],
    adminTitle: '운영자 직접 지원',
    adminText: '관리자의 직접적인 도움이 필요하신가요? 상단의 **Admin Inbox** 탭을 클릭하여 메시지를 남겨주세요.',
    musicRequestTitle: '음악 신청 및 메타데이터 오류 신고',
    musicRequestText: '원하는 곡이 없으신가요? 프로필의 **Request Song** 또는 **Report Issue** 메뉴를 통해 요청해 주세요.',
    helpPrompt: '오늘 SONORA에서 어떤 음악이나 기능을 도와드릴까요?',
    notFound: '은(는) 현재 라이브러리에 등록되어 있지 않습니다. 곡 요청 기능을 통해 신청해 주세요!'
  },
  zh: {
    artistPresent: '已正式收录在 SONORA 音乐曲库中！',
    genre: '流派 / 类型',
    country: '国家 / 地区',
    listeners: '每月听众人数',
    officialAlbums: '官方专辑与 EP',
    popularTracks: '热门单曲与原声带',
    viewProfilePrompt: '您可以随时探索他们的完整作品集：',
    recommendTitle: '为您精选的 SONORA 音乐推荐：',
    recommendFooter: '点击任意曲目或按空格键即可立即播放！',
    lyricsTitle: 'SONORA 歌词展示与多语言即时翻译',
    lyricsSteps: [
      '**打开播放视图:** 点击底部播放栏的专辑封面。',
      '**开启歌词:** 点击 **歌词** 图标查看动态滚动歌词。',
      '**翻译为20+种语言:** 在翻译菜单中选择中文、英文、日文、韩文等。',
      '**调节字号:** 点击 **A-** 或 **A+** 即可缩放歌词字体。'
    ],
    equalizerTitle: '10段专业音频均衡器 (EQ)',
    equalizerSteps: [
      '**打开均衡器:** 在底部播放栏音量滑块旁点击 **EQ 图标**。',
      '**选择预设:** 支持重低音增强、人声强化、摇滚、流行、原声等多种风格。',
      '**微调10个频段:** 从 32Hz 超低音到 16kHz 细腻高音随意调整。',
      '**自动保存:** 浏览器会实时记住您的专属音频曲线。'
    ],
    troubleshootTitle: '播放与音频故障排查',
    troubleshootSteps: [
      '**播放/暂停:** 按键盘 **空格键** 或点击播放按钮。',
      '**检查音量:** 确保网页标签未静音，且系统音量正常。',
      '**音频设备:** 检查耳机或蓝牙音箱连接状态。',
      '**刷新页面:** 如遇缓冲延迟，请刷新页面 (`Ctrl + F5`)。',
      '**管理员支持:** 若仍有问题，可切换至 Admin Inbox 标签联系人工客服。'
    ],
    adminTitle: '人工管理员支持',
    adminText: '需要人工协助？请点击上方的 **Admin Inbox** 标签直接留言。',
    musicRequestTitle: '点歌请求与问题反馈',
    musicRequestText: '找不到心仪的歌曲或专辑？可使用 **Request Song** 或 **Report Issue** 提交请求。',
    helpPrompt: '今天在 SONORA 有什么我可以为您效劳的吗？',
    notFound: '目前尚未收录在曲库中。您可以通过点歌功能提交申请！'
  },
  fr: {
    artistPresent: 'est officiellement disponible dans la bibliothèque SONORA !',
    genre: 'Genre',
    country: 'Pays / Région',
    listeners: 'Auditeurs mensuels',
    officialAlbums: 'Albums & EPs officiels',
    popularTracks: 'Titres et bandes originales populaires',
    viewProfilePrompt: 'Vous pouvez explorer toute sa discographie sur',
    recommendTitle: 'Voici une sélection de titres recommandés dans SONORA :',
    recommendFooter: 'Cliquez sur un titre ou appuyez sur Espace pour lancer la lecture !',
    lyricsTitle: 'Paroles et traduction multilingue dans SONORA',
    lyricsSteps: [
      '**Ouvrir la lecture :** Cliquez sur la pochette dans la barre de lecture.',
      '**Afficher les paroles :** Cliquez sur l’icône Paroles pour voir le texte synchronisé.',
      '**Traduire en 20+ langues :** Utilisez le menu déroulant de traduction.',
      '**Ajuster la taille :** Cliquez sur **A-** ou **A+** pour ajuster la police.'
    ],
    equalizerTitle: 'Égaliseur audio 10 bandes',
    equalizerSteps: [
      '**Ouvrir l’égaliseur :** Cliquez sur l’icône EQ à côté du volume.',
      '**Choisir un préréglage :** Bass Boost, Vocal, Rock, Pop, Acoustique, etc.',
      '**Ajuster les 10 fréquences :** De 32 Hz à 16 kHz selon vos préférences.',
      '**Sauvegarde automatique :** Enregistré dans votre profil de navigateur.'
    ],
    troubleshootTitle: 'Dépannage de la lecture et du son',
    troubleshootSteps: [
      '**Lecture/Pause :** Appuyez sur **Espace** ou sur le bouton Lecture.',
      '**Volume :** Vérifiez que l’onglet ou l’appareil n’est pas en sourdine.',
      '**Sortie audio :** Assurez-vous que vos écouteurs ou enceintes sont connectés.',
      '**Actualiser :** Rechargez la page (`Ctrl + F5`) en cas de mise en mémoire tampon.',
      '**Support Admin :** Cliquez sur l’onglet Admin Inbox pour contacter un humain.'
    ],
    adminTitle: 'Support administrateur en direct',
    adminText: 'Besoin d’aide humaine ? Rendez-vous dans l’onglet **Admin Inbox** ici même.',
    musicRequestTitle: 'Demander un morceau ou signaler une erreur',
    musicRequestText: 'Vous ne trouvez pas votre artiste favori ? Utilisez les options **Request Song** ou **Report Issue**.',
    helpPrompt: 'Comment puis-je vous aider aujourd’hui sur SONORA ?',
    notFound: 'n’est pas encore dans notre bibliothèque. Vous pouvez en faire la demande via le formulaire de requête !'
  },
  de: {
    artistPresent: 'ist offiziell in der SONORA-Bibliothek verfügbar!',
    genre: 'Genre',
    country: 'Land / Region',
    listeners: 'Monatliche Hörer',
    officialAlbums: 'Offizielle Alben & EPs',
    popularTracks: 'Beliebte Songs & Soundtracks',
    viewProfilePrompt: 'Sie können die gesamte Diskografie entdecken unter',
    recommendTitle: 'Hier sind handverlesene Songs aus SONORA, die Ihnen gefallen werden:',
    recommendFooter: 'Einfach Songtitel anklicken oder Leertaste drücken zum Abspielen!',
    lyricsTitle: 'Songtexte & mehrsprachige Übersetzung in SONORA',
    lyricsSteps: [
      '**Wiedergabe öffnen:** Auf das Album-Cover in der unteren Leiste klicken.',
      '**Songtexte aktivieren:** Auf das Text-Symbol für synchronisierte Lyrics klicken.',
      '**In 20+ Sprachen übersetzen:** Über das Dropdown-Menü in Deutsch, Englisch etc. übersetzen.',
      '**Schriftgröße anpassen:** Mit **A-** oder **A+** die Textgröße skalieren.'
    ],
    equalizerTitle: '10-Band-Equalizer in SONORA',
    equalizerSteps: [
      '**EQ öffnen:** Neben dem Lautstärkeregler auf das EQ-Symbol klicken.',
      '**Voreinstellungen wählen:** Bass Boost, Gesang, Rock, Pop, Akustik etc.',
      '**10 Frequenzen anpassen:** Von 32 Hz Sub-Bass bis 16 kHz Höhen.',
      '**Automatisch gespeichert:** Bleibt in Ihrem Browser hinterlegt.'
    ],
    troubleshootTitle: 'Audio- & Wiedergabe-Fehlerbehebung',
    troubleshootSteps: [
      '**Play/Pause:** **Leertaste** drücken oder den Play-Button betätigen.',
      '**Lautstärke:** Prüfen, ob der Tab oder das Betriebssystem stummgeschaltet ist.',
      '**Ausgabegerät:** Kopfhörer oder Bluetooth-Lautsprecher kontrollieren.',
      '**Seite neu laden:** Bei Pufferproblemen `Ctrl + F5` drücken.',
      '**Admin kontaktieren:** Für persönlichen Support den Admin Inbox Tab nutzen.'
    ],
    adminTitle: 'Persönlicher Administrator-Support',
    adminText: 'Brauchen Sie direkte Unterstützung? Wechseln Sie zum **Admin Inbox** Reiter.',
    musicRequestTitle: 'Musik anfragen oder Fehler melden',
    musicRequestText: 'Fehlt ein Song oder Album? Nutzen Sie **Request Song** oder **Report Issue**.',
    helpPrompt: 'Wie kann ich Ihnen heute bei SONORA helfen?',
    notFound: 'ist derzeit nicht in unserer Bibliothek. Sie können den Titel über das Request-Formular anfordern!'
  },
  pt: {
    artistPresent: 'está oficialmente disponível na biblioteca do SONORA!',
    genre: 'Gênero',
    country: 'País / Região',
    listeners: 'Ouvintes Mensais',
    officialAlbums: 'Álbuns e EPs Oficiais',
    popularTracks: 'Músicas e Trilhas Sonoras Populares',
    viewProfilePrompt: 'Você pode conferir a discografia completa em',
    recommendTitle: 'Aqui estão faixas selecionadas do SONORA que você vai curtir:',
    recommendFooter: 'Basta clicar no título ou pressionar a barra de espaço para ouvir!',
    lyricsTitle: 'Letras e Tradução Multilíngue no SONORA',
    lyricsSteps: [
      '**Abrir Tocador:** Clique na capa do álbum na barra inferior.',
      '**Ativar Letras:** Clique no ícone de Letras para ver os versos sincronizados.',
      '**Traduzir para 20+ Idiomas:** Use o menu seletor para traduzir para português, inglês, etc.',
      '**Ajustar Tamanho:** Clique em **A-** ou **A+** para redimensionar o texto.'
    ],
    equalizerTitle: 'Equalizador de 10 Bandas no SONORA',
    equalizerSteps: [
      '**Abrir EQ:** Na barra inferior perto do volume, clique no ícone de equalizador.',
      '**Escolher Predefinição:** Bass Boost, Vocal, Rock, Pop, Acústico, etc.',
      '**Ajustar 10 Frequências:** De 32Hz (graves profundos) a 16kHz (agudos claros).',
      '**Salvo Automaticamente:** Fica gravado no perfil do seu navegador.'
    ],
    troubleshootTitle: 'Solução de Problemas de Reprodução e Som',
    troubleshootSteps: [
      '**Tocar/Pausar:** Pressione a **barra de espaço** ou o botão central Play.',
      '**Volume:** Verifique se a aba ou o seu dispositivo não estão no mudo.',
      '**Saída de Áudio:** Certifique-se de que os fones ou caixa de som estejam conectados.',
      '**Recarregar:** Se travar o streaming, atualize com `Ctrl + F5`.',
      '**Suporte Humano:** Acesse a aba Admin Inbox para falar com um administrador.'
    ],
    adminTitle: 'Suporte com Administrador Humano',
    adminText: 'Precisa de suporte personalizado? Acesse a aba **Admin Inbox** aqui nas Mensagens.',
    musicRequestTitle: 'Pedir Música ou Reportar Erro',
    musicRequestText: 'Não encontrou o que procurava? Use os botões **Request Song** ou **Report Issue**.',
    helpPrompt: 'Como posso ajudar você hoje no SONORA?',
    notFound: 'não está disponível no catálogo no momento. Você pode sugerir via formulário de pedidos!'
  },
  id_ms: {
    artistPresent: 'sudah resmi tersedia di perpustakaan musik SONORA!',
    genre: 'Genre',
    country: 'Negara / Wilayah',
    listeners: 'Pendengar Bulanan',
    officialAlbums: 'Album & EP Resmi',
    popularTracks: 'Lagu & Soundtrack Populer',
    viewProfilePrompt: 'Anda dapat mendengarkan seluruh diskografi di',
    recommendTitle: 'Berikut beberapa lagu pilihan terbaik di SONORA untuk Anda:',
    recommendFooter: 'Cukup klik judul lagu atau tekan Spasi untuk memutar langsung!',
    lyricsTitle: 'Lirik dan Terjemahan Multibahasa di SONORA',
    lyricsSteps: [
      '**Buka Pemutar:** Klik sampul album pada bilah pemutar di bagian bawah.',
      '**Tampilkan Lirik:** Klik ikon Lirik untuk melihat lirik lagu yang tersinkronisasi.',
      '**Terjemahkan ke 20+ Bahasa:** Pilih menu terjemahan untuk membaca dalam berbagai bahasa.',
      '**Ubah Ukuran Font:** Klik **A-** atau **A+** untuk mengatur ukuran teks.'
    ],
    equalizerTitle: 'Equalizer Audio 10-Band di SONORA',
    equalizerSteps: [
      '**Buka EQ:** Di bilah bawah samping volume, klik ikon slider equalizer.',
      '**Pilih Preset:** Bass Boost, Vocal, Acoustic, Rock, Pop, Electronic, dll.',
      '**Sesuaikan 10 Band Frekuensi:** Atur mulai dari 32Hz hingga 16kHz.',
      '**Simpan Otomatis:** Pengaturan otomatis tersimpan di browser Anda.'
    ],
    troubleshootTitle: 'Panduan Mengatasi Masalah Audio & Pemutaran',
    troubleshootSteps: [
      '**Putar/Jeda:** Tekan tombol **Spasi** atau tombol Play.',
      '**Periksa Volume:** Pastikan tab browser dan volume perangkat tidak dibisukan.',
      '**Koneksi Audio:** Pastikan headphone atau speaker Bluetooth terhubung dengan baik.',
      '**Muat Ulang Halaman:** Jika terjadi buffering, tekan `Ctrl + F5`.',
      '**Bantuan Admin:** Beralih ke tab Admin Inbox jika memerlukan bantuan langsung.'
    ],
    adminTitle: 'Bantuan Admin Langsung',
    adminText: 'Butuh bantuan dari tim administrator kami? Klik tab **Admin Inbox** di atas.',
    musicRequestTitle: 'Permintaan Lagu & Lapor Masalah',
    musicRequestText: 'Lagu atau album favorit belum ada? Gunakan opsi **Request Song** atau **Report Issue**.',
    helpPrompt: 'Ada yang bisa saya bantu untuk musik Anda di SONORA hari ini?',
    notFound: 'saat ini belum ada di katalog kami. Anda dapat memintanya melalui fitur Request Song!'
  },
  ar: {
    artistPresent: 'موجود رسمياً في مكتبة سونورا (SONORA) الموسيقية!',
    genre: 'النوع الموسيقي',
    country: 'البلد / المنطقة',
    listeners: 'المستمعون شهرياً',
    officialAlbums: 'الألبومات والإصدارات الرسمية',
    popularTracks: 'أشهر الأغاني والمقاطع الصوتية',
    viewProfilePrompt: 'يمكنك استكشاف أعمالهم الموسيقية الكاملة عبر',
    recommendTitle: 'إليك باقة مميزة من الأغاني المختارة في SONORA:',
    recommendFooter: 'اضغط على اسم الأغنية أو زر المسافة لتشغيلها على الفور!',
    lyricsTitle: 'كلمات الأغاني والترجمة الفورية في SONORA',
    lyricsSteps: [
      '**فتح مشغل الموسيقى:** انقر فوق صورة الألبوم في الشريط السفلي.',
      '**إظهار الكلمات:** اضغط على أيقونة الكلمات لمتابعة النص المتزامن.',
      '**ترجمة إلى أكثر من 20 لغة:** اختر لغتك المفضلة من قائمة الترجمة.',
      '**تعديل حجم الخط:** استخدم زري **A-** و **A+** لضبط الحجم المناسب.'
    ],
    equalizerTitle: 'معادل الصوت ذو 10 نطاقات (Equalizer)',
    equalizerSteps: [
      '**فتح المعادل:** انقر على أيقونة مؤشرات الصوت بجوار شريط الصوت في الأسفل.',
      '**اختيار الأنماط الجاهزة:** تعزيز الصوت الجهير (Bass Boost)، الأصوات الغنائية، الروك، البوب وغيرها.',
      '**ضبط الترددات:** تحكم كامل في 10 نطاقات تبدأ من 32 هرتز إلى 16 كيلوهرتز.',
      '**حفظ تلقائي:** يتم حفظ الإعدادات تلقائياً في متصفحك.'
    ],
    troubleshootTitle: 'دليل حل مشكلات الصوت والتشغيل',
    troubleshootSteps: [
      '**تشغيل / إيقاف مؤقت:** اضغط على **مسطرة المسافة (Spacebar)** أو زر التشغيل.',
      '**التحقق من الصوت:** تأكد من عدم كتم صوت المتصفح أو الجهاز.',
      '**جهاز الإخراج:** تأكد من توصيل سماعات الرأس أو مكبر الصوت.',
      '**تحديث الصفحة:** إذا توقف البث اضغط `Ctrl + F5`.',
      '**دعم المشرفين:** يمكنك التبديل إلى تبويب Admin Inbox للتواصل مع الدعم البشري.'
    ],
    adminTitle: 'التواصل مع إدارة المنصة',
    adminText: 'هل تحتاج إلى مساعدة إدارية متخصصة؟ يمكنك الانتقال إلى تبويب **Admin Inbox** هنا في الرسائل.',
    musicRequestTitle: 'طلب إضافة موسيقى أو الإبلاغ عن مشكلة',
    musicRequestText: 'لم تجد أغنيتك أو فنانك المفضل؟ استخدم خيار **Request Song** أو **Report Issue**.',
    helpPrompt: 'كيف يمكنني مساعدتك اليوم في استكشاف موسيقى SONORA؟',
    notFound: 'غير متوفر حالياً في مكتبتنا. يمكنك إرسال طلب لإضافته عبر نموذج Request Song!'
  },
  hi: {
    artistPresent: 'सोनोरा (SONORA) की आधिकारिक लाइब्रेरी में उपलब्ध हैं!',
    genre: 'शैली (Genre)',
    country: 'देश / क्षेत्र',
    listeners: 'मासिक श्रोता',
    officialAlbums: 'आधिकारिक एल्बम और ईपी',
    popularTracks: 'लोकप्रिय गीत और साउंडट्रैक',
    viewProfilePrompt: 'आप उनकी पूरी डिस्कोग्राफी यहाँ सुन सकते हैं:',
    recommendTitle: 'यहाँ SONORA लाइब्रेरी से आपके लिए चुनिंदा बेहतरीन गाने हैं:',
    recommendFooter: 'गाना बजाने के लिए टाइटल पर क्लिक करें या स्पेसबार दबाएं!',
    lyricsTitle: 'SONORA में गीत के बोल (Lyrics) और बहुभाषी अनुवाद',
    lyricsSteps: [
      '**प्लेयर खोलें:** नीचे दिए गए प्लेयर बार में एल्बम आर्ट पर क्लिक करें।',
      '**बोल देखें:** सिंक किए गए बोल देखने के लिए लिरिक्स आइकन पर क्लिक करें।',
      '**20+ भाषाओं में अनुवाद:** ड्रॉपडाउन मेनू से हिंदी, अंग्रेजी आदि में अनुवाद करें।',
      '**फॉन्ट साइज बदलें:** सुविधानुसार आकार बदलने के लिए **A-** या **A+** पर क्लिक करें।'
    ],
    equalizerTitle: 'SONORA 10-बैंड ऑडियो इक्वलाइज़र',
    equalizerSteps: [
      '**EQ खोलें:** वॉल्यूम के पास स्थित इक्वलाइज़र स्लाइडर्स आइकन पर क्लिक करें।',
      '**प्रीसेट चुनें:** बास बूस्ट, वोकल, रॉक, पॉप, एकॉस्टिक आदि में से चुनें।',
      '**10 फ़्रीक्वेंसी बैंड सेट करें:** 32Hz से लेकर 16kHz तक अपनी पसंद अनुसार ट्यून करें।',
      '**स्वतः सहेजा गया:** आपकी सेटिंग्स ब्राउज़र में सुरक्षित रहती हैं।'
    ],
    troubleshootTitle: 'ऑडियो और प्लेबैक समस्या निवारण',
    troubleshootSteps: [
      '**प्ले/पॉज़:** **स्पेसबार** दबाएं या प्ले बटन पर क्लिक करें।',
      '**वॉल्यूम जांचें:** सुनिश्चित करें कि ब्राउज़र टैब और डिवाइस म्यूट नहीं हैं।',
      '**हेडफ़ोन/स्पीकर:** पुष्टि करें कि ऑडियो आउटपुट सही से कनेक्ट है।',
      '**पेज रीफ्रेश करें:** अगर बफरिंग हो रही है तो `Ctrl + F5` दबाएं।',
      '**एडमिन सपोर्ट:** अधिक सहायता के लिए Admin Inbox टैब पर जाएं।'
    ],
    adminTitle: 'एडमिनिस्ट्रेटर से संपर्क करें',
    adminText: 'क्या आपको तकनीकी टीम से सीधे बात करनी है? ऊपर दिए गए **Admin Inbox** टैब पर क्लिक करें।',
    musicRequestTitle: 'गाना अनुरोध करें या समस्या बताएं',
    musicRequestText: 'पसंदीदा गाना नहीं मिल रहा? **Request Song** या **Report Issue** फॉर्म भरें।',
    helpPrompt: 'आज मैं SONORA में आपकी किस प्रकार सहायता कर सकती हूँ?',
    notFound: 'फिलहाल हमारी लाइब्रेरी में नहीं है। आप Request Song विकल्प द्वारा अनुरोध कर सकते हैं!'
  }
};

// ---------------------------------------------------------------------------
// 6. Local Intelligent Fallback Engine (Zero-Cost, Guaranteed Real Database)
// ---------------------------------------------------------------------------
export function generateLocalAriaResponse(
  userPrompt: string,
  history: ChatMessage[] = [],
  userName: string = 'Friend'
): { reply: string; suggestedFollowUps: string[]; suggestAdminHandoff: boolean } {
  const text = userPrompt.toLowerCase().trim();
  const lang = detectLanguage(userPrompt);
  const copy = LOCALIZED_COPY[lang] || LOCALIZED_COPY.en;
  const stats = getSonoraCatalogStats();

  // Step 1: Resolve pronoun or anaphora reference if query refers to "they/them/sila/nila"
  let effectiveQuery = userPrompt;
  const resolvedArtistName = resolveEntityFromHistory(userPrompt, history);
  if (resolvedArtistName) {
    effectiveQuery = `${userPrompt} ${resolvedArtistName}`;
  }

  // Step 2: Search catalog with effective query
  const catalogMatch = searchSonoraCatalog(effectiveQuery);

  // Intent A: Specific Artist or Music Query
  // Note: Only treat as catalog match if an artist is explicitly found or matches effective query
  if (catalogMatch && catalogMatch.artists.length > 0) {
    const art = catalogMatch.artists[0];
    const db = getSonoraDb();
    const artistAlbums = (db.albums || []).filter(
      (a: any) => a.artistId === art.id || a.artistName?.toLowerCase() === art.name.toLowerCase()
    );
    const artistSongs = (db.songs || []).filter(
      (s: any) => s.artistId === art.id || s.artistName?.toLowerCase() === art.name.toLowerCase()
    );

    let reply = `✨ **${art.name}** ${copy.artistPresent}\n\n`;
    reply += `* **${copy.genre}:** ${art.genreName || 'Music'}\n`;
    reply += `* **${copy.country}:** ${art.country || 'Global'}\n`;
    reply += `* **${copy.listeners}:** ${(art.monthlyListeners || 0).toLocaleString()}\n\n`;

    if (artistAlbums.length > 0) {
      reply += `💿 **${copy.officialAlbums} (${artistAlbums.length}):**\n`;
      artistAlbums.slice(0, 4).forEach((a: any) => {
        reply += `  • *${a.title}* (${a.releaseDate?.substring(0, 4) || 'Official'})\n`;
      });
      reply += `\n`;
    }

    if (artistSongs.length > 0) {
      reply += `🎵 **${copy.popularTracks} (${artistSongs.length} total):**\n`;
      artistSongs.slice(0, 6).forEach((s: any) => {
        const dur = s.duration ? ` [${s.duration}]` : '';
        reply += `  • **${s.title}**${dur}${s.albumTitle ? ` — from *${s.albumTitle}*` : ''}\n`;
      });
      reply += `\n`;
    }

    reply += `${copy.viewProfilePrompt} [${art.name} Profile](/artists/${art.slug || art.id})!`;

    const followUps = [
      `What are other ${art.genreName || 'similar'} artists on SONORA?`,
      `How do I see synchronized lyrics for ${art.name}?`,
      `How do I add ${art.name} songs to a playlist?`
    ];

    return {
      reply,
      suggestedFollowUps: followUps,
      suggestAdminHandoff: false
    };
  }

  // Intent B: Specific Song Query
  if (catalogMatch && catalogMatch.songs.length > 0 && !catalogMatch.artists.length) {
    const song = catalogMatch.songs[0];
    let reply = `🎵 **"${song.title}"** by **${song.artistName}** is ready to stream on SONORA!\n\n`;
    if (song.albumTitle) reply += `* **Album:** *${song.albumTitle}*\n`;
    if (song.duration) reply += `* **Duration:** ${song.duration}\n`;
    if (song.genreName) reply += `* **Genre:** ${song.genreName}\n\n`;
    reply += `Press Spacebar or tap the track in Search/Artists to listen right away.`;

    return {
      reply,
      suggestedFollowUps: [
        `Show more songs by ${song.artistName}`,
        'How do I view lyrics for this song?',
        'How do I use the Equalizer?'
      ],
      suggestAdminHandoff: false
    };
  }

  // Intent C: Music Recommendations / Discovery
  const recommendKeywords = [
    'recommend', 'suggest', 'suggestion', 'rekomenda', 'sugyot', 'nindot', 'paminawon',
    'pakinggan', 'maganda', 'recomienda', 'recommand', 'empfehl', 'recomenda', 'lagu bagus',
    'おすすめ', '추천', '推荐', 'اقتراح', 'सुझाव'
  ];
  if (recommendKeywords.some(k => text.includes(k))) {
    const recs = getFeaturedRecommendations();
    let reply = `🎶 **${copy.recommendTitle}**\n\n`;
    recs.forEach((s: any, idx: number) => {
      reply += `${idx + 1}. **${s.title}** by *${s.artistName}* (${s.genreName || 'Pop'}${s.duration ? `, ${s.duration}` : ''})\n`;
    });
    reply += `\n${copy.recommendFooter}`;

    return {
      reply,
      suggestedFollowUps: [
        'Give me K-Pop recommendations',
        'Show me top OPM and P-Pop songs',
        'How do I configure the 10-band equalizer?'
      ],
      suggestAdminHandoff: false
    };
  }

  // Intent D: Lyrics & Translation
  const lyricsKeywords = [
    'lyric', 'lyrics', 'titik', 'sabay', 'letra', 'letras', 'paroles', 'songtext', 'songtexte',
    'lirik', '歌詞', '가사', '歌词', 'كلمات', 'बोल'
  ];
  if (lyricsKeywords.some(k => text.includes(k))) {
    let reply = `🎤 **${copy.lyricsTitle}**\n\n`;
    copy.lyricsSteps.forEach((step: string) => {
      reply += `${step}\n\n`;
    });
    reply += `You can test lyrics right now on any active song!`;

    return {
      reply,
      suggestedFollowUps: [
        'How do I adjust lyrics font size?',
        'How do I use the Equalizer?',
        'How do I report missing lyrics?'
      ],
      suggestAdminHandoff: false
    };
  }

  // Intent E: Equalizer & Sound Quality
  const eqKeywords = [
    'equalizer', 'eq', 'bass', 'treble', 'sound quality', 'tingog', 'tunog', 'ecualizador',
    'égaliseur', 'イコライザー', '이퀄라이저', '均衡器', 'معادل', 'इक्वलाइज़र'
  ];
  if (eqKeywords.some(k => text.includes(k))) {
    let reply = `🎚️ **${copy.equalizerTitle}**\n\n`;
    copy.equalizerSteps.forEach((step: string) => {
      reply += `${step}\n\n`;
    });

    return {
      reply,
      suggestedFollowUps: [
        'Which preset is best for Bass Boost?',
        'How do I see song lyrics?',
        'How do I report audio problems?'
      ],
      suggestAdminHandoff: false
    };
  }

  // Intent F: Playback & Audio Troubleshooting
  const playbackKeywords = [
    'play', 'troubleshoot', 'not working', 'error', 'buffering', 'audio', 'sound', 'dili motokar',
    'ayaw tumugtog', 'walang tunog', 'way tingog', 'problema', 'no se escucha', 'ne marche pas',
    'ton', 'tidak berbunyi', '再生できない', '소리가 안나요', '无法播放', 'لا يعمل', 'चल नहीं रहा'
  ];
  if (playbackKeywords.some(k => text.includes(k))) {
    let reply = `🛠️ **${copy.troubleshootTitle}**\n\n`;
    copy.troubleshootSteps.forEach((step: string) => {
      reply += `${step}\n\n`;
    });

    return {
      reply,
      suggestedFollowUps: [
        'Talk to Admin Support',
        'How do I adjust the Equalizer?',
        'How do I request a missing song?'
      ],
      suggestAdminHandoff: true
    };
  }

  // Intent G: Admin Escalation & Human Support
  const adminKeywords = [
    'admin', 'human', 'support', 'helpdesk', 'agent', 'contact', 'tawo', 'tao', 'makig-istorya',
    'kausapin', 'humano', 'administrateur', 'mensch', 'bantuan admin', '管理者', '관리자', '人工客服', 'مشرف'
  ];
  if (adminKeywords.some(k => text.includes(k))) {
    let reply = `👨‍💼 **${copy.adminTitle}**\n\n${copy.adminText}\n\n`;
    reply += `Our human moderators can help resolve account permissions, music licenses, and deeper technical issues.`;

    return {
      reply,
      suggestedFollowUps: [
        'Switch to Admin Inbox tab',
        'How do I report a bug?',
        'How do I request a song?'
      ],
      suggestAdminHandoff: true
    };
  }

  // Intent H: Song Request & Missing Music
  const requestKeywords = [
    'request', 'missing', 'wala lagi', 'wala pa', 'kulang', 'ihangyo', 'i-request', 'solicitar',
    'demander', 'anfragen', 'minta lagu', 'リクエスト', '곡 신청', '点歌', 'طلب'
  ];
  if (requestKeywords.some(k => text.includes(k))) {
    let reply = `📝 **${copy.musicRequestTitle}**\n\n${copy.musicRequestText}\n\n`;
    reply += `Currently, SONORA features **${stats.artistCount.toLocaleString()} artists**, **${stats.albumCount.toLocaleString()} albums**, and **${stats.songCount.toLocaleString()} songs**.`;

    return {
      reply,
      suggestedFollowUps: [
        'Who are popular artists in SONORA?',
        'Recommend top trending songs',
        'How do I talk to an admin?'
      ],
      suggestAdminHandoff: false
    };
  }

  // Intent I: Greetings & Casual Introductions
  const greetingKeywords = [
    'hello', 'hi', 'hey', 'kumusta', 'kamusta', 'maayong', 'hola', 'bonjour', 'hallo',
    'olá', 'halo', 'こんにちは', '안녕하세요', '你好', 'مرحبا', 'नमस्ते'
  ];
  if (greetingKeywords.some(k => text.includes(k)) || text.length < 5) {
    let greeting = `✨ **Hello, ${userName}! I'm Aria**, your personal AI music assistant for SONORA.\n\n`;
    if (lang === 'ceb') {
      greeting = `✨ **Kumusta, ${userName}! Ako si Aria**, ang imong opisyal nga AI music assistant dinhi sa SONORA.\n\n`;
    } else if (lang === 'fil') {
      greeting = `✨ **Kamusta, ${userName}! Ako si Aria**, ang iyong opisyal na AI music assistant dito sa SONORA.\n\n`;
    } else if (lang === 'es') {
      greeting = `✨ **¡Hola, ${userName}! Soy Aria**, tu asistente inteligente oficial en SONORA.\n\n`;
    } else if (lang === 'ja') {
      greeting = `✨ **こんにちは、${userName}さん！私はSONORAの公式AI音楽アシスタント「Aria」です。**\n\n`;
    } else if (lang === 'ko') {
      greeting = `✨ **안녕하세요, ${userName}님! 저는 SONORA의 공식 AI 음악 어시스턴트 아리아(Aria)입니다.**\n\n`;
    } else if (lang === 'zh') {
      greeting = `✨ **您好，${userName}！我是 SONORA 官方 AI 音乐助手 Aria。**\n\n`;
    }

    let reply = greeting;
    reply += `Our music platform currently hosts **${stats.artistCount.toLocaleString()} artists**, **${stats.albumCount.toLocaleString()} albums**, and **${stats.songCount.toLocaleString()} full-length songs** across genres like ${stats.genres.slice(0, 5).join(', ')}.\n\n`;
    reply += `I can help you with:\n`;
    reply += `* 🔍 **Finding artists, albums, and songs**\n`;
    reply += `* 🎤 **Lyrics display and 20+ language translations**\n`;
    reply += `* 🎚️ **Customizing the 10-Band Studio Equalizer**\n`;
    reply += `* 🛠️ **Troubleshooting audio and playback issues**\n`;
    reply += `* 🎶 **Tailored music and playlist recommendations**\n\n`;
    reply += copy.helpPrompt;

    return {
      reply,
      suggestedFollowUps: [
        'Tell me about BINI and their albums',
        'How do I use the 10-band Equalizer?',
        'Recommend me some top songs'
      ],
      suggestAdminHandoff: false
    };
  }

  // Fallback: Default Helpful Assistant Response with Live Stats
  let reply = `🎶 I understand your query! In SONORA, we have **${stats.artistCount.toLocaleString()} artists**, **${stats.albumCount.toLocaleString()} albums**, and **${stats.songCount.toLocaleString()} songs** available.\n\n`;
  reply += `If you are searching for a specific song, artist, or feature, you can type their name directly. Or let me know if you would like me to explain lyrics translations, equalizer settings, or audio playback!\n\n`;
  reply += copy.helpPrompt;

  return {
    reply,
    suggestedFollowUps: [
      'Show me recommended songs',
      'How do I see song lyrics in different languages?',
      'How do I tune the Equalizer?'
    ],
    suggestAdminHandoff: false
  };
}

// ---------------------------------------------------------------------------
// 7. Unified Aria AI Orchestrator (OpenAI GPT-4o-mini + Local Neural Brain)
// ---------------------------------------------------------------------------
export async function getAriaResponse(
  userPrompt: string,
  history: ChatMessage[] = [],
  userName: string = 'Friend'
): Promise<{ reply: string; suggestedFollowUps: string[]; suggestAdminHandoff: boolean }> {
  const apiKey = process.env.OPENAI_API_KEY;
  const lang = detectLanguage(userPrompt);

  // If no OpenAI API key configured, use local intelligent engine immediately
  if (!apiKey || !apiKey.startsWith('sk-')) {
    return generateLocalAriaResponse(userPrompt, history, userName);
  }

  // Query live database stats to keep system prompt 100% accurate
  const stats = getSonoraCatalogStats();
  const catalogMatch = searchSonoraCatalog(userPrompt);
  const resolvedArtistName = resolveEntityFromHistory(userPrompt, history);

  try {
    const systemPrompt = `
You are Aria, the official, friendly, intelligent, and highly capable AI Music Assistant for SONORA Music Platform.
SONORA is a dark-themed music streaming platform with the following LIVE database statistics:
- Artists: ${stats.artistCount.toLocaleString()}
- Albums: ${stats.albumCount.toLocaleString()}
- Songs/Tracks: ${stats.songCount.toLocaleString()}
- Key Genres: ${stats.genres.join(', ')}

CURRENT USER CONTEXT:
- Name: ${userName}
- Detected User Language: ${lang}
${resolvedArtistName ? `- Recently discussed artist in conversation history: "${resolvedArtistName}". Resolve any pronouns (they/them/their/sila/nila) to this artist!` : ''}

RELEVANT CATALOG MATCHES IN SONORA FOR THIS QUERY:
${catalogMatch?.artists?.length ? `Artists found: ${catalogMatch.artists.map((a: any) => `${a.name} (${a.genreName || 'Music'}, ${a.country || 'Global'}, ${(a.monthlyListeners || 0).toLocaleString()} monthly listeners)`).join('; ')}` : 'No direct artist match.'}
${catalogMatch?.albums?.length ? `Albums found: ${catalogMatch.albums.map((a: any) => `${a.title} by ${a.artistName}`).join('; ')}` : ''}
${catalogMatch?.songs?.length ? `Songs found: ${catalogMatch.songs.map((s: any) => `${s.title} by ${s.artistName} [${s.duration || ''}]`).join('; ')}` : ''}

PLATFORM CAPABILITIES & INSTRUCTIONS:
1. MULTILINGUAL FLUENCY: Respond naturally in the SAME language or conversational blend (e.g., Bisaya, Tagalog, Taglish, Spanish, Japanese, Korean, French, German, Indonesian, Arabic, Hindi) used by the user. Understand colloquial slang, abbreviations (dli, wla, pano, san, lodi, unsaon), and informal grammar.
2. ACCURACY: ONLY refer to real artists and albums in SONORA. Never fabricate songs or albums.
3. PLATFORM FEATURES:
   - Lyrics & Translation: Click album art in bottom player -> click Lyrics icon -> choose Translation dropdown for 20+ languages -> click A-/A+ for typography scale.
   - Equalizer: Click EQ sliders icon in bottom bar -> 10-band sliders (32Hz to 16kHz) with presets (Bass Boost, Vocal, Acoustic, Rock, etc.).
   - Playback: Spacebar toggles Play/Pause. Check tab audio mute permissions.
   - Missing Music: Guide users to "Request Song" or "Report Issue" in profile/modals.
   - Admin Escalation: Users can switch to the "Admin Inbox" tab in /messages for human assistance.
4. TONE: Warm, musical, professional, concise, formatted with clear markdown bullet points.

FORMAT YOUR RESPONSE STRICTLY AS VALID JSON:
{
  "reply": "Your markdown formatted message here",
  "suggestedFollowUps": ["Follow-up question 1?", "Follow-up question 2?", "Follow-up question 3?"],
  "suggestAdminHandoff": false
}
`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const conversationMessages: any[] = [
      { role: 'system', content: systemPrompt }
    ];

    // Append last 4 messages from history for conversational context
    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-4);
      for (const m of recentHistory) {
        if (m.role === 'user' || m.role === 'assistant') {
          conversationMessages.push({ role: m.role, content: m.content });
        }
      }
    }

    conversationMessages.push({ role: 'user', content: userPrompt });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: conversationMessages,
        temperature: 0.4,
        max_tokens: 750,
        response_format: { type: 'json_object' }
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`OpenAI status ${response.status}, utilizing local Aria engine.`);
      return generateLocalAriaResponse(userPrompt, history, userName);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '';

    try {
      const parsed = JSON.parse(rawContent);
      if (parsed.reply) {
        return {
          reply: parsed.reply,
          suggestedFollowUps: Array.isArray(parsed.suggestedFollowUps) ? parsed.suggestedFollowUps.slice(0, 3) : [],
          suggestAdminHandoff: Boolean(parsed.suggestAdminHandoff)
        };
      }
    } catch {
      // Fallback if JSON parse fails
    }

    if (rawContent.trim()) {
      return {
        reply: rawContent.trim(),
        suggestedFollowUps: [
          'How do I customize lyrics display?',
          'How do I fix playback issues?',
          'How do I explore artists?'
        ],
        suggestAdminHandoff: false
      };
    }

    return generateLocalAriaResponse(userPrompt, history, userName);
  } catch (error) {
    // Network or quota issue -> smoothly fall back to local neural brain
    return generateLocalAriaResponse(userPrompt, history, userName);
  }
}
