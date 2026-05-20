const Content = require('../database/content');
const { requireAdmin, logAction } = require('../middleware/auth');

module.exports = (bot) => {

  // /addkonten [channel_id] [label]
  bot.command('addkonten', requireAdmin, async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length < 1) return ctx.reply('Usage: /addkonten [channel_id] [label]');
    const [channel_id, ...labelParts] = args;
    const label = labelParts.join(' ') || channel_id;
    const { error } = await Content.add({ channel_id, label });
    if (error) return ctx.reply(`❌ Gagal: ${error.message}`);
    await logAction(ctx.from.id, 'addkonten', `channel=${channel_id}`);
    return ctx.reply(`✅ Channel <code>${channel_id}</code> ditambahkan sebagai auto konten.`, { parse_mode: 'HTML' });
  });

  // /delkonten [channel_id]
  bot.command('delkonten', requireAdmin, async (ctx) => {
    const channel_id = ctx.message.text.split(' ')[1];
    if (!channel_id) return ctx.reply('Usage: /delkonten [channel_id]');
    await Content.remove(channel_id);
    await logAction(ctx.from.id, 'delkonten', `channel=${channel_id}`);
    return ctx.reply(`✅ Channel <code>${channel_id}</code> dihapus dari daftar konten.`, { parse_mode: 'HTML' });
  });

  // /getkonten
  bot.command('getkonten', requireAdmin, async (ctx) => {
    const { data } = await Content.getAll();
    if (!data || data.length === 0) return ctx.reply('Tidak ada channel konten terdaftar.');
    const list = data.map((c, i) =>
      `${i + 1}. <code>${c.channel_id}</code> - ${c.label} (limit: ${c.limit_count})`
    ).join('\n');
    return ctx.reply(`📦 <b>Daftar Channel Konten</b>\n\n${list}`, { parse_mode: 'HTML' });
  });

  // /limitkonten [channel_id] [angka]
  bot.command('limitkonten', requireAdmin, async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length < 2) return ctx.reply('Usage: /limitkonten [channel_id] [angka]');
    const [channel_id, limitStr] = args;
    const limit_count = parseInt(limitStr);
    if (isNaN(limit_count)) return ctx.reply('Angka limit tidak valid.');
    await Content.setLimit(channel_id, limit_count);
    return ctx.reply(`✅ Limit channel <code>${channel_id}</code> diset ke <code>${limit_count}</code>`, { parse_mode: 'HTML' });
  });

  // /setdb [channel_id] - alias
  bot.command('setdb', requireAdmin, async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length < 1) return ctx.reply('Usage: /setdb [channel_id] [label]');
    const [channel_id, ...labelParts] = args;
    const label = labelParts.join(' ') || channel_id;
    await Content.add({ channel_id, label });
    return ctx.reply(`✅ Database channel <code>${channel_id}</code> diatur.`, { parse_mode: 'HTML' });
  });

  // /getdb
  bot.command('getdb', requireAdmin, async (ctx) => {
    const { data } = await Content.getAll();
    if (!data || data.length === 0) return ctx.reply('Tidak ada database channel.');
    const list = data.map((c, i) => `${i + 1}. <code>${c.channel_id}</code>`).join('\n');
    return ctx.reply(`🗄️ <b>Database Channels</b>\n\n${list}`, { parse_mode: 'HTML' });
  });

};
