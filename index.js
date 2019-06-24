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
    channel.send(`**USAGE:** ${config.prefix + config.command} ROLEID/ROLENAME USERID/USERMENTION USERID/USERMENTION ...`);
}

// message event, it fires every message it receives
client.on('message', (message) => {
    // if bot, dont respond
    if (message.author.bot) return;

    // command prefix check
    if (message.content.toLowerCase().startsWith(config.prefix)) {

        // command without prefix
        const command = message.content.substring(config.prefix.length);
        
        // args, split by space
        const args = command.split(' ');

        // check if command. first arg is command name
        if (args[0] === config.command) {
            // check if user has permission to run the command
            if (!message.author.hasPermission('MANAGE_ROLES')) {
                return returnError(message.channel, "You don't have the permissions to use this command");
            }

            // check if at least two arguments (3 because commmand name)
            if (args.length < 3) {
                return returnError(message.channel, "Please provide enough arguments");
            }

            // check if argument 1 is role id or role name
            const roles = message.guild.roles;
            let role;
            // if role id is correct. set role variable to the id
            if (roles.get(args[1])) role = args[1];
            // loop through roles. if name corresponds to inputted role. set role variable to the id
            for (let i in roles) {
                if (roles[i].name == args[1]) role = roles[i].id; 
            }
            // check if a role has been found
            if (!role) {
                return returnError(message.channel, "Couldn't find the role. make sure it's typed correctly");
            }

            // check if all other arguments are mentions or user id's
            // loop through arguments starting from the third.
            let users = [];
            for (let i = 2; i < args.length; i++) {
                // test if its a mention
                let IDToTest;
                if (/<@.?[0-9]*?>/g.test(args[i])) {
                    IDToTest = args[i].substring(2).slice(0,-1); // remove first 2 characters and the last one.
                } else {
                    IDToTest = args[i]; // id
                }
                // test if its a user id
                if (message.guild.members.get(IDToTest)) {
                    users.push(IDToTest);
                } else {
                    // user in message wasn't correct.
                    return returnError(message.channel, "Couldn't find the users.");
                }
            }

            // sets temporary role
            return addTemporaryRole(config.time, message.guild.id, 'test', ['test', 'test']);
        }
    }
});

// login the bot with the discord bot token
client.login(config.token);