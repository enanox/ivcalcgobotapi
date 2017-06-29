const LocalizationHelper = require("../helpers/localization");
const FrameworkStats = require("../../api/framework/stats");

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

const debug = false;
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

class IVCalculatorCtrl {        
    responseListener(bot, msg, match) {
        if (!this.bot) {
            this.bot = bot;
        }

        const chatId = msg.chat.id;
        
        store.input = this.parseInput(match);
        Object.preventExtensions(store.input);

        let formatted = this.beautifyOutput(store.input);

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

    beautifyOutput(inputData)  {
        return LocalizationHelper.translate("ivCalculator.beautifiedOutput", Object.values(inputData));
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
        const opts = {
            chat_id: msg.chat.id,
            message_id: msg.message_id,
            parse_mode: "Markdown"
        };
        let text;
        
        if (data.action === "teamSelection" && Object.keys(TEAMS).indexOf(data.value) !== -1) {
            text = `${ msg.text.replace(store.input.mon, "*" + store.input.mon + "*") } *${ TEAMS[data.value] }*`;
        }

        store.team = data.value;        
        store.storedInitialResponse = msg;
        debugStore();
        return bot.editMessageText(text, opts).then((originalMsg) => {
            const overall = this.askLeaderOverallAppraisal();
            const prompt = LocalizationHelper.translate(`ivCalculator.overallAppraisalPrompt`);
            bot.sendMessage(originalMsg.chat.id, prompt, overall);
        });
    }

    askLeaderOverallAppraisal() {
        debugStore();
        let keyboardAnswers = [];
        let teamKey = store.team;
        let teamOptions = LocalizationHelper.translate(`ivCalculator.leaderAppraisal.${ teamKey }.overallShort`, [store.input.mon]);

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
        const opts = {
            chat_id: msg.chat.id,
            message_id: msg.message_id,
            parse_mode: "Markdown"
        };
        let texts = LocalizationHelper.translate(`ivCalculator.leaderAppraisal.${ store.team }.overall`, [store.input.mon]);
        let text = texts[data.value];
        store.overall = data.value;        
        debugStore();

        return bot.editMessageText(text, opts).then((originalMsg) => {
            const stat = this.askStat(originalMsg);
            const prompt = LocalizationHelper.translate(`ivCalculator.statPrompt`);
            bot.sendMessage(originalMsg.chat.id, prompt, stat);
        });
    }

    askStat() {
        debugStore();
        let keyboardAnswers = [];
        let teamKey = store.team;
        let teamOptions = LocalizationHelper.translate(`ivCalculator.statCalculation`);

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
        const opts = {
            chat_id: msg.chat.id,
            message_id: msg.message_id,
            parse_mode: "Markdown"
        };
        
        let stat = LocalizationHelper.translate(`ivCalculator.statCalculation`)[data.value];
        let text = LocalizationHelper.translate(`ivCalculator.bestStat`, [stat]);
        store.stat = data.value;        
        debugStore();

        return bot.editMessageText(text, opts).then((originalMsg) => {
            const individual = this.askLeaderIndividualAppraisal(originalMsg);
            const prompt = LocalizationHelper.translate(`ivCalculator.individualAppraisalPrompt`);
            bot.sendMessage(originalMsg.chat.id, prompt, individual);
        });
    }

    askLeaderIndividualAppraisal() {
        debugStore();
        let keyboardAnswers = [];
        let teamKey = store.team;
        let teamOptions = LocalizationHelper.translate(`ivCalculator.leaderAppraisal.${ teamKey }.individualShort`, [store.input.mon]);

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
        const opts = {
            chat_id: msg.chat.id,
            message_id: msg.message_id,
        };
        let texts = LocalizationHelper.translate(`ivCalculator.leaderAppraisal.${ store.team }.individual`, [store.input.mon]);
        let text = texts[data.value];
        let resultText;
        
        store.individual = data.value;        

        if (data.action === "individualAppraisal") {
            let calculations = FrameworkStats.calculate(store);
            resultText = LocalizationHelper.translate(`ivCalculator.result`, 
                [calculations.mon, calculations.IVs.ratio, calculations.IVs.statIVs.atk, calculations.IVs.statIVs.def, calculations.IVs.statIVs.sta]);
        }

        debugStore();
        return bot.editMessageText(text, opts).then((originalMsg) => {
            bot.sendMessage(originalMsg.chat.id, resultText, {
                parse_mode: "Markdown"
            });
        });
    }
}

module.exports = IVCalculatorCtrl;