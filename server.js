const express = require("express");
const socket = require("socket.io");
const app = express();
const cors = require("cors");
const res = require("express/lib/response");
const { json } = require("express/lib/response");

app.use(cors({ origin: true }));
app.use(express.json());

class MensagemPayload {
    constructor(nome, mensgem){
        this.nome = nome;
        this.mensagem = mensgem;
    }
}

let listaMensagem = [];


const port = process.env.PORT || 8000
const host = process.env.HEROKU_APP_NAME ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` : "http://localhost"

const server = app.listen(port, () => {
      const portStr = port === 80 ? '' :  ':' + port
      if (process.env.HEROKU_APP_NAME) 
          console.log('Servidor iniciado. Abra o navegador em ' + host)
      else 
            console.log('Servidor iniciado. Abra o navegador em ' + host + portStr)  
});

io = socket(server, { 
    cors: { 
        origins: ["*"],
        methods: ["GET", "POST"],
        credentials: true
    },
    allowEIO3: true
});

app.get('/', function (requisicao, resposta) {
    resposta.sendStatus(200);
});


io.on("connection", (socket) => {
  console.log(socket.id);

socket.on("send_message", (data) => {

    let mensagem = new MensagemPayload(data.nome, data.mensagem);
    listaMensagem.push(mensagem);
    socket.emit("receive_message", listaMensagem);
    console.log(listaMensagem);
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });
});