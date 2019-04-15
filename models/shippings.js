let mongoose = require('mongoose');

let ShippingSchema = new mongoose.Schema({
        tracking_number: {type: String, require: true, default: null},
        carrier_code: {type: String, require: true, default: null},
        transaction_id: {type: String, require: true},
        customer_id: {type: String, require: true},
        seller_id: {type: String, require: true},
        last_edit: Date
    },
    { collection: 'shipping' });

module.exports = mongoose.model('Shipping', ShippingSchema);
