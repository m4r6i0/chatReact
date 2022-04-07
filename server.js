// const { response } = require('express')
// const express = require('express')
// const cors = require('cors');

// const app = express()


// app.use(express.static("public"));
// app.use(cors());

// const http = require('http').Server(app)
// const serverSocket = require('socket.io')(http)

// const porta = process.env.PORT || 8000

// const host = process.env.HEROKU_APP_NAME ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` : "http://localhost"
// console.log(host);

// const server = serverSocket(http, {
//     cors:{
//         origin: "*",
//         methods: ["GET", "POST"],
//         allowedHeaders: ["content-type"],
//     },
// });

const { response } = require('express')
const express = require('express')
const cors = require("cors");
const socketio = require("socket.io");

const app = express();
app.use(cors());
app.use(express.static("public"));

const server = require('http').Server(app);

const socket = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["content-type"],
  },
});

const porta = process.env.PORT || 8000
const host = process.env.HEROKU_APP_NAME ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` : "http://localhost"

server.listen(porta, function(){
    const portaStr = porta === 80 ? '' :  ':' + porta

    if (process.env.HEROKU_APP_NAME) 
        console.log('Servidor iniciado. Abra o navegador em ' + host)
    else console.log('Servidor iniciado. Abra o navegador em ' + host + portaStr)
})

app.get('/', function (requisicao, resposta) {
    resposta.send({message: "Server On"});
})


socket.on('connect', function(socket){
    socket.on('login', function (nickname) {
        socket.nickname = nickname
        const msg = nickname + ' conectou'
        console.log(msg)
        serverSocket.emit('chat msg', msg)
    })

    socket.on('disconnect', function(){
        console.log('Cliente desconectado: ' + socket.nickname)
    })
        
    socket.on('chat msg', function(msg){
        serverSocket.emit('chat msg', `${socket.nickname} diz: ${msg}`)
        console.log('Mensagem ->' + msg);
    })

    socket.on('status', function(msg){
        console.log(msg)
        socket.broadcast.emit('status', msg)
    })
})