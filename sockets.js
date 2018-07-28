"use strict";

const MessageModel = require('./models/messages.model');
var User       = require('./models/users.model');
var moment = require('moment');



// function auth (socket, next) {
//
//     // Parse cookie
//     cookieParser()(socket.request, socket.request.res, () => {});
//
//     // JWT authenticate
//     passport.authenticate('jwt', {session: true}, function (error, decryptToken, jwtError) {
//         if(!error && !jwtError && decryptToken) {
//             next(false, {username: decryptToken.username, id: decryptToken.id});
//         } else {
//             next('guest');
//         }
//     })
//     (socket.request, socket.request.res);
//
// }

// function auth (req, res, next) {
//     if (!req.user) {
//     console.log('THIS!');
//     console.log(req.user);
//     next;
//         } else {
//     console.log('THAT');
//     console.log(req.user);
//     next;
//     }
// }

// function auth (socket, next) {
//
//     // Parse cookie
//
//     cookieParser()(socket.request, socket.request.res () => {
//
//         console.log(decryptToken);
//         console.log(decryptToken
//         );
//         console.log('THERE!');
//     });
//
//     // JWT authenticate
//     passport.authenticate('local-login', {session: true}, function (error, decryptToken) {
//         console.log('BEFORE IF')
//         if(!error && decryptToken) {
//             console.log(decryptToken.username);
//             console.log(decryptToken.id);
//             next(false, {username: decryptToken.username, id: decryptToken.id});
//         } else {
//             next('guest');
//         }
//     })
//
// }


module.exports = io => {
    io.on('connection', function (socket) {
        console.log(socket.handshake.session);
        if (!socket.handshake.session.passport) {
            console.log('Part0 ' + JSON.stringify(socket.handshake));
            socket.join('all');
            let uName = 'guest' + Math.round(Math.random() * 10000000);
            socket.username = uName;
            socket.emit('connected', `You are connected to chat as ${socket.username}`);
        } else {
            console.log("!!!!!!!!!!!!" + socket.handshake.session.cookie);
            // let hs = new Object(JSON.parse(socket.handshake));
            // console.log("ACT!" + hs.cookie)
            let var0 = new Object(JSON.parse(socket.handshake.session.passport.user));

            console.log(var0);
            console.log(var0._id);
            User.findOne({"_id" : var0._id}, function (err, user){
                if (err)
                    return done(err);
                console.log(user);
                socket.username = user.local.name;
                socket.emit('connected', `You are connected to chat as ${socket.username}`);
            })
            // console.log(typeof var0);
            // console.log('VAR0' + var0);
            // let varA = JSON.stringify(socket.handshake.session.passport.user);
            // console.log("varA" + varA);
            // let varB = JSON.parse(varA);
            // console.log("varB" + varB);
            // console.log(typeof varB);
            // let obj = new Object(varB);
            // console.log("OBJ" + obj);
            // console.log(typeof obj);
            // console.log(obj._id);
            // console.log(Array.isArray(obj))
            // let varC = JSON.stringify(varB);
            // console.log('varC' + varC);
            // let varD = "'" + varB + "'";
            // console.log(varD);
            // console.log(varD)
            // let varB = [JSON.parse(varA)];
            // console.log('varA' + varA);
            // console.log('varB' + varB[0]["vk"]);
            // console.log(varB["vk"]);
            // console.log('Part0 ' + JSON.stringify(socket.handshake.session.passport.user))
            // console.log('Part0 ' + socket.handshake.session.passport.user)
            // let varC = socket.handshake.session.passport.user;
            // console.log(varC.vk);
            // console.log(varC.vk.id)
        }
        // console.log('Part1 ' + socket.handshake.session.userdata);
        // socket.on('login', function(userdata) {
        //     socket.handshake.session.userdata = userdata;
        //     socket.handshake.session.save();
        //     console.log('THIS' + socket.handshake.session.userdata);
        //     // if (!socket.handshake.session.cookie.passport.user) {
        //     //     console.log("next");
        //     // } else {
        //     //     console.log(socket.handshake.session.cookie.passport.user);
        //     // }
        // })
        // // auth(socket, (guest, user) => {
        // //     if (!guest) {
        // //         socket.join('all');
        // //         socket.username = user.username;
        // //         socket.emit('connected', `you are connected to chat as ${socket.username}`);
        // //     } else {
        //         socket.join('all');
        //
        // //         console.log(socket.handshake.headers.cookie);
        // // var handshakeData = socket.request;
        // // handshakeData.cookies = cookieParser(socket.handshake.headers.cookie || '');
        // // var sidCookie = handshakeData.cookies['wgwsighwiortgnowirg'];
        // // var sid = cookieParser.signedCookie(sidCookie, 'wgwsighwiortgnowirg');
        // // if(!sid){
        // //     console.log('Not session found');
        // // }
        //         let uName = 'guest' + Math.round(Math.random() * 10000000);
        //         socket.username = uName;
        //         socket.emit('connected', `you are connected to chat as ${socket.username}`);
        //     // }
        //
        //
        // socket.on("login", function(message) {
        //     // console.log(message)
        //     // socket.handshake.session.user = {
        //     //   username: 'jorgei'
        //     // }
        //     // socket.handshake.session.save();
        //     if (typeof message !== 'undefined' && message && typeof message.user !== 'undefined' && message.user) {
        //         // console.log(socket.handshake.session);
        //         // console.log(socket.id);
        //         // socket.handshake.session.socketID = socket.id;
        //         // socket.handshake.session.socketName = message.user.username || socket.id;
        //         // socket.handshake.session.save();
        //     }
        // })

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
        })

        socket.on('receiveHistory', () => {
            MessageModel.find({})
                .sort({date: -1})
                .limit(10)
                // .sort({date: 1})
                .lean()
                .exec((err, messages) => {
                    if (!err) {
                        socket.emit('history', messages.reverse());
                    }
                });
        })
    });
}