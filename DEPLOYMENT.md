# 🌐 SONORA Music System — Deployment & Hosting Guide

Kini nga giya nagpatin-aw kon unsaon pag-deploy sa **SONORA Music System** sa cloud aron magamit kini 24/7 bisan asa sa kalibutan, ug kon unsaon kini i-konekta sa imong **Expo Mobile App**.

---

## 🚀 Opsyon 1: Pag-deploy sa Vercel (Girekomenda para sa Next.js)

Ang **Vercel** mao ang pinakadali ug pinakapaspas nga paagi sa pag-host sa SONORA:

1. **I-push ang imong Code sa GitHub / GitLab / Bitbucket**:
   ```bash
   git add .
   git commit -m "Deploy: Ready for cloud hosting and mobile app"
   git push origin main
   ```

2. **I-konekta sa Vercel**:
   - Adto sa [vercel.com](https://vercel.com) ug pag-login.
   - I-click ang **"Add New Project"** -> pilia ang imong `sonora-music-system` repository.
   - **Framework Preset**: Awtomatikong ma-detect isip **Next.js**.
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

3. **Environment Variables**:
   I-paste ang mga gikinahanglan nga variables (tan-awa ang `.env.example`):
   - `NEXT_PUBLIC_APP_URL` = `https://imong-app-name.vercel.app`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (kung mogamit og Clerk auth)
   - `CLERK_SECRET_KEY` (kung mogamit og Clerk auth)
   - `NEXT_PUBLIC_SUPABASE_URL` (opsyonal)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (opsyonal)

4. **I-click ang "Deploy"**:
   Sulod sa 2 ka minuto, live na ang imong website sa internet!

---

## ⚡ Opsyon 2: Pag-deploy sa Netlify

1. Adto sa [netlify.com](https://netlify.com) -> **"Add new site"** -> **"Import an existing project"**.
2. Pilia ang imong Git repository.
3. Build command: `npm run build`, publish directory: `.next`.
4. I-add ang environment variables ug i-click ang **"Deploy"**.

---

## 🖥️ Opsyon 3: Pag-deploy sa VPS / Linux Server (Ubuntu gamit ang PM2)

Kung mogamit ka og kaugalingong cloud server (DigitalOcean, AWS, Linode, Hostinger):

1. **Install Node.js & PM2**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

2. **Build ug Start**:
   ```bash
   git clone <your-repo-url>
   cd sonora-music-system
   npm install
   npm run build
   pm2 start npm --name "sonora" -- start
   pm2 save
   pm2 startup
   ```

---

## 📱 Pag-konekta sa Deployed URL sa Expo Mobile App

Inig human og deploy sa imong web system (e.g. `https://sonora-music.vercel.app`):
1. Ablihi ang **Expo Mobile App** sa imong cellphone gamit ang **Expo Go**.
2. I-tap ang **⚙ Gear Icon** sa ibabaw nga status bar.
3. I-paste ang imong bag-ong live URL (`https://sonora-music.vercel.app`).
4. I-click ang **"Connect & Load"**.
5. Bisan mapalong ang imong laptop, magamit gihapon nimo ang SONORA sa imong cellphone 24/7!
