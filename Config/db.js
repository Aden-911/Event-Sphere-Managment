const mongoose = require("mongoose");

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo DB Connected Successfully!");
    }catch(error){
        console.error("Mongo DB Connection Failed" , error);
        process.exit(1);
    }
};

module.exports = connectDB;