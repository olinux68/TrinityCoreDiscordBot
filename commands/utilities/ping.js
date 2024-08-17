const { SlashCommandBuilder } = require("discord.js");

module.exports = function (api) {
  return {
    data: new SlashCommandBuilder()
      .setName(api.i18n.translate("en", "bot.cmd.ping"))
      .setDescription(api.i18n.translate("en", "bot.desc.ping"))
      .setNameLocalizations(api.i18n.getAllTranslations("bot.cmd.ping"))
      .setDescriptionLocalizations(
        api.i18n.getAllTranslations("bot.desc.ping")
      ),
    async execute(interaction) {
      await interaction.reply(
        api.i18n.translate(interaction.locale, "bot.pong")
      );
    },
  };
};
