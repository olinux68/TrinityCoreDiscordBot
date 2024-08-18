# Project Status: Reviving

Note: This repository is now actively maintained by Zapto.

## Bot startup

Info: This bot uses Discord ID and stores it into the SQL database auth => account => reg_mail

This way it verifies if the user is trying to use his own account created using the bot

Requirements:

    - NodeJS (Tested with v20.16.0)
    - Modules (Use installation to install them)
    - Discord Account with a bot account for bot token

Installation:

    - Run "npm install", this will install all dependencies
    - Rename "example.env" to ".env" and insert all your information: token, usernames, passwords, ...
    - Make sure your TrinityCore server has enabled SOAP.

Startup:

    - Use a terminal
    - run the commands :
    - npm install
    - npm run deploy
    - npm run start

Extra information:

    - Special thanks to Village#9461 (no github) for funding the project.
    - Original project by XanderDeLaet called AzerothCoreDiscordBot
