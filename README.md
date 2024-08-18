# Project Status: Reviving

Note: This repository is now actively maintained by Zapto.

## Bot startup

Info: This bot uses Discord ID and stores it into the SQL database auth => account => reg_mail

This way it verifies if the user is trying to use his own account created using the bot

Requirements:

- NodeJS (Tested with v20.16.0)
- Modules (Use installation to install them)
- SOAP enabled on your TrinityCore server
- a GM account to use with SOAP
- Access to the database
- Discord Account with a bot account for bot token

Installation:

    git clone https://github.com/ZaptoInc/TrinityCoreDiscordBot
    cd trinitycorediscordbot
    cp example.env .env
    nano .env
    npm install
    npm run deploy

- Change all the .env config for your needs

Startup:

    npm run start

Updating:

    git pull
    npm install
    npm install
    npm run deploy

- Please check example.env if new variables are needed to be filled

Extra information:

- Original project by XanderDeLaet called AzerothCoreDiscordBot
- Special thanks to Village#9461 (no github) for funding the original project.
- Thanks to Olinux68 for the idea + Trinity Core server to test and run the bot.
