const { Pool } = require('pg');
const {DB_HOST, DB_PORT, DB_NAME, DB_PASSWORD, DB_USER} = require('./config');

const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
});

const query = (text, params) => pool.query(text, params);

module.exports = {
  query,
};
