const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../Model/User');
const {generateToken} = require('../ultils/tokenUtils')
const cookiConfig =require('../ultils/cookieConfig')
const router = express.Router();
const {auth} = require('../middleware/auth')


router.post('/signup' , async(req, res)=>{
  try {
     const { email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.json({ message: 'User registered successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
   
})


router.post('/login', async(req,res)=>{
    try{
       const {email , password}= req.body;
       const user = await User.findOne({email});

       if(!user){
         return res.status(400).json({message: 'Invalid credential'});
       }

       const ismatch = await bcrypt.compare(password , user.password);
       if(!ismatch){
         return res.status(400).json({message: 'Invalid credential'});
       }

       const token = generateToken(user._id);

       res.cookie('token',token,cookiConfig)
       .json({
        token,
        user:{
          _id:user._id,
          name:user.name,
          email:user.email
        }
       })
    }catch(error){
      res.status(500).json({error: error.message});
    }
})




router.post('/logOut',(req,res)=>{
  res.clearCookie('token',{
    httpOnly:true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }).json({message:'logged out successfully'})
 
})
 
router.get('/me',auth,async(req,res)=>{
  try{
    const user = await User.findById(req.user._id);
    if(!user){
      return res.status(404).json({message: 'User not found'});
    }
    res.json(user);
  }catch(error){
    res.status(500).json({error: error.message});
  }
})

module.exports = router;