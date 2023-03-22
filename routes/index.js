const express = require("express")
const actions = require("../methods/actions")
const router = express.Router()

router.get('/',(req,res) =>{
    res.send("hello world")
})
router.post('/createaccount',actions.addNew)
router.post('/createinvoice',actions.addnewinv)
router.get('/invoices/search',actions.invoicelist)

// router.post('/auth',actions.authenticate)
// router.get("/getinfo",actions.getinfo)
module.exports=router 