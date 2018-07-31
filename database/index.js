'use strict';

var config 		= require('../config/index');
var Mongoose 	= require('mongoose');

var dbURI = "mongodb://" + 
			encodeURIComponent(config.db.username) + ":" + 
			encodeURIComponent(config.db.password) + "@" + 
			config.db.host + ":" + 
			config.db.port + "/" + 
			config.db.name;
Mongoose.connect(dbURI, console.log('Succes!'));


Mongoose.connection.on('error', function(err) {
	if(err) throw err;
});


Mongoose.Promise = global.Promise;
