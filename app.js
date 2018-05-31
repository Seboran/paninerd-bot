var Discord = require('discord.js');

var bot = require('./bot');
var db = require('./db');

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
  var channel = client.channels.get('451430959116582936');
  channel.send(messagesCancer[Math.floor(Math.random() * messagesCancer.length)])
  .then(function(message) {
      console.log('Sent message ' + message.content);
  })
  .catch(console.error);
});

// Create an event listener for messages
client.on('message', function(message) {
  // If the message is "ping"
    console.log('channel', message.channel.name);
    if (message.author.bot) return;
    if(message.channel.name === 'bot-testing') {
        // !stats
        if (!message.content.startsWith(prefix)) return;
        var args = message.content.slice(prefix.length).split(' ');
        var command = args.shift().toLowerCase();
        if(command === 'stats') {
            var author = message.member;
            console.log(author.user.username);
            // Checks database
            db.connect(function (err) {
                if (err) return console.log(err);
                // Get URL
                db.get().query('SELECT urlStats FROM stats_users WHERE id = ?;', [message.author.id], function(err, resultQuery) {
                    if (err) return console.log(err);
                    if (!resultQuery) {
                        return message.channel.send('You must create an account with the command !create url');
                    }
                    var user = resultQuery[0];
                    console.log(user);
                    return message.channel.send('Statistiques de ' + message.member +'\n' + user.urlStats);
                });
            });
        }
        if (command === 'create') {
            // Add an user
            if (!args.length) {
                return message.channel.send('You must send your stats url');
            }
            db.connect(function(err) {
                if (err) return console.log(err);
                // id, username, url
                var values = [message.author.id, message.member.user.username, args[0]];
                console.log('value', message.author.id);
                db.get().query('INSERT INTO stats_users VALUES (?, ?, ?);', values, function(err, resultQuery) {
                    if (err) {
                        console.log(err);
                        return message.channeld.send('User already created, try !update url');
                    }
                    message.channel.send('User created ! You can write \'!stats to see your URL later');
                });
            });
        }
        if (command === 'update') {
            // Update an user
            if (!args.length) return message.channel.send('You must send an url');
            db.connect(function(err) {
                if (err) return console.log(err);
                var values = [args[0], message.author.id];
                db.get().query('UPDATE stats_users SET urlStats = ? WHERE id = ?;', values, function(err, resultQuery) {
                    if(err) return console.log(err);
                    if (resultQuery.affectedRows) return message.channel.send('Url updated !');
                    return message.channel.send('User not found ! Please try \`!create\` url');
                    
                });
            });
        }
        
    }
    
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
});

// Log our bot in
client.login(token);