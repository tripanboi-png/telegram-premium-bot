const { query } = require('../supabase/client');

const Settings = {
  async get(key) {
    const { data } = await query(client =>
      client.from('settings').select('value').eq('key', key).single()
    );
    return data ? data.value : null;
  },

  async set(key, value) {
    return query(client =>
      client
        .from('settings')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    );
  },

  async getAll() {
    return query(client =>
      client.from('settings').select('*').order('key')
    );
  },

  async getProtect() {
    const val = await Settings.get('protect_content');
    return val === 'true';
  },

  async setProtect(bool) {
    return Settings.set('protect_content', bool ? 'true' : 'false');
  },
};

module.exports = Settings;
