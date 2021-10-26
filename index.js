const express = require('express');
const { Server } = require('socket.io');
const { createServer } = require('http');
const { User, Player } = require('./model/client_model.js')
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
let numberIn = 0
let playerScore = [0, 0];
const MAX_PLAYER = 2;
const findSocketId = (array, val) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].socketId === val) {
            return i
        }
    }
    return null;
}
const swapTurn = () => {
    if (playerList.length <= MAX_PLAYER) {
        playerList[1].isTurn = !playerList[1].isTurn;
        playerList[0].isTurn = !playerList[0].isTurn;
    } else {
        console.log("Player exceeding the limit")
    }
}
const resetCollected = () => {
    characters = [];
    // dupCharacters = [];
}
const checkCharacter = (character) => {

    if (characters[numberIn] === character) {
        if (playerList[0].isTurn) {
            playerScore[0] += 1;
        } else if (playerList[1].isTurn) {
            playerScore[1] += 1;
        }
        console.log(playerScore)
        numberIn++;
    } else {
        console.log("Wrong button.")
    }
}
const startNewTurn = () => {
    resetCollected();

}

io.on("connection", (socket) => {
    const player = new Player(socket.id);
    if (playerList.length < MAX_PLAYER) {
        //the number of players are not exceed the limit.
        playerList.push(player)
    } else {
        //the number of players are exceed the limit.
        socket.emit("playerExceed")
    }
    // console.log(playerList)
    //set first player to start first.
    playerList[0].isTurn = true;
    console.log(playerList[playerList.length - 1], 'has connected to server')

    socket.on("disconnect", async (obj) => {
        console.log(socket.id, 'disconnect to server');
        const index = await findSocketId(playerList, socket.id)
        playerList.splice(index, 1)
        console.log(playerList)
    })

    //recieving each character from client.
    socket.on("enterCharacters", (obj) => {
        if (socket.id !== playerList[1].socketId && playerList[0].isTurn) {
            if (copyTurn) {
                checkCharacter(obj.character)
            } else {
                console.log(obj)
                characters.push(obj.character)
                io.to(playerList[1].socketId).emit('showCharacter', obj)
            }
        } else if (socket.id !== playerList[0].socketId && playerList[1].isTurn) {
            if (copyTurn) {
                checkCharacter(obj.character)
            } else {
                console.log(obj)
                characters.push(obj.character)
                io.to(playerList[0].socketId).emit('showCharacter', obj)

            }
        } else {
            console.log("Sth")
        }

    }
    )
    socket.on("stop", (obj) => {
        //Not finished yet.
        swapTurn()
        copyTurn = !copyTurn;
    })

    socket.on("triggerConsoleServer", (obj) => {
        console.log(obj.console)
    })
    socket.on("resetButton", () => {
        resetCollected();
        playerScore = [];
    })

    // socket.emit('playerInformation, )
})

io.on("error", (err) => { console.log(err) })
httpServer.listen(port, () => console.log(`Listening on ${port}`))
