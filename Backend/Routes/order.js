const express = require('express')
const Order  = require('../Model/Order')
const Address = require('../Model/Address')
const {auth } = require('../middleware/auth')
const Cart = require('../Model/Cart')
const router = express.Router()

router.post('/', auth , async(req,res)=>{
    try {
         const cart = await Cart.findOne({user: req.user._id}).populate('products.product')

         if(!cart){
            return res.status(400).json({message: 'Cart is empty'})
        }

        const address = req.body.addressId
         ?await Address.findOne({_id: req.body.addressId , user: req.user._id})
         :await Address.findOne({user:req.user._id})

         if(!address){
            return res.status(400).json({message: 'Address not found'})
        }

        const orderProducts = cart.products.map(item =>({
            product: item.product._id,
            quantity: item.quantity,
            size:item.size,
            price: item.product.price,
            sellingPrice: item.product.sellingPrice,
             brand: item.product.brand,
            imageUrls: item.product.imageUrls, // Pass the array of image URLs
             name: item.product.name,
            features: item.product.features,
             details: item.product.details
        }))


        const totalAmount = orderProducts.reduce(
            (total,item) => total +(item.sellingPrice * item.quantity),0
        )

        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 7);

        const order  = new Order({
            user:req.user._id,
            products:orderProducts,
            totalAmount,
            deliveryDate,
            shippingAddress:{
                houseNo:address.houseNo,
                landmark:address.landmark,
                areaPin:address.areaPin,
                name:address.name,
                state:address.state,
                phone:address.phone
            }
        })

        await order.save()
        cart.products = []
        await cart.save()
        res.json(order)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.get('/user',auth,async(req,res)=>{
    try{
     const orders = await Order.find({user:req.user._id}).populate('products.product')
     res.status(200).json(orders)
    }catch(error){
        res.status(400).json({error: error.message})
    }
})

router.delete('/:id', auth,async(req,res)=>{
    try{
       const order = await Order.findById(req.params.id)

       if(!order){
            return res.status(404).json({error: 'Order not found'})
       }

       if(order.user.toString()!== req.user._id.toString()){
            return res.status(401).json({error: 'Unauthorized'})
       }

       await Order.findByIdAndDelete(req.params.id)
       res.status(200).json({error:'Order delete successfully'})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

router.put('/return/:id' , auth , async(req,res)=>{
    try{
        const { productId } = req.body;
        const order = await Order.findById(req.params.id);
    
        if (!order) {
          return res.status(404).json({ error: 'Order not found' });
        }
    
        if (order.status !== 'Delivered') {
          return res.status(400).json({ error: 'Order cannot be returned' });
        }
    
        const returnRequestDate = new Date();
        const deliveryDate = new Date(order.deliveryDate);
        const fiveDaysAfterDelivery = new Date(deliveryDate);
        fiveDaysAfterDelivery.setDate(deliveryDate.getDate() + 5);
    
        if (returnRequestDate > fiveDaysAfterDelivery) {
          return res.status(400).json({ error: 'Return request is outside the 5-day window' });
        }
    
        const product = order.products.find(item => item.product.toString() === productId);
    
        if (!product) {
          return res.status(404).json({ error: 'Product not found in order' });
        }
    
        product.returnRequested = true;
        product.returnRequestDate = returnRequestDate;
        await order.save();
    
        res.status(200).json({ message: 'Return requested successfully' });
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

router.put('/cancel/:id', auth, async(req,res)=>{
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
          return res.status(404).json({ error: 'Order not found' });
        }
    
        if (order.status !== 'Ordered') {
          return res.status(400).json({ error: 'Order cannot be canceled' });
        }
    
        order.status = 'Cancelled';
        order.cancellationDate = new Date();
        await order.save();
    
        res.status(200).json({ message: 'Order cancelled successfully' });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
})

router.get('/Chick-User-Order', async(req,res)=>{
  try{
     const orders = await Order.find()
     .populate('user')
     .populate('products.product');
      res.json(orders)
  }catch(error){
        res.status(400).json({error: error.message})
    }
  })


router.put('/admin/update/:id', async (req, res) => {
  try {
    const { status, deliveryDate } = req.body;
    const orderId = req.params.id;

    if (!status || !deliveryDate) {
      return res.status(400).json({ error: 'Status and delivery date are required' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    order.deliveryDate = new Date(deliveryDate);
    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
 

router.delete('/admin/delete/:id',async(req,res)=>{
  try{
     const order = await Order.findById(req.params.id)
     if(!order){
        return res.status(404).json({error: 'Order not found'})
     }
     await Order.findByIdAndDelete(req.params.id)
     res.status(200).json({message: 'Order deleted successfully'})
  }catch(error){
    res.status(500).json({error: error.message})
  }
})


router.put('/admin/return/:id',async(req,res)=>{
  try{
      const {productId } = req.body
      const order = await Order.findById(req.params.id)

      if(!order){
        return res.status(404).json({error: 'Order not found'})
      }
      const product = order.products.find(item => item.product.toString() === productId)
      if(!product){
        return res.status(404).json({error: 'Product not found in order'})
      }

      product.returnRequested = true;
      order.status='Returned'
      await order.save()

      res.status(200).json({message: 'Return request accepted successfully'})

  }catch(error){
    res.status(500).json({error: error.message})
  }
})

module.exports = router;