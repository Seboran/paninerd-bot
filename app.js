var Discord = require('discord.js');
var bot = require('./bot');
var rls_api = require('./rl-api');
var db = require('./db');

// Create an instance of a Discord client
var client = new Discord.Client();



// The token of your bot - https://discordapp.com/developers/applications/me

// This is most likely to crash if you do not have the config file
var config = require('./config.json');

var token = process.env.TOKEN,
    prefix = config.prefix;

var messagesCancer = require('./rocket-league-rapid-chat.js');

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

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
    console.log('received message', message.content);

    if (message.author.bot) return;

    bot.use(message, 'salt', 0, function() {
        var cancerMessage = randomElement(messagesCancer);
        for(var i = 0; i < 3; i++) {
            message.channel.send(cancerMessage);
        }
        message.channel.send('Chat disabled for 1 second');
        
    });

    // !stats
    bot.use(message, 'stats', 0, function() {
        var author = message.member;
        
        // Checks database

        db.query('SELECT urlStats FROM stats_users WHERE id = ?;', [message.author.id], function(err, resultQuery) {
            if (err) return console.log(err);

            if (!resultQuery) return message.channel.send('You must create an account with the command !create url');
            
            var user = resultQuery[0];
            console.log(user);
            rls_api.getPlayer(user.urlStats, function(data) {
                if (data) {
                    console.log('data info', data);
                    // Extract season data
                    
                    return message.channel.send('Statistiques de ' + message.member, {files: [data.signatureUrl]});
                    
                }
                return message.channel.send('You must create an account with the command !create url');
            });
            

        });

    });
    
    

    bot.answer(message, 'ping', 'pong ' + message.member);

    bot.answer(message, `${prefix}server`, `Nom du serveur : ${message.guild.name}\nNombre de membres: ${message.guild.memberCount}`);
    bot.answer(message, 'good', 'bot', 'Thanks');
    bot.answer(message, 'bad', 'bot', 'La critique est aisée mais l\'art est difficile');
    bot.answer(message, 'dark', 'plagueis', "I thought not. It's not a story the Jedi would tell you. It's a Sith legend. Darth Plagueis was a Dark Lord of the Sith, so powerful and so wise he could use the Force to influence the midichlorians to create life… He had such a knowledge of the dark side that he could even keep the ones he cared about from dying. The dark side of the Force is a pathway to many abilities some consider to be unnatural. He became so powerful… the only thing he was afraid of was losing his power, which eventually, of course, he did. Unfortunately, he taught his apprentice everything he knew, then his apprentice killed him in his sleep. Ironic. He could save others from death, but not himself.");
    
    
    

    // create
    bot.use(message, 'create', 1, function(url) {

        // Insert value into database
        // id, username, url
        var values = [message.author.id, message.member.user.username, url];

        db.query('INSERT INTO stats_users VALUES (?, ?, ?);', values, function(err, resultQuery) {

            // If error (like user non existing)
            if (err) return message.channel.send('User already created, try \`!update\` \`url\`');

            // Everything went fine
            message.channel.send('User created ! You can write `!stats` to see your URL later');
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
            if (resultQuery.affectedRows) return message.channel.send('Url updated ! Try the command `!stats`');

            // If user not found
            return message.channel.send('User not found ! Please try \`!create\` \`url\`');
            
        });
        

    });


    bot.use(message, 'help', 0, function() {
        message.channel.send(
            'Le robot paninerd possède les fonctionnalités suivantes :\n' +
            '`!create player-id` permet au bot de savoir où trouver ses stats. Tu peux trouver ton `player-id` sur <https://rocketleaguestats.com/>\n' +
            '`!update player-id` te permet de modifier ton player-id\n' +
            '`!stats` te permet de voir tes stats'
        );
    });

    

});

client.on('error', function(error) {
    console.log(error);
});

// Log our bot in
client.login(token);