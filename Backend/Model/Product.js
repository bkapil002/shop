const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    brand:{
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
        US7:{type: Boolean, default: false},
        US8:{type: Boolean, default: false},
        US9:{type: Boolean, default: false},
        US10:{type: Boolean, default: false},
        US11:{type: Boolean, default: false},
        US12:{type: Boolean, default: false},
    }  ,
    details:String
},{timestamps:true})

module.exports = mongoose.model('Product', productSchema);