"use stict";

const MessageModel = require('./models/messages.model');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const config = require('./config/index');

function auth (socket, next) {

    // Parse cookie
    cookieParser()(socket.request, socket.request.res, () => {});

    // JWT authenticate
    passport.authenticate('jwt', {session: false}, function (error, decryptToken, jwtError) {
        if(!error && !jwtError && decryptToken) {
            next(false, {username: decryptToken.username, id: decryptToken.id});
        } else {
            next('guest');
        }
    })(socket.request, socket.request.res);

}

module.exports = io => {
    io.on('connection', function (socket) {
        // auth(socket, (guest, user) => {
        //     if(!guest) {
                socket.join('all');
                socket.username = 'vasya';
                socket.emit('connected', `you are connected to chat as ${socket.username}`);
        //     }
        // });

        socket.on('msg', content => {
            const obj = {
                date: new Date(),
                content: content,
                username: socket.username
            };

                socket.emit("message", obj);
                socket.to('all').emit("message", obj);
            });



    });
};