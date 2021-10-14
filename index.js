const express = require('express');
const { Server } = require('socket.io');
const { createServer } = require('http');
const { User, Player } = require('./model/client_model.js')
const app = express();
const port = 4000;
app.use(express.json())

app.get('/', async (req, res) => {
    await res.json({ "status": res.statusCode, "message": "OK" });
})

const httpServer = createServer(app);
const io = new Server(httpServer);
let playerList = [];
let characters = []

io.on("connection", (socket) => {
    console.log("someone connected to server")
    const player = new Player(socket.id);

    if (playerList.length < 2){
        //the number of players are not exceed the limit.
        playerList.push(player)
    }else{
        //the number of players are exceed the limit.
        socket.emit("playerExceed")
    }
    socket.on("disconnect", () => {
        console.log("someone disconnect");
    })
    socket.on("status", (obj) => {
        console.log(obj)
    })

    //recieving each character from client.
    socket.on("enterCharacters", (obj)=>{
        
    })

})
httpServer.listen(port, () => console.log(`Listening on ${port}`))
