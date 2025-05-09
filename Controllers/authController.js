const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require("../Models/User")

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Optional: you can change the expiry
      });
  
      console.log("User Logged In Successfully!")
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token, // Send the token back
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

const registerUser = async (req, res) => {
    console.log("📥 Register request received");

  const { name, email, password, role } = req.body;
  console.log("Request data:", { name, email, password, role });


  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        console.log("User already exists");
        return res.status(400).json({ message: 'User already exists' })
    };
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Create token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    console.log("User created:", user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser };
