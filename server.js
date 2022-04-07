const { response } = require('express')
const express = require('express')
const cors = require('cors');

const app = express()

// app.use(cors());
// app.options('*', cors());
// app.use(express.static("public"));

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
  }
  
  const domainsFromEnv = process.env.CORS_DOMAINS || ""
  
  const whitelist = domainsFromEnv.split(",").map(item => item.trim())
  console.log(whitelist);
  
  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  }
  app.use(cors(corsOptions))


const http = require('http').Server(app)
const serverSocket = require('socket.io')(http)

const porta = process.env.PORT || 8000

const host = process.env.HEROKU_APP_NAME ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` : "http://localhost"

http.listen(porta, function(){
    const portaStr = porta === 80 ? '' :  ':' + porta

    if (process.env.HEROKU_APP_NAME) 
        console.log('Servidor iniciado. Abra o navegador em ' + host)
    else console.log('Servidor iniciado. Abra o navegador em ' + host + portaStr)
})

app.get('/', function (requisicao, resposta) {
    resposta.send({message: "Server On"});
})


serverSocket.on('connect', function(socket){
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