const curseWords = require("../words").curseWords;
const messageRegex = require("../config").messageRegex;
const LocalizationHelper = require("../helpers/localization");

class BareMessageCtrl {
    constructor(bot) {
        this.bot = bot;
    }

    responseListener(bot, botan, msg) {
        if (!this.bot) {
            this.bot = bot;
        }
        
        const chatId = msg.chat.id;

        // send a message to the chat acknowledging receipt of their message
        
        if (!msg.text.match(messageRegex.echo) && !msg.text.match(messageRegex.iv) && !msg.text.match(messageRegex.start) && !msg.text.match(messageRegex.support))  {
            this.process(botan, chatId, msg);
        }
    }

    process(botan, chatId, msg) {
        let message = msg.text;
        let language_code = LocalizationHelper.parseLanguageCode(msg.from.language_code);
        let curseWordResponse = curseWords.find((word) => {            
            if (word.match && word.match instanceof Array) {
                for (let match of word.match) {
                    if (message && message.includes(match)) {
                        return true;
                    }
                }
            } else {
                if (message.includes(word.match)) {
                    return true;
                }
            }
        });

        if (curseWordResponse) {
            message = curseWordResponse.response;
        } else {
            message = LocalizationHelper.translate("bareMessage.received", language_code);
        }

        if (message.startsWith("/") && !message.includes("/echo") && !message.includes("/start") && !message.includes("/support")) {
            message = LocalizationHelper.translate("bareMessage.wrong", language_code);
        }
        
        botan.track(msg, "any");
        this.bot.sendMessage(chatId, message);
    }

    startResponseListener(bot, botan, msg) {
        if (!this.bot) {
            this.bot = bot;
        }
        let language_code = LocalizationHelper.parseLanguageCode(msg.from.language_code);
        const chatId = msg.chat.id;
        const fromUser = `${msg.from.first_name || "@" + msg.from.username}`;
        const welcomeMessage = LocalizationHelper.translate("bareMessage.welcome", language_code, [fromUser]);
        
        botan.track(msg, "/start");
        this.bot.sendMessage(chatId, welcomeMessage, {parse_mode: "HTML"});
    }

    supportResponseListener(bot, botan, msg) {
        if (!this.bot) {
            this.bot = bot;
        }
        let language_code = LocalizationHelper.parseLanguageCode(msg.from.language_code);
        const chatId = msg.chat.id;
        const supportMessage = LocalizationHelper.translate("bareMessage.support", language_code);

        botan.track(msg, "/support");
        this.bot.sendMessage(chatId, supportMessage);
    }
}

module.exports = BareMessageCtrl;