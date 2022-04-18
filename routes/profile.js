const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const mysqlConn = require('../connect')

router.get('/displayProfile',async(req,res)=>{
    res.locals.session = req.session;
    res.locals.userid = req.session.userid;

    var sqlcheck = `SELECT * FROM userData_signup where userID = "${req.session.userid}"`
    mysqlConn.query(sqlcheck, (err,rows)=>{
                if(err){
                        console.log(err);
                    }else{
                        res.render('dashboard',{ pdata : rows });
                    }
                             
                    
                });

});


module.exports = router;