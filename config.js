require("dotenv").config();

module.exports = {
  token: process.env.TOKEN,
  clientId: process.env.BOT_ID,
  guildId: process.env.GUILD_ID,
  statusMessage: process.env.STATUS_MESSAGE,
  color: process.env.COLOR,
  databaseHost: process.env.DATABASE_HOST,
  databaseUser: process.env.DATABASE_USER,
  databasePassword: process.env.DATABASE_PASSWORD,
  soapPort: process.env.SOAP_PORT,
  soapHostname: process.env.SOAP_HOSTNAME,
  soapAuth: process.env.SOAP_AUTH,
};
