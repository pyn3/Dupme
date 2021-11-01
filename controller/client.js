const socket = io()
// const socket = io.connect()

socket.on("playerExceed", () => {
    alert("Player exceeded")
})

//sending each character to server and another client.
const enterCharacters = (char) => {
    triggerConsoleServer(socket.id);
    socket.emit("enterCharacters", { character: char, socket: socket.id })
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

// socket.on("loop", () => {
//     socket.emit("loop")
// })
const reset = () => {
    socket.emit("resetGame")
}

const enterUsername = (username) => {
    console.log(username, "enterUsername")
    socket.emit("enterUsername", { username: username })
}

const checkPlayer = () => {
    socket.emit('checkPlayer')
}
socket.on("status", (obj) => {
    console.log({"status": obj.status})
})
const trash = () =>{
    socket.emit('trash')
}
const setDress = (scraf, glasses) =>{
    socket.emit("setDress", {scraf: scraf,glasses: glasses})
}
socket.on("playerInfo", (obj) => console.log(obj.player))
socket.on("playersInfo", (obj) => console.log(obj.players))
const getDress = () => {

    socket.on("oppData", (obj) => console.log(obj.oppPlayer))
}
// const test = (asd) => { console.log(asd) }
