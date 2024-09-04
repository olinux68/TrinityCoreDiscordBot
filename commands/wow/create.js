const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = function (api) {
  const getTranslation = (locale, key) => api.i18n.translate(locale, key);
  const getAllTranslations = (key) => api.i18n.getAllTranslations(key);

  const createTextInput = (id, labelKey, placeholderKey, style, minLength, maxLength, locale) => {
    return new TextInputBuilder()
      .setCustomId(id)
      .setLabel(getTranslation(locale, labelKey))
      .setPlaceholder(getTranslation(locale, placeholderKey))
      .setRequired(true)
      .setStyle(style)
      .setMinLength(minLength)
      .setMaxLength(maxLength);
  };

  return {
    data: new SlashCommandBuilder()
      .setName(getTranslation("en", "wow.cmd.create"))
      .setDescription(getTranslation("en", "wow.desc.create"))
      .setNameLocalizations(getAllTranslations("wow.cmd.create"))
      .setDescriptionLocalizations(getAllTranslations("wow.desc.create")),
    async execute(interaction) {
      const locale = interaction.locale;
      const modal = new ModalBuilder()
        .setCustomId("wow_create")
        .setTitle(getTranslation(locale, "wow.modal.create.title"))
        .addComponents(
          new ActionRowBuilder().addComponents(
            createTextInput(
              "wow_username",
              "wow.modal.create.username.label",
              "wow.modal.create.username.placeholder",
              TextInputStyle.Short,
              3,
              10,
              locale
            )
          ),
          new ActionRowBuilder().addComponents(
            createTextInput(
              "wow_password",
              "wow.modal.create.password.label",
              "wow.modal.create.password.placeholder",
              TextInputStyle.Short,
              6,
              32,
              locale
            )
          )
        );
      await interaction.showModal(modal);
    },
  };
};