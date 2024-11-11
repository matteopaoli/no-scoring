import { execSync } from 'child_process';
import { Client } from 'pg';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

const DB_URL = process.env.DATABASE_URL;
const MAIN_DB_URL = DB_URL.replace('/testdb', '/postgres');
const SEED_SQL_PATH = path.join(__dirname, 'db', 'seed.sql');
const ADMIN_SCRIPT_PATH = path.join(__dirname, 'tools', 'createAdmin.js');

async function setupTestDatabase() {
  const client = new Client({ connectionString: MAIN_DB_URL });

  try {
    await client.connect();

    // Drop testdb if it exists
    await client.query(`DROP DATABASE IF EXISTS testdb;`);

    // Create a new testdb
    await client.query(`CREATE DATABASE testdb;`);
    console.log('✅ Test database created.');

    // Migrate the test database
    execSync(`npx drizzle-kit push --config=drizzle-test.config.ts`, { stdio: 'inherit' });
    console.log('✅ Migrations applied.');

    // Seed the test database
    const seedClient = new Client({ connectionString: DB_URL });
    await seedClient.connect();

    // Execute seed SQL
    await seedClient.query(await (await import('fs/promises')).readFile(SEED_SQL_PATH, 'utf-8'));
    console.log('✅ Seed SQL applied.');

    // Run admin script
    execSync(`node ${ADMIN_SCRIPT_PATH}`, { stdio: 'inherit' });
    console.log('✅ Admin user created.');

    await seedClient.end();
  } catch (err) {
    console.error('❌ Error setting up test database:', err);
  } finally {
    await client.end();
  }
}

// Setup before running tests
beforeAll(async () => {
  console.log('🔧 Setting up test database...');
  await setupTestDatabase();
});
