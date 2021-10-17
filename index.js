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
    // await res.json({ "status": res.statusCode, "message": "OK" });
    await res.sendFile(path.join(__dirname, '/view/test.html'))
})

const httpServer = createServer(app);
const io = new Server(httpServer);
let playerList = [];
let characters = [];
let dupCharacters = [];
let nowTurn = 0;

const findSocketId = (array, val) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].socketId === val) {
            return i
        }
    }
    return null;
}
const swapTurn = () => {
    if (playerList.length <= 2) {
        if (playerList[0].isTurn) {
            playerList[0].isTurn = false;
            playerList[1].isTurn = true;
            nowTurn = 1
        } else if (playerList[1].isTurn) {
            playerList[1].isTurn = false;
            playerList[0].isTurn = true;
            nowTurn = 0
        }
        else console.log("cannot check for turn")
        characters = []
        dupCharacters = []
    } else {
        console.log("Player exceeding the limit")
    }
}

const verifyTurn = () => {
    if (nowTurn === 0) {
        return playerList[0]
    } else if (nowTurn === 1) {
        return playerList[1]
    }
}
io.on("connection", (socket) => {
    const player = new Player(socket.id);
    if (playerList.length < 2) {
        //the number of players are not exceed the limit.
        playerList.push(player)
    } else {
        //the number of players are exceed the limit.
        socket.emit("playerExceed")
    }
    // console.log(playerList)
    console.log(playerList[playerList.length - 1], 'has connected to server')
    //set first player to start first.
    playerList[0].isTurn = true;

    socket.on("disconnect", async (obj) => {
        console.log(socket.id, 'disconnect to server');
        const index = await findSocketId(playerList, socket.id)
        playerList.splice(index, 1)
        console.log(playerList)
    })

    //recieving each character from client.
    //@TODO - checking the player turn unless the block player!
    socket.on("enterCharacters", (obj) => {
        characters.push(obj.character)
        if (!playerList[1].isTurn && playerList[0].isTurn && socket.id !== playerList[1].socketId) {
            console.log(obj)
            io.to(playerList[1].socketId).emit('showCharacter', obj)
        } else if (!playerList[0].isTurn && playerList[1].isTurn && socket.id !== playerList[0].socketId) {
            console.log(obj)
            io.to(playerList[0].socketId).emit('showCharacter', obj)
        }else{
            console.log("Sth")
        }
    })
    socket.on("stop", (obj) => {
        //Not finished yet.
        swapTurn();
    })

    socket.on("triggerConsoleServer", (obj) => {
        console.log(obj.console)
    })

})

io.on("error", (err) => { console.log(err) })
httpServer.listen(port, () => console.log(`Listening on ${port}`))
