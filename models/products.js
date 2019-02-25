let mongoose = require('mongoose');

let ProductSchema = new mongoose.Schema({
        seller_id: { type: String, required: true},
        name: { type: String, required: true, unique: true, maxlength: 100},
        price: {type: Number, required: true},
        stock: {type: Number, required: true},
        body_id: {type: String, default: null},
        detail_id: {type: String, default: null},
        class_region_id: {type: String, required: true},
        class_type_id: {type: String, required: true},
        catalogue_id: {type: String, required: true},
        isShow: {type: Boolean, default: false},
        last_edit: Date
    },
    { collection: 'product' });

module.exports = mongoose.model('Product', ProductSchema);
