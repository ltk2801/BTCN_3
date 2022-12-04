const pgp = require("pg-promise")({});
const databaseConfig = {
  host: "localhost",
  port: 5432,
  database: "BTCN_3",
  user: "postgres",
  password: "123456",
  max: 30,
};
const db = pgp(databaseConfig);
module.exports = {
  pgp,
  db,
};
