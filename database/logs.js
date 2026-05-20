const { query } = require('../supabase/client');

const Logs = {
  async add({ user_id, action, details }) {
    return query(client =>
      client.from('logs').insert({ user_id, action, details })
    );
  },

  async getRecent(limit = 50) {
    return query(client =>
      client
        .from('logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)
    );
  },

  async getByUser(user_id, limit = 20) {
    return query(client =>
      client
        .from('logs')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })
        .limit(limit)
    );
  },
};

module.exports = Logs;
