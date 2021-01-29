require('dotenv').config();
var express = require('express');
const Discord = require('discord.js');

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

client.on('message', msg => {
    console.log({ msg });
    if (msg.content === 'ping') {
        msg.reply('Fuck of Jack!');
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
