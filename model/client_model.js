class Player {
    constructor(username) {
        this.username = username;
        this.score = 0;
        this.isTurn = false;
    }
}

module.exports = { Player }