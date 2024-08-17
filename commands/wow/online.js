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
      let onlinePlayers = 0;
      api.database.query("USE characters");
      api.database.query(
        "select name, joindate, last_login, locale, reg_mail from characters where online = 1",
        (error, results1, fields) => {
          console.log(results1);
        }
      );
      let embed = new EmbedBuilder();
      embed.setDescription("testing");
      await interaction.reply({ embeds: [embed] });
    },
  };
};
