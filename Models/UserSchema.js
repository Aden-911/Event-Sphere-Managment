const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, },
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'exhibitor', 'attendee'], default: 'attendee' },
  companyName: { type: String},
  boothNumber: { type: String, },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
