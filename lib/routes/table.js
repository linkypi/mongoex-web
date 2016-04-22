/**
 * Created by JL on 2016/3/30.
 */
'use strict';

//var bson  = require('../bson');
var host = require('../host');
var ObjectId = require('mongodb').ObjectID;

var routes = function () {
    var exp = {};
    exp.getDatas = function (req, res) {
        //var limit = parseInt(req.params.limit, 10) || config.options.documentsPerPage;
        var hostid = req.params.host;
        var dbname = req.params.db;
        var table = req.params.table;
        var dbhost = host({id:hostid});
        dbhost.query(dbname,table,{limit: parseInt(req.query.limit) , offset: parseInt(req.query.offset) },
            function(err,data){
              if(err){  res.json({err:err.message,data:[]});  };
              //res.json({err:null,data:data});
              res.json(data);
        });
    };

    exp.delete = function (req, res) {
        var dbname = req.params.db;
        var table = req.params.table;
        var dbhost = host({id: req.params.host });

        var arr = [],ids = req.body._id;
        if(ids.length === 0) res.json({success:false});
        for(var i=0;i<ids.length;i++){
            arr.push(new ObjectId(ids[i]));
        }

        dbhost.delete(dbname,table,{ _id:{ $in: arr }},
            function(err,result){
                if(err){  res.json({err:err.message,success:false});  };
                var success = false;
                if(result.deletedCount === ids.length) success = true;
                res.json({success:success});
         });
    };

   return exp;
}

module.exports = routes;