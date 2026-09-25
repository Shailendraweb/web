import { AppDataSource } from '../data-source';

async function run() {
  try {
    await AppDataSource.initialize();
    console.log('Connected to DB, running migrations...');
    const res = await AppDataSource.runMigrations();
    console.log('Migrations complete:', res.map(r => r.name));
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    try { await AppDataSource.destroy(); } catch (_) {}
  }
}

run();
