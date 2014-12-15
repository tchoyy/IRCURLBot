var Promise = require('bluebird');
var uuid = require('node-uuid');
var fs = Promise.promisifyAll(require('fs'));
var YAML = require('yamljs');
var weburl = require('./regex-weburl');

exports.config = YAML.load('config/config.yaml'),

exports.getUrl = function(message){
	var result = message.match(weburl);
	return (result!=null)?result[0]:null;
};

exports.getApiKey = fs.readFileAsync('api.key');

exports.generateAPIKey = new Promise(function(resolve,reject){
	fs.exists('api.key',function(exists){
		if (!exists) {
			var apiKey = uuid.v4();	
			fs.writeFile('api.key',apiKey,function(err){
				if (err) return reject(err);
				else return resolve('API key file generated');
			});
		} else return resolve('API key file already exists');
	});
})
