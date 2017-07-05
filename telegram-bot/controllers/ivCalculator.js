const LocalizationHelper = require("../helpers/localization");
const FrameworkStats = require("../../api/framework/stats");
const ClientStore = require("../../api/models/clientStore");
const debug = require("../config").debug;

const MON_NAME = 1;
const CP_VALUE = 4;
const HP_VALUE = 7;
const STARDUST_VALUE = 10;
const CANDY_VALUE = 13;
const TEAMS = {i: "Instinct", m: "Mystic", v: "Valor"};
const TEAM_YELLOW = 0, TEAM_BLUE = 1; TEAM_RED = 2;

// ToDo: add Redux store
/* @type ClientStore[] */
const store = [];

const orientationTeam = "sideBySide";
const orientationAppraisal = "rows";
const orientationStat = "sideBySide";

function debugStore() {
    if (debug) {
        console.log("-----------------");
        console.info(store);
        console.log("-----------------");
    }
}

function clearStore(storeIndex) {
    if (!storeIndex) {
        store.splice(0, store.length);
    } else {
        store[storeIndex].input = {};
        store[storeIndex].team = "";
        store[storeIndex].overall = -1;
        store[storeIndex].stat = -1;
        store[storeIndex].individual = -1;
        store[storeIndex].size = -1;
        store[storeIndex].storedInitialResponse = "";
    }
}

