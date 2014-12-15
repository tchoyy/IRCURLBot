var getApiKey = require('../util/helpers').getApiKey;
var dbPouch = require('../connections/pouchDb');
var express = require('express');
var app = express();
var _ = require('underscore');

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

module.exports = app;
