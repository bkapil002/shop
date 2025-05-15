const express = require('express')
const Cart = require('../Model/Cart')
const {auth} = require('../middleware/auth')
const router = express.Router()


router.post('/add', auth, async (req, res) => {
  try {
      const { id, quantity, size } = req.body;
      let cart = await Cart.findOne({ user: req.user._id });

      if (!cart) {
          cart = new Cart({ user: req.user._id, products: [] });
      }

      const productIndex = cart.products.findIndex(
          item => item.product.toString() === id
      );

      if (productIndex > -1) {
          // If the product already exists in the cart, update the quantity and size
          cart.products[productIndex].quantity += quantity;
          cart.products[productIndex].size = size; // Ensure size is updated
      } else {
          // If the product does not exist, add it to the cart with the specified size
          cart.products.push({ product: id, quantity, size });
      }

      await cart.save();
      res.json(cart);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});



  router.post('/update/:id', auth , async(req , res) =>{
    try{
      const {id} = req.params
      const { quantity } = req.body;
      const cart = await Cart.findOne({user:req.user._id})

      if(!cart){
        return res.status(400).json({message: 'Cart not found'});
      }

      const productIndex = cart.products.findIndex(
        item => item.product.toString() === id
      );

      if(productIndex > -1){
        if(quantity <= 0){
            cart.products.splice(productIndex, 1);
        }else{
            cart.products[productIndex].quantity = quantity;
        }
      }

      await cart.save();
      res.json(cart);
    }catch(error){
        res.status(400).json({ error: error.message });
    }
  })


  

  router.delete('/remove/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        cart.products = cart.products.filter(
            item => item.product.toString() !== id
        );

        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ error: error.message });
    }
});




router.get('/', auth, async(req, res)=>{
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('products.product');
    if (!cart) {
      return res.json({ products: [] }); // Return an empty products array if cart is not found
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
module.exports = router;