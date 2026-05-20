const { query } = require('../supabase/client');

const Content = {
  async add({ channel_id, label, limit_count = 0 }) {
    return query(client =>
      client
        .from('content_channels')
        .upsert({ channel_id, label, limit_count }, { onConflict: 'channel_id' })
        .select()
        .single()
    );
  },

  async remove(channel_id) {
    return query(client =>
      client.from('content_channels').delete().eq('channel_id', channel_id)
    );
  },

  async getAll() {
    return query(client =>
      client.from('content_channels').select('*').order('created_at', { ascending: false })
    );
  },

  async getById(channel_id) {
    return query(client =>
      client.from('content_channels').select('*').eq('channel_id', channel_id).single()
    );
  },

  async setLimit(channel_id, limit_count) {
    return query(client =>
      client
        .from('content_channels')
        .update({ limit_count })
        .eq('channel_id', channel_id)
    );
  },
};

module.exports = Content;
