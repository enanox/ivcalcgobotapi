const curseWords = require("../words").curseWords;
const messageRegex = require("../config").messageRegex;

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
        
        if (!msg.text.match(messageRegex.echo) && !msg.text.match(messageRegex.iv))  {
            this.process(chatId, msg.text);
        }
    }

    process(chatId, msg) {
        let message = msg;
        let curseWordResponse = curseWords.find((word) => {            
            if (word.match && word.match.length) {
                for (let match of word.match) {
                    if (msg.includes(match)) {
                        return true;
                    }
                }
            }
        });
        
        if (curseWordResponse) {
            message = curseWordResponse.response;
        } else {
            message = "Received your message";
        }
        
        if (msg.startsWith("/")) {
            message = "Wrong command input";
        }
        
        this.bot.sendMessage(chatId, message);
    }
}

module.exports = BareMessageCtrl;