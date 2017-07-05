const esLang = require("../lang/es");
const enLang = require("../lang/en");
const debug = require("../config").debug;

class LocalizationHelper {
    static parseLanguageCode(language_code) {
        if (language_code.includes("-")) {
            language_code = language_code.split("-")[0];
        }

        return language_code;
    }

    static translate(messageKey, currentLang, parameterList) {
        let langFile;

        if (currentLang) {
            langFile = require("../lang/" + currentLang);
        } else {
            langFile = esLang;
        }

        if (debug) {
            console.log(`Translating ${ messageKey } in ${ currentLang }. Parameters: ${ parameterList }`);
        }

        if (messageKey && messageKey.includes(".")) {
            let localizedText = LocalizationHelper.deepValue(messageKey, langFile);
            
            let totalPlaceholders;
            
            if (localizedText instanceof Array) {
                for (let text of localizedText) {
                    let count = text.match(/%(\d)+/g);
                    
                    if (!totalPlaceholders || (count && totalPlaceholders && count.length > totalPlaceholders.length)) {
                        totalPlaceholders = count;
                    }
                }
            } else {
                totalPlaceholders = localizedText.match(/%(\d)+/g);
            }

            let replacements;
            
            if (totalPlaceholders && parameterList) {
                for (let i = 0; i < totalPlaceholders.length; i++) {
                    let parameter = parameterList[i];
                    
                    if (!replacements) {
                        replacements = localizedText;
                    }
                    
                    if (parameter === null || parameter === undefined) {
                        parameter = LocalizationHelper.deepValue("fallback." + messageKey, langFile);
                    }

                    if (localizedText instanceof Array) {
                        for (let j = 0; j < localizedText.length; j++) {
                            localizedText[j] = localizedText[j].replace(`%${i}`, parameter);
                        }
                    } else {
                        replacements = replacements.replace(`%${i}`, parameter);
                    }
                }
            }

            if (!replacements) {
                replacements = localizedText;
            }
            
            return replacements;            
        } else {
            console.warning("No translation available for " + messageKey);
        }
    }

    static deepValue(path, obj) {
        for (let i = 0, splitPath = path.split('.'), len = splitPath.length; i < len; i++) {
            obj = obj[splitPath[i]];
        };

        return obj;
    }
}

module.exports = LocalizationHelper;