require('dotenv').config();

const config = {
  // Bot
  BOT_TOKEN: process.env.BOT_TOKEN,
  BOT_USERNAME: process.env.BOT_USERNAME || 'mybot',

  // Owners
  OWNER_ID: parseInt(process.env.OWNER_ID) || 0,
  OWNER_IDS: (process.env.OWNER_IDS || '')
    .split(',')
    .map(id => parseInt(id.trim()))
    .filter(Boolean),

  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,

  // Force Subscribe
  FORCE_SUB_CHANNELS: (process.env.FORCE_SUB_CHANNELS || '')
    .split(',')
    .map(c => c.trim())
    .filter(Boolean),
  FORCE_SUB_MESSAGE:
    process.env.FORCE_SUB_MESSAGE ||
    'Anda harus bergabung di Channel/Grup kami terlebih dahulu.',

  // Bot mode
  BOT_MODE: process.env.BOT_MODE || 'polling',
  WEBHOOK_URL: process.env.WEBHOOK_URL || '',
  PORT: parseInt(process.env.PORT) || 3000,

  // Anti spam
  COOLDOWN_SECONDS: parseInt(process.env.COOLDOWN_SECONDS) || 3,
  MAX_SPAM_COUNT: parseInt(process.env.MAX_SPAM_COUNT) || 5,

  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};

// Validate required fields
const required = ['BOT_TOKEN', 'SUPABASE_URL', 'SUPABASE_KEY'];
for (const field of required) {
  if (!config[field]) {
    console.error(`[CONFIG] Missing required env: ${field}`);
    process.exit(1);
  }
}

module.exports = config;
