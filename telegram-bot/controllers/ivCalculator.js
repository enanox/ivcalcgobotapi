const LocalizationHelper = require("../helpers/localization");
const FrameworkStats = require("../../api/framework/stats");
const debug = require("../config").debug;

const MON_NAME = 1;
const CP_VALUE = 4;
const HP_VALUE = 7;
const STARDUST_VALUE = 10;
const CANDY_VALUE = 13;
const TEAMS = {i: "Instinct", m: "Mystic", v: "Valor"};
const TEAM_YELLOW = 0, TEAM_BLUE = 1; TEAM_RED = 2;

const store = {
    input: {},
    team: "",
    overall: -1,
    stat: -1,
    individual: -1,
    size: -1,
    storedInitialResponse: ""
};

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

function clearStore() {
    store.input = {};
    store.team = "";
    store.overall = -1;
    store.stat = -1;
    store.individual = -1;
    store.size = -1;
    store.storedInitialResponse = "";
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

        store.input = this.parseInput(match);
        Object.preventExtensions(store.input);

        let formatted = this.beautifyOutput(store.input, language_code);
        
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

        store.team = data.value;        
        debugStore();
        
        return bot.editMessageText(text, opts).then((originalMsg) => {
            const overall = this.askLeaderOverallAppraisal(language_code);
            const prompt = LocalizationHelper.translate(`ivCalculator.overallAppraisalPrompt`, language_code);
            bot.sendMessage(originalMsg.chat.id, prompt, overall);
        });
    }

    askLeaderOverallAppraisal(language_code) {
        debugStore();
        let keyboardAnswers = [];
        let teamKey = store.team;
        let teamOptions = LocalizationHelper.translate(`ivCalculator.leaderAppraisal.${ teamKey }.overallShort`, language_code, [store.input.mon]);

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

        let texts = LocalizationHelper.translate(`ivCalculator.leaderAppraisal.${ store.team }.overall`, language_code, [store.input.mon]);
        let text = texts[data.value];
        store.overall = data.value;        

        debugStore();

        return bot.editMessageText(text, opts).then((originalMsg) => {
            const stat = this.askStat(language_code);
            const prompt = LocalizationHelper.translate(`ivCalculator.statPrompt`, language_code);
            bot.sendMessage(originalMsg.chat.id, prompt, stat);
        });
    }

    askStat(language_code) {
        debugStore();
        let keyboardAnswers = [];
        let teamKey = store.team;
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
        store.stat = data.value;        
        debugStore();

        return bot.editMessageText(text, opts).then((originalMsg) => {
            const individual = this.askLeaderIndividualAppraisal(language_code);
            const prompt = LocalizationHelper.translate(`ivCalculator.individualAppraisalPrompt`, language_code);
            bot.sendMessage(originalMsg.chat.id, prompt, individual);
        });
    }

    askLeaderIndividualAppraisal(language_code) {
        debugStore();
        let keyboardAnswers = [];
        let teamKey = store.team;
        let teamOptions = LocalizationHelper.translate(`ivCalculator.leaderAppraisal.${ teamKey }.individualShort`, language_code, [store.input.mon]);

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

        let texts = LocalizationHelper.translate(`ivCalculator.leaderAppraisal.${ store.team }.individual`, language_code, [store.input.mon]);
        let text = texts[data.value];
        let resultText;
        
        store.individual = data.value;        

        if (data.action === "individualAppraisal") {
            let calculations = FrameworkStats.calculate(store);
            resultText = LocalizationHelper.translate(`ivCalculator.result`, language_code, 
                [calculations.mon, calculations.IVs.ratio, calculations.IVs.statIVs.atk, calculations.IVs.statIVs.def, calculations.IVs.statIVs.sta]);
        }

        debugStore();
        return bot.editMessageText(text, opts).then((originalMsg) => {
            clearStore();
            bot.sendMessage(originalMsg.chat.id, resultText, {
                parse_mode: "Markdown"
            });
        });
    }
}

module.exports = IVCalculatorCtrl;