const socket = io()

socket.on("playerExceed", () => {
    console.log("Player exceeded")
})

socket.emit("enterPattern", (data) => {

})