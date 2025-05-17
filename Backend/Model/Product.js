const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    sellingPrice:{
        type: Number,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    features: {
        cashOnDelivery: { type: Boolean, default: false },
        lowestPrice: { type: Boolean, default: false },
        fiveDayReturns: { type: Boolean, default: false },
        freeDelivery: { type: Boolean, default: false },
    },
    imageUrls: [{
        type: String,
        required: true
      }],

    size:{
        S:{type: Boolean, default: false},
        M:{type: Boolean, default: false},
        L:{type: Boolean, default: false},
        XL:{type: Boolean, default: false},
        XXL:{type: Boolean, default: false},
    }  ,
    details:String
},{timestamps:true})

module.exports = mongoose.model('Product', productSchema);