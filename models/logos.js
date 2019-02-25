let mongoose = require('mongoose');

//default seller = {"username": "customer@gmail.com", "password": "123abc-ABC"}

let LogoSchema = new mongoose.Schema({
        path: { type: String, required: true},
        owner: { type: String, required: true},
        register_date: Date
    },
    { collection: 'logo' });

module.exports = mongoose.model('Logo', LogoSchema);
