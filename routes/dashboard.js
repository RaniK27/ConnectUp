const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const mysqlConn = require('../connect')

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



router.get('/dashboard',async(req,res)=>{
    res.locals.session = req.session;
    res.locals.userid = req.session.userid;
    var sqlcheck = `SELECT * FROM userData_signup where userID = "${req.session.userid}"`
    mysqlConn.query(sqlcheck, (err,rows)=>{
                if(err){
                        console.log(err);
                    }else{
                        var type = rows[0]['category'];
                        if(type === 1)
                        {
                            var sql = `SELECT * FROM userdata_signup INNER JOIN student_1 ON (userdata_signup.userID="${req.session.userid}" AND userData_signup.userID = student_1.userID )`
                        }else if(type === 2)
                        {
                            var sql = `SELECT * FROM userdata_signup INNER JOIN company_2 ON (userdata_signup.userID="${req.session.userid}" AND userData_signup.userID = company_2.userID)`
                        }else if(type === 3)
                        {
                            var sql = `SELECT * FROM userdata_signup INNER JOIN professional_3 ON (userdata_signup.userID="${req.session.userid}" AND userData_signup.userID = professional_3.userID)`
                        }else
                        {
                            var sql = `SELECT * FROM userdata_signup INNER JOIN selfEmployed_4 ON (userdata_signup.userID="${req.session.userid}" AND userData_signup.userID = selfEmployed_4.userID)`
                        }

                        mysqlConn.query(sql, (err,row)=>{
                            if(err){
                                    console.log(err);
                                }else{
                                    const message =  req.flash('submitflash')
                                    res.render('dashboard',{ data : row, message});
                                }                                
                            });
                    }
                             
                    
                });

});


router.post('/editprofile',async(req,res)=>{
    res.locals.session = req.session;
    res.locals.userid = req.session.userid;
});

router.post('/addAnnounce',upload.single('image'),async(req,res)=>{
    res.locals.session = req.session;
    res.locals.userid = req.session.userid;
    var uid = req.session.userid;
    if (!req.file) {
        var imgsrc = 'http://127.0.0.1:3000/img/uploaded/basic.jpg';
    } else {        
        var imgsrc = 'http://127.0.0.1:3000/img/uploaded/' + req.file.filename;
    }
    var sql = `INSERT INTO announcements VALUES("${uid}",now(),"${req.body.content}","${imgsrc}")`
    mysqlConn.query(sql,(err,rows)=>{
        if(err){
            console.log(err);
            req.flash('submitFlash','Error while adding announcement!')
            return res.redirect('/dashboard');
            }
        else{
            console.log(rows);
            req.flash('submitFlash','Announcement added successfully!')
            return res.redirect('/dashboard');
        }
    });

});


module.exports = router