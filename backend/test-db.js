const pool = require('./config/database');

pool.query('SELECT NOW() as current_time', (err, result) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  } else {
    console.log('✅ PostgreSQL connected successfully!');
    console.log('Current time from database:', result.rows[0]);
    process.exit(0);
  }
});