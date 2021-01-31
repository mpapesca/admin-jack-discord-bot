require('dotenv').config();

var express = require('express');
const Discord = require('discord.js');

var app = express();
app.set('port', (process.env.PORT || 5000));

const adminJackCommand = /^!jack\s?/;

//For avoidong Heroku $PORT error
app.get('/', function (request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function () {
    console.log('App is running, server is listening on port ', app.get('port'));
});

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {

    // Commands should be preceded with !jack.
    if (msg.content.match(adminJackCommand)) {

        var args = msg.content.split(' ');

        if (args.length <= 1) {
            return msg.reply('What do you want!?');
        }

        let [bot, actionName, ...actionArgs] = args;

        var command = commands.find(c => {
            return c.action.name == actionName;
        });

        let response;

        if (command) {
            // NOTE: This requires all actions to be async.
            response = await command.action(...actionArgs);
        } else {
            response = 'Yea.. IDK what that is.';
        }

        msg.reply(response);

    }
});

client.login(process.env.DISCORD_BOT_TOKEN);

// Require actions
const define = require('./actions/define');
const synonyms = require('./actions/synonyms');

const getFunctionArgs = (func) => {
    var args = func.toString().match(/async\s.*?\(([^)]*)\)/)[1].replace(' ', '').split(',');
    return args;
};

// Get help info.
const help = async () => {

    const formattedCommands = commands.map(c => {

        let actionArgs = getFunctionArgs(c.action).filter(a => a != '');
        let actionArgsString = actionArgs.length <= 0 ? '' : ` ${actionArgs.map(a => `<${a}>`).join(' ')}`;

        return `>   **${c.action.name}**: \`!jack ${c.action.name}${actionArgsString}\`\n>   ${c.description}`;

    }).join("\n> \n");

    return `Here is what I can do so far...\n${formattedCommands}`;
};


const commands = [
    {
        action: help,
        description: 'Returns all commands and how to use them.'
    },
    {
        action: define,
        description: 'Returns the definition of the requested word.'
    },
    {
        action: synonyms,
        description: 'Returns synonyms of the requested word.'
    }
];




