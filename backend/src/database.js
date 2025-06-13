const { Pool } = require('pg');

const URL = "postgres://postgres:123@localhost:5432/adotacats";
const database = new Pool({
  connectionString: URL,
});

module.exports = database; 