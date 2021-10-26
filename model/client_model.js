class Player {
    constructor(socketId) {
        this.socketId = socketId;
        this.username = "";
        this.score = 0;
        this.isTurn = false;
    }
}

module.exports = { Player }