const mons = require("../data/mons.json");
const FOUND = 0;
const ALTERNATIVES = 1;

class Validation {
    static inputMon(inputData) {
        const nameCheck = Validation.nameNotExists(inputData.mon);       
        
        if (!nameCheck[FOUND]) {
            return nameCheck;
        }

        return true;
    }

    static nameNotExists(inputName) {
        let sanitizedName = `${inputName.charAt("0").toUpperCase()}${inputName.substr(1).toLowerCase()}`;
        let foundMon, alternatives;
        
        if (mons) {
            foundMon = mons.find((mon) => mon.POK === sanitizedName);
            alternatives = !foundMon && mons.filter((mon) => mon.POK.startsWith(sanitizedName.substr(0, 3)));
            
            if (alternatives.length > 0) {
                alternatives.splice(3);
            }
        } else {
            throw "Cannot open mon data file.";
        }
        
        return [foundMon, alternatives];
    }
}

module.exports = Validation;