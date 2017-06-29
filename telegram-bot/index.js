const fs = require("fs"),
      path = require("path");
const TelegramBot = require('node-telegram-bot-api');
const config = require("./config");
const messageRegex = config.messageRegex;
const BareMessageCtrl = require("./controllers/bareMessage");
const IVCalculatorCtrl = require("./controllers/ivCalculator");

// replace the value below with the Telegram token you receive from @BotFather
let token = process.env.IVCalcGoBotToken;

if (!token) {
    try {
        token = fs.readFileSync(path.resolve("./telegram-bot/config/token"));
    } catch (e) {
        throw "Missing token file. Load the IVCalcGoBotToken environment variable or add a file text.";
    }
}

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(messageRegex.echo, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];

  bot.sendMessage(chatId, resp);
});

// Matches "/iv <name> [cp:]<number> [hp:]<number> [s:]<number> [c:]<number>"
// [optional]
bot.onText(messageRegex.iv, (msg, match) => new IVCalculatorCtrl().responseListener(bot, msg, match));

bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  const action = JSON.parse(callbackQuery.data);
  const msg = callbackQuery.message;
  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
  };
  
  switch(action.action) {
    case "teamSelection":
      new IVCalculatorCtrl().processTeamSelectionAnswer(bot, callbackQuery);
      break;
    case "overallAppraisal":
      new IVCalculatorCtrl().processOverallAppraisalAnswer(bot, callbackQuery);
      break;
    case "statCalculation":
      new IVCalculatorCtrl().processStatAnswer(bot, callbackQuery);
      break;
    case "individualAppraisal":
      new IVCalculatorCtrl().processIndividualAppraisalAnswer(bot, callbackQuery);
      break;
  }
});

bot.onText(messageRegex.start, (msg, match) => new BareMessageCtrl().startResponseListener(bot, msg));
bot.onText(messageRegex.support, (msg, match) => new BareMessageCtrl().supportResponseListener(bot, msg));

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => new BareMessageCtrl().responseListener(bot, msg));
