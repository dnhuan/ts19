const io = require("socket.io").listen(8080)

const flatCache = require('flat-cache')
var cache = flatCache.load('counter')
var total = 0

if(cache.getKey('key') == undefined){
    cache.setKey('key', { value: total })
    cache.save()
}

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