const { SlashCommandBuilder } = require("discord.js");

module.exports = function (api) {
  const getTranslations = (key) => ({
    name: api.i18n.translate("en", key),
    description: api.i18n.translate("en", key),
    nameLocalizations: api.i18n.getAllTranslations(key),
    descriptionLocalizations: api.i18n.getAllTranslations(key),
  });

  const translations = getTranslations("bot.cmd.ping");
  const descriptionTranslations = getTranslations("bot.desc.ping");

  return {
    data: new SlashCommandBuilder()
      .setName(translations.name)
      .setDescription(descriptionTranslations.description)
      .setNameLocalizations(translations.nameLocalizations)
      .setDescriptionLocalizations(descriptionTranslations.descriptionLocalizations),
    async execute(interaction) {
      await interaction.reply(
        api.i18n.translate(interaction.locale, "bot.pong")
      );
    },
  };
};