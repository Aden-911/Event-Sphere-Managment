const User = require('../Models/UserSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require("../Models/UserSchema");
const nodemailer = require("nodemailer");

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d', // Optional: you can change the expiry
    });

    // Respond with token and role-based redirect path
    let redirectPath = '/'; // default

    if (user.role === 'admin') {
      redirectPath = '/adminDashboard';
    } else if (user.role === 'exhibitor') {
      redirectPath = '/exhibitorDashboard';
    } else if (user.role === 'attendee') {
      redirectPath = '/attendeeDashboard';
    };


    console.log("User Logged In Successfully!")

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token, // Send the token back
      redirectPath // Send the redirect path back
    });
    console.log(`User role: ${user.role}, redirecting to: ${redirectPath}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const registerUser = async (req, res) => {
  console.log("📥 Register request received");

  const { name, email, password, role, companyName, boothNumber } = req.body;
  console.log("Request data:", { name, email, password, role, companyName, boothNumber });


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
      username: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
      ...(role === 'exhibitor' && { companyName, boothNumber })
    });

    // Create token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });

    // Respond with token and role-based redirect path
    let redirectPath = '/'; // default

    if (user.role === 'admin') {
      redirectPath = '/adminDashboard';
    } else if (user.role === 'exhibitor') {
      redirectPath = '/exhibitorDashboard';
    } else if (user.role === 'attendee') {
      redirectPath = '/attendeeDashboard';
    }

    console.log("User created:", user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
      redirectPath
    });
    console.log(`User role: ${user.role}, redirecting to: ${redirectPath}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.sendStatus(400);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) {
      user.token = null;
      await user.save();
    }
    res.sendStatus(200);
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};


const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) { return res.status(400).json({ message: 'Email is required' }) };
    const existingUser = await User.findOne({ email });
    if (!existingUser) { return res.status(404).json({ message: 'User not found' }) };


    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      }
    })

    const receiver = {
      from: "EventSphereManagment@gmail.com",
      to: email,
      subject: "Password Reset Request",
      text: `Click on this link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`
    }

    await transporter.sendMail(receiver);

    return res.status(200).send({ message: "Password reset link sent to your email" });
    console.log("Password link set");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Please Provide Password' });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: decode.email })

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("Received password:", password);
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password Reset Successfully' });
    console.log("Password Reset Successfully")
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { registerUser, loginUser, forgetPassword, resetPassword, logout };
