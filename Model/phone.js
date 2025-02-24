const mongoose =require ('mongoose');

const memoryDetail = new mongoose.Schema({
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    infoMemory: { type: String, required: true },
    _id:false,

});

const colorForImg = new mongoose.Schema({
    color: { type: String, required: true },
    imageUrl: { type: String, required: true },
    memory: { type: [memoryDetail], required: true },
    _id:false
});


const phone = new mongoose.Schema({
    _id :{
        type : String ,
        default:()=>new mongoose.Types.ObjectId().toHexString(),
        required: true
    },
    name :{
        type : String ,
        required: true
    },
    info:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    Sim:{
        type: String,
        required: true
    },
    Design:{
        type: String,
        required: true
    },
    Screen:{
        type: String,
        required: true
    },
    Pixel:{
        type: String,
        required: true
    },
    Cpu:{
        type: String,
        required: true
    },
    Ram :{
        type: String,
        required: true
    },
    Rom :{
        type: String,
        required: true
    },
    Camera1:{
        type: String,
        required: true
    },
    Camera2:{
        type: String,
        required: true
    },
    Jack:{
        type: String,
        required: true
    },
    Battery:{
        type: String,
        required: true
    },
    image:{
        type:[colorForImg],
        required: true
    }

})
const Phone = mongoose.model('phones', phone);
module.exports =Phone
