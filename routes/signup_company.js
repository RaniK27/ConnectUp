const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const bcrypt = require('bcrypt')
const mysqlConn = require('../connect')


router.get('/signup_company',async(req,res)=>{
    res.locals.session = req.session;
    const message = req.flash('status');
    res.render('signup_company',{ message })
});


var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/img/uploaded')   
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
var upload = multer({
    storage: storage
});


router.post('/submit_company',upload.single('image'),async(req,res)=>{  
    const salt = 5;
    password  = await bcrypt.hash(req.body.password, salt);
    if (!req.file) {
        var imgsrc = 'http://127.0.0.1:3000/img/uploaded/default.png';
    } else {        
        var imgsrc = 'http://127.0.0.1:3000/img/uploaded/' + req.file.filename;
    }

    var userId = 0;
    var sql = `INSERT INTO userData_Signup VALUES("${req.body.name}","${req.body.username}","${req.body.email}","${password}","${req.body.contact}","1","${imgsrc}")`
    mysqlConn.query(sql,(err,rows,fields)=>{
        if(err){
            console.log(err)
            req.flash('status','Warning!These credentials are already in use!')
            //return res.redirect('signup_company');
               
            }
            
        });

    //var sqlu =`SELECT * FROM userData_Signup WHERE emailID = ${req.body.email}`
    //mysqlConn.query(sqlu,(err,rows)=>{
    //    userId = rows.userID;
    //})

        //console.log(username);
        var sql2 = `INSERT INTO company_2 VALUES("${req.body.name}","${req.body.descompany}","${req.body.domain}","${req.body.intdomain}","${req.body.address}","${req.body.started}","${req.body.ln}","${req.body.project}")`
        mysqlConn.query(sql2, (err,rows,fields)=>{
            if(err){
                req.flash('status','Account could not be created!')
                return res.redirect('signup_company');
                }
            else{
                console.log(rows)
                req.flash('status','Account successfully created! You can now signin!')
                res.redirect('signin');
                    }
                
                });    

});


module.exports = router