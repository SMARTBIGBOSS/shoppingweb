import {Double} from "mongodb"
let mongoose = require('mongoose');

let ProductSchema = new mongoose.Schema({
        seller_id: { type: String, required: true},
        name: { type: String, required: true, unique: true, maxlength: 100},
        price: {type: Double, required: true},
        stock: {type: Number, required: true},
        image_url: {type: bufferCommands},
        class_id: {type: String, required: true},
        catalogue_id: {type: String, required: true},
        isShow: {type: Boolean, default: false},
        last_edit: Date
    },
    { collection: 'product' });

module.exports = mongoose.model('Product', ProductSchema);
