const esLang = require("../lang/es");

class LocalizationHelper {
    static translate(messageKey, parameterList) {
        if (messageKey && messageKey.includes(".")) {
            let localizedText = LocalizationHelper.deepValue(messageKey, esLang);
            
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

                    if (!parameter) {
                        parameter = LocalizationHelper.deepValue("fallback." + messageKey, esLang);
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
    };
}

module.exports = LocalizationHelper;