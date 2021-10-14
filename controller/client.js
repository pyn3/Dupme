const socket = io()


socket.on("playerExceed", () => {
    alert("Player exceeded")
})

//sending each character to server and another client.
const enterCharacters = (char) => {
    socket.emit("enterCharacters", { character: char, socket: socket.id })
    console.log(socket.id)
}

const stop = () => {
    socket.emit("stop", { socket: socket.id })
}

// const test = (asd) => { console.log(asd) }

