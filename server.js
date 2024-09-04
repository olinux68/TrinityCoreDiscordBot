const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  ActivityType,
} = require("discord.js");

const config = require("./config.js");
const database = require("./databasesql.js")(config);
const i18n = require("./i18n.js");
const soap = require("./soap.js");

i18n.load();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
client.interactions = { modals: {} };

const api = {
  config,
  client,
  database,
  i18n,
  soap,
  regex: {
    username: (text) => /^[a-zA-Z0-9]+$/gm.test(text),
    password: (text) => /^[^\s'"]+$/g.test(text),
    passwordComplexity: (text) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(text),
  },
};

const loadFiles = (folderPath, callback) => {
  try {
    const files = fs.readdirSync(folderPath);
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      callback(filePath);
    });
  } catch (error) {
    console.error(
      i18n.translate(config.locale, "logs.loading.error", {
        logtype: i18n.translate(config.locale, "logs.error"),
      }),
      error
    );
  }
};

const loadCommands = () => {
  const foldersPath = path.join(__dirname, "commands");
  loadFiles(foldersPath, (folderPath) => {
    loadFiles(folderPath, (filePath) => {
      if (filePath.endsWith(".js")) {
        const command = require(filePath)(api);
        if (command.data && command.execute) {
          client.commands.set(command.data.name, command);
        } else {
          console.log(
            i18n.translate(config.locale, "logs.cmd.missing.parts", {
              logtype: i18n.translate(config.locale, "logs.warning"),
              path: filePath,
            })
          );
        }
      }
    });
  });
};

const loadModals = () => {
  const foldersPath = path.join(__dirname, "interactions", "modals");
  loadFiles(foldersPath, (filePath) => {
    const modal = require(filePath)(api);
    if (modal.customId && modal.execute) {
      client.interactions.modals[modal.customId] = modal;
    } else {
      console.log(
        i18n.translate(config.locale, "logs.cmd.missing.parts", {
          logtype: i18n.translate(config.locale, "logs.warning"),
          path: filePath,
        })
      );
    }
  });
};

client.once(Events.ClientReady, (readyClient) => {
  console.log("----------");
  console.log(
    i18n.translate(config.locale, "logs.bot.loggedin", {
      logtype: i18n.translate(config.locale, "logs.info"),
      username: readyClient.user.tag,
    })
  );
  console.log("----------");
  client.user.setActivity(config.statusMessage, { type: ActivityType.Playing });
  setInterval(() => {
    client.user.setActivity(config.statusMessage, { type: ActivityType.Playing });
  }, 360000);
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) throw new Error(`No command matching ${interaction.commandName} was found.`);
      await command.execute(interaction);
    } else if (interaction.isModalSubmit()) {
      const modal = client.interactions.modals[interaction.customId];
      if (!modal) throw new Error(`No modal matching ${interaction.customId} was found.`);
      await modal.execute(interaction);
    }
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

loadCommands();
loadModals();
client.login(config.token);

module.exports = client;