const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  date: Date,
  description: String,
  status: { type: String, enum: ['upcoming', 'ongoing', 'ended'], default: 'upcoming' },
});

module.exports = mongoose.model('Event', eventSchema);
