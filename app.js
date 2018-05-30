var Discord = require('discord.js');

// Create an instance of a Discord client
var client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
var config = require('./config.json');
var token = config.token,
    prefix = config.prefix;

var messagesCancer = require('./rocket-league-rapid-chat.js');

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', function()  {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', function(message) {
  // If the message is "ping"
    console.log('channel', message.channel.name);
    if (message.author.bot || 
        message.channel.name !== 'bot-testing') return
    
    if (message.content === 'tupu') {
        message.channel.send('toi-même ' + message.member);
    }
    if (message.content === `${prefix}server`) {
        message.channel.send(`Nom du serveur : ${message.guild.name}\nNombre de membres: ${message.guild.memberCount}`);
    }
    if (message.content === 'good bot') {
        message.channel.send('merci !');
    }
    if (message.content === 'bad bot') {
        message.channel.send('T_T');
    }
    if (message.content.includes('dark') && message.content.includes('plagueis'))
    {
        message.channel.send("I thought not. It's not a story the Jedi would tell you. It's a Sith legend. Darth Plagueis was a Dark Lord of the Sith, so powerful and so wise he could use the Force to influence the midichlorians to create life… He had such a knowledge of the dark side that he could even keep the ones he cared about from dying. The dark side of the Force is a pathway to many abilities some consider to be unnatural. He became so powerful… the only thing he was afraid of was losing his power, which eventually, of course, he did. Unfortunately, he taught his apprentice everything he knew, then his apprentice killed him in his sleep. Ironic. He could save others from death, but not himself.");
    }

});

client.on('error', function(error) {
    console.log(error);
})

// Log our bot in
client.login(token);