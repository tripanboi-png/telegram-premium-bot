const { checkForceSub, sendForceSubMessage } = require('../services/forceSub');
const { isOwner } = require('./auth');
const config = require('../config');

/**
 * Force subscribe middleware
 * Blocks users who haven't joined required channels
 */
async function forceSubMiddleware(ctx, next) {
  // Skip if no force sub configured
  if (!config.FORCE_SUB_CHANNELS || config.FORCE_SUB_CHANNELS.length === 0) {
    return next();
  }

  // Skip for callback queries (allow "Coba Lagi")
  if (ctx.callbackQuery?.data === 'check_sub') return next();

  // Skip for owners
  if (ctx.from && isOwner(ctx.from.id)) return next();

  // Skip channel posts
  if (ctx.channelPost) return next();

  const notJoined = await checkForceSub(ctx);
  if (notJoined.length > 0) {
    await sendForceSubMessage(ctx, notJoined);
    return; // Block further processing
  }

  return next();
}

module.exports = { forceSubMiddleware };
