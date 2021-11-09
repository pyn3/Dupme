import { Server, Socket } from "socket.io";
import { createServer } from "http"
import express from "express"
import { Response, Request } from "express"
import path from "path";
import { Player } from "./model/client_model"

//OOP refactor
import { PlayerList } from "./model/player_list"
import { Game } from "./model/game"
//
const app = express();
const port = 8090;
app.use(express.json())
app.use(express.static(path.join(__dirname, 'controller')))


app.get('/', async (req: Request, res: Response) => {
    await res.sendFile(path.join(__dirname, '/view/test.html'))
})

app.get('/status', async (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.json({
        NumberPlayer: playerList.length,
    })
})
enum status {
    done = "DONE"
}
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
let playerList: Player[] = [];
let characters: string[] = [];
let copyTurn: boolean = false;
let numberIn: number = 0;
let nowTurn: number = 0;
let count: number = 0;
let level: number = 0;
const MAX_PLAYER: number = 2;

const findSocketId = (val: string, array = playerList) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].socketId === val) {
            return i
        }
    }
}

const randomTurn = () => {
    const randInt = Math.floor((Math.random() * 10)) % 2
    if (playerList.length >= MAX_PLAYER) {
        playerList[0].setTurn(false);
        playerList[1].setTurn(false);
        playerList[randInt].setTurn(true);
        nowTurn = randInt;
        console.log(`Player ${randInt} turn`)
    }
}

const swapTurn = () => {
    if (playerList.length >= MAX_PLAYER) {
        playerList[1].swapTurn();
        playerList[0].swapTurn();
    } else {
        console.log("Player exceeding the limit")
    }
}

const startNewRound = () => {
    resetCollected();
    numberIn = 0;
    copyTurn = false;
    console.log("Round has been restarted")
}
const resetCollected = () => {
    characters = [];
    console.log(characters, "is our stored characters");
}
//for checking character and increasing score of that player.
const checkCharacter = (character: string) => {
    console.log(characters[numberIn], numberIn)
    if (characters[numberIn] === character) {
        if (playerList[0].getTurn()) {
            playerList[0].increaseScore(50);
        } else if (playerList[1].getTurn()) {
            playerList[1].increaseScore(50);
        }
        numberIn++;
    } else {
        if (playerList[0].getTurn()) {
            playerList[0].decreaseScore(numberIn * 50);
        } else if (playerList[1].getTurn()) {
            playerList[1].decreaseScore(numberIn * 50);
        }
        numberIn = 0;
        console.log("Wrong button.")
    }
    console.log(`player 0 score: ${playerList[0].score}`)
    console.log(`player 1 score: ${playerList[1].score}`)
    if (characters.length === numberIn) {
        startNewRound()
        console.log('ROUND HAS DONE!')
    }
}

const trash = (socketId: string) => {
    if (playerList.length >= 2) {
        if (playerList[0].getTurn() && playerList[1].socketId !== socketId) {
            playerList[0].score -= 50;
        } else if (playerList[1].getTurn() && playerList[0].socketId !== socketId) {
            playerList[1].score -= 50;
        }
        numberIn--;
        console.warn('Trash~!')
        console.log(`player 0 score: ${playerList[0].score}`)
        console.log(`player 1 score: ${playerList[1].score}`)
    } else {
        console.warn("Player <= 2")
    }
}
const resetAll = () => {
    resetCollected();
    randomTurn();
    copyTurn = false;
    numberIn = 0
    playerList[0].score = 0
    level = 0
    console.log('--------------------------------')
    console.log("Reset following variables:")
    console.log("    player 0's score: ", playerList[0].score)
    if (playerList.length === 2) {
        playerList[1].score = 0;
        console.log("    player 1's score:", playerList[1].score)
    }
    console.log("    level:", level)
    console.log("    copyTurn:", copyTurn)
    console.log("    numberIn:", numberIn)
    console.log("    turn", nowTurn)
    console.log("    characters:", characters)
    console.log('--------------------------------')
}

//oop refactor
const game = new Game();
//
io.on("connection", async (socket: Socket) => {
    
    if (playerList.length < MAX_PLAYER) {
        const player = new Player(socket.id);
        await game.addPlayer(player)
    } else {
        socket.emit("playerExceed")
    }
    if (game.getPlayerNumber() >= MAX_PLAYER) {
        game.randomTurn()
    }

    socket.on("disconnect", async () => {
        console.log(socket.id, 'disconnect to server');
        game.disconnect(socket.id);
    })

    socket.on("enterCharacters", (obj) => {
        //oop refactor
        if (game.getCopyTurn()) {
            game.verifyCharacter(socket.id, obj.character)
        } else if (game.checkTurnSender(socket.id)) {
            game.addCharacter(socket.id, obj.character)
            const opp = game.getOpp(socket.id)!.getSocketId()
            if (opp != socket.id) io.to(opp).emit("showCharacter", obj)
        }
    })
    socket.on("stop", () => {
        if (game.checkTurnSender(socket.id)) {
            game.swapCopyTurn()
            game.swapTurn()
            console.log("stop")
            if (count >= 8) {
                socket.emit("endGame", { status: status.done })
            } else {
                count++
            }
        }else{
            console.warn("wrong turn!")
        }
    })

    socket.on("triggerConsoleServer", (obj) => {
        console.log(obj.console)
    })
    socket.on("resetGame", () => {
        game.resetAll()
    })

    socket.on("enterUsername", async (username) => {
        game.setUsername(socket.id, username)
    })

    socket.on("checkPlayer", () => {
        console.log(game.allPlayers)
        console.log(game.characters)
        console.log(game.iterator)
        console.log("round",count)
    })
    socket.emit("playerInfo", { player: playerList })
    socket.on('trash', () => {
        game.trash(socket.id)
     })
    socket.on('setDress', (toon, scraf, glasses) => {
        playerList[findSocketId(socket.id)!].setDress(toon, scraf, glasses)
    })
    socket.on("getOppData", () => {
        socket.emit("oppData", { oppPlayer: game.getOpp(socket.id) })
    })
    let x = 0
    socket.on('setLevel', (obj) => {
        if (x === 0) {
            level = obj.level
            socket.broadcast.emit('getLevel', { level: level })
        }
        x++
    })
    socket.on("getNumPlayers", () => {
        socket.emit('something', { something: playerList.length })
    })
    socket.on("getWinner", () => {
        socket.emit('something', playerList.find(p => p.getScore() === Math.max(playerList[0].getScore(), playerList[1].getScore())))
    })
})

io.on("error", (err) => { console.log(err) })
httpServer.listen(port, () => console.log(`Listening on ${port}`))
