class ClientStore {
    constructor(input, team, overall, stat, individual, size) {
        this.input = input;
        this.team = team;
        this.overall = overall;
        this.stat = stat;
        this.individual = individual;
        this.size = size;
    }
}

module.exports = ClientStore;