const express = require('express');
const { Server } = require('socket.io');
const { createServer } = require('http');

const app = express();
const port = 4000;
app.use(express.json())

app.get('/', async (req, res) => {
    await res.json({ "status": res.statusCode, "message": "OK" });
})

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log("someone connected to server")
})
httpServer.listen(port, () => console.log(`Listening on ${port}`))