let mongoose = require('mongoose');

let ClassificationSchema = new mongoose.Schema({
        admin_id: { type: String, required: true},
        type: { type: String, required: true},
        title: { type: String, required: true},
        subtitle: { type: String, required: true},
        active: {type: Boolean, default: false},
        last_edit: Date
    },
    { collection: 'classification' });

module.exports = mongoose.model('Classification', ClassificationSchema);
