const express = require('express');
const expressServer = require('http').createServer();
const app = express()


// http server
app.get('/', function(req, res){
    res.sendFile('index.html', {root: __dirname});
});

expressServer.on('request', app);
expressServer.listen(3000, function(){ console.log("server started on port 3000");})   


// Webscokets
const WebScoketServer = require('ws').Server;
const wss = new WebScoketServer({server: expressServer})

wss.on('connection', function connection(ws) {
    const numClients = wss.clients.size
    if (ws.readyState === ws.OPEN) {
        ws.send('Welcome to the server.');
    }
    console.log('New Client Connected - Total Clients Connected: ', numClients)

    wss.broadcast(`Current Connections: ${numClients}`);
    ws.on('close', function close(){
        wss.broadcast(`Current Connections: ${numClients}`);
        console.log("Client closed")
    })

})

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client){
        client.send(data)
    })
}