const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = function (api) {
  return {
    data: new SlashCommandBuilder()
      .setName(api.i18n.translate("en", "wow.cmd.online"))
      .setDescription(api.i18n.translate("en", "wow.desc.online"))
      .setNameLocalizations(api.i18n.getAllTranslations("wow.cmd.online"))
      .setDescriptionLocalizations(
        api.i18n.getAllTranslations("wow.desc.online")
      ),
    async execute(interaction) {
      let counter = 0;
      let onlinePlayers = {};
      api.database.query("use auth;");
      api.database.query(
        "select username, joindate, last_login, locale, reg_mail, online, id from account where online = 1;",
        (error1, accounts, fields1) => {
          api.database.query("use characters;");
          api.database.query(
            "select name, account, map from characters where online = 1;",
            async (error2, characters, fields2) => {
              accounts.forEach((account) => {
                if (!onlinePlayers[account.id]) {
                  onlinePlayers[account.id] = {};
                }
                onlinePlayers[account.id].account = account;
              });
              characters.forEach(async (character) => {
                if (!onlinePlayers[character.account]) {
                  onlinePlayers[character.account] = {};
                }
                onlinePlayers[character.account].character = character;
              });

              const onlinePlayersCount = Object.keys(onlinePlayers).length;

              console.log(onlinePlayers, onlinePlayersCount);

              let embed = new EmbedBuilder()
                .setTitle(
                  api.i18n.translate(
                    interaction.locale,
                    `wow.online.players.${
                      onlinePlayersCount > 1 ? "plurial" : "singular"
                    }`,
                    {
                      count: onlinePlayersCount,
                    }
                  )
                )
                .setColor(api.config.color);
              let tempDesc = "";
              Object.values(onlinePlayers).forEach(async (player) => {
                if (tempDesc > 4000) {
                  embed.setDescription(tempDesc);
                  tempDesc = "";
                  if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ embeds: [embed] });
                  } else {
                    await interaction.reply({ embeds: [embed] });
                  }
                }

                let isLinkedToDiscord = /^\d{17,19}$/.test(
                  player.account.reg_mail
                );
                if (player.character) {
                  tempDesc += api.i18n.translate(
                    interaction.locale,
                    `wow.online.playing.${
                      isLinkedToDiscord ? "discord" : "regular"
                    }`,
                    {
                      username: player.account.username,
                      character: player.character.name,
                      discord: isLinkedToDiscord
                        ? player.account.reg_mail
                        : null,
                      since: Math.floor(
                        new Date(player.account.last_login).getTime() / 1000
                      ),
                    }
                  );
                } else {
                  tempDesc += api.i18n.translate(
                    interaction.locale,
                    `wow.online.connected.${
                      isLinkedToDiscord ? "discord" : "regular"
                    }`,
                    {
                      username: player.account.username,
                      discord: isLinkedToDiscord
                        ? player.account.reg_mail
                        : null,
                      since: Math.floor(
                        new Date(player.account.last_login).getTime() / 1000
                      ),
                    }
                  );
                }
              });
              embed.setDescription(tempDesc);
              tempDesc = "";

              if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ embeds: [embed] });
              } else {
                await interaction.reply({ embeds: [embed] });
              }
            }
          );
        }
      );
    },
  };
};
