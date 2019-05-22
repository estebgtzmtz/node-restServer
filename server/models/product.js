const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name must be provided'],
        unique: true
    },
    unitPrice: {
        type: Number,
        required: [true, 'Unit price must be provided']
    },
    description: {
        type: String,
        required: false
    },
    available: {
        type: Boolean,
        required: true,
        default: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Product', productSchema);