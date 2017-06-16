const LocalizationHelper = require("../helpers/localization");

const MON_NAME = 1;
const CP_VALUE = 4;
const HP_VALUE = 7;
const STARDUST_VALUE = 10;
const CANDY_VALUE = 13;
const TEAMS = {i: "Instinct", m: "Mystic", v: "Valor"};
const TEAM_YELLOW = 0, TEAM_BLUE = 1; TEAM_RED = 2;

class IVCalculatorCtrl {    
    responseListener(bot, msg, match) {
        if (!this.bot) {
            this.bot = bot;
        }

        const chatId = msg.chat.id;
        // console.log(msg, msg.length);
        // console.log(match);
        
        let formatted = this.beautifyOutput(this.parseInput(match));

        const opts = this.askForTeam(msg);
        bot.sendMessage(chatId, formatted, opts);
    }

    parseInput(match) {
        return {
            mon: match[MON_NAME],
            cp: match[CP_VALUE] || match[CP_VALUE - 2],
            hp: match[HP_VALUE] || match[HP_VALUE - 2],
            stardust: match[STARDUST_VALUE] || match[STARDUST_VALUE - 2],
            candy: match[CANDY_VALUE] || match[CANDY_VALUE - 2]
        };
    }

    beautifyOutput(inputData)  {
        return LocalizationHelper.translate("ivCalculator.beautifiedOutput", Object.values(inputData));
    }

    askForTeam(msg) {
        let keyboardAnswers = [];

        for (let i = 0; i < Object.keys(TEAMS).length; i++) {
            keyboardAnswers.push([{ 
                text: Object.values(TEAMS)[i], 
                callback_data: this.stringifyTeamSelection(Object.keys(TEAMS)[i])
            }]);
        }
        
        return {
            //reply_to_message_id: msg.message_id,
            reply_markup: JSON.stringify({
                inline_keyboard: keyboardAnswers
            })
        };
    }

    stringifyTeamSelection(value) {
        return JSON.stringify({ 
            action: "teamSelection",
            value: value
        });
    }

    processTeamSelectionAnswer(bot, callbackQuery) {
        const data = JSON.parse(callbackQuery.data);
        const msg = callbackQuery.message;
        const opts = {
            chat_id: msg.chat.id,
            message_id: msg.message_id,
        };
        let text;
        
        if (data.action === "teamSelection" && Object.keys(TEAMS).indexOf(data.value) !== -1) {
            text = msg.text + `\n${ TEAMS[data.value] }`;
        }

        return bot.editMessageText(text, opts).then((a) => {
            
        });
    }

    askLeaderValoration() {
        
    }
}

module.exports = IVCalculatorCtrl;