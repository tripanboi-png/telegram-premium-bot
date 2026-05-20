const logger = require('../utils/logger');

module.exports = (bot) => {

  bot.catch((err, ctx) => {
    const update = ctx?.update;
    const userId = ctx?.from?.id;

    logger.error(
      `[BotError] user=${userId} update_type=${update?.update_id} error=${err.message}`
    );

    if (process.env.NODE_ENV !== 'production') {
      console.error(err);
    }

    // Notify user of error gracefully
    if (ctx?.reply) {
      ctx.reply('⚠️ Terjadi kesalahan. Silakan coba lagi.').catch(() => {});
    }
  });

};
