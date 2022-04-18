const express = require('express')
const router = express.Router()

router.get('/contactus',async(req,res)=>{
    res.locals.session = req.session;
    res.render('contactus')
});

module.exports = router