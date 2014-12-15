var uuid = require('node-uuid');
var fs = require('fs');
var YAML = require('yamljs');
var weburl = require('./regex-weburl');

exports.config = YAML.load('config/config.yaml'),

exports.getUrl = function(message){
	var result = message.match(weburl);
	return (result!=null)?result[0]:null;
};

exports.getApiKey = function(cb){
	fs.readFile('api.key',function(err,apiKey){
		typeof cb === "function" && cb(err,apiKey);
	});
};

exports.generateAPIKey = function(cb){
	fs.exists('api.key',function(exists){
		if (!exists) {
			var apiKey = uuid.v4();	
			fs.writeFile('api.key',apiKey,function(err){
				if (err) typeof cb === "function" && cb(err,null);
				else typeof cb === "function" && cb(null,'API key file generated');
			});
		} else typeof cb === "function" && cb(null,'API key file already exists');
	});
};
