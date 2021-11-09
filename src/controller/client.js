const socket = io()
// const socket = io.connect()

socket.on("playerExceed", () => {
    alert("Player exceeded")
})

//sending each character to server and another client.
const enterCharacters = (char) => {
    triggerConsoleServer(socket.id);
    socket.emit("enterCharacters", { character: char })
}

const stop = () => {
    triggerConsoleServer(socket.id);
    socket.emit("stop", { socket: socket.id })
}

const triggerConsoleServer = (text) => {
    socket.emit("triggerConsoleServer", { console: text })
}

socket.on("showCharacter", (obj) => {
    console.log(obj.character, "showCharacter")
})

const reset = () => {
    socket.emit("resetGame")
}

const enterUsername = (username) => {
    console.log(username, "enterUsername")
    socket.emit("enterUsername", username)
}

const checkPlayer = () => {
    socket.emit('checkPlayer')
}
const trash = () => {
    socket.emit('trash')
}
const setDress = (toon, scraf, glasses) => {
    socket.emit("setDress", { toon: toon, scraf: scraf, glasses: glasses })
}
socket.on("status", (obj) => console.log({ "status": obj.status })) //get status of the game if it DONE return "DONE" 
socket.on("playerInfo", (obj) => console.log(obj.player)) //get own player info
socket.on("playersInfo", (obj) => console.log(obj.players)) //get all players info
socket.on("something", (obj) => console.log(obj.something)) //get the number of players

const getDress = () => {
    socket.on("oppData", (obj) => console.log(obj.oppPlayer))
}
// input: 0,1 -> 0: easy, 1: hard.
const diff = (level) => {
    socket.emit("setLevel", { level: level })
}
const numPlayers = () =>{
    socket.emit("getNumPlayers")
}
const getWinner = () => socket.emit("getWinner")


// const test = (asd) => { console.log(asd) }
