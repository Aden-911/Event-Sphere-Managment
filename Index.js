require('dotenv').config();
const express = require("express");
const connectDB = require('./Config/db');

const app = express();

app.use(express.json());

connectDB();

app.get('/', (req,res)=>res.send("Api is running........!"));

// Routes
app.use('/api/auth', require('./Routes/authRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>console.log(`Server is running on ${PORT}`));