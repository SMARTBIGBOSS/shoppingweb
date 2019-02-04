let mongoose = require('mongoose');

let CatalogueSchema = new mongoose.Schema({
        seller_id: { type: String, required: true},
        name: { type: String, required: true, unique: true, maxlength: 30},
        last_edit: Date
    },
    { collection: 'catalogue' });

module.exports = mongoose.model('Catalogue', CatalogueSchema);
