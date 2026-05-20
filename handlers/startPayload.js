const { checkForceSub, sendForceSubMessage } = require('../services/forceSub');
const { isOwner } = require('../middleware/auth');
const logger = require('../utils/logger');

/**
 * Handle /start dengan payload
 * Contoh: /start ABC123 → decode → kirim konten
 */
module.exports = (bot) => {

  bot.start(async (ctx) => {
    const payload = ctx.startPayload; // teks setelah /start

    // Kalau tidak ada payload → welcome biasa
    if (!payload) return; // biarkan handler /start di general.js yang handle

    // Decode payload
    let fromChatId, fromMsgId;
    try {
      const decoded = Buffer.from(payload, 'base64url').toString('utf8');
      const parts = decoded.split('_');
      fromChatId = parts[0];
      fromMsgId = parseInt(parts[1]);

      if (!fromChatId || isNaN(fromMsgId)) throw new Error('invalid');
    } catch (err) {
      return ctx.reply('❌ Link tidak valid atau sudah expired.');
    }

    // Cek force subscribe
    const notJoined = await checkForceSub(ctx);
    if (notJoined.length > 0) {
      // Simpan payload di session biar setelah join bisa kirim konten
      ctx.session.pendingPayload = payload;
      return sendForceSubMessage(ctx, notJoined);
    }

    // Sudah join → kirim konten
    await sendContent(ctx, fromChatId, fromMsgId);
  });

};

/**
 * Kirim konten dari channel database ke user
 */
async function sendContent(ctx, fromChatId, fromMsgId) {
  try {
    await ctx.telegram.copyMessage(
      ctx.from.id,   // kirim ke user
      fromChatId,    // dari channel database
      fromMsgId,     // message id konten
      {
        protect_content: false,
      }
    );
  } catch (err) {
    logger.error(`[StartPayload] Gagal kirim konten: ${err.message}`);
    await ctx.reply(
      '❌ Gagal mengambil konten. Pastikan bot sudah jadi admin di channel database.'
    );
  }
}

module.exports.sendContent = sendContent;
