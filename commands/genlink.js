const { requireAdmin } = require('../middleware/auth');

module.exports = (bot) => {

  /**
   * /genlink
   * Cara pakai: Forward pesan dari channel database ke bot, lalu reply dengan /genlink
   * Bot akan generate link yang kalau diklik, user wajib join dulu lalu konten dikirim
   */
  bot.command('genlink', requireAdmin, async (ctx) => {
    const reply = ctx.message.reply_to_message;

    if (!reply) {
      return ctx.reply(
        '📎 <b>Cara pakai /genlink:</b>\n\n' +
        '1. Forward video/file dari channel kamu ke bot ini\n' +
        '2. Reply pesan itu dengan /genlink\n' +
        '3. Bot akan kasih link yang bisa kamu share',
        { parse_mode: 'HTML' }
      );
    }

    // Ambil chat_id dan message_id dari pesan yang di-forward
    let fromChatId = null;
    let fromMsgId = null;

    if (reply.forward_from_chat) {
      // Pesan di-forward dari channel
      fromChatId = reply.forward_from_chat.id;
      fromMsgId = reply.forward_from_message_id;
    } else {
      // Pesan biasa (bukan forward) - pakai chat & message id langsung
      fromChatId = reply.chat.id;
      fromMsgId = reply.message_id;
    }

    if (!fromChatId || !fromMsgId) {
      return ctx.reply('❌ Tidak bisa baca sumber pesan. Pastikan kamu forward dari channel.');
    }

    // Encode jadi payload: chatId_msgId
    // Contoh: -1001234567890_55 → base64
    const payload = Buffer.from(`${fromChatId}_${fromMsgId}`).toString('base64url');

    const botUsername = ctx.botInfo.username;
    const link = `https://t.me/${botUsername}?start=${payload}`;

    return ctx.reply(
      `✅ <b>Link berhasil dibuat!</b>\n\n` +
      `🔗 <code>${link}</code>\n\n` +
      `📋 <b>Cara kerja:</b>\n` +
      `• User klik link\n` +
      `• Bot cek apakah sudah join channel\n` +
      `• Kalau belum → muncul tombol join\n` +
      `• Kalau sudah → konten langsung dikirim otomatis`,
      { parse_mode: 'HTML' }
    );
  });

};
