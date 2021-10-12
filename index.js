const express = require('express');
const socket = require('socket.io');
// const myip = require('myip');
// const path = require('path');

const app = express();
const port = 4000;
app.use(express.json())

app.get('/', async(req,res)=>{
    await res.json({"status" :res.statusCode, "message":"OK"});
})
app.listen(port, () => console.log(`Listening on ${port}`))

//testttt
