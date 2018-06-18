var Discord = require('discord.js');
var bot = require('./bot');
var rls_api = require('./rl-api');
var db = require('./db');
var fetch = require('node-fetch');

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
var channel;

var channelNews;

client.on('ready', function()  {
  console.log('I am ready!');
  channel = client.channels.get(process.env.CHANNEL_ID);
  channelNews = client.channels.get('426854878552522792');
  channel.send(messagesCancer[Math.floor(Math.random() * messagesCancer.length)])
  .then(function(message) {
      console.log('Sent message ' + message.content);
  })
  .catch(console.error);
  


});

// Create an event listener for messages
db.connect(function() {
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
    
                if (!resultQuery.length) return message.channel.send('You must create an account with the command !create url');
                
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
    
            db.query('INSERT INTO stats_users VALUES (?, ?, ?, 0);', values, function(err, resultQuery) {
    
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
    
        bot.use(message, 'tip', 1, function() {
            
            var member = message.mentions.members.first();
            if (!member) return message.channel.send('Vous devez mentionner une personne présente sur ce discord.');
            console.log('Mentionned member', member.id);

            if (member.id === message.member.id) return message.channel.send('Vous ne pouvez pas donner de point à vous même !');

            // Now we add +1 to this user
            db.query('UPDATE stats_users SET points = points + 1 WHERE id = ?;', [member.id], function(err, resultQuery) {
                
                if (err) return message.channel.send('Something went horribly wrong');

                

                if (resultQuery.affectedRows) {
                    // Get new count
                    db.query('SELECT points FROM stats_users WHERE id = ?;', [member.id], function(err, resultSelect) {

                        if (err) return message.channel.send('Something went horribly wrong');
                        var pluriel = (resultSelect[0].points > 1) ? 's' : '';
                        return message.channel.send('Point internet donné !\n' + member + ' a désormais ***' + resultSelect[0].points + ' point' + pluriel + '*** internet !!!');

                    });
                    
                } else {
                    // Means the player isn't created yet
                    console.log('Create', member.id, member.username)
                    db.query('INSERT INTO stats_users VALUES (?, ?, NULL, ?);', [member.id, member.user.username, 1], function(err, resultCreate) {
                        if (err) return message.channel.send('Something went horribly wrong');

                        return message.channel.send('Point internet donné !\n' + member + ' a désormais ***1 point*** internet !!!');
                    })
                }
            });
    
        });
    
        
    
    });
});


// Send twitch data
setInterval(function() {
    var getData = {
        method: 'GET',
        headers: {
            'Client-ID': '8l0jin92206uapy9vl23zxclgg2x92'
        }   
    };

    fetch('https://api.twitch.tv/helix/streams?user_id=57781936', getData)
    .then(res => res.json())
    .then(resJson => {
        if (resJson.length && resJson[0].type === 'live') return channelNews.send('Rocket League Stream is live on https://www.twitch.tv/rocketleague');
    })
    .catch(err => console.log(err));



}, 3000000);

client.on('error', function(error) {
    console.log(error); 
});

// Log our bot in
client.login(token);