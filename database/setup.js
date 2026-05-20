/**
 * Database setup script
 * Run: node database/setup.js
 */
require('dotenv').config();
const { getClient } = require('../supabase/client');

async function setup() {
  console.log('🚀 Running database setup...');
  const client = getClient();

  const defaultSettings = [
    { key: 'protect_content', value: 'false' },
    { key: 'welcome_message', value: 'Selamat datang di bot kami! 👋' },
    { key: 'maintenance_mode', value: 'false' },
    { key: 'max_limit', value: '10' },
  ];

  for (const setting of defaultSettings) {
    const { error } = await client
      .from('settings')
      .upsert(setting, { onConflict: 'key', ignoreDuplicates: true });
    if (error) {
      console.error(`❌ Failed to insert setting ${setting.key}:`, error.message);
    } else {
      console.log(`✅ Setting '${setting.key}' ready`);
    }
  }

  console.log('\n✅ Database setup complete!');
  console.log('📋 Make sure you have run setup.sql in Supabase SQL Editor first.\n');
  process.exit(0);
}

setup().catch(err => {
  console.error('Setup failed:', err);
  process.exit(1);
});
