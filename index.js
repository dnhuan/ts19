const fs = require('fs')
const options = {
    cert: fs.readFileSync('sslcert/crt.pem'),
    key: fs.readFileSync('sslcert/key.pem')
}
const express = require("express")
const app = express()
const server = require("https").createServer(options,app)
const io = require("socket.io")(server)
var flatCache = require('flat-cache')
var cache = flatCache.load('counter');
var total = 0
if(cache.getKey('key') == undefined){
    cache.setKey('key', { value: total })
    cache.save()
}

app.use(express.static("www"))
app.use(require('helmet')());


app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/index.html")
})

server.listen(443)

io.on('connect',() => {
    total++
})

setInterval(() => {
    if(total < cache.getKey('key').value){
        total = cache.getKey('key').value
        if(total == undefined){
            total = 0
            cache.setKey('key', { value: total })
        }
        console.log(total);
    }
    //
    cache.setKey('key', { value: total })
    cache.save()
    var data = {
        o: io.engine.clientsCount,
        s: total
    }
    io.emit("realtime", data)
}, 500)