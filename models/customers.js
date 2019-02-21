let mongoose = require('mongoose');

//default seller = {"username": "customer@gmail.com", "password": "123abc-ABC"}

let CustomerSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true, match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[a-zA-Z\d\W?$]{8,16}/ },
        name: { type: String, required: true, unique: true, maxlength: 30},
        register_date: Date,
        active: { type: Boolean, default: false},
        active_code: String,
        logo_id: String
    },
    { collection: 'customer' });

module.exports = mongoose.model('Customer', CustomerSchema);
