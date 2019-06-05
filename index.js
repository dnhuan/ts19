const fs = require('fs')
const options = {
    key: fs.readFileSync('www/sslcert/privkey.pem'),
    cert: fs.readFileSync('www/sslcert/fullchain.pem'),
    ca : fs.readFileSync('www/sslcert/chain.pem')
}
const express = require("express")
const app = express()
const server = require("https").Server(options,app)
const io = require("socket.io")(server)
const path = require("path")
var flatCache = require('flat-cache')
var cache = flatCache.load('counter');
var total = 0
if(cache.getKey('key') == undefined){
    cache.setKey('key', { value: total })
    cache.save()
}

app.use(express.static(path.join(__dirname, 'www')))
app.use(require('helmet')());


app.get("/",(req,res)=>{
    console.log(__dirname);
    res.sendFile(__dirname + "/index.html")
})

server.listen(8443)

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