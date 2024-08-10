// Node server which will handle socket io connections
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Handle other requests
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World');
});

const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const users ={};

io.on('connection',socket =>{
    //if new user joins, let other users conneccted to the server notified
    socket.on('new-user-joined',username =>{
        console.log("New user",username);
        users[socket.id]=username;
        socket.broadcast.emit('user-joined',username);
    });
    // if  someone sends mssg, broadcast it to other people
    socket.on('send',message =>{
        socket.broadcast.emit('receive', {message: message,username:users[socket.id]});
        
    });
    // if  someone sends mssg, broadcast it to other people
    socket.on('disconnect',() =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id] ;
    }); 
});

server.listen(8000, () => {
    console.log('Server is running on port 8000');
});