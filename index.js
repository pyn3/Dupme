const express = require('express');
const { Server } = require('socket.io');
const { createServer } = require('http');
const { User, Player } = require('./model/client_model.js')
const path = require('path')
const app = express();
const port = 4000;

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
let dupCharacter = [];
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
        else console.log("cannot check for trun")
    } else {
        console.log("Player exceeding the limit")
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
    console.log(playerList)
    console.log(socket.id, 'connected to server')
    //set first player to start first.
    playerList[0].isTurn = true;

    socket.on("disconnect", async (obj) => {
        console.log(socket.id, 'disconnect to server');
        const index = await findSocketId(playerList, socket.id)
        playerList.splice(index, 1)
        console.log(playerList)
    })

    //recieving each character from client.
    socket.on("enterCharacters", (obj) => {
        console.log(obj)
        characters.push(obj.character)
        if(!playerList[1].isTurn && playerList[0].isTurn){
            io.to(playerList[1].socketId).emit('showCharacter', obj)
        }else if(!playerList[0].isTurn && playerList[1].isTurn){
            io.to(playerList[0].socketId).emit('showCharacter', obj)
        }
    })
    socket.on("stop", (obj) => {
        //Not finished yet.
        try {
            // if (obj.socketId === playerList[0].socketId) {
            //     playerList[0].isTurn = false;
            //     playerList[1].isTurn = true;
            //     console.log('xxxxxxx')
            // } else if (obj.socketId === playerList[1].socketId) {
            //     playerList[1].isTurn = false;
            //     playerList[0].isTurn = true;
            //     console.log('dasdasdas')
            // }
            swapTurn();
        } catch (err) {
            console.log(err)
        }
    })

    socket.on("triggerConsoleServer", (obj) => {
        console.log(obj.console)
    })

})

io.on("error", (err) => { console.log(err) })
httpServer.listen(port, () => console.log(`Listening on ${port}`))
