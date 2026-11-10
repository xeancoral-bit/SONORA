# 📱 SONORA — Mobile App (Expo & React Native)

Kini ang opisyal nga **Expo Mobile App companion** alang sa **SONORA Music System**.
Pinaagi niini, pwede nimo madagan ang SONORA isip usa ka tinuod nga mobile app sa bisan unsang cellphone (Android / iPhone), tablet, o gadget gamit ang **Expo Go**.

---

## 🚀 Dali nga Pagsugod (Quick Start)

### 1. I-download ang Expo Go sa Imong Cellphone / Gadget
- **Android**: I-search ug i-install ang **"Expo Go"** gikan sa [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent).
- **iPhone / iOS**: I-search ug i-install ang **"Expo Go"** gikan sa [Apple App Store](https://apps.apple.com/app/expo-go/id982107779).

---

### 2. Sugdi ang SONORA Web Server (Terminal 1)
Siguroha nga nagdagan ang imong main system:
```bash
npm run dev
```
*(Nagsugod kini sa `http://localhost:3000` o sa imong local network IP `http://192.168.x.x:3000`)*

---

### 3. Sugdi ang Expo Mobile App (Terminal 2)
Sa laing terminal window, padagana:
```bash
npm run mobile
```
*O kung gusto nimo ma-access bisan lahi og Wi-Fi network o gamit ang mobile data:*
```bash
npm run mobile:tunnel
```

---

### 4. I-Scan ang QR Code sa Imong Cellphone
1. **Sa Android**:
   - Ablihi ang **Expo Go** app.
   - I-tap ang **"Scan QR code"**.
   - I-tutok ang camera sa QR code nga makita sa imong terminal screen.
2. **Sa iPhone / iPad (iOS)**:
   - Ablihi ang standard **Camera app**.
   - I-point ang camera sa QR code.
   - Mo-gawas ang yellow banner nga **"Open in Expo Go"** — i-tap kini.

🎉 **Mo-abli ug motokar dayon ang SONORA sa imong cellphone!**

---

## ⚡ Awtomatikong Updates (Real-Time Live Updates)

> **"kung naa update sa system igo ra e expo dayon e update dayon niya once e scan niya ang qr code mo update na dayon siya sa app"**

- **Dili na kinahanglan mag-compile og bag-ong APK**: Bisan unsang bag-ong kanta, bag-ong album, AI updates, o bag-ong code nga imong idugang sa SONORA, **awtomatikong mo-reflect dayon kini sa app sa imong cellphone**!
- **Dali nga Refresh**: Sa ibabaw sa app, i-tap lang ang **↻ Reload button** o i-scan pag-usab ang Expo QR code, ug makita na dayon ang pinakabag-ong bersyon.

---

## ⚙️ Pag-ilis o Pag-connect sa Deployed Cloud URL (Vercel / Netlify)

1. Sa ibabaw nga navigation bar sa mobile app, i-tap ang **⚙ Gear Icon**.
2. I-type ang imong live cloud URL, pananglitan:
   `https://sonora-music.vercel.app`
3. I-tap ang **"Connect & Load"**.
4. Ma-save kini sa memory sa app, mao nga bisan mapalong ang imong computer, magamit gihapon nimo ang SONORA gikan sa cloud 24/7!

---

## 📦 Paggama og Standalone APK (Opsyonal)

Kung gusto nimo mag-generate og standalone installer file (`.apk`) para ma-install direkta sa Android nga dili na magkinahanglan og Expo Go:
```bash
cd mobile
npx eas build -p android --profile preview
```
