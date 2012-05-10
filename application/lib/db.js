var 
mongodb = require('mongodb')
,db = new mongodb.Db('hellodenver', new mongodb.Server('127.0.0.1', mongodb.Connection.DEFAULT_PORT, {poolSize:10, auto_reconnect:true}), false);

module.exports = db;