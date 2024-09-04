const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = function (api) {
  const getTranslation = (locale, key, params = {}) =>
    api.i18n.translate(locale, key, params);
  const getAllTranslations = (key) => api.i18n.getAllTranslations(key);

  const fetchOnlineAccounts = async () => {
    await api.database.query("USE auth;");
    const [accounts] = await api.database.query(
      "SELECT username, joindate, last_login, locale, reg_mail, online, id FROM account WHERE online = 1;"
    );
    return accounts;
  };

  const fetchOnlineCharacters = async () => {
    await api.database.query("USE characters;");
    const [characters] = await api.database.query(
      "SELECT name, account, map FROM characters WHERE online = 1;"
    );
    return characters;
  };

  const buildOnlinePlayers = (accounts, characters) => {
    const onlinePlayers = {};
    accounts.forEach((account) => {
      if (!onlinePlayers[account.id]) {
        onlinePlayers[account.id] = {};
      }
      onlinePlayers[account.id].account = account;
    });
    characters.forEach((character) => {
      if (!onlinePlayers[character.account]) {
        onlinePlayers[character.account] = {};
      }
      onlinePlayers[character.account].character = character;
    });
    return onlinePlayers;
  };

  const createEmbed = (locale, onlinePlayers, onlinePlayersCount) => {
    const embed = new EmbedBuilder()
      .setTitle(
        getTranslation(
          locale,
          `wow.online.players.${onlinePlayersCount > 1 ? "plurial" : "singular"}`,
          { count: onlinePlayersCount }
        )
      )
      .setColor(api.config.color);

    if (onlinePlayersCount > 0) {
      let tempDesc = "";
      Object.values(onlinePlayers).forEach((player) => {
        const isLinkedToDiscord = /^\d{17,19}$/.test(player.account.reg_mail);
        if (player.character) {
          tempDesc += getTranslation(
            locale,
            `wow.online.playing.${isLinkedToDiscord ? "discord" : "regular"}`,
            {
              username: player.account.username,
              character: player.character.name,
              discord: isLinkedToDiscord ? player.account.reg_mail : null,
              since: Math.floor(new Date(player.account.last_login).getTime() / 1000),
            }
          );
        } else {
          tempDesc += getTranslation(
            locale,
            `wow.online.connected.${isLinkedToDiscord ? "discord" : "regular"}`,
            {
              username: player.account.username,
              discord: isLinkedToDiscord ? player.account.reg_mail : null,
              since: Math.floor(new Date(player.account.last_login).getTime() / 1000),
            }
          );
        }
      });
      embed.setDescription(tempDesc);
    } else {
      embed.setDescription(getTranslation(locale, "wow.online.empty"));
    }

    return embed;
  };

  return {
    data: new SlashCommandBuilder()
      .setName(getTranslation("en", "wow.cmd.online"))
      .setDescription(getTranslation("en", "wow.desc.online"))
      .setNameLocalizations(getAllTranslations("wow.cmd.online"))
      .setDescriptionLocalizations(getAllTranslations("wow.desc.online")),
    async execute(interaction) {
      try {
        const accounts = await fetchOnlineAccounts();
        const characters = await fetchOnlineCharacters();
        const onlinePlayers = buildOnlinePlayers(accounts, characters);
        const onlinePlayersCount = Object.keys(onlinePlayers).length;

        const embed = createEmbed(interaction.locale, onlinePlayers, onlinePlayersCount);

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ embeds: [embed] });
        } else {
          await interaction.reply({ embeds: [embed] });
        }
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "An error occurred while fetching online players.",
          ephemeral: true,
        });
      }
    },
  };
};