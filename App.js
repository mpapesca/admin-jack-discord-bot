require('dotenv').config();

var express = require('express');
const Discord = require('discord.js');
const DictionaryApi = require('./dictionaryApi');

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

        const actionName = args[1];

        var command = commands.find(c => {
            return c.action.name == actionName;
        });

        let response;

        if (command) {
            const actionArgs = args.slice(2);
            // NOTE: This requires all actions to be async.
            response = await command.action(...actionArgs);
        } else {
            response = 'Yea.. IDK what that is.';
        }

        msg.reply(response);

    }
});

client.login(process.env.DISCORD_BOT_TOKEN);

const getFunctionArgs = (func) => {
    var args = func.toString().match(/async\s.*?\(([^)]*)\)/)[1].replace(' ', '').split(',');
    return args;
};

// Get help info.
const help = async () => {

    const formattedCommands = commands.map(c => {

        let actionArgs = getFunctionArgs(c.action);
        let actionArgsString = actionArgs.length <= 0 ? '' : ` ${actionArgs.map(a => `<${a}>`).join(' ')}`;

        return `>   **${c.action.name}**: \`!jack ${c.action.name}${actionArgsString}\`\n>   ${c.description}`;

    }).join("\n> \n");

    return `Here is what I can do so far...\n${formattedCommands}`;
};

// Get the definition for the word.
const define = async (word) => {

    let dictionaryApi = new DictionaryApi();

    var response = await dictionaryApi.getDefinition(word);

    if (response.length <= 0) {
        return `I don\'t think "${word}" is a real word.`;
    }
    var shortDefs = response[0]['shortdef'];

    let definitions = shortDefs.map((def, index) => `${index + 1}: ${def}`);

    return `The definition of ${test} "${word}" is:\n>>> ${definitions.join("\n")}.`;
};

// Get synonyms for the word.
const synonyms = async (word, count) => {

    count = count == null ? 10 : count;

    let dictionaryApi = new DictionaryApi();

    var response = await dictionaryApi.getSynonyms(word);

    if (response.length <= 0) {
        return `I don\'t think "${word}" is a real word.`;
    }

    if (!response[0]['meta']) {
        return `I couldn't find that word. Did you mean one these?\n> ${response.slice(0, 3).join(', ')}`;
    }

    var synonymArrays = response[0]['meta']['syns'];

    var syns = synonymArrays[0].concat(...(synonymArrays.slice(1)));

    let answer;

    if (syns.length >= count) {
        answer = `Here are ${count} synonyms for ${word}:`;
    } else {
        count = syns.length;
        answer = `We could only find ${count} synonyms for ${word}:`;
    }

    let randos = [];
    while (randos.length < count) {
        let index = Math.floor(Math.random() * syns.length);
        if (randos.indexOf(index) == -1) {
            randos.push(index);
        }
    }

    let chosenSyns = randos.map(r => syns[r]);
    answer += `\n> ${chosenSyns.join(', ')}`;
    return answer;
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
