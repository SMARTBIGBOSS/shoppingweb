let mongoose = require('mongoose');

//default seller = {"username": "seller@gmail.com", "password": "123abc-ABC"}

let SellerSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true, match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[a-zA-Z\d\W?$]{8,16}/ },
        name: { type: String, required: true, unique: true, maxlength: 30},
        description: { type: String, maxlength: 200},
        register_date: Date,
        active: { type: Boolean, default: false}
    },
    { collection: 'seller' });

module.exports = mongoose.model('Seller', SellerSchema);
