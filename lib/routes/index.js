'use strict';

//Add routes from other files
var collectionRoute  = require('./collection');
var databaseRoute    = require('./database');
var documentRoute    = require('./document');
var gridFSRoute      = require('./gridfs');
var host             = require('../host');
var tableRoute       = require('./table');
var Promise          = require("promise");

var routes = function (config) {
  var exp = {};

  exp.getDatas          = tableRoute().getDatas;
  exp.delete          = tableRoute().delete;
  exp.update          = tableRoute().update;

  exp.addDatabase       = databaseRoute(config).addDatabase;
  exp.deleteDatabase    = databaseRoute(config).deleteDatabase;
  exp.viewDatabase      = databaseRoute(config).viewDatabase;

  exp.addCollection     = collectionRoute(config).addCollection;
  exp.compactCollection = collectionRoute(config).compactCollection;
  exp.deleteCollection  = collectionRoute(config).deleteCollection;
  exp.exportColArray    = collectionRoute(config).exportColArray;
  exp.exportCollection  = collectionRoute(config).exportCollection;
  exp.renameCollection  = collectionRoute(config).renameCollection;
  exp.updateCollections = collectionRoute(config).updateCollections;
  exp.viewCollection    = collectionRoute(config).viewCollection;

  exp.getProperty       = documentRoute(config).getProperty;
  exp.addDocument       = documentRoute(config).addDocument;
  exp.checkValid        = documentRoute(config).checkValid;
  exp.deleteDocument    = documentRoute(config).deleteDocument;
  exp.updateDocument    = documentRoute(config).updateDocument;
  exp.viewDocument      = documentRoute(config).viewDocument;

  exp.addBucket         = gridFSRoute(config).addBucket;
  exp.deleteBucket      = gridFSRoute(config).deleteBucket;
  exp.viewBucket        = gridFSRoute(config).viewBucket;
  exp.addFile           = gridFSRoute(config).addFile;
  exp.getFile           = gridFSRoute(config).getFile;
  exp.deleteFile        = gridFSRoute(config).deleteFile;

  //Homepage route
  exp.index = function (req, res) {
    var ctx = {
      title: 'Mongo Express',
      info: false,
    };

    if (typeof req.adminDb === 'undefined') {
      return res.render('index');
    }

    if(req.session.hosts){
      var funcs = [];

      req.session.hosts.forEach(function(item){
        //funcs.push(function (_args, callback) {
        //
        //  //首个执行时 _args为回调函数
        //  if (typeof(_args) === 'function') {
        //    first = true;
        //    callback = _args;
        //  }
        //
        //  host(item.config).infos(function(){
        //
        //  });
        //});

        funcs.push(new Promise(function (resolve, reject) {
          host(item.config).infos(function(err,result){
             if(err){reject(err);}
             result.sort = item.sort;
             resolve(result);
          });
        }));
      });
      Promise.all(funcs).then(function (arr) {
        res.locals.infos = arr;
        res.render('index', ctx);
      });
      //async.waterfall(funcs, function (err, _args) {
      //  if (err) {
      //    console.log('get collections take error : ' + err);
      //    reject(err);
      //  }
      //  resolve(_args);
      //});
      //res.locals.databases      = mongo.databases;
      //res.locals.collections    = mongo.collections;
    }
    //req.adminDb.serverStatus(function (err, info) {
    //  if (err) {
    //    //TODO: handle error
    //    console.error(err);
    //  }
    //
    //  ctx.info = info;
    //
    //  res.render('index', ctx);
    //});
  };

  return exp;
};

module.exports = routes;
