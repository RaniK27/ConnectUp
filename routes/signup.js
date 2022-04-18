const express = require('express')
const router = express.Router()

router.get('/signup',async(req,res)=>{
    res.locals.session = req.session;
    const message = req.flash('status');
    res.render('signup', { message })
});

module.exports = router