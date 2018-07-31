"use strict";

const MessageModel = require('./models/messages.model');
var User       = require('./models/users.model');
var moment = require('moment');

module.exports = io => {
    io.on('connection', function (socket) {
        console.log(socket.handshake.session);
        if (!socket.handshake.session.passport) {
            socket.join('all');
            let uName = 'guest' + Math.round(Math.random() * 10000000);
            socket.username = uName;
            socket.emit('connected', `You are connected to chat as ${socket.username}`);
        } else {
            let var0 = socket.handshake.session.passport.user;
            User.findOne({"_id" : var0._id}, function (err, user){
                if (err)
                    return done(err);
                socket.username = user.local.name;
                socket.emit('connected', `You are connected to chat as ${socket.username}`);
            })
        }

        socket.on('msg', content => {
            const obj = {
                date: new Date(),
                dateFormat: moment(new Date()).format("HH:mm:ss DD.MM.YYYY"),
                content: content,
                username: socket.username
            };

            MessageModel.create(obj, (err, result) => {
                if (err) {
                    return console.log('MessageModel', err);
                }

                socket.emit("message", obj);
                socket.to('all').emit("message", obj);
            });


        });

        socket.on('changeName', name => {
            socket.username = name;
            socket.emit('nameChanged', `You successful changed name to ${socket.username}`);
        });

        socket.on('receiveHistory', () => {
            MessageModel.find({})
                .sort({date: -1})
                .limit(10)
                .lean()
                .exec((err, messages) => {
                    if (!err) {
                        socket.emit('history', messages.reverse());
                    }
                });
        })
    });
}