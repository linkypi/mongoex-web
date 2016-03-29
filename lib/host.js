
var Db = require('./dbx');
var cache = require('memory-cache');
var hostlist = {};

var host = function(config){

    var mongo = hostlist[config.id];// cache.get(config.id);
    if(mongo){
       return mongo;
    }

    mongo = Db(config);
    if(mongo){
        hostlist[mongo.id] = mongo;
        //cache.put(mongo.id,mongo,365*24*60*60*1000); // time in ms
    }

    return mongo ;
};


module.exports = host;