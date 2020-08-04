const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  empId:{
    type:Number,
    required:true
  },
  orderNo: {
    type: Number,
    required: true
  },
  Product: {
    type: String,
    required: true
  },
  Window: {
    type: String,
    required: true
  },
  Activity: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    time : true
   
  },
  windowPerNet: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },

  });

const worker = mongoose.model('worker', UserSchema);

module.exports = worker;
