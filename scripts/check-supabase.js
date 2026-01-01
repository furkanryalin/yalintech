#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

function parseDotEnv(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);
    const obj = {};
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if (val.startsWith("\"") && val.endsWith("\"")) val = val.slice(1, -1);
      obj[key] = val;
    }
    return obj;
  } catch (err) {
    return {};
  }
}

async function check() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, '..');
  const dotenvPath = path.join(repoRoot, '.env');
  const envFromFile = parseDotEnv(dotenvPath);
  const env = { ...process.env, ...envFromFile };

  const required = [
    'PUBLIC_SUPABASE_URL',
    'PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ADMIN_PASSWORD',
    'ADMIN_SESSION_SECRET'
  ];

  console.log('\n--- ENV VARS ---');
  for (const k of required) {
    console.log(`${k}: ${env[k] ? 'SET' : 'MISSING'}`);
  }

  if (!env.PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('\nMissing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Cannot run DB checks without service role key.');
    process.exitCode = 2;
    return;
  }

  const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const tables = ['profiles', 'comments', 'contact_messages'];
  console.log('\n--- DB TABLE CHECKS ---');

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('id').limit(1);
      if (error) {
        console.log(`${table}: ERROR — ${error.code || ''} ${error.message || JSON.stringify(error)}`);
      } else if (!data) {
        console.log(`${table}: no data (empty) but table exists`);
      } else {
        console.log(`${table}: exists (sample rows: ${data.length})`);
      }
    } catch (err) {
      console.log(`${table}: ERROR — ${err.message || err}`);
    }
  }

  console.log('\n--- DONE ---\n');
}

check().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
