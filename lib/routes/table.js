/**
 * Created by JL on 2016/3/30.
 */
'use strict';

//var bson  = require('../bson');
var host = require('../host');


var routes = function () {
    var exp = {};

    exp.getDatas = function (req, res) {
        //var limit = parseInt(req.params.limit, 10) || config.options.documentsPerPage;
        var hostid = req.params.host;
        var dbname = req.params.db;
        var table = req.params.table;
        var dbhost = host({id:hostid});
        dbhost.query(dbname,table,{},function(err,data){
            if(err){  res.json({err:err.message,data:[]});  };
            res.json({err:null,data:data});
        });

    };

   return exp;
}

module.exports = routes;