var PouchDB = require('pouchdb');
var config = require('./helpers').config;

PouchDB.plugin(require('pouchdb-quick-search'));
module.exports = new PouchDB(config.dbPath);
