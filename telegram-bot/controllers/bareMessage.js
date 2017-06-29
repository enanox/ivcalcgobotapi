const curseWords = require("../words").curseWords;
const messageRegex = require("../config").messageRegex;
const LocalizationHelper = require("../helpers/localization");

class BareMessageCtrl {
    constructor(bot) {
        this.bot = bot;
    }

    responseListener(bot, msg) {
        if (!this.bot) {
            this.bot = bot;
        }
        
        const chatId = msg.chat.id;

        // send a message to the chat acknowledging receipt of their message
        
        if (!msg.text.match(messageRegex.echo) && !msg.text.match(messageRegex.iv) && !msg.text.match(messageRegex.start) && !msg.text.match(messageRegex.support))  {
            this.process(chatId, msg.text);
        }
    }

    process(chatId, msg) {
        let message = msg;
        let curseWordResponse = curseWords.find((word) => {            
            if (word.match && word.match instanceof Array) {
                for (let match of word.match) {
                    if (msg.includes(match)) {
                        return true;
                    }
                }
            } else {
                if (msg.includes(word.match)) {
                    return true;
                }
            }
        });
        
        if (curseWordResponse) {
            message = curseWordResponse.response;
        } else {
            message = LocalizationHelper.translate("bareMessage.received");
        }
        
        if (msg.startsWith("/") && !msg.includes("/echo") && !msg.includes("/start") && !msg.includes("/support")) {
            message = LocalizationHelper.translate("bareMessage.wrong");
        }
        
        this.bot.sendMessage(chatId, message);
    }

    startResponseListener(bot, msg) {
        if (!this.bot) {
            this.bot = bot;
        }
        
        const chatId = msg.chat.id;
        const fromUser = `${msg.from.first_name || "@" + msg.from.username}`;
        
        // send a message to the chat acknowledging receipt of their message
        const welcomeMessage = LocalizationHelper.translate("bareMessage.welcome", [fromUser]);
        this.bot.sendMessage(chatId, welcomeMessage, {parse_mode: "HTML"});
    }

    supportResponseListener(bot, msg) {
        if (!this.bot) {
            this.bot = bot;
        }
        
        const chatId = msg.chat.id;

        // send a message to the chat acknowledging receipt of their message
        const supportMessage = LocalizationHelper.translate("bareMessage.support");
        this.bot.sendMessage(chatId, supportMessage);
    }
}

module.exports = BareMessageCtrl;