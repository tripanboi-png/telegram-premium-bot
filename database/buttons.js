const { query } = require('../supabase/client');

const Buttons = {
  async add({ channel_id, label, url, position = 0 }) {
    return query(client =>
      client
        .from('buttons')
        .insert({ channel_id, label, url, position })
        .select()
        .single()
    );
  },

  async remove(id) {
    return query(client =>
      client.from('buttons').delete().eq('id', id)
    );
  },

  async removeByChannel(channel_id) {
    return query(client =>
      client.from('buttons').delete().eq('channel_id', channel_id)
    );
  },

  async getByChannel(channel_id) {
    return query(client =>
      client
        .from('buttons')
        .select('*')
        .eq('channel_id', channel_id)
        .order('position', { ascending: true })
    );
  },

  async getAll() {
    return query(client =>
      client.from('buttons').select('*').order('channel_id')
    );
  },
};

module.exports = Buttons;
