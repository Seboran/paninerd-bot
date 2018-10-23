var Discord = require("discord.js");
var Promise = require("bluebird");

var config = require("./config.json");
var token = config.token,
  prefix = config.prefix;

function Bot() {
  this.client = new Discord.Client();
  this.wrongCommand =
    "I don't know this command, send `!help` for more information";
}

/**
 * @param {Object} message The discord message
 * @param {...string} wordTrigger the word that triggers the bot
 * @param {string} response the answer given by the bot
 */
Bot.prototype.answer = function() {
  // We want to check only one word
  if (arguments.length === 3) {
    var message = arguments[0];
    var wordTrigger = arguments[1];
    var response = arguments[2];

    if (message.content !== wordTrigger) return this;

    message.channel.send(response);

    // We want to check multiple words
  } else if (arguments.length > 3) {
    var argumentsCopy = Array.prototype.slice.call(arguments, 0);

    var message = argumentsCopy.shift();
    var response = argumentsCopy.pop();

    var wordTriggers = argumentsCopy;

    // We check if every words left in wordsTriggers are in message
    if (
      wordTriggers.every(function(word) {
        return message.content.includes(word);
      })
    )
      message.channel.send(response);
  }

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
  var args = message.content.slice(prefix.length).split(" ");
  // shift pops the first element
  var receivedCommand = args.shift().toLowerCase();

  // Not the good command
  if (receivedCommand !== command) return this;

  // TODO : send why the command is wrongly used
  // Not the right amount of arguments
  if (args.length !== numberOfArgs) return this;

  next.apply(this, args);
  return this;
};
/**
 * @param {Object} message The discord message
 * @param {string} wordTrigger the word that triggers the bot
 * @param {...string} emojis the answer given by the bot
 */
Bot.prototype.react = function() {
  var argumentsCopy = Array.prototype.slice.call(arguments, 0);
  var message = argumentsCopy.shift();
  var wordTrigger = argumentsCopy.shift();
  if (message.content.includes(wordTrigger)) {
    Promise.each(argumentsCopy, emoji => message.react(emoji)).then(() =>
      console.log("emojied")
    );
  }
};

module.exports = new Bot();
