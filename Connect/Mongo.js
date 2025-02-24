const mongoose = require('mongoose');
const uri = "mongodb+srv://admin:123456thuan@cluster0.sglib.mongodb.net/TTTN-Web";

try {
    if(mongoose.connect(uri)){
        console.log('Connected to MongoDB');
    }
} catch (error) {
  handleError(error);
}

module.exports =mongoose