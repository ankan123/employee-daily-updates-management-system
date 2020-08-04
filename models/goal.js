const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true
  },
 activity: {
    type: String,
    required: true
  },
  standardDays: {
    type: Number,
    required: true
  },
  standardRate: {
    type: Number,
    required: true
  }
});

const goal = mongoose.model('goal', UserSchema);

module.exports = goal;
