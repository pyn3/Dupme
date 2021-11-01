class Player {
    constructor(socketId) {
        this.socketId = socketId;
        this.username = "";
        this.score = 0;
        this.isTurn = false;
        this.dress = [false, false]; //default dress
        //[scraf, glasses]
    }
    setDress(scraf, glasses) {
        this.dress = [scraf, glasses]
    }
    getDress() { return this.dress }
}

module.exports = { Player }