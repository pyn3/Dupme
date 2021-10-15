class Player {
    constructor(socketId) {
        this.username = "";
        this.score = 0;
        this.isTurn = false;
        this.socketId = socketId;
    }
}

module.exports = { Player }