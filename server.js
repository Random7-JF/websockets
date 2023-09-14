const express = require('express');
const expressServer = require('http').createServer();
const app = express()


// Http server
app.get('/', function(req, res){
    res.sendFile('index.html', {root: __dirname});
});


expressServer.on('request', app);
expressServer.listen(3000, function(){ console.log("server started on port 3000");})   

process.on("SIGINT", () => {
    server.close(() => {
        shutdownDB();
    })
})

// Webscoket server
const WebScoketServer = require('ws').Server;
const wss = new WebScoketServer({server: expressServer})

wss.on('connection', function connection(ws) {
    const numClients = wss.clients.size
    if (ws.readyState === ws.OPEN) {
        ws.send('Welcome to the server.');
    }
    console.log('New Client Connected - Total Clients Connected: ', numClients)

    db.run(`INSERT INTO visitors (count,time)
        VALUES (${numClients}, datetime('now'))`)

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

// Database
const sqlite = require('sqlite3');
const db = new sqlite.Database(':memory:');

db.serialize(() => {
    db.run(`
        CREATE TABLE visitors (
            count INTEGER,
            time TEXT
        )
    `)
});

function getCounts() {
    db.each("SELECT * FROM visitors", (err, row) => {
        console.log(row);
    })
}

function shutdownDB() {
    getCounts();
    console.log("Shutting down db");
    db.close();
}