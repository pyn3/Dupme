import { Server, Socket } from "socket.io";
import { createServer } from "http"
import express from "express"
import { Response, Request } from "express"
import path from "path";
import { MAX_PLAYER } from "./model/game";
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
let count: number = 0;
let level: number = 0;

const findSocketId = (val: string, array = playerList) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].socketId === val) {
            return i
        }
    }
}
const game = new Game();
io.on("connection", async (socket: Socket) => {

    if (playerList.length < MAX_PLAYER+1) {
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
        game.allPlayers.getPlayerById(socket.id).setDress(toon, scraf, glasses)
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
