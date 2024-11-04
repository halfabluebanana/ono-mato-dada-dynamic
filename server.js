import express from 'express';
let app = express();

//Initialize HTTP server
import http from "http";
import { Server } from 'socket.io';

let server = http.createServer(app);

//initialise socket io
//let io = require("socket.io");
let io = new Server(server);

//serve static files from the public folder
app.use(express.static('public'));


//'port' variable allows for deployment
let PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

//listen for client to connect and disconnnect
io.on('connection', (socket) => {
    console.log("A user connected: " + socket.id);

    // Listen for slider change from a client. if any connection performs a certain action
    socket.on('sliderChange', (data) => {
        // Broadcast the slider value to all other connected clients
        io.emit('updateSoundDuration', data);
    });

    socket.on('disconnect', () => {
        console.log("A user disconnected:" + socket.id);
    });
});
