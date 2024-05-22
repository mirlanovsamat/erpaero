const mysql = require('mysql2');
const env = require('env-var');

const connectionOptions = {
  host: env.get('MYSQL_HOST').required().asString(),
  user: env.get('MYSQL_USER').required().asString(),
  password: env.get('MYSQL_PASSWORD').required().asString(),
  database: env.get('MYSQL_DATABASE').required().asString(),
};
const connection = mysql.createConnection(connectionOptions);

function connect() {
  return new Promise((resolve, reject) => {
    connection.connect(async (error) => {
      if (error) reject(error);

      console.log('Successfully connected to the database');
      resolve(connection);
    });
  });
}

function query(query, params) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, function (error, results, fields) {
      if (error) reject(error);

      resolve(results);
    });
  });
}

module.exports = {
  connection,
  connect,
  query,
};
