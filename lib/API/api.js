var getApiKey = require('../util/helpers').getApiKey;
var dbPouch = require('../connections/pouchDb');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');
var favicon = require('serve-favicon');

app.use(favicon('./images/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-bunyan-logger')({
	excludes: ["req","res","user-agent","req-headers","res-headers","req_id","remote-address","ip","method","url","referer","body","short-body","http-version","response-time","status-code","incoming"]
}));

// Routes

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
	getApiKey.then(function(apiKey){
		if (apiKey.toString() === req.query.apikey){
			return dbPouch.get(req.params.id);
		} else throw {message: 'Unauthorized', status: 401};
	}).then(function(doc){
		return dbPouch.remove(doc);
	}).then(function(response){
		res.json(response);
	}).catch(function(err){
		res.json(err);
	});
});

app.get('/urlReplicate',function(req,res){
	if (req.body.target) {
		var dbReplication = dbPouch.replicate.to(req.body.target);
		dbReplication.on('complete',function(info){
			res.json(info);
		});
		dbReplication.on('error',function(err){
			res.json(err);
		});
	} else res.json({message: 'No target specified', status: 400});
});

module.exports = app;
