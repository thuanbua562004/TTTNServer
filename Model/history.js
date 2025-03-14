const mongoose = require('mongoose');
const productInCartSchema = new mongoose.Schema({
     color: { type: String },
     id_product: { type: String },
     imgProduct: { type: String },
     nameProduct: { type: String },
     number: { type: Number },
     price: { type: Number },
     memory: { type: String },
     _id:{ type:String}
 });
const historybuy = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId, 
    default: () => new mongoose.Types.ObjectId(),
  },
    id :{type: 'string',required: false},
    adress :{type: 'string',required: false},
    date: { type: Date, default: Date.now },
    methodPayload: {type: 'string',required: false},
    totalPrice: {type: Number,required: false},
    note : {type: 'string',required: false},
    phone : {type: 'string',required: false},
    stage :{type: 'string',default: 'Đơn mới'},
    nameCustomer : {type: 'string',required: false , default: 'Customer'},
    listProduct : [productInCartSchema]
})
const HistoryBuy = mongoose.model('history',historybuy);
module.exports = HistoryBuy;