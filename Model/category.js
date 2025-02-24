const mongoose = require('mongoose');

const category = mongoose.Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toHexString(),
        required: true
    },
    name: { type: String, required: true },
    img : { type: String, required: true},
    description: { type: String, required: false },
    created_at: { type: Date, default: Date.now }
})
const cate = mongoose.model('categorys', category);

module.exports = cate;