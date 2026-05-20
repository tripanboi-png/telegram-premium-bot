const config = require('../config');
const logger = require('../utils/logger');

/**
 * Check if a user has joined all required channels/groups
 * Returns array of channels user has NOT joined
 */
async function checkForceSub(ctx) {
  const channels = config.FORCE_SUB_CHANNELS;
  if (!channels || channels.length === 0) return [];

  const userId = ctx.from?.id;
  if (!userId) return [];

  const notJoined = [];

  for (const channel of channels) {
    try {
      const member = await ctx.telegram.getChatMember(channel, userId);
      const status = member?.status;
      if (!status || status === 'left' || status === 'kicked') {
        notJoined.push(channel);
      }
    } catch (err) {
      logger.warn(`[ForceSub] Failed to check ${channel}: ${err.message}`);
    }
  }

  return notJoined;
}

/**
 * Build the force subscribe keyboard
 * Tampilkan 2 tombol "Join Sini Kak" per baris
 */
async function buildForceSubKeyboard(ctx, notJoined) {
  const joinButtons = [];

  for (const channel of notJoined) {
    try {
      let url;

      if (channel.startsWith('@')) {
        url = `https://t.me/${channel.slice(1)}`;
      } else {
        const chat = await ctx.telegram.getChat(channel).catch(() => null);
        url = chat?.invite_link || `https://t.me/c/${String(channel).replace('-100', '')}`;
      }

      joinButtons.push({ text: 'Join Sini Kak ↗', url });
    } catch (err) {
      logger.warn(`[ForceSub] Failed to get link for ${channel}: ${err.message}`);
    }
  }

  const rows = [];

  // Susun 2 tombol per baris
  for (let i = 0; i < joinButtons.length; i += 2) {
    rows.push(joinButtons.slice(i, i + 2));
  }

  // Kalau hanya 1 channel, duplikat tombol biar tampil 2
  if (joinButtons.length === 1) {
    rows[0] = [joinButtons[0], joinButtons[0]];
  }

  // Tombol Coba Lagi di baris terakhir
  rows.push([{ text: '🔄 Coba Lagi', callback_data: 'check_sub' }]);

  return { inline_keyboard: rows };
}

/**
 * Send force subscribe message
 */
async function sendForceSubMessage(ctx, notJoined) {
  const keyboard = await buildForceSubKeyboard(ctx, notJoined);

  return ctx.reply(
    `👋 <b>Hello BITCH HUB</b>\n\n` +
    `Anda harus bergabung di Channel/Grup saya Terlebih dahulu untuk Melihat File yang saya Bagikan\n\n` +
    `Silakan Join Ke Channel &amp; Group Terlebih Dahulu`,
    {
      parse_mode: 'HTML',
      reply_markup: keyboard,
    }
  );
}

module.exports = { checkForceSub, sendForceSubMessage, buildForceSubKeyboard };
