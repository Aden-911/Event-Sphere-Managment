require('dotenv').config();
const express = require("express");
const connectDB = require('./Config/db');
const cors = require('cors');
const User = require('./Models/UserSchema')
// const adminDashboardRoutes = require('./Routes/adminDashboard')

const app = express();

app.use(cors());


app.use(express.json());

connectDB();

app.get('/', (req, res) => res.send("Api is running........!"));

app.use('/api/admin', require('./Routes/adminRoutes'));

// Routes
app.use('/api/auth', require('./Routes/authRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));