const sql = require('mssql');

const config = {
  server: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_DATABASE || 'TabreedPortal',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'YourStrong@Password123',
  options: {
    encrypt: false,
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool = null;

async function getPool() {
  if (!pool) {
    pool = await sql.connect(config);
    console.log('Connected to SQL Server:', config.database);
  }
  return pool;
}

async function query(queryString, params = {}) {
  const p = await getPool();
  const request = p.request();
  for (const [key, value] of Object.entries(params)) {
    request.input(key, value);
  }
  return request.query(queryString);
}

module.exports = { sql, getPool, query };
