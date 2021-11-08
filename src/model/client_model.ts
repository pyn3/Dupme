class Player {
    socketId: string = ""
    username: string = ""
    score: number = 0
    isTurn: boolean = false
    dress: [number, boolean, boolean] = [0, false, false];

    constructor(socketId: string) {
        this.socketId = socketId;
        this.username = "";
        this.score = 0;
        this.isTurn = false;
        this.dress = [0, false, false]; //default dress
        //[toon,scraf, glasses]
    }
    setDress(toon: number, scraf: boolean, glasses: boolean) {
        this.dress = [toon, scraf, glasses]
    }
    getDress() {
        return this.dress
    }
}
export { Player }
