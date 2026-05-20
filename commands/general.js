const { checkForceSub, sendForceSubMessage } = require('../services/forceSub');
const Settings = require('../database/settings');
const { mentionUser } = require('../utils/helpers');

module.exports = (bot) => {

  // /start
  bot.start(async (ctx) => {
    const notJoined = await checkForceSub(ctx);
    if (notJoined.length > 0) {
      return sendForceSubMessage(ctx, notJoined);
    }

    const welcome = await Settings.get('welcome_message') || 'Selamat datang! 👋';
    const name = ctx.from?.first_name || 'User';

    return ctx.reply(
      `👋 <b>Halo, ${name}!</b>\n\n${welcome}\n\n` +
      `Ketik /help untuk melihat daftar perintah.`,
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[
            { text: '📋 Help', callback_data: 'help' },
            { text: '👤 Profile', callback_data: 'profile' },
          ]],
        },
      }
    );
  });

  // /help
  bot.command('help', async (ctx) => {
    return ctx.reply(
      `📋 <b>Daftar Perintah</b>\n\n` +
      `<b>Umum:</b>\n` +
      `/start - Mulai bot\n` +
      `/help - Bantuan\n` +
      `/ping - Cek status bot\n\n` +
      `<b>Admin:</b>\n` +
      `/addadmin - Tambah admin\n` +
      `/deladmin - Hapus admin\n` +
      `/getadmin - Lihat admin\n` +
      `/users - Total pengguna\n` +
      `/broadcast - Kirim siaran\n` +
      `/stats - Statistik bot\n` +
      `/protect true/false - Proteksi konten\n` +
      `/addbutton - Tambah button\n` +
      `/delbutton - Hapus button\n` +
      `/getbutton - Lihat button\n` +
      `/addkonten - Tambah channel konten\n` +
      `/delkonten - Hapus channel konten\n` +
      `/getkonten - Lihat channel konten`,
      { parse_mode: 'HTML' }
    );
  });

  // Callback: help
  bot.action('help', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.reply(
      `📋 <b>Bantuan Bot</b>\n\nKetik /help untuk daftar perintah lengkap.`,
      { parse_mode: 'HTML' }
    );
  });

  // Callback: profile
  bot.action('profile', async (ctx) => {
    await ctx.answerCbQuery();
    const u = ctx.from;
    return ctx.reply(
      `👤 <b>Profil Kamu</b>\n\n` +
      `🆔 ID: <code>${u.id}</code>\n` +
      `👤 Nama: ${[u.first_name, u.last_name].filter(Boolean).join(' ')}\n` +
      `📛 Username: ${u.username ? `@${u.username}` : 'Tidak ada'}`,
      { parse_mode: 'HTML' }
    );
  });

};
