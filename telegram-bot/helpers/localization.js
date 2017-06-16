const esLang = require("../lang/es");

class LocalizationHelper {
    static translate(messageKey, parameterList) {
        if (messageKey && messageKey.includes(".")) {
            let localizedText = LocalizationHelper.deepValue(messageKey, esLang);            
            let totalPlaceholders = localizedText.match(/%(\d)+/g);
            let replacements;
            
            for (let i = 0; i < totalPlaceholders.length; i++) {
                let parameter = parameterList[i];
                
                if (!replacements) {
                    replacements = localizedText;
                }

                if (!parameter) {
                    parameter = LocalizationHelper.deepValue("fallback." + messageKey, esLang);
                }

                replacements = replacements.replace(`%${i}`, parameter);
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