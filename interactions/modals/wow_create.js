const { EmbedBuilder } = require("discord.js");

const customId = "wow_create";

module.exports = function (api) {
  const validateInputs = (username, password) => {
    const usernameValid = api.regex.username(username);
    const passwordValid = api.regex.password(password);
    const passwordComplexity = api.regex.passwordComplexity(password);

    if (!usernameValid) {
      return {
        valid: false,
        message: "Your username is not valid, it must only contain alphanumerical characters.",
      };
    }

    if (!passwordValid || !passwordComplexity) {
      return {
        valid: false,
        message: "Your password is not valid, it must not contain spaces, single or double quotes.\r\nIt must be at least 8 characters long, contain a lowercase letter, an uppercase letter, and at least one digit.",
      };
    }

    return { valid: true };
  };

  const createAccountEmbed = (username, password, api) => {
    return new EmbedBuilder()
      .setColor(api.config.color)
      .setTitle("Account Created")
      .setDescription(
        "Download [the client here](https://drive.proton.me/urls/9YA89NY4B4#InyQI8wE4dMC)\r\n Take a look at your account info below:"
      )
      .addFields([
        {
          name: "Username",
          value: username,
          inline: true,
        },
        {
          name: "Password",
          value: password,
          inline: true,
        },
      ])
      .setTimestamp()
      .setFooter({
        text: "Create command",
        iconURL: api.client.user.displayAvatarURL(),
      });
  };

  return {
    customId,
    async execute(interaction) {
      const username = interaction.fields.getTextInputValue("wow_username");
      const password = interaction.fields.getTextInputValue("wow_password");

      const validation = validateInputs(username, password);
      if (!validation.valid) {
        return interaction.reply({
          content: validation.message,
          ephemeral: true,
        });
      }

      try {
        await api.database.query("USE auth");
        const [results] = await api.database.query(
          "SELECT COUNT(username) AS count FROM account WHERE reg_mail = ?",
          [interaction.user.id]
        );

        if (results[0].count === 0) {
          const result = await api.soap.Soap(`account create ${username} ${password}`);
          if (result.faultString) {
            return interaction.reply({
              content: "Username already exists.",
              ephemeral: true,
            });
          }

          await api.database.query(
            "UPDATE account SET reg_mail = ? WHERE username = ?",
            [interaction.user.id, username]
          );

          const embed = createAccountEmbed(username, password, api);
          return interaction.reply({ ephemeral: true, embeds: [embed] });
        } else {
          return interaction.reply({
            content: "You already have an account.",
            ephemeral: true,
          });
        }
      } catch (error) {
        console.error(error);
        return interaction.reply({
          content: "An error occurred.",
          ephemeral: true,
        });
      }
    },
  };
};