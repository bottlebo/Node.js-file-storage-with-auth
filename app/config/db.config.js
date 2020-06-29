module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "1234567890",
  DB: "testdb-2",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
