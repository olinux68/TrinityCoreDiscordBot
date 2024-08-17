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

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const database = require("./databasesql.js")(client);

const i18n = require("./i18n.js");
i18n.load();

const soap = require("./soap.js");

const api = {
  config,
  client,
  database,
  i18n,
  soap,
};

module.exports = client;

client.commands = new Collection();
client.interactions = {
  modals: {},
};

// Loading commands
try {
  const foldersPath = path.join(__dirname, "commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath)(api);
      if ("data" in command && "execute" in command) {
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
  }
} catch (error) {
  console.error(
    i18n.translate(config.locale, "logs.cmd.loading.error", {
      logtype: i18n.translate(config.locale, "logs.error"),
    }),
    error
  );
}

// Loading modals
try {
  const foldersPath = path.join(__dirname, "interactions", "modals");
  const modalsFolders = fs.readdirSync(foldersPath);

  for (const file of modalsFolders) {
    const filePath = path.join(foldersPath, file);
    const modal = require(filePath)(api);
    if ("customId" in modal && "execute" in modal) {
      client.interactions.modals[modal.customId] = modal;
    } else {
      console.log(
        i18n.translate(config.locale, "logs.cmd.missing.parts", {
          logtype: i18n.translate(config.locale, "logs.warning"),
          path: filePath,
        })
      );
    }
  }
} catch (error) {
  console.error(
    i18n.translate(config.locale, "logs.modal.loading.error", {
      logtype: i18n.translate(config.locale, "logs.error"),
    }),
    error
  );
}

// Startup
client.once(Events.ClientReady, (readyClient) => {
  console.log("----------");
  console.log(
    i18n.translate(config.locale, "logs.bot.loggedin", {
      logtype: i18n.translate(config.locale, "logs.info"),
      username: readyClient.user.tag,
    })
  );
  console.log("----------");
  client.user.setActivity(config.statusMessage, {
    type: ActivityType.Playing,
  });
  setInterval(() => {
    client.user.setActivity(config.statusMessage, {
      type: ActivityType.Playing,
    });
  }, 360000);
});

// Interaction Handler

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  } else if (interaction.isModalSubmit()) {
    if (client.interactions.modals[interaction.customId]) {
      client.interactions.modals[interaction.customId].execute(interaction);
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.login(config.token);
