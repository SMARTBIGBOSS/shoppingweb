let mongoose = require('mongoose');

let TransactionSchema = new mongoose.Schema({
        paymentId: {type: String,required: true},
        customer_id: { type: String, required: true},
        seller_id: { type: String, required: true},
        firstName: { type: String, required: true},
        lastName: { type: String, required: true},
        address: { type: String, required: true},
        city: { type: String, required: true},
        province: { type: String, required: true},
        country_code: { type: String, required: true},
        postal_code: {type: String, required: true},
        contact_num: {type: String, required: true},
        email: { type: String, required: true},
        product_id: {type: String, required: true},
        product_name: {type: String, required: true},
        product_price: {type: String, required : true},
        quantity: {type: String, required: true},
        shipping_price: {type: String},
        total:{type: String, required: true},
        currency: {type: String, required: true},
        payment_statue: {type: String, required: true, default: 'uncompleted'},
        shipping_statue: {type: String, required: true, default: 'pending'},
        last_edit: Date
    },
    { collection: 'transaction' });

module.exports = mongoose.model('Transaction', TransactionSchema);
