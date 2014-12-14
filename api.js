var config = require('./lib/util/helpers').config;
var dbPouch = require('./lib/connections/pouchDb');
var log = require('./lib/util/logger');
var express = require('express');
var app = express();
var uuid = require('node-uuid');
var fs = require('fs');
var _ = require('underscore');

var getApiKey = function(cb){
	fs.readFile('api.key',function(err,apiKey){
		typeof cb === "function" && cb(err,apiKey);
	});
};

app.get('/url',function(req,res){
	dbPouch.allDocs({include_docs:true}).then(function(results){
		res.json(_.pluck(results.rows,"doc"));
	});
});

app.get('/url/:id',function(req,res){
	dbPouch.get(req.params.id,function(err,doc){
		res.json(doc);
	});
});

app.delete('/url/:id',function(req,res){
	getApiKey(function(err,apiKey){
		if (apiKey.toString() === req.query.apikey){
			dbPouch.get(req.params.id).then(function(doc){
				return dbPouch.remove(doc);
			}).then(function(response){
				res.json(response);
			});
		} else res.json({message: 'Unauthorized', status: 401});
	});
});

var server = app.listen(3000);

log.info("server listening  at http://"+server.address().address+":"+server.address().port);

fs.exists('api.key',function(exists){
	if (!exists) {
		var apiKey = uuid.v4();	
		fs.writeFile('api.key',apiKey,function(err){
			if (err) log.error(err);
			else log.info('Api key file generated');
		});
	}
});
