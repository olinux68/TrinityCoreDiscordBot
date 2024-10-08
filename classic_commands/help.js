const Discord = require("discord.js");
const config = require('../config.js');
const connection = require('../databasesql.js');

module.exports = {
  name: 'help',
  description: 'List all of my commands or info about a specific command.',
  DMonly: false,
  async execute(message, args) {
    const data = [];
    const { commands } = message.client;

    if (!args.length) {
      await sendAllCommands(message, commands, data);
    } else {
      await sendCommandDetails(message, args, commands, data);
    }
  },
};

async function sendAllCommands(message, commands, data) {
  data.push('Here\'s a list of all my commands:');
  data.push(commands.map(command => command.name).join(' | '));
  data.push(`\nYou can send \`${config.prefix}help [command name]\` to get info on a specific command!`);

  try {
    await message.author.send(data, { split: true });
    if (message.channel.type !== 'dm') {
      message.reply('I\'ve sent you a DM with all my commands!');
    }
  } catch (error) {
    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
  }
}

async function sendCommandDetails(message, args, commands, data) {
  const name = args[0].toLowerCase();
  const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

  if (!command) {
    return message.reply('That\'s not a valid command!');
  }

  data.push(`**Name:** ${command.name}`);
  if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
  if (command.description) data.push(`**Description:** ${command.description}`);
  if (command.usage) data.push(`**Usage:** ${config.prefix}${command.name} ${command.usage}`);
  data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

  message.channel.send(data, { split: true });
}