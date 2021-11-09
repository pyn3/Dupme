import { Player } from "./client_model"
import { PlayerList } from "./player_list"

export const MAX_PLAYER: number = 2;
export class Game {

    characters: string[] = [];
    copyTurn: boolean = false;
    iterator: number = 0;
    allPlayers: PlayerList = new PlayerList();

    addPlayer(player: Player) {
        if (this.allPlayers.getLength() >= MAX_PLAYER + 1) {
            return
        }
        this.allPlayers.addPlayer(player)
        console.log(player)
    }

    addCharacter(sender: string, character: string) {
        this.allPlayers.removeServer();
        if (this.checkTurnSender(sender)) {
            this.characters.push(character);
            console.log(`character added ${character}`)
        }
    }

    verifyCharacter(sender: string, character: string) {
        if (this.characters[this.iterator] === character && this.copyTurn && this.checkTurnSender(sender)) {
            this.allPlayers.getPlayerById(sender).increaseScore(50)
            this.iterator++;
            console.log("correct")
            console.log(this.allPlayers.getPlayerById(sender), "increase 50 points")
        } else if (this.copyTurn && this.characters[this.iterator] != character && this.checkTurnSender(sender)) {
            this.allPlayers.getPlayerById(sender).decreaseScore(50 * this.iterator);
            this.iterator = 0;
            console.log("wrong")
        }
        if (this.characters.length === this.iterator) {
            this.swapCopyTurn()
            this.resetChar()
            this.resetIterator()
            console.log("Well Done!")
        }
    }
    trash(sender: string){
        const player = this.allPlayers.getPlayerById(sender)
        if(this.checkTurnSender(sender) && this.copyTurn && (player.score >= 0)){
            this.iterator--;
            player.decreaseScore(50)
        }
    }
    swapCopyTurn() {
        this.copyTurn = !this.copyTurn;
    }
    getCopyTurn(): boolean {
        return this.copyTurn;
    }
    getPlayerNumber(): number {
        return this.allPlayers.getNumberOfPlayers()
    }
    randomTurn() {
        if (this.checkNotEnoughPlayer()) {
            console.warn("Not Enough Player"); return;
        }
        this.allPlayers.randomTurn()
        console.log("Random Turn")
    }
    getOpp(id: string) {
        const opp = this.allPlayers.getOpp(id)
        return opp;
    }
    swapTurn() {
        this.allPlayers.swapTurn();
    }
    checkTurnSender(sender: string) {
        if (this.checkNotEnoughPlayer()) return
        return this.allPlayers.getPlayerById(sender).getTurn();
    }
    checkNotEnoughPlayer(): boolean {
        this.allPlayers.removeServer();
        return !(this.allPlayers.getNumberOfPlayers() >= MAX_PLAYER)
    }
    disconnect(id: string) {
        this.allPlayers.removePlayer(id)
    }
    resetAll() {
        this.allPlayers.resetAll()
        this.randomTurn()
        this.resetChar()
        this.copyTurn = false;
        this.iterator = 0
    }
    resetChar() {
        this.characters = []
    }
    resetIterator() {
        this.iterator = 0
    }
    setUsername( id: string,username: string) {
        this.allPlayers.getPlayerById(id).setUsername(username)
    }
}