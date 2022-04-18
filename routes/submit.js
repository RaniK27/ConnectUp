const express = require('express')
const multer =require('multer')
const router = express.Router()
const bcrypt = require('bcrypt')
const mysqlConn = require('../connect')


router.post('/submit',(req,res)=>{

    var userid = req.body.user;
    var plainpass = req.body.password;
      

    var sql = `SELECT * FROM userData_signup WHERE userID = "${req.body.user}" AND emailID = "${req.body.email}"`
    mysqlConn.query(sql,async(err,rows)=>{
        if(err){
            console.log(err)
        }else{
            if(rows<1)
                {
                    req.flash('status','Error! No match found for given credentials!')
                    res.redirect('signin');
                }else{
                    // compare hash and password
                    //console.log(rows[0].pass)
                    const match = await bcrypt.compare(plainpass, rows[0].pass);
                    if(!match){                        
                        req.flash('status', 'Incorrect Password!')
                        res.redirect('signin');
                    }else{
                        req.session.loggedin = true;
                        req.session.userid = userid;                   
                        console.log(req.sessionID);
                        req.flash('status', 'Logged in Succesfully!')
                        res.redirect('dashboard');
                    }
                    
            //res.render('dashboard',{message : req.flash('submitflash')});
        }}
    });
    
    //res.sendFile('dashboard.html',{root: __dirname}) //how to sendFile
    });

    
    module.exports = router