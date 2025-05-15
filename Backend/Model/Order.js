const mongoose =require('mongoose')

const orderSchema = new mongoose.Schema({
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

    , products:[{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        returnRequested:{
            type: Boolean,
            default: false
        },
        name: String,
        brand: String,
        price: Number,
        sellingPrice: Number,
        imageUrls: [{ type: String }], 
        features: {
            cashOnDelivery: Boolean,
            lowestPrice: Boolean,
            sevenDayReturns: Boolean,
            freeDelivery: Boolean
        },
        size: {
          type: String,
          required: true
        }
       ,details:String
    }],
    totalAmount: Number,
    deliveryDate: Date,
    status: {
        type: String,
        enum: ['Ordered', 'Shipping', 'Out for Delivery', 'Delivered', 'Cancelled', 'Return Requested', 'Returned'],
        default: 'Ordered'
      },
      cancellationDate: {
        type: Date,
        default: null
      },
      returnRequestDate: {
        type: Date,
        default: null
      },
     
      shippingAddress:{
        name:String,
        houseNo:String,
        landmark: String,
        areaPin: String,
        state: String,
        phone: String,
      }

},{timestamps:true})

module.exports = mongoose.model('Order', orderSchema)