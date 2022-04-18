const express = require('express')
const router = express.Router()
const mysqlConn = require('../connect')

router.get('/dashboard',async(req,res)=>{
    res.locals.session = req.session;
    res.locals.userid = req.session.userid;
    const message =  req.flash('submitflash')
    res.render('dashboard',{ message })
});

router.get('/display',async(req,res)=>{
    res.locals.session = req.session;
    res.locals.userid = req.session.userid;

    var sqlcheck = `SELECT * FROM userData_signup`
    mysqlConn.query(sqlcheck, (err,rows)=>{
                if(err){
                        console.log(err);
                    }else{
                        res.render('dashboard',{ data : rows });
                    }
                             
                    
                });

});

module.exports = router