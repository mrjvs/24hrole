// libs
// import discord
const Discord = require('discord.js');
// make a new bot client
const client = new Discord.Client();

// config
const config = require('config.json');

function setTemporaryRoleTimer(time, guildID, roleID, userIDArray) {
    // set a timeout to remove the role after certain time.
    client.setTimeout(removeTemporaryRole, time, guildID, roleID, userIDArray);
}
function removeTemporaryRole(guildID, roleID, userIDArray) {
    // get discord server from id
    const guild = client.guilds.get(guildID);
    // loop through the users and remove the role from each user.
    for (let userID in userIDArray) {
        guild.members.get(userID).removeRole(roleID);
    }
}
function addTemporaryRole(time, guildID, roleID, userIDArray) {
    // get discord server from id
    const guild = client.guilds.get(guildID);
    // loop through the users and add the role to each user.
    for (let userID in userIDArray) {
        guild.members.get(userID).addRole(roleID);
    }
    // register timer
    setTemporaryRoleTimer(time, guildID, roleID, userIDArray);
}

function returnError(channel, errorText) {
    channel.send(errorText);
    channel.send('HELP TEXT HERE');
}

// message event, it fires every message it receives
client.on('message', (message) => {
    // if bot, dont respond
    if (message.author.bot) return;

    // command prefix check
    if (message.content.toLowerCase().startsWith(config.prefix)) {

        // command without prefix
        const command = message.content.slice(config.prefix.length * -1);
        
        // args, split by space
        const args = command.split(' ');

        // check if command. first arg is command name
        if (args[0] === config.command) {
            // check if user has permission to run the command
            // TODO

            // check if at least two arguments (3 because commmand name)
            if (args.length < 3) {
                return returnError(message.channel, "Please provide enough arguments");
            }

            // check if argument 1 is role id or role name
            // TODO

            // check if all other arguments are mentions or user id's
            // TODO

            // sets temporary role
            addTemporaryRole(config.time, message.guild.id, 'test', ['test', 'test']);
        }
    }
});

// login the bot with the discord bot token
client.login(config.token);