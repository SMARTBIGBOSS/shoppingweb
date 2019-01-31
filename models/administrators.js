let mongoose = require('mongoose');

//default admin = {"username": "admin@gmail.com", "password": "123abc-ABC"}

let AdminSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true, match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[a-zA-Z\d\W?$]{8,16}/ },
        name: { type: String, required: true, maxlength: 30},
        register_date: Date,
        active: { type: Boolean, default: true}
    },
    { collection: 'admin' });

module.exports = mongoose.model('Admin', AdminSchema);


