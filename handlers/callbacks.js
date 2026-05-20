const { checkForceSub, sendForceSubMessage } = require('../services/forceSub');
const { sendContent } = require('./startPayload');
const logger = require('../utils/logger');

module.exports = (bot) => {

  // "Coba Lagi" — re-check force subscribe
  bot.action('check_sub', async (ctx) => {
    await ctx.answerCbQuery('Mengecek...');

    const notJoined = await checkForceSub(ctx);
    if (notJoined.length > 0) {
      return ctx.answerCbQuery('❌ Kamu belum join semua channel!', { show_alert: true });
    }

    // Sudah join semua
    await ctx.answerCbQuery('✅ Berhasil!', { show_alert: false });

    // Hapus pesan force sub
    try { await ctx.deleteMessage(); } catch (_) {}

    // Kalau ada pending konten → kirim sekarang
    const payload = ctx.session?.pendingPayload;
    if (payload) {
      try {
        const decoded = Buffer.from(payload, 'base64url').toString('utf8');
        const parts = decoded.split('_');
        const fromChatId = parts[0];
        const fromMsgId = parseInt(parts[1]);

        ctx.session.pendingPayload = null;
        await sendContent(ctx, fromChatId, fromMsgId);
        return;
      } catch (err) {
        logger.error('[Callback] Gagal kirim pending konten:', err.message);
      }
    }

    return ctx.reply('✅ Terima kasih sudah bergabung! Ketik /start untuk memulai.');
  });

};
