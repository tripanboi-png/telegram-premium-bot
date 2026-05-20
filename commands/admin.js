const { Markup } = require('telegraf');
const Admins = require('../database/admins');
const Users = require('../database/users');
const Settings = require('../database/settings');
const { requireOwner, requireAdmin, logAction } = require('../middleware/auth');
const { broadcast } = require('../services/broadcast');
const { mentionUser, formatUptime } = require('../utils/helpers');
const logger = require('../utils/logger');

module.exports = (bot) => {

  // ─── /addadmin ───────────────────────────────────────────
  bot.command('addadmin', requireOwner, async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    const targetId = parseInt(args[0]);
    if (!targetId) {
      return ctx.reply('Usage: /addadmin [user_id]');
    }
    await Admins.add({ user_id: targetId, username: null, added_by: ctx.from.id });
    await logAction(ctx.from.id, 'addadmin', `Added admin: ${targetId}`);
    return ctx.reply(`✅ User <code>${targetId}</code> berhasil dijadikan admin.`, { parse_mode: 'HTML' });
  });

  // ─── /deladmin ───────────────────────────────────────────
  bot.command('deladmin', requireOwner, async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    const targetId = parseInt(args[0]);
    if (!targetId) return ctx.reply('Usage: /deladmin [user_id]');
    await Admins.remove(targetId);
    await logAction(ctx.from.id, 'deladmin', `Removed admin: ${targetId}`);
    return ctx.reply(`✅ Admin <code>${targetId}</code> telah dihapus.`, { parse_mode: 'HTML' });
  });

  // ─── /getadmin ───────────────────────────────────────────
  bot.command('getadmin', requireAdmin, async (ctx) => {
    const { data: admins } = await Admins.getAll();
    if (!admins || admins.length === 0) return ctx.reply('📋 Tidak ada admin terdaftar.');
    const list = admins.map((a, i) =>
      `${i + 1}. <code>${a.user_id}</code>${a.username ? ` @${a.username}` : ''}`
    ).join('\n');
    return ctx.reply(`👑 <b>Daftar Admin</b>\n\n${list}`, { parse_mode: 'HTML' });
  });

  // ─── /users ──────────────────────────────────────────────
  bot.command('users', requireAdmin, async (ctx) => {
    const { data: count } = await Users.count();
    const total = count ?? 0;
    return ctx.reply(`👥 <b>Total Pengguna Bot</b>\n\n<code>${total}</code> pengguna terdaftar`, { parse_mode: 'HTML' });
  });

  // ─── /broadcast ──────────────────────────────────────────
  bot.command('broadcast', requireAdmin, async (ctx) => {
    const text = ctx.message.text.split(' ').slice(1).join(' ');
    const reply = ctx.message.reply_to_message;

    if (!text && !reply) {
      return ctx.reply('Usage:\n/broadcast [pesan]\n\nAtau reply ke pesan yang ingin di-broadcast.');
    }

    const statusMsg = await ctx.reply('📡 Memulai broadcast...');

    let stats;
    if (reply) {
      stats = await broadcast(ctx.telegram, {
        chat_id: reply.chat.id,
        message_id: reply.message_id,
      });
    } else {
      stats = await broadcast(ctx.telegram, text);
    }

    await logAction(ctx.from.id, 'broadcast', `Sent to ${stats.success}/${stats.total}`);

    return ctx.telegram.editMessageText(
      statusMsg.chat.id,
      statusMsg.message_id,
      null,
      `✅ <b>Broadcast Selesai</b>\n\n` +
      `📤 Terkirim: <code>${stats.success}</code>\n` +
      `❌ Gagal: <code>${stats.failed}</code>\n` +
      `👥 Total: <code>${stats.total}</code>`,
      { parse_mode: 'HTML' }
    );
  });

  // ─── /protect ────────────────────────────────────────────
  bot.command('protect', requireAdmin, async (ctx) => {
    const arg = ctx.message.text.split(' ')[1]?.toLowerCase();
    if (!['true', 'false'].includes(arg)) {
      return ctx.reply('Usage: /protect true|false');
    }
    await Settings.setProtect(arg === 'true');
    await logAction(ctx.from.id, 'protect', `Set to: ${arg}`);
    return ctx.reply(`🛡️ Proteksi konten: <b>${arg === 'true' ? 'Aktif' : 'Nonaktif'}</b>`, { parse_mode: 'HTML' });
  });

  // ─── /setmsg ─────────────────────────────────────────────
  bot.command('setmsg', requireAdmin, async (ctx) => {
    const text = ctx.message.text.split(' ').slice(1).join(' ');
    if (!text) return ctx.reply('Usage: /setmsg [pesan wajib join]');
    await Settings.set('welcome_message', text);
    return ctx.reply('✅ Pesan welcome berhasil diperbarui.');
  });

  // ─── /ping ───────────────────────────────────────────────
  bot.command('ping', async (ctx) => {
    const start = Date.now();
    const msg = await ctx.reply('🏓 Pong!');
    const ms = Date.now() - start;
    return ctx.telegram.editMessageText(
      msg.chat.id, msg.message_id, null,
      `🏓 <b>Pong!</b>\n⚡ Latency: <code>${ms}ms</code>`,
      { parse_mode: 'HTML' }
    );
  });

  // ─── /uptime ─────────────────────────────────────────────
  bot.command('uptime', requireAdmin, async (ctx) => {
    const uptime = formatUptime(process.uptime());
    const mem = process.memoryUsage();
    return ctx.reply(
      `🕐 <b>Bot Uptime</b>\n\n` +
      `⏱️ Uptime: <code>${uptime}</code>\n` +
      `💾 RAM: <code>${Math.round(mem.rss / 1024 / 1024)}MB</code>`,
      { parse_mode: 'HTML' }
    );
  });

  // ─── /stats ──────────────────────────────────────────────
  bot.command('stats', requireAdmin, async (ctx) => {
    const { data: userCount } = await Users.count();
    const { data: admins } = await Admins.getAll();
    const protect = await Settings.getProtect();
    const uptime = formatUptime(process.uptime());

    return ctx.reply(
      `📊 <b>Bot Statistics</b>\n\n` +
      `👥 Total Users: <code>${userCount ?? 0}</code>\n` +
      `👑 Total Admin: <code>${admins?.length ?? 0}</code>\n` +
      `🛡️ Protect: <code>${protect ? 'Aktif' : 'Nonaktif'}</code>\n` +
      `⏱️ Uptime: <code>${uptime}</code>\n` +
      `💾 RAM: <code>${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB</code>`,
      { parse_mode: 'HTML' }
    );
  });

  // ─── /info ───────────────────────────────────────────────
  bot.command('info', requireAdmin, async (ctx) => {
    return ctx.reply(
      `ℹ️ <b>Info Bot</b>\n\n` +
      `🤖 Bot: @${ctx.botInfo?.username}\n` +
      `🆔 Bot ID: <code>${ctx.botInfo?.id}</code>\n` +
      `⚙️ Mode: <code>${process.env.BOT_MODE || 'polling'}</code>\n` +
      `🌍 Node: <code>${process.version}</code>`,
      { parse_mode: 'HTML' }
    );
  });

};
