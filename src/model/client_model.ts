class Player {
    public socketId: string = ""
    public username: string = ""
    public score: number = 0
    public isTurn: boolean = false
    public dress: [number, boolean, boolean] = [0, false, false];

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
    getDress():[number, boolean, boolean] {
        return this.dress
    }
    increaseScore(score: number){
        this.score += score
    }
    decreaseScore(score: number){
        this.score -= score
    }
    getScore():number{
        return this.score;
    }
    getTurn(): boolean {
        return this.isTurn
    }
    setTurn(turn: boolean){
        this.isTurn = turn
    }
    swapTurn(){
        this.isTurn = !this.isTurn;
    }
}

export { Player }