class IVCalculatorCtrl {        
    responseListener(bot, msg, match) {
        if (!this.bot) {
            this.bot = bot;
        }

        const chatId = msg.chat.id;
        const language_code = LocalizationHelper.parseLanguageCode(msg.from.language_code);

        if (debug) {
            console.log(msg);
        }

        const input = this.parseInput(match);
        Object.preventExtensions(input);
        
        store.push(new ClientStore(chatId, input));

        let formatted = this.beautifyOutput(input, language_code);
        
        const opts = this.askForTeam(msg);
        debugStore();
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

    beautifyOutput(inputData, language_code)  {
        return LocalizationHelper.translate("ivCalculator.beautifiedOutput", language_code, Object.values(inputData));
    }

    askForTeam(msg) {
        let keyboardAnswers = [];

        for (let i = 0; i < Object.keys(TEAMS).length; i++) {
            let position = Math.floor(i / 2);
            let keyboardOption = this.createKeyboardOptionSchema(Object.values(TEAMS)[i], this.stringifySelection("teamSelection", Object.keys(TEAMS)[i]));

            if (orientationTeam === "sideBySide") {
                if (i % 2 === 0) {
                    keyboardAnswers[position] = [];
                }

                keyboardAnswers[position].push(keyboardOption);
            } else {
                keyboardAnswers.push([keyboardOption]);
            }
        }
        
        return {
            //reply_to_message_id: msg.message_id,
            reply_markup: JSON.stringify({
                inline_keyboard: keyboardAnswers
            }),
            parse_mode: "Markdown"
        };
    }

    createKeyboardOptionSchema(option, callbackData) {
        return {
            text: option,
            callback_data: callbackData
        };
    }

    stringifySelection(key, value) {
        return JSON.stringify({
            action: key,
            value: value
        });
    }

    processTeamSelectionAnswer(bot, callbackQuery) {
        const data = JSON.parse(callbackQuery.data);
        const msg = callbackQuery.message;
        const language_code = LocalizationHelper.parseLanguageCode(callbackQuery.from.language_code);
        const opts = {
            chat_id: msg.chat.id,
            message_id: msg.message_id,
            parse_mode: "Markdown"
        };
        
        if (debug) {
            console.log(`First message`, msg);
        }

        let text;
        
        if (data.action === "teamSelection" && Object.keys(TEAMS).indexOf(data.value) !== -1) {
            text = `*${ TEAMS[data.value] }*`;
        }

        const storeIndex = store.findIndex((item) => item.chat_id === msg.chat.id);
        if (storeIndex > -1) {
            store[storeIndex].team = data.value;        
            debugStore();
        }
        
        return bot.editMessageText(text, opts).then((originalMsg) => {
            const overall = this.askLeaderOverallAppraisal(language_code, storeIndex);
            const prompt = LocalizationHelper.translate(`ivCalculator.overallAppraisalPrompt`, language_code);
            bot.sendMessage(originalMsg.chat.id, prompt, overall);
        });
    }

    askLeaderOverallAppraisal(language_code, storeIndex) {
        debugStore();
        let keyboardAnswers = [];
        let teamKey = store[storeIndex].team;
        let teamOptions = LocalizationHelper.translate(`ivCalculator.leaderAppraisal.${ teamKey }.overallShort`, language_code, [store[storeIndex].input.mon]);

        for (let i = 0; i < teamOptions.length; i++) {
            let position = Math.floor(i / 2);
            let keyboardOption = this.createKeyboardOptionSchema(teamOptions[i], this.stringifySelection("overallAppraisal", i));

            if (orientationAppraisal === "sideBySide") {
                if (i % 2 === 0) {
                    keyboardAnswers[position] = [];
                }

                keyboardAnswers[position].push(keyboardOption);
            } else {
                keyboardAnswers.push([keyboardOption]);
            }   
        }
        
        return {
            //reply_to_message_id: msg.message_id,
            reply_markup: JSON.stringify({
                inline_keyboard: keyboardAnswers
            })
        };
    }

    processOverallAppraisalAnswer(bot, callbackQuery) {
        const data = JSON.parse(callbackQuery.data);
        const msg = callbackQuery.message;
        const language_code = LocalizationHelper.parseLanguageCode(callbackQuery.from.language_code);
        const opts = {
            chat_id: msg.chat.id,
            message_id: msg.message_id,
            parse_mode: "Markdown"
        };

        const storeIndex = store.findIndex((item) => item.chat_id === msg.chat.id);
        let texts = LocalizationHelper.translate(`ivCalculator.leaderAppraisal.${ store[storeIndex].team }.overall`, language_code, [store[storeIndex].input.mon]);
        let text = texts[data.value];
        
        if (storeIndex > -1) {
            store[storeIndex].overall = data.value;        
            debugStore();
        }

        return bot.editMessageText(text, opts).then((originalMsg) => {
            const stat = this.askStat(language_code, storeIndex);
            const prompt = LocalizationHelper.translate(`ivCalculator.statPrompt`, language_code);
            bot.sendMessage(originalMsg.chat.id, prompt, stat);
        });
    }

    askStat(language_code, storeIndex) {
        debugStore();
        let keyboardAnswers = [];
        let teamKey = store[storeIndex].team;
        let teamOptions = LocalizationHelper.translate(`ivCalculator.statCalculation`, language_code);

        for (let i = 0; i < teamOptions.length; i++) {
            let position = Math.floor(i / 3);
            let keyboardOption = this.createKeyboardOptionSchema(teamOptions[i], this.stringifySelection("statCalculation", i));
            
            if (orientationStat === "sideBySide") {
                if (i % 3 === 0) {
                    keyboardAnswers[position] = [];
                }

                keyboardAnswers[position].push(keyboardOption);
            } else {
                keyboardAnswers.push([keyboardOption]);
            }
        }
        
        return {
            //reply_to_message_id: msg.message_id,
            reply_markup: JSON.stringify({
                inline_keyboard: keyboardAnswers
            })
        };
    }

    processStatAnswer(bot, callbackQuery) {
        const data = JSON.parse(callbackQuery.data);
        const msg = callbackQuery.message;
        const language_code = LocalizationHelper.parseLanguageCode(callbackQuery.from.language_code);
        const opts = {
            chat_id: msg.chat.id,
            message_id: msg.message_id,
            parse_mode: "Markdown"
        };

        let stat = LocalizationHelper.translate(`ivCalculator.statCalculation`, language_code)[data.value];
        let text = LocalizationHelper.translate(`ivCalculator.bestStat`, language_code, [stat]);
        const storeIndex = store.findIndex((item) => item.chat_id === msg.chat.id);
        
        if (storeIndex > -1) {
            store[storeIndex].stat = data.value;        
            debugStore();
        }

        return bot.editMessageText(text, opts).then((originalMsg) => {
            const individual = this.askLeaderIndividualAppraisal(language_code, storeIndex);
            const prompt = LocalizationHelper.translate(`ivCalculator.individualAppraisalPrompt`, language_code);
            bot.sendMessage(originalMsg.chat.id, prompt, individual);
        });
    }

    askLeaderIndividualAppraisal(language_code, storeIndex) {
        debugStore();
        let keyboardAnswers = [];
        let teamKey = store[storeIndex].team;
        let teamOptions = LocalizationHelper.translate(`ivCalculator.leaderAppraisal.${ teamKey }.individualShort`, language_code, [store[storeIndex].input.mon]);

        for (let i = 0; i < teamOptions.length; i++) {
            let position = Math.floor(i / 2);
            let keyboardOption = this.createKeyboardOptionSchema(teamOptions[i], this.stringifySelection("individualAppraisal", i));
            
            if (orientationAppraisal === "sideBySide") {
                if (i % 2 === 0) {
                    keyboardAnswers[position] = [];
                }

                keyboardAnswers[position].push(keyboardOption);
            } else {
                keyboardAnswers.push([keyboardOption]);
            }
        }
        
        return {
            //reply_to_message_id: msg.message_id,
            reply_markup: JSON.stringify({
                inline_keyboard: keyboardAnswers
            })
        };
    }

    processIndividualAppraisalAnswer(bot, callbackQuery) {
        const data = JSON.parse(callbackQuery.data);
        const msg = callbackQuery.message;
        const language_code = LocalizationHelper.parseLanguageCode(callbackQuery.from.language_code);
        const opts = {
            chat_id: msg.chat.id,
            message_id: msg.message_id,
            parse_mode: "Markdown"
        };

        const storeIndex = store.findIndex((item) => item.chat_id === msg.chat.id);
        let texts = LocalizationHelper.translate(`ivCalculator.leaderAppraisal.${ store[storeIndex].team }.individual`, language_code, [store[storeIndex].input.mon]);
        let text = texts[data.value];
        let resultText;
        
        if (storeIndex > -1) {
            store[storeIndex].individual = data.value;        
            debugStore();
        }

        if (data.action === "individualAppraisal") {
            let calculations = FrameworkStats.calculate(store[storeIndex]);
            resultText = LocalizationHelper.translate(`ivCalculator.result`, language_code, 
                [calculations.mon, calculations.IVs.ratio, calculations.IVs.statIVs.atk, calculations.IVs.statIVs.def, calculations.IVs.statIVs.sta]);
        }

        debugStore();
        return bot.editMessageText(text, opts).then((originalMsg) => {
            clearStore(storeIndex);
            bot.sendMessage(originalMsg.chat.id, resultText, {
                parse_mode: "Markdown"
            });
        });
    }
}

module.exports = IVCalculatorCtrl;