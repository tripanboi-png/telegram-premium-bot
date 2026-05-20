const { query } = require('../supabase/client');

const Admins = {
  async add({ user_id, username, added_by }) {
    return query(client =>
      client
        .from('admins')
        .upsert({ user_id, username, added_by }, { onConflict: 'user_id' })
        .select()
        .single()
    );
  },

  async remove(user_id) {
    return query(client =>
      client.from('admins').delete().eq('user_id', user_id)
    );
  },

  async isAdmin(user_id) {
    const { data } = await query(client =>
      client.from('admins').select('user_id').eq('user_id', user_id).single()
    );
    return !!data;
  },

  async getAll() {
    return query(client =>
      client.from('admins').select('*').order('added_at', { ascending: false })
    );
  },
};

module.exports = Admins;
