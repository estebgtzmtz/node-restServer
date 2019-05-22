const moongose = require('mongoose')
const Schema = moongose.Schema;

const categorySchema = new Schema({
    description: {
        type: String,
        unique: true,
        required: [true, 'description is required']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = moongose.model('Category', categorySchema);