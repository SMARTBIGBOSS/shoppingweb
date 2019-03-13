let mongoose = require('mongoose');

//default seller = {"username": "customer@gmail.com", "password": "123abc-ABC"}

let ImageSchema = new mongoose.Schema({
        path: { type: [String], required: true},
        key: { type: [String], required: true},
        owner: { type: String, required: true},
        register_date: Date
    },
    { collection: 'image' });

module.exports = mongoose.model('Image', ImageSchema);
