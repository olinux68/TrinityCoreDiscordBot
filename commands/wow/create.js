const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = function (api) {
  return {
    data: new SlashCommandBuilder()
      .setName(api.i18n.translate("en", "wow.cmd.create"))
      .setDescription(api.i18n.translate("en", "wow.desc.create"))
      .setNameLocalizations(api.i18n.getAllTranslations("wow.cmd.create"))
      .setDescriptionLocalizations(
        api.i18n.getAllTranslations("wow.desc.create")
      ),
    async execute(interaction) {
      let modal = new ModalBuilder()
        .setCustomId("wow_create")
        .setTitle(
          api.i18n.translate(interaction.locale, "wow.modal.create.title")
        )
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("wow_username")
              .setRequired(true)
              .setPlaceholder(
                api.i18n.translate(
                  interaction.locale,
                  "wow.modal.create.username.placeholder"
                )
              )
              .setLabel(
                api.i18n.translate(
                  interaction.locale,
                  "wow.modal.create.username.label"
                )
              )
              .setStyle(TextInputStyle.Short)
              .setMinLength(3)
              .setMaxLength(10)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("wow_password")
              .setLabel(
                api.i18n.translate(
                  interaction.locale,
                  "wow.modal.create.password.label"
                )
              )
              .setPlaceholder(
                api.i18n.translate(
                  interaction.locale,
                  "wow.modal.create.password.placeholder"
                )
              )
              .setRequired(true)
              .setStyle(TextInputStyle.Short)
              .setMinLength(6)
              .setMaxLength(32)
          )
        );
      await interaction.showModal(modal);
    },
  };
};
