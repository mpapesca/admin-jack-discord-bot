require('dotenv').config();

var express = require('express');
const Discord = require('discord.js');
const DictionaryApi = require('./dictionaryApi');

var app = express();
app.set('port', (process.env.PORT || 5000));

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
    if (msg.content.match(/^!jack\s?/)) {
        var args = msg.content.split(' ');
        if (args.length <= 1) {
            return msg.reply('What do you want!?');
        }


        let response;

        switch (args[1]) {
            case 'define':
                response = await define(args);
                break;
            default:
                response = 'Yea.. IDK what that is.';
        }

        msg.reply(response);

    }
});

client.login(process.env.DISCORD_BOT_TOKEN);

const define = async (args) => {
    let dictionaryApi = new DictionaryApi();
    if (args.length != 3) {
        return 'Close, but IDK what to do with that.';
    }

    var response = await dictionaryApi.getDefinition(args[2]);

    if (response.length <= 0) {
        return `I don\'t think "${args[2]}" is a real word.`;
    }
    var shortDefs = response[0]['shortdef'];

    let definitions = shortDefs.map((def, index) => `${index + 1}: ${def}`);

    return `The definition of "${args[2]}" is:\n>>> ${definitions.join("\n")}.`;
};
