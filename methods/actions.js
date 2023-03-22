var User = require("../models/user");
var Invoice = require("../models/invoice")
const mongoose = require("mongoose")

var functions = {
  addNew: function (req, res) {
    if (!req.body.name || !req.body.balances) {
      res.json({ success: false, msg: "Enter all fields" });
    } else {
      var newUser = User({
        name: req.body.name,
        balances: req.body.balances,
      });
      newUser.save(function (err, newUser) {
        if (err) {
          res.json({ success: false, msg: "failed to save" });
          // console.log(err)
        } else {
          res.json({ success: true, msg: "save successful" });
        }
      });
    }
  },
  addnewinv:async function  (req,res) {
    const date = new Date
    const {  customerId, accountArray, totalAmount, year } = req.body;

    // Validate input fields
    if ( !customerId || !accountArray || !totalAmount  || !year) {
      return res.status(400).send('All fields are compulsory');
    }
  
    if (accountArray.length < 1) {
      return res.status(400).send('Account array should have at least one object');
    }
  
    const accountIds = [];
for (let i = 0; i < accountArray.length; i++) {
  accountIds.push(accountArray[i].accountId);
}

    const accounts = await User.find({ _id: { $in: accountIds } });
  
    if (accounts.length !== accountIds.length) {
      return res.status(400).send('Invalid account id in account array');
    }

   const invoiceNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
    const existingInvoice = await Invoice.findOne({ invoiceNumber: invoiceNumber, year: year });
    if (existingInvoice) {
      return res.status(400).send('Invoice already exists for this year');
    }
  
    let accountTotal =0;
    for (let i = 0; i < accountArray.length; i++) {
      accountTotal += Number(accountArray[i].amount);
    }
    console.log(accountTotal);
  
    if (accountTotal !== totalAmount) {
      return res.status(400).send('Total of amount in account array should be equal to total amount');
    }
  
    try {
      // Create a new invoice object
      const invoice = new Invoice({
        date: date,
        customerId: customerId,
        accountArray: accountArray,
        totalAmount: totalAmount,
        invoiceNumber: invoiceNumber,
        year: year
      });
  
      // Save the invoice object to the database
      await invoice.save();
  
  
for (let i = 0; i < accountArray.length; i++) {

    const account = accounts.find((a) => a._id.toString() === accountArray[i].accountId);
    const balanceIndex = account.balances.findIndex((b) => b.year === year);
    console.log(balanceIndex);
    if (balanceIndex === -1) {
      account.balances.push({ year: year, balance: Number(accountArray[i].amount )});
    } else {
      account.balances[balanceIndex].balance += Number(accountArray[i].amount );
    }
    await account.save();
  }
  
      res.status(201).send('Invoice created successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
    
  },

    invoicelist: async function (req,res) {

          const searchText = req.query.searchText;


          const limit = parseInt(req.query.limit) || 10; // default limit is 10
          const skip = parseInt(req.query.skip) || 0; // default skip is 0
          try {
          const name =await User.findOne({ name:searchText })
          //  console.log(name._id);
          const customerid = name? name._id:null;
        
            const partialAmount = 10;

            const invoices = await Invoice.find({
                  $or: [
                  { invoiceNumber: { $regex: searchText, $options: 'i' } },
                  { accountArray: { $elemMatch: { amount: { $regex: new RegExp(searchText, 'i')  } } } },

                  { customerId: customerid },
              
                  ]
            })
            .skip(skip)
            .limit(limit);
            res.status(200).json(invoices);
          } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
          }
    
    }
  
  


};
module.exports = functions;
