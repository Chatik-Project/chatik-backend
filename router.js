"use strict";

const UsersModel = require('./models/users.model');
const MessageModel = require('./models/messages.model');
const _ = require('lodash');
const config = require('./config');
const bcrypt = require('bcryptjs');
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const io = require('socket.io');

// function checkAuth (req, res, next) {
//     passport.authenticate('jwt', { session: false }, (err, decryptToken, jwtError) => {
//         if(jwtError != void(0) || err != void(0)) return res.render('index', { error: err || jwtError});
//         req.user = decryptToken;
//         console.log(req.user);
//         console.log(req.user.username);
//         next();
//     })(req, res, next);
// }
//
// function auth2 (socket, next) {
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
//
// function createToken (body) {
//     return jwt.sign(
//         body,
//         config.jwt.secretOrKey,
//         {expiresIn: config.expiresIn}
//     );
// }

module.exports = (app, passport) => {
    // app.use('/assets', express.static('./client/public'));

    app.get('/', (req, res) => {
        // console.log(req.user);
        // console.log(req.session);
        // // console.log(isLoggedIn());
        // console.log(isLoggedIn);
        // console.log(req.cookies);
        res.render('index.ejs');
    });

    app.get('/login', (req, res) => {
        res.render('login.ejs')
    });

    // function isLoggedIn(req, res, next) {
    //
    //     if (req.isAuthenticated())
    //         return next();
    //
    //     res.redirect('/404');
    //
    // }


    app.post('/changename', (req, res) => {
        console.log(req.user);
        UsersModel.update({"local.name": req.user.local.name}, { $set: {"local.name": req.body.newname}}, function (err, user) {
            if (err) return handleError(err);
            res.send("Succes!");
        });
    });


    app.get('/profile', isLoggedIn, (req, res) => {
        res.render('profile.ejs')
    });



    app.get('/api/getalluser', async (req, res) => {
        let users = await UsersModel.find().lean().exec();
        res.send(users);
        }
    );

    app.get('/api/getallmsg', async (req, res) => {
        let messages = await MessageModel.find().lean().exec();
        res.send(messages);
    })

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        // failureFlash : true // allow flash messages
    }));

    app.post('/register', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        // failureFlash : true // allow flash messages
    }));

    app.post('/logout', (req, res) => {
        // req.logout();
        // res.clearCookie('token');
        // res.status(200).send({message: "Logout success."});
        req.session.destroy(function (err) {
            res.redirect('/'); //Inside a callback… bulletproof!
        })

    })

    app.get('/auth/vk',
        passport.authenticate('vk', {
            scope: ['friends']
        }),
        function (req, res) {
            // The request will be redirected to vk.com
            // for authentication, so
            // this function will not be called.
        });

    app.get('/auth/vk/callback',
        passport.authenticate('vk', {
            failureRedirect: '/auth'
        }),
        function (req, res) {
            // Successful authentication
            //, redirect home.
            console.log("Удачная аутентификация!!!длаа")
            res.redirect('/');
        });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}