const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const mysql = require("mysql2");

const customId = "wow_create";

module.exports = function (api) {
  return {
    customId,
    async execute(interaction) {
      const username = interaction.fields.getTextInputValue("wow_username");
      const password = interaction.fields.getTextInputValue("wow_password");

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
