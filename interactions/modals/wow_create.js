const { EmbedBuilder } = require("discord.js");

const customId = "wow_create";

module.exports = function (api) {
  return {
    customId,
    async execute(interaction) {
      const username = interaction.fields.getTextInputValue("wow_username");
      const password = interaction.fields.getTextInputValue("wow_password");

      api.database.query("USE auth");
      connection.query(
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
                    connection.query(
                      `UPDATE account set reg_mail = '${interaction.user.id}' WHERE username = '${username}'`
                    );

                  const embed = new EmbedBuilder()
                    .setColor(api.config.color)
                    .setTitle("Account Created")
                    .setDescription("Take a look at your account info below:")
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
                    .setFooter(
                      "Create command",
                      api.client.user.displayAvatarURL()
                    );
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
      // const connection = mysql.createConnection({
      //   host: config.databaseHost,
      //   user: config.databaseUser,
      //   password: config.databasePassword,
      //   database: "auth",
      // });

      // console.log("Attempting to connect to the database");

      // connection.connect((err) => {
      //   if (err) {
      //     console.error("Error connecting to the database:", err);
      //     return interaction.reply({
      //       content: "Error connecting to the database.",
      //       ephemeral: true,
      //     });
      //   }

      //   console.log("Connected to the database");

      //   // Requête SQL pour insérer les données
      //   const query = "INSERT INTO account (username, password) VALUES (?, ?)";

      //   connection.query(query, [username, password], (err, results) => {
      //     if (err) {
      //       console.error("Error executing the query:", err);
      //       connection.end();
      //       return interaction.reply({
      //         content: "Error executing the query.",
      //         ephemeral: true,
      //       });
      //     }

      //     console.log("Query executed successfully");
      //     console.log("Results:", results);

      //     // Confirmation à l'utilisateur
      //     const embed = new EmbedBuilder()
      //       .setTitle("Account Created")
      //       .setDescription(`Account for ${username} created successfully!`)
      //       .setColor("#00FF00");

      //     interaction.reply({ embeds: [embed] });

      //     // Fermeture de la connexion
      //     connection.end((err) => {
      //       if (err) {
      //         console.error("Error closing the database connection:", err);
      //       } else {
      //         console.log("Database connection closed");
      //       }
      //     });
      //   });
      // });
    },
  };
};
