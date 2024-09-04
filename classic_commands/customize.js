const Discord = require("discord.js");
const config = require('../config.js');
const client = require('../server.js');
const connection = require('../databasesql.js');
const soap = require("../soap.js");

module.exports = {
  name: 'customize',
  description: 'Mark character for customize at next login.',
  DMonly: false,
  async execute(message, args) {
    if (!args[0]) {
      return message.reply(`You need to add a character name after the command. \nUsage: **!customize <charactername>**`);
    }

    const charName = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase();

    try {
      await connection.query('USE acore_characters');
      const [results1] = await connection.query('SELECT account FROM characters WHERE name = ?', [charName]);

      if (!results1[0]) {
        return message.reply(`Character doesn't exist!`);
      }

      await connection.query('USE acore_auth');
      const [results2] = await connection.query('SELECT id FROM account WHERE reg_mail = ? AND id = ?', [message.author.id, results1[0].account]);

      if (!results2 || !results2[0]) {
        return message.reply(`Couldn't find account connected to the character.`);
      }

      if (results1[0].account === results2[0].id) {
        const result = await soap.Soap(`character customize ${charName}`);

        if (result.faultString) {
          return message.reply(result.faultString);
        }

        const embed = new Discord.MessageEmbed()
          .setColor(config.color)
          .setTitle('Customize Success')
          .setDescription('You can customize the character at next login.')
          .setTimestamp()
          .setFooter('Customize Command', client.user.displayAvatarURL());

        message.channel.send(embed);
      } else {
        message.reply('The account bound to the character is not yours.');
      }
    } catch (error) {
      console.error(error);
      message.reply('An error occurred while processing your request.');
    }
  },
};