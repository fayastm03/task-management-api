const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 

const User = require('../models/User');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

router.get('/', async (req, res) => {
    res.send({ message: 'User route is working' })

})

router.post('/register', async (req, res) => {

    try {
    const {name,email,password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({message: 'Name, email, and password are required'});
    }

    const newUser =new User({
        name,
        email,
        password
    });

    await newUser.save();

    res.status(201).json(newUser);

    console.log('User created:', newUser);
}
catch (err){
    console.error("Error:", err);
    res.status(500).json({message: 'Server error'});
}
}
);

router.post('/login', async (req, res) => {
  try {
    const { email,password } = req.body;

    const user = await User.findOne(
      {  email },
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(400).json({ message: 'Invalid credentials' }); 
    }

    const token = jwt.sign({
        _id: user._id.toString()
    },
    process.env.JWT_SECRET_KEY
  );
  res.send({ token, user, message: 'Login successful' });

  } catch (err) {
    res.status(400).json({ message: 'Invalid user' });
  }
});

module.exports = router;