const socket = io()

socket.on("playerExceed", () => {
    console.log("Player exceeded")
})

//sending each character to server and another client.
const enterCharacters = (char) => {
    socket.emit("enterCharacters", {character: char})
}
