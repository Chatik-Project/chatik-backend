"use stict";

const cookieParser = require('cookie-parser');
const passport = require('passport');
const config = require('./config/index');
const MessageModel = require('./models/messages.model');

function auth (socket, next) {

    // Parse cookie
    cookieParser()(socket.request, socket.request.res, () => {});

    // JWT authenticate
    passport.authenticate('jwt', {session: true}, function (error, decryptToken, jwtError) {
        if(!error && !jwtError && decryptToken) {
            next(false, {username: decryptToken.username, id: decryptToken.id});
        } else {
            next('guest');
        }
    })
    (socket.request, socket.request.res);

}

module.exports = io => {
    io.on('connection', function (socket) {
        auth(socket, (guest, user) => {
            if (!guest) {
                socket.join('all');
                socket.username = user.username;
                socket.emit('connected', `you are connected to chat as ${socket.username}`);
            } else {
                socket.join('all');
                let uName = 'guest' + Math.round(Math.random() * 10000000);
                socket.username = uName;
                socket.emit('connected', `you are connected to chat as ${socket.username}`);
            }
        });

        socket.on('msg', content => {
            const obj = {
                date: new Date(),
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
        })

        socket.on('receiveHistory', () => {
            MessageModel.find({})
                .sort({date: -1})
                .limit(10)
                .sort({date: 1})
                .lean()
                .exec((err, messages) => {
                    if (!err) {
                        socket.emit('history', messages);
                    }
                });
        })
    });
}