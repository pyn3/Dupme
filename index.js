const express = require('express');
const { Server } = require('socket.io');
const { createServer } = require('http');
const { Player } = require('./model/client_model.js')
const path = require('path')
const app = express();
const port = 8080;
app.use(express.json())
app.use(express.static(path.join(__dirname, 'controller')))

app.get('/', async (req, res) => {
    await res.sendFile(path.join(__dirname, '/view/test.html'))
})

const httpServer = createServer(app);
const io = new Server(httpServer);
let playerList = [];
let copyTurn = false;
let characters = [];
let numberIn = 0;
let nowTurn = 0;
const MAX_PLAYER = 2;
const findSocketId = (val, array = playerList) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].socketId === val) {
            return i
        }
    }
    return null;
}

const randomTurn = () => {
    const randInt = Math.floor((Math.random() * 10)) % 2
    if (playerList.length >= MAX_PLAYER) {
        playerList[0].isTurn = false;
        playerList[1].isTurn = false;
        playerList[randInt].isTurn = true;
        nowTurn = randInt;
        console.log(`Player ${randInt} turn`)
    }
}

const swapTurn = () => {
    if (playerList.length >= MAX_PLAYER) {
        playerList[1].isTurn = !playerList[1].isTurn;
        playerList[0].isTurn = !playerList[0].isTurn;
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
    console.log(characters,"is our stored characters");
}

const checkCharacter = (character) => {
    console.log(characters[numberIn],numberIn)
    if (characters[numberIn] === character) {
        if (playerList[0].isTurn) {
            playerList[0].score += 1;
        } else if (playerList[1].isTurn) {
            playerList[1].score += 1;
        }
        numberIn++;
    } else {
        if (playerList[0].isTurn) {
            playerList[0].score -= numberIn;
        } else if (playerList[1].isTurn) {
            playerList[1].score -= numberIn;
        }
        numberIn = 0;
        console.log("Wrong button.")
    }
    console.log(`player 0 score: ${playerList[0].score}`)
    console.log(`player 1 score: ${playerList[1].score}`)
    if(characters.length === numberIn) {
        startNewRound()
        console.log('ROUND HAS DONE!')
    }
}


io.on("connection", (socket) => {
    const player = new Player(socket.id);

    if (playerList.length < MAX_PLAYER) {
        playerList.push(player)
    } else {
        socket.emit("playerExceed")
    }
    console.log(`${playerList.length} has joined the server`)
    if (playerList.length >= MAX_PLAYER) {
        randomTurn()
    }

    socket.on("disconnect", async (obj) => {
        console.log(socket.id, 'disconnect to server');
        const index = await findSocketId(playerList, socket.id)
        playerList.splice(index, 1)
        console.log(playerList)
    })

    socket.on("enterCharacters", (obj) => {
        if ((socket.id !== playerList[1].socketId) && playerList[0].isTurn) {
            if (copyTurn) {
                checkCharacter(obj.character)
            } else {
                console.log(obj, "as player 0")
                characters.push(obj.character)
                io.to(playerList[1].socketId).emit('showCharacter', obj)
            }
        } else if ((socket.id !== playerList[0].socketId) && playerList[1].isTurn) {
            if (copyTurn) {
                checkCharacter(obj.character)
            } else {
                console.log(obj, "as player 1")
                characters.push(obj.character)
                io.to(playerList[0].socketId).emit('showCharacter', obj)
            }
        } else {
            console.log("Wrong Turn")
        }
    })

    socket.on("stop", () => {
        swapTurn()
        copyTurn = !copyTurn;
    })

    socket.on("triggerConsoleServer", (obj) => {
        console.log(obj.console)
    })
    socket.on("resetGame", () => {
        resetCollected();
        randomTurn();
        copyTurn = false;
        numberIn = 0
        playerList[0].score = 0

        console.log('--------------------------------')
        console.log("Reset following variables:")
        console.log("    player 0's score: ",playerList[0].score)
        if(playerList.length === 2){
            playerList[1].score = 0;
            console.log("    player 1's score:",playerList[1].score)
        }
        console.log("    copyTurn:",copyTurn)
        console.log("    numberIn:",numberIn)
        console.log("    turn", nowTurn)
        console.log("    characters:",characters)
        console.log('--------------------------------')
    })
    
    socket.on("enterUsername",  (obj) => {
        playerList[findSocketId(socket.id)].username = obj.username
        console.log(`Set username ${playerList[findSocketId(socket.id)].username} as "${obj.username}"`)
    })
    
    socket.on("checkPlayer", () => {
        console.log(playerList)
        console.log(copyTurn, "copyTurn")
        socket.emit("status",{status: nowTurn})
    })
    socket.emit("playerInfo", { player: player })
})

io.on("error", (err) => { console.log(err) })
httpServer.listen(port, () => console.log(`Listening on ${port}`))
