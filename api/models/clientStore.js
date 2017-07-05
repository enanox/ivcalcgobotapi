class ClientStore {
    constructor(chat_id, input, team, overall, stat, individual, size) {
        this.chat_id = chat_id;
        this.input = input;
        this.team = team;
        this.overall = overall;
        this.stat = stat;
        this.individual = individual;
        this.size = size;
    }
}

module.exports = ClientStore;