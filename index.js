let express = require('express');
let app = express();
let httpServer = require('http').createServer(app);
let io = require('socket.io')(httpServer);

let connections = [];

io.on('connection', (socket) => {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length); 

    socket.on('draw', (data) => {
        connections.forEach((conn) => {
            if (conn.id !== socket.id) {
                conn.emit('draw', {x: data.x, y: data.y});
            }
        });
    });

    socket.on('down', (data) => {
        connections.forEach((conn) => {
            if (conn.id !== socket.id) {
                conn.emit('ondown', {x: data.x, y: data.y});
            }
        });
    });

    socket.on('disconnect', (data) => {
        console.log('Disconnected: %s sockets connected', connections.length)
        connections = connections.filter((conn) => conn.id !== socket.id);
    });

});

app.use(express.static(__dirname+ '/pb'));


let PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}`))