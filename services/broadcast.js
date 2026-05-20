const Users = require('../database/users');
const logger = require('../utils/logger');
const { sleep } = require('../utils/helpers');

/**
 * Broadcast a message to all registered users
 * @param {Object} telegram - Telegraf telegram instance
 * @param {string|Object} message - Message text or options
 * @param {Object} extra - Telegraf extra options
 * @returns {Object} stats
 */
async function broadcast(telegram, message, extra = {}) {
  const { data: users, error } = await Users.getAll();

  if (error || !users) {
    return { success: 0, failed: 0, total: 0, error: error?.message };
  }

  let success = 0;
  let failed = 0;
  const total = users.length;

  logger.info(`[Broadcast] Starting broadcast to ${total} users`);

  for (const user of users) {
    try {
      if (typeof message === 'string') {
        await telegram.sendMessage(user.user_id, message, {
          parse_mode: 'HTML',
          ...extra,
        });
      } else {
        // Forward a message
        await telegram.forwardMessage(user.user_id, message.chat_id, message.message_id);
      }
      success++;
    } catch (err) {
      failed++;
      // Log only critical errors, not "user blocked bot"
      if (!err.message?.includes('blocked') && !err.message?.includes('not found')) {
        logger.warn(`[Broadcast] Failed for ${user.user_id}: ${err.message}`);
      }
    }

    // Rate limiting: Telegram allows ~30 messages/second
    if (success % 25 === 0) {
      await sleep(1000);
    }
  }

  logger.info(`[Broadcast] Done: ${success} sent, ${failed} failed out of ${total}`);
  return { success, failed, total };
}

module.exports = { broadcast };
