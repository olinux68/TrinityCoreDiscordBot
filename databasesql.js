const MySQLEvents = require("@rodrigogs/mysql-events");
const mysql = require("mysql2/promise");

let active = new Map();

module.exports = async (config) => {
  const connection = await createConnection(config);
  const instance = await initializeMySQLEvents(connection);

  return connection;
};

async function createConnection(config) {
  try {
    const connection = await mysql.createConnection({
      host: config.databaseHost,
      user: config.databaseUser,
      password: config.databasePassword,
      database: "auth",
    });

    console.log("Connected as id " + connection.threadId);
    return connection;
  } catch (err) {
    console.error(`Error connecting: ${err.stack}`);
    throw err;
  }
}

async function initializeMySQLEvents(connection) {
  try {
    const instance = new MySQLEvents(connection, {
      startAtEnd: true,
      excludedSchemas: {
        mysql: true,
      },
    });

    instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
    instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);

    await instance.start();
    console.log("MySQLEvents started.");
    return instance;
  } catch (err) {
    console.error("Error initializing MySQLEvents:", err);
    throw err;
  }
}