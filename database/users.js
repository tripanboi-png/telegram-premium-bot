const { query } = require('../supabase/client');

const Users = {
  async upsert({ user_id, username, first_name, last_name }) {
    return query(client =>
      client
        .from('users')
        .upsert(
          { user_id, username, first_name, last_name, last_seen: new Date().toISOString() },
          { onConflict: 'user_id' }
        )
        .select()
        .single()
    );
  },

  async getById(user_id) {
    return query(client =>
      client.from('users').select('*').eq('user_id', user_id).single()
    );
  },

  async getAll() {
    return query(client =>
      client.from('users').select('*').order('joined_at', { ascending: false })
    );
  },

  async count() {
    return query(client =>
      client.from('users').select('*', { count: 'exact', head: true })
    );
  },

  async ban(user_id) {
    return query(client =>
      client.from('users').update({ is_banned: true }).eq('user_id', user_id)
    );
  },

  async unban(user_id) {
    return query(client =>
      client.from('users').update({ is_banned: false }).eq('user_id', user_id)
    );
  },

  async incrementMessage(user_id) {
    return query(client =>
      client.rpc('increment_message_count', { uid: user_id })
    );
  },
};

module.exports = Users;
