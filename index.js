const express = require('express');
const { Server } = require('socket.io');
const { createServer } = require('http');
const { User } = require('./model/client_model.js')
const app = express();
const port = 4000;
app.use(express.json())

app.get('/', async (req, res) => {
    await res.json({ "status": res.statusCode, "message": "OK" });
})

const httpServer = createServer(app);
const io = new Server(httpServer);
let playerList = [];

io.on("connection", (socket) => {
    console.log("someone connected to server")
    
    playerList.push()
    // socket.on("hello", "world");
    socket.on("disconnect", () => {
        console.log("someone disconnect");
    })
    socket.on("status", (data) => {
        
        console.log(data)
    })
    socket.on("connection_error", () => {
        socket.connect();
        console.log("error")
    })

})
httpServer.listen(port, () => console.log(`Listening on ${port}`))
