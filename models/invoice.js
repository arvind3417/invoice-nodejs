const mongoose = require('mongoose');
// require("../models/user");

const invoiceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  accountArray: {
    type: [{
      accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      amount: {
        type: String,
        required: true
      }
    }],
    required: true
  },
  totalAmount: {
    type: String,
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  }
});


module.exports =  mongoose.model('Invoice', invoiceSchema);

