let mongoose = require('mongoose');

let AddressSchema = new mongoose.Schema({
        customer_id: { type: String, required: true},
        consignee: { type: String, required: true},
        address: { type: String, required: true},
        city: { type: String, required: true},
        province: { type: String, required: true},
        country: { type: String, required: true},
        post_code: {type: String, required: true},
        contact_num: { type: String, required: true},
        last_edit: Date
    },
    { collection: 'address' });

module.exports = mongoose.model('Address', AddressSchema);
