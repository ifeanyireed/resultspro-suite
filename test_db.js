const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: 'srv2113.hstgr.io',
    user: 'u721451974_resultspro',
    password: '*Reedb4b4',
    database: 'u721451974_resultspro_db'
  });

  const [rows] = await connection.execute('SELECT id, email, account_status, otp_code FROM users LIMIT 5');
  console.log(rows);
  
  await connection.end();
}

run().catch(console.error);
