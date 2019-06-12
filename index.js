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
const connectDB = require('./database').connectDB
const getDB = require('./database').getDB
var flatCache = require('flat-cache')
var cache = flatCache.load('counter');
var total = 0
if(cache.getKey('key') == undefined){
    cache.setKey('key', { value: total })
    cache.save()
}

app.use(express.static(path.join(__dirname, 'www')))

app.get("/",(req,res)=>{
    res.sendStatus(200)
})

server.listen(8083)

function process(sock){
    sock.on('getData',sbd=>{
        getDB(db=>{
                var ketqua = db.collection("ketqua")
                ketqua.findOne({"SBD":sbd}, (err,res)=>{
                    if(err) console.error(err)
                    var send = {
                        s: null,
                        h: null,
                        e: null,
                        v: null,
                        a: null,
                        t: null,
                        c: null
                    }
                    if(res == null){
                        sock.emit("dataRes",{})
                    }else{
                        console.log(res);
                        send = res;
                        delete send._id;
                        sock.emit("dataRes",res)
                    }
                })
            })
    })
}

io.on('connect',(socket) => {
    process(socket)
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
}, 1000)

connectDB()
	.then(()=>{
		console.log("Connected to MongoDB")
	})
	.catch(()=>{console.log("Error connecting to MongoDB")})