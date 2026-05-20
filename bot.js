require('dotenv').config();
const { Telegraf } = require('telegraf');
const config = require('./config');
const logger = require('./utils/logger');

// Middleware
const { saveUser, checkBan } = require('./middleware/auth');
const { antiSpam } = require('./middleware/antiSpam');
const { forceSubMiddleware } = require('./middleware/forceSub');
const { sessionMiddleware } = require('./middleware/session');

// Commands
const generalCommands = require('./commands/general');
const adminCommands = require('./commands/admin');
const buttonCommands = require('./commands/buttons');
const kontenCommands = require('./commands/konten');
const genlinkCommand = require('./commands/genlink');

// Handlers
const startPayloadHandler = require('./handlers/startPayload');
const callbackHandlers = require('./handlers/callbacks');
const errorHandler = require('./handlers/error');

// ─── Initialize Bot ───────────────────────────────────────
const bot = new Telegraf(config.BOT_TOKEN);

// ─── Global Middleware ────────────────────────────────────
bot.use(sessionMiddleware);
bot.use(saveUser);
bot.use(checkBan);
bot.use(antiSpam);

// ─── Start dengan payload DULU (sebelum forceSubMiddleware) ──
startPayloadHandler(bot);

// ─── Force Sub Middleware ─────────────────────────────────
bot.use(forceSubMiddleware);

// ─── Register Commands ────────────────────────────────────
generalCommands(bot);
adminCommands(bot);
buttonCommands(bot);
kontenCommands(bot);
genlinkCommand(bot);

// ─── Register Handlers ────────────────────────────────────
callbackHandlers(bot);
errorHandler(bot);

// ─── Launch ───────────────────────────────────────────────
async function launch() {
  try {
    const botInfo = await bot.telegram.getMe();
    logger.info(`🤖 Bot started: @${botInfo.username} (${botInfo.id})`);

    if (config.BOT_MODE === 'webhook' && config.WEBHOOK_URL) {
      await bot.launch({
        webhook: {
          domain: config.WEBHOOK_URL,
          port: config.PORT,
        },
      });
      logger.info(`🌐 Webhook mode aktif`);
    } else {
      await bot.launch();
      logger.info('📡 Polling mode aktif');
    }
  } catch (err) {
    logger.error('Failed to launch bot:', err.message);
    process.exit(1);
  }
}

launch();

// ─── Graceful Shutdown ────────────────────────────────────
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
process.on('uncaughtException', (err) => logger.error('Uncaught:', err.message));
process.on('unhandledRejection', (reason) => logger.error('Unhandled:', reason));
