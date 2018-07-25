"use strict";

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {serveClient: true});
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

var path 		= require('path');

const passport = require('passport');
const { Strategy } = require('passport-jwt');

const { jwt } = require('./config');


var config 		= require('./config/index');

passport.use(new Strategy(jwt, function(jwt_payload, done) {
    if(jwt_payload != void(0)) return done(false, jwt_payload);
    done();
}));

var dbURI = "mongodb://" +
    encodeURIComponent(config.db.username) + ":" +
    encodeURIComponent(config.db.password) + "@" +
    config.db.host + ":" +
    config.db.port + "/" +
    config.db.name;

mongoose.connect(dbURI, console.log('Succes!'));
mongoose.Promise = require('bluebird');
mongoose.set('debug', true);

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

//For public directory
app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cookieParser());

require('./router')(app);

require('./sockets')(io);

server.listen(7777, () => {
    console.log('Server started on port 7777');
});