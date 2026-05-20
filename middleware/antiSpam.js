const Cooldown = require('../utils/cooldown');
const { isOwner } = require('./auth');

/**
 * Anti-spam middleware - applies cooldown and spam detection
 */
async function antiSpam(ctx, next) {
  if (!ctx.from) return next();

  const userId = ctx.from.id;

  // Skip for owners/bots
  if (isOwner(userId) || ctx.from.is_bot) return next();

  // Check spam
  if (Cooldown.trackSpam(userId)) {
    return ctx.reply('⚠️ Kamu mengirim terlalu banyak pesan. Tunggu sebentar.').catch(() => {});
  }

  // Check cooldown
  if (Cooldown.check(userId)) {
    return; // Silent ignore during cooldown
  }

  return next();
}

module.exports = { antiSpam };
