var Discord = require('discord.js');

var config = require('./config.json');
var token = config.token,
    prefix = config.prefix;

function Bot() {
    this.client = new Discord.Client();
    this.wrongCommand = 'I don\'t know this command, send \`!help\` for more information';
}

/**
 * @param {function(): boolean | boolean} condition the condition to execute
 * @param {function(): void} next what to do
 */
Bot.prototype.answer = function(condition, next) {

    // If condition then next

    var result;
    // Multi check
    if (typeof(condition) === 'function') result = condition();
    if (typeof(condition) === 'boolean') result = condition;

    if (!result) return this;
    next();
    return this;
};
/**
 * @param {Object} message the received message
 * @param {string} command the command to check
 * @param {number} numberOfArgs the number of arguments
 * @param {function : void} next what to do
 */

Bot.prototype.use = function(message, command, numberOfArgs, next) {
    // Tests if the command starts with a prefix
    if (!message.content.startsWith(prefix)) return this;

    // Splits the input into words
    var args = message.content.slice(prefix.length).split(' ');
    // shift pops the first element
    var receivedCommand = args.shift().toLowerCase();



    // Not the good command
    if(receivedCommand !== command) return this;

    // TODO : send why the command is wrongly used
    // Not the right amount of arguments
    if (args.length !== numberOfArgs) return this;

    next.apply(this, args);
    return this;
    

    
};

module.exports = (new Bot());