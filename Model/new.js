const mongoose = require('mongoose');
const { Schema } = mongoose;

const news = new Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toHexString(),
        required: true
    },
    title: { type: String, require: true },
    img1:{ type: String, require: true },
    img2:{ type: String, require: true },
    img3:{ type: String, require: true },
    img4:{ type: String, require: true },
    info: { type: String, require: true },
    details: { type: String, require: true },
    date: { type: Date, default: Date.now }

});

const News = mongoose.model('News', news);
module.exports = News;