var Discord = require('discord.js');

var bot = require('./bot');
var db = require('./db');

// Create an instance of a Discord client
var client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me

// This is most likely to crash if you do not have the config file
var config = require('./config.json');

var token = config.token,
    prefix = config.prefix;

var messagesCancer = require('./rocket-league-rapid-chat.js');

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', function()  {
  console.log('I am ready!');
  var channel = client.channels.get('451430959116582936');
  channel.send(messagesCancer[Math.floor(Math.random() * messagesCancer.length)])
  .then(function(message) {
      console.log('Sent message ' + message.content);
  })
  .catch(console.error);
});

// Create an event listener for messages
client.on('message', function(message) {
    
    if (message.channel.name !== 'bot-testing' || message.author.bot) return;

    bot.answer(message.content === 'ping', function() {
        message.channel.send('pong ' + message.member);
    })
    .answer(message.content === `${prefix}server`, function() {
        
        message.channel.send(`Nom du serveur : ${message.guild.name}\nNombre de membres: ${message.guild.memberCount}`);

    })
    .answer(message.content.includes('good') && message.content.includes('bot'), function() {
        message.channel.send('Thanks !');
    })
    .answer(message.content.includes('bad') && message.content.includes('bot'), function() {
        message.channel.send('La critique est aisée mais l\'art est difficile');
    })
    .answer(message.content.includes('dark') && message.content.includes('plagueis'), function() {
        message.channel.send("I thought not. It's not a story the Jedi would tell you. It's a Sith legend. Darth Plagueis was a Dark Lord of the Sith, so powerful and so wise he could use the Force to influence the midichlorians to create life… He had such a knowledge of the dark side that he could even keep the ones he cared about from dying. The dark side of the Force is a pathway to many abilities some consider to be unnatural. He became so powerful… the only thing he was afraid of was losing his power, which eventually, of course, he did. Unfortunately, he taught his apprentice everything he knew, then his apprentice killed him in his sleep. Ironic. He could save others from death, but not himself.");
    });

    // !stats
    bot.use(message, 'stats', 0, function() {
        var author = message.member;
        console.log(author.user.username);
        // Checks database

        db.query('SELECT urlStats FROM stats_users WHERE id = ?;', [message.author.id], function(err, resultQuery) {
            if (err) return console.log(err);

            if (!resultQuery) return message.channel.send('You must create an account with the command !create url');
            
            var user = resultQuery[0];
            console.log(user);
            return message.channel.send('Statistiques de ' + message.member +'\n' + user.urlStats);

        });

    });
    

    // create
    bot.use(message, 'create', 1, function(url) {

        // Insert value into database
        // id, username, url
        var values = [message.author.id, message.member.user.username, url];
        console.log('value', message.author.id);

        db.query('INSERT INTO stats_users VALUES (?, ?, ?);', values, function(err, resultQuery) {

            // If error (like user non existing)
            if (err) return message.channel.send('User already created, try \`!update\` \`url\`');

            // Everything when fine
            message.channel.send('User created ! You can write \'!stats to see your URL later');
        });
        
    });
    

    // update
    bot.use(message, 'update', 1, function(url) {

        // update value
        var values = [url, message.author.id];
        db.query('UPDATE stats_users SET urlStats = ? WHERE id = ?;', values, function(err, resultQuery) {

            // If error
            if(err) return console.log(err);

            // If user found
            if (resultQuery.affectedRows) return message.channel.send('Url updated !');

            // If user not found
            return message.channel.send('User not found ! Please try \`!create\` \`url\`');
            
        });
        

    });

});

client.on('error', function(error) {
    console.log(error);
});

// Log our bot in
client.login(token);