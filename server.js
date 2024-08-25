const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidv4 } = require('uuid');


//Middlewares
app.set("view engine", "ejs");
app.use(express.static("public"));



//Routes
app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`);
})


app.get("/:room", (req, res) => {
    const roomId = req.params.room;
    res.render("room", { roomId })
})



io.on("connection", socket => {
    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId); //Join the socket server
        socket.to(roomId).emit("user-connected", userId) //Send the user join message everyone except self.
    })
})







//Listen the server
server.listen(9000);