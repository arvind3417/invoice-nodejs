var mongoose = require("mongoose")


const accountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    balances: [{
      year: { type: String, required: true },
      balance: { type: Number, required: true }
    }]
  });

module.exports = mongoose.model('User',accountSchema)