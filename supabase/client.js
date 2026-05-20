const { createClient } = require('@supabase/supabase-js');
const config = require('../config');
const logger = require('../utils/logger');

let supabase = null;

function getClient() {
  if (!supabase) {
    supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY, {
      auth: { persistSession: false },
    });
    logger.info('[Supabase] Client initialized');
  }
  return supabase;
}

/**
 * Generic async query wrapper with error handling
 */
async function query(fn) {
  try {
    const client = getClient();
    const result = await fn(client);
    if (result.error) throw result.error;
    return { data: result.data, error: null };
  } catch (error) {
    logger.error('[Supabase] Query error:', error.message);
    return { data: null, error };
  }
}

module.exports = { getClient, query };
