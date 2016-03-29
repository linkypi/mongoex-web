'use strict';

// var _     = require('underscore');
// var bson  = require('../bson');
// var os    = require('os');
// var utils = require('../utils');

var routes = function (config) {
  var exp = {};

  //view all entries in a collection
  exp.connect = function (req, res) {
  	 var param = req.body ;
      config.mongodb.server = param.server;
      config.mongodb.port = param .port;
      mongo = db(config);
      
  }

  return exp;
};

module.exports = routes;