const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

var _db

function connectDB(){
    return new Promise((resolve,reject)=>{
        try {
            MongoClient.connect("mongodb://localhost:27017/TS19",{ useNewUrlParser: true }, (error, client)=>{
                if(error) return reject(error)
                _db = client.db(process.env.DB)
                return resolve(_db)
            })
        } catch (error) {
            return reject(error)
        }
    })
}

function getDB(callback){
    callback(_db)
}

module.exports = {
    connectDB,
    getDB
}