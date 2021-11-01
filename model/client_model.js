class Player {
    constructor(socketId) {
        this.socketId = socketId;
        this.username = "";
        this.score = 0;
        this.isTurn = false;
        this.dress = [0,false, false]; //default dress
                //[toon,scraf, glasses]
    }
    setDress(toon,scraf, glasses) {
        this.dress = [toon,scraf, glasses]
    }
    getDress() { return this.dress }
}

module.exports = { Player }