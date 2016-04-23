/**
 * Created by JL on 2016/3/23.
 */

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var utils = require('./utils');
var ObjectId = require('mongodb').ObjectID;
var Promise = require("promise");
var async = require('async');

var mongo = function(config) {
    //this.id = utils.guid();
    //config.id =this.id;
    //this.config = config;
    var id = utils.guid();
    config.id = id;
    this.id = id;
    this.config = config;
    //return {
    //    id: id,
    //    config:config,
    //    infos:infos
    //};
}

/**
 * 获取主机所有数据库及集合
 * @param args
 * @returns {*|exports|module.exports}
 */
var getColls = function (args) {
    return new Promise(function (resolve, reject) {
        try {

            var funcs = [];
            args.databases.forEach(function (item) {
                var dname = item;
                var db = args.db.db(dname);
                var databases = args.databases;
                var first = false;

                funcs.push(function (_args, callback) {

                    //首个执行时 _args为回调函数
                    if (typeof(_args) === 'function') {
                        first = true;
                        callback = _args;
                    }
                    db.collections(function (err, result) {

                        if (first) {
                            first = false;
                            _args = {databases: databases, colls: {}};
                        }

                        _args.colls[dname] = [];
                        for (var index in result) {
                            _args.colls[dname].push(result[index].s.name);
                        }

                        //console.log("list cls: " + JSON.stringify(_args));
                        callback(null, _args);
                    });
                });
            });

            //顺序执行函数  不应该同步执行 防止竞争资源造成堵塞
            async.waterfall(funcs, function (err, _args) {
                if (err) {
                    console.log('get collections take error : ' + err);
                    reject(err);
                }
                resolve(_args);
            });
        } catch (err) {
            reject(err);
        }
    });
};

var getDbs = function (db) {
    return new Promise(function (resolve, reject) {
        try {
            db.admin().listDatabases(function (err, result) {
                //console.log("databases:" + JSON.stringify(result));
                if(err){ reject(err);}
                var dbs = [];
                result.databases.forEach(function(item){
                    dbs.push(item.name);
                });
                resolve({ admin: db.admin(), db: db, databases: dbs});
            });
        } catch (err) {
            reject(err);
        }
    });
};

/**
 * 获取主机数据库信息
 * @param callback
 */
mongo.prototype.infos = function (callback) {
    _this = this;
    MongoClient.connect(this.config.url, function (err, db) {
        //assert.equal(null, err);
        if(err){ callback(err);}
        getDbs(db).then(getColls)
            .then(function (result) {
                if(result){
                    result.name = _this.config.name;
                    result.id = _this.id;
                }
                callback(null,result);
                //console.log("all infos : " + JSON.stringify(result));
            })
            .catch(function (ex) {
                console.log("get db infos take error: " + ex);
                callback(ex);
            })
            .finally(function () {
                db.close();
            });
    });
};
/**
 *
 */
//mongo.prototype.insertDocument = function (dname,cname, data) {
//    if(!data) return;
//    MongoClient.connect(this.config.url, function (err, db) {
//        var db = args.db.db(dname);
//        db.collection(cname).insertOne(data, function (err, result) {
//            assert.equal(err, null);
//            console.log('Inserted a document into the '+ cname +' collection. data: ' + JSON.stringify(data));
//            callback();
//        });
//    });
//};

/**
 * 查询数据
 * @param dbname
 * @param table
 * @param option
 * @param callback
 */
mongo.prototype.query = function (dbname,table, option,callback) {
    if(!dbname|| !table) return;
    option.pi = option.pi || 1;
    option.ps = option.ps || 20;
    option.offset = option.offset || 0;
    option.limit = option.limit || 10;
    MongoClient.connect(this.config.url, function (err, db) {
        var collection = db.db(dbname).collection(table);
        var total=0;
        collection.count().then(function(count){
            total = count;
            collection.find(option.where ||{})
                .skip(option.offset)
                .limit(option.limit)
                .toArray(function(err, docs) {
                    db.close();
                    callback(err,{total:total,rows:docs});
                });
        });


    });
};

/**
 * 删除数据
 * @param dbname
 * @param table
 * @param where
 * @param callback
 */
mongo.prototype.delete = function (dbname,table, where,callback) {
    if(!dbname|| !table) return;

    MongoClient.connect(this.config.url, function (err, db) {
        var collection = db.db(dbname).collection(table);
        collection.deleteMany( where ,function(err,r){
            callback(err,r);
        });
    });
};

/**
 * 更新数据
 * @param dbname
 * @param table
 * @param where
 * @param updates
 * @param options
 * @param callback
 */
mongo.prototype.update = function (dbname,table, where,updates,options,callback) {
    if(!dbname|| !table) return;

    if(typeof options === 'function'){
        callback = options;
        options = {};
    }
    MongoClient.connect(this.config.url, function (err, db) {
        var collection = db.db(dbname).collection(table);
        collection.updateMany(where,updates,options,function(err,r){
            callback(err,r);
        });
    });
};

module.exports = mongo;