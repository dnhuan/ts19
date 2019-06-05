const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var flatCache = require('flat-cache')
var cache = flatCache.load('counter')
var total = 0
if(cache.getKey('key') == undefined){
    cache.setKey('key', { value: total })
    cache.save()
}

app.get("/",(req,res)=>{
    res.sendStatus(200)
})

http.listen(8080)

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