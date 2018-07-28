'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    date: {type: Date},
    dateFormat: {type: String},
    content: {type: String},
    username: {type: String}
}, {
    versionKey: false,
    collection: 'MessagesCollection'
});

module.exports = mongoose.model('MessageModel', MessageSchema);