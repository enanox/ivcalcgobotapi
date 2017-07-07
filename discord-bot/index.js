const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const path = require("path");

let token = process.env.IVCalcGoBotTokenDiscord;

if (!token) {
    try {
        token = fs.readFileSync(path.resolve("./discord-bot/config/token")).toString();
    } catch (e) {
        throw "Missing token file. Load the IVCalcGoBotTokenDiscord environment variable or add a file text.";
    }
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {  
  if (msg.content === 'ping') {
    msg.react("👏");
    msg.reply('Pong! :thumbsup:');
  }
});

client.login(token);
