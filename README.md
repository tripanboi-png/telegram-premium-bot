# 🤖 Telegram Premium Bot

Bot Telegram premium dengan Force Subscribe, Admin System, Broadcast, dan Supabase database.

---

## 📁 Struktur Project

```
telegram-premium-bot/
├── commands/
│   ├── admin.js        # Perintah admin
│   ├── buttons.js      # Manajemen button
│   ├── general.js      # Perintah umum user
│   └── konten.js       # Manajemen channel konten
├── database/
│   ├── admins.js       # Model admin
│   ├── buttons.js      # Model button
│   ├── content.js      # Model konten
│   ├── logs.js         # Model log
│   ├── settings.js     # Model settings
│   ├── setup.js        # Script setup DB
│   └── users.js        # Model user
├── handlers/
│   ├── callbacks.js    # Callback query handler
│   └── error.js        # Error handler
├── middleware/
│   ├── antiSpam.js     # Anti spam
│   ├── auth.js         # Autentikasi & otorisasi
│   ├── forceSub.js     # Force subscribe
│   └── session.js      # Session middleware
├── services/
│   ├── broadcast.js    # Layanan broadcast
│   └── forceSub.js     # Logika force subscribe
├── supabase/
│   └── client.js       # Supabase client
├── utils/
│   ├── cooldown.js     # Anti spam cooldown
│   ├── helpers.js      # Helper functions
│   └── logger.js       # Logger Winston
├── bot.js              # Entry point
├── config.js           # Konfigurasi
├── setup.sql           # SQL untuk Supabase
├── package.json
├── railway.json
├── Procfile
├── .env.example
└── README.md
```

---

## ⚙️ Fitur

- ✅ Force Subscribe (wajib join channel/grup)
- ✅ Inline button premium
- ✅ Multi channel checker
- ✅ Broadcast ke semua user
- ✅ Admin system (add/del/get)
- ✅ Anti spam + cooldown
- ✅ Session middleware
- ✅ Logger modern (Winston)
- ✅ Auto reconnect
- ✅ Protect content
- ✅ Dynamic settings (Supabase)
- ✅ Error handling
- ✅ Railway webhook support
- ✅ Polling mode

---

## 🚀 Setup & Deployment

### 1. Setup Supabase

1. Buka [supabase.com](https://supabase.com) → New Project
2. Masuk ke **SQL Editor**
3. Copy isi file `setup.sql` dan jalankan
4. Salin **Project URL** dan **anon public key** dari Settings → API

---

### 2. Setup Bot Telegram

1. Chat [@BotFather](https://t.me/BotFather) → `/newbot`
2. Simpan **BOT_TOKEN** yang diberikan
3. Dapatkan **USER_ID** kamu via [@userinfobot](https://t.me/userinfobot)

---

### 3. Jalankan Lokal / VPS

```bash
# Clone atau extract project
cd telegram-premium-bot

# Install dependencies
npm install

# Buat file .env
cp .env.example .env
nano .env   # Isi semua nilai

# Setup database defaults
npm run setup

# Jalankan bot
npm start

# Atau development mode (auto restart)
npm run dev
```

**Isi `.env` minimal:**
```env
BOT_TOKEN=123456:ABCdef...
OWNER_ID=123456789
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJhbGci...
FORCE_SUB_CHANNELS=@channelkamu
BOT_MODE=polling
```

---

### 4. Deploy ke Railway

1. Push project ke GitHub:
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/username/repo.git
git push -u origin main
```

2. Buka [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**

3. Pilih repository kamu

4. Klik **Variables** → tambahkan semua env dari `.env.example`:
   - `BOT_TOKEN`
   - `OWNER_ID`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `FORCE_SUB_CHANNELS`
   - `BOT_MODE=polling`
   - `NODE_ENV=production`

5. Railway akan otomatis deploy. Lihat log di tab **Deployments**.

> **Webhook mode (opsional):**
> Set `BOT_MODE=webhook` dan `WEBHOOK_URL=https://your-app.railway.app`

---

### 5. Upload ke GitHub (ZIP)

```bash
# Compress project (tanpa node_modules)
zip -r telegram-premium-bot.zip telegram-premium-bot/ \
  --exclude "*/node_modules/*" \
  --exclude "*/.env" \
  --exclude "*/logs/*"
```

Lalu upload ZIP ke GitHub via web atau CLI.

---

## 📋 Daftar Command

### Umum
| Command | Keterangan |
|---------|-----------|
| `/start` | Mulai bot |
| `/help` | Daftar perintah |
| `/ping` | Cek latency bot |

### Admin
| Command | Keterangan |
|---------|-----------|
| `/addadmin [id]` | Tambah admin |
| `/deladmin [id]` | Hapus admin |
| `/getadmin` | Lihat daftar admin |
| `/users` | Total pengguna |
| `/broadcast [pesan]` | Kirim siaran |
| `/stats` | Statistik bot |
| `/uptime` | Uptime & RAM |
| `/info` | Info bot |
| `/protect true/false` | Proteksi konten |
| `/setmsg [pesan]` | Set pesan welcome |

### Button
| Command | Keterangan |
|---------|-----------|
| `/addbutton [ch] [label] [url]` | Tambah button |
| `/delbutton [id]` | Hapus button |
| `/getbutton [ch]` | Lihat button |

### Konten
| Command | Keterangan |
|---------|-----------|
| `/addkonten [ch] [label]` | Tambah channel konten |
| `/delkonten [ch]` | Hapus channel konten |
| `/getkonten` | Lihat daftar konten |
| `/limitkonten [ch] [n]` | Set limit channel |
| `/setdb [ch]` | Set database channel |
| `/getdb` | Lihat database channel |

---

## 🔒 Force Subscribe

Set di `.env`:
```env
FORCE_SUB_CHANNELS=@channel1,@channel2,-1001234567890
```

Bot akan memblokir user yang belum join dan menampilkan tombol join.
User klik **Coba Lagi** untuk verifikasi ulang.

---

## 📝 License

MIT
