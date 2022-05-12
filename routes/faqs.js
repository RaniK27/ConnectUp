const express = require('express')
const router = express.Router()

router.get('/faqs',async(req,res)=>{
    res.locals.session = req.session;
    res.render('faqs')
});

module.exports = router