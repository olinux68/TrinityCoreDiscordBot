const { EmbedBuilder } = require("discord.js");

const customId = "wow_create";

module.exports = function (api) {
  return {
    customId,
    async execute(interaction) {
      const username = interaction.fields.getTextInputValue("wow_username");
      const usernameValid = api.regex.username(username);
      const password = interaction.fields.getTextInputValue("wow_password");
      const passwordValid = api.regex.password(password);
      const passwordComplexity = api.regex.passwordComplexity(password);

      if (usernameValid && passwordValid && passwordComplexity) {
        api.database.query("USE auth");
        api.database.query(
          "select COUNT(username) from account where reg_mail = ?",
          [interaction.user.id],
          (error, results, fields) => {
            if (error)
              return interaction.reply({
                content: "An error occured.",
                ephemeral: true,
              });

            if (Object.values(results[0])[0] == 0) {
              try {
                api.soap
                  .Soap(`account create ${username} ${password}`)
                  .then((result) => {
                    console.log(result);
                    if (result.faultString)
                      return interaction.reply({
                        content: "Username already exists.",
                        ephemeral: true,
                      });
                    else
                      api.database.query(
                        `UPDATE account set reg_mail = '${interaction.user.id}' WHERE username = ?`,
                        [username]
                      );

                    const embed = new EmbedBuilder()
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
                    interaction.reply({ ephemeral: true, embeds: [embed] });
                  });
              } catch (error) {
                console.log(error);
                return interaction.reply({
                  content: "An error occured.",
                  ephemeral: true,
                });
              }
            } else {
              return interaction.reply({
                content: "You already have an account.",
                ephemeral: true,
              });
            }
          }
        );
      } else if(!usernameValid) {
        return interaction.reply({
          content: "Your username is not valid, it must only contain alphanumerical.",
          ephemeral: true,
        });
      } else if(!passwordValid || !passwordComplexity) {
        return interaction.reply({
          content: "Your password is not valid, it must not contain spaces, single or double quotes.\r\nIt must be at least 8 characters long, a lowercase, an uppercase letter and at least one digit.",
          ephemeral: true,
        });
      }
    },
  };
};
