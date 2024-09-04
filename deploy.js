const { REST, Routes } = require("discord.js");
const config = require("./config.js");
const i18n = require("./i18n.js");
const fs = require("node:fs");
const path = require("node:path");

i18n.load();

const api = { config, i18n };

const commands = [];
const foldersPath = path.join(__dirname, "commands");

const loadCommands = (folderPath) => {
  const commandFiles = fs
    .readdirSync(folderPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    const command = require(filePath)(api);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
};

const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  loadCommands(commandsPath);
}

const rest = new REST().setToken(config.token);

const deployCommands = async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
};

deployCommands();