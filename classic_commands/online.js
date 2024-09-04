const Discord = require("discord.js");
const config = require('../config.js');
const client = require('../server.js');
const connection = require('../databasesql.js');

module.exports = {
  name: 'online',
  description: 'Gives list of online players.',
  DMonly: false,
  async execute(message, args) {
    try {
      await connection.query('USE acore_characters');
      const [results1] = await connection.query('SELECT name FROM characters WHERE online = 1');

      let onlinePlayers;
      let counter = 0;

      if (!results1.length) {
        onlinePlayers = "There is no one online!";
      } else {
        onlinePlayers = results1.map(player => player.name);
        counter = onlinePlayers.length;
      }

      const embed = new Discord.MessageEmbed()
        .setColor(config.color)
        .setTitle('Online Players')
        .setDescription(Array.isArray(onlinePlayers) ? onlinePlayers.join(', ') : onlinePlayers)
        .addField('Amount of characters online:', `${counter} characters`)
        .setTimestamp()
        .setFooter('Online command', client.user.displayAvatarURL());

      message.channel.send(embed);
    } catch (error) {
      console.error(error);
      message.reply('An error occurred while fetching the online players.');
    }
  },
};