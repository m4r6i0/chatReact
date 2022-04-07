const { response } = require('express')
const express = require('express')
const cors = require('cors');

const app = express()

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
app.configure(function() {
    app.use(allowCrossDomain);
    app.use(express.static("public"));
    console.log('configure cors');
}); 



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
    resposta.sendStatus(200)
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