const Buttons = require('../database/buttons');
const { requireAdmin, logAction } = require('../middleware/auth');

module.exports = (bot) => {

  // /addbutton [channel_id] [label] [url]
  bot.command('addbutton', requireAdmin, async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length < 3) {
      return ctx.reply('Usage: /addbutton [channel_id] [label] [url]\n\nContoh:\n/addbutton @mychannel Download https://example.com');
    }
    const [channel_id, label, url] = args;
    const { error } = await Buttons.add({ channel_id, label, url });
    if (error) return ctx.reply(`❌ Gagal menambah button: ${error.message}`);
    await logAction(ctx.from.id, 'addbutton', `channel=${channel_id} label=${label}`);
    return ctx.reply(`✅ Button <b>${label}</b> berhasil ditambahkan ke <code>${channel_id}</code>`, { parse_mode: 'HTML' });
  });

  // /delbutton [id]
  bot.command('delbutton', requireAdmin, async (ctx) => {
    const id = parseInt(ctx.message.text.split(' ')[1]);
    if (!id) return ctx.reply('Usage: /delbutton [id]');
    await Buttons.remove(id);
    await logAction(ctx.from.id, 'delbutton', `id=${id}`);
    return ctx.reply(`✅ Button ID <code>${id}</code> dihapus.`, { parse_mode: 'HTML' });
  });

  // /getbutton [channel_id]
  bot.command('getbutton', requireAdmin, async (ctx) => {
    const channel_id = ctx.message.text.split(' ')[1];
    if (channel_id) {
      const { data } = await Buttons.getByChannel(channel_id);
      if (!data || data.length === 0) return ctx.reply(`Tidak ada button untuk ${channel_id}`);
      const list = data.map(b => `• ID: <code>${b.id}</code> | ${b.label} → ${b.url}`).join('\n');
      return ctx.reply(`🔘 <b>Buttons untuk ${channel_id}</b>\n\n${list}`, { parse_mode: 'HTML' });
    }
    const { data } = await Buttons.getAll();
    if (!data || data.length === 0) return ctx.reply('Tidak ada button terdaftar.');
    const list = data.map(b => `• ID: <code>${b.id}</code> | ${b.channel_id} | ${b.label}`).join('\n');
    return ctx.reply(`🔘 <b>Semua Buttons</b>\n\n${list}`, { parse_mode: 'HTML' });
  });

};
