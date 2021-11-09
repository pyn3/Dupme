import { Player } from "./client_model"
import { MAX_PLAYER } from "./game"

export class PlayerList {

    playerList: Player[] = []

    addPlayer(player: Player): void {
        this.playerList.push(player)
    }
    removeServer() {
        const server = this.playerList.find(u => !u.getUsername())
        if (!server) return
        this.removePlayer(server.socketId);

    }

    getNowTurn() {
        const player = this.playerList.find(p => p.getTurn())
        if (!player) return;
        return player
    }

    removePlayer(id: string) {
        const user = this.playerList.findIndex(p => p.socketId === id)
        if (!user) return;
        this.playerList.splice(user, 1)
        return user
    }

    getWinner() {
        return this.playerList.find(p => p.score === Math.max(this.playerList[0].getScore(), this.playerList[1].getScore()))
    }

    getNumberOfPlayers() {
        return this.playerList.length
    }

    resetTurn() {
        for (const player of this.playerList) {
            player.setTurn(false)
        }
    }
    resetAll(){
        for (const player of this.playerList) {
            player.resetPlayer()
        }
    }
    getLength() {
        return this.playerList.length
    }

    swapTurn() {
        for (const player of this.playerList) {
            player.setTurn(!player.getTurn());
        }
    }

    getOpp(id:string): Player {
        const opp = this.playerList.find(p => p.socketId != id)
        if (!opp) {
            return this.playerList[0]
        }
        return opp;
    }

    getPlayerById(playerId: string): Player {
        return this.playerList.find(p => p.getSocketId() === playerId) as Player
    }
    randomTurn() {
        const randInt = Math.floor((Math.random() * 10)) % 2
        this.removeServer()
        if (this.playerList.length >= MAX_PLAYER) {
            this.resetTurn();
            this.playerList[randInt].setTurn(true);
            console.log(`Player ${randInt} turn`)
        }
    }
}