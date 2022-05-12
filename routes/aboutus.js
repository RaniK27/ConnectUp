const express = require('express')
const router = express.Router()

router.get('/aboutus',async(req,res)=>{
    res.locals.session = req.session;
    res.render('aboutus')
});

module.exports = router