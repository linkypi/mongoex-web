/**
 * Created by JL on 2016/3/23.
 */

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var Promise = require("promise");
var async = require('async');

var url = 'mongodb://192.168.0.228:27017';

var insertDocument = function(db, callback) {
    db.collection('restaurants').insertOne( {
        "address" : {
            "street" : "2 Avenue",
            "zipcode" : "10075",
            "building" : "1480",
            "coord" : [ -73.9557413, 40.7720266 ]
        },
        "borough" : "Manhattan",
        "cuisine" : "Italian",
        "grades" : [
            {
                "date" : new Date("2014-10-01T00:00:00Z"),
                "grade" : "A",
                "score" : 11
            },
            {
                "date" : new Date("2014-01-16T00:00:00Z"),
                "grade" : "B",
                "score" : 17
            }
        ],
        "name" : "Vella",
        "restaurant_id" : "41704620"
    }, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the restaurants collection.");
        callback();
    });
};

var listcolls = function (args) {

    return new Promise(function(resolve,reject){


        //var pris = [];
        //args.databases.forEach(function (item) {
        //    pris.push(new Promise(function(resolve, reject){
                try{

                  var funcs = [];
                  args.databases.forEach(function (item) {
                        var dname = item.name;
                        var db = args.db.db(dname);

                        funcs.push(function(_args,callback){
                            //this._args = this.arguments;
                            //var _this = this;
                            if(typeof(_args) === 'function'){ callback = _args; }

                            db.collections(function (err, result) {
                                var data = {};
                                data[dname] = [];
                                for(var index in result){
                                    data[dname].push(result[index].s.name);
                                }
                                var next = { databases:args.databases, colls: data};
                                if(typeof(_args) !== 'function'){
                                //    next = { databases:args.databases, colls: data};
                                //}else{
                                    next = { databases:args.databases, colls: data};
                                    for(var attr in _args || {})
                                    {
                                        next.colls[attr] = _args[attr];
                                    }
                                }

                                //console.log("list cls: " + JSON.stringify(data));
                                callback(null, next);
                            });
                        });
                    });

                    async.waterfall(funcs, function (err, _args) {
                        resolve(_args);
                       // console.log(result);
                    });
                }catch(err){
                    reject(err);
                }
        //    }));
        //});

        //Promise.all(pris).then(function(results) {
        //    console.log('Then: ', one);
        //    data.cols = results;
        //    resolve(data);
        //}).catch(function(err) {
        //    console.log('Catch: ', err);
        //    reject(err);
        //});

    });
};

var dbs = function (db) {

    return new Promise(function (resolve, reject) {
        try{
            db.admin().listDatabases(function (err, result) {
                console.log("databases:" + JSON.stringify(dbs));
                resolve({admin:db.admin(),db:db,databases:result.databases});
            });
        }catch(err){
            reject(err);
        }
    });
};

module.exports.insert = function() {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);

        dbs(db).then(listcolls)
            .then(function(result){
                console.log("all infos : " + JSON.stringify(result));
            })
        .catch(function(ex) {
            console.log("get db info take error: " + ex);
        }).finally(function(){
           db.close();
        });
        //db.collections(function (err,result) {
        //   console.log("cls: " + JSON.stringify(result));
        //});
        //
        //db.listCollections().toArray(function (err, result) {
        //    console.log("list cls: " + JSON.stringify(result));
        //
        //});
        //
        //
        //db.listDatabases(function (err, dbs) {
        //    console.log("databases:" + JSON.stringify(dbs));
        //
        //});

        //insertDocument(db, function () {
        //    db.close();
        //});
    });
};