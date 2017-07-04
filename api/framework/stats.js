const ClientStore = require("../models/clientStore");

class Stats {
    static validate(clientStore) {
        // if (!(clientStore instanceof ClientStore)) {
        //     throw "The stats client store needs to be an api.framework.ClientStore instance";
        // }

        if (!clientStore.input) {
            throw "Missing input data";
        }

        this.stored = new ClientStore(clientStore.input, clientStore.team, clientStore.overall, clientStore.stat, clientStore.individual, clientStore.size)
    }

    static calculate(clientStore) {
        const overallStops = ["82.2% - 100%", "66.7% - 80%", "51.1% - 64.4%", "0% - 48.9%"];
        const individualStops = ["15", "13-14", "8-12", "0-7"];
        const stats = ["ATK", "DEF", "STA", "ATK/DEF", "ATK/STA", "DEF/STA", "ATK/DEF/STA"];

        Stats.validate(clientStore);
        
        let dependingOnStops = individualStops[clientStore.individual];
        let statIVs = {
            atk: 0,
            def: 0,
            sta: 0
        };

        let restPosition = clientStore.individual === 3 && 3 || clientStore.individual + 1;

        if (clientStore.stat === 6) {
            let threshold;
            
            if (clientStore.overall > clientStore.individual) {
                const stopArray = individualStops[clientStore.overall].split("-");
                threshold = stopArray[stopArray.length - 1];
            } else {
                threshold = individualStops[clientStore.individual];
            }

            statIVs.atk = Number.parseInt(threshold);
            statIVs.def = Number.parseInt(threshold);
            statIVs.sta = Number.parseInt(threshold);
        } else if ([3, 4, 5].lastIndexOf(clientStore.stat) !== -1) {

            if (clientStore.stat === 3) {
                statIVs.atk = dependingOnStops;
                statIVs.def = dependingOnStops;
                statIVs.sta = individualStops[restPosition];
            } else if (clientStore.stat === 4) {
                statIVs.atk = dependingOnStops;
                statIVs.sta = dependingOnStops;
                statIVs.def = individualStops[restPosition];
            } else if (clientStore.stat === 5) {
                statIVs.def = dependingOnStops;
                statIVs.sta = dependingOnStops;
                statIVs.atk = individualStops[restPosition];
            }
        } else if (clientStore.stat === 2) {
            statIVs.sta = dependingOnStops;
            statIVs.atk = individualStops[restPosition];
            statIVs.def = individualStops[restPosition];
        } else if (clientStore.stat === 1) {
            statIVs.def = dependingOnStops;
            statIVs.atk = individualStops[restPosition];
            statIVs.sta = individualStops[restPosition];
        } else if (clientStore.stat === 0) {
            statIVs.atk = dependingOnStops;
            statIVs.def = individualStops[restPosition];
            statIVs.sta = individualStops[restPosition];
        }
        
        return {
            mon: clientStore.input.mon,
            IVs: {
                ratio: overallStops[clientStore.overall],
                statIVs
            }
        }
    }
}

module.exports = Stats;