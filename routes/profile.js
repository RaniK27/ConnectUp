const e = require('connect-flash')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const mysqlConn = require('../connect')


router.get('/profile/:id',async(req,res)=>{
res.locals.session = req.session;
res.locals.userid = req.session.userid;
var uid1 = req.session.userid;
var uid2 = req.params.id;
//var records = [];

var sql = `SELECT *  FROM connectup.userData_signup WHERE userID = "${uid2}"`
mysqlConn.query(sql,(err,rows)=>{
    if(err)
    {
        console.log(err);
    }else{
        var type = rows[0]['category'];
        if(type == 1)
        {            
            var sqlfetch = `SELECT * FROM student_1 INNER JOIN userData_signup ON (userData_signup.userID = "${uid2}" AND student_1.userID = userData_signup.userID) INNER JOIN rate ON (rate.userId = "${uid2}" AND student_1.userID = rate.userId)`        
        }else if(type == 2)
        {            
            var sqlfetch = `SELECT * FROM company_2 INNER JOIN userData_signup ON (userData_signup.userID = "${uid2}" AND company_2.userID = userData_signup.userID) INNER JOIN rate ON (rate.userId = "${uid2}" AND company_2.userID = rate.userId)`                    
        }else if(type == 3)
        {            
            var sqlfetch = `SELECT * FROM professional_3 INNER JOIN userData_signup ON (userData_signup.userID = "${uid2}" AND professional_3.userID = userData_signup.userID) INNER JOIN rate ON (rate.userId = "${uid2}" AND professional_3.userID = rate.userId)`  
        }else{            
            var sqlfetch = `SELECT * FROM selfemployed_4 INNER JOIN userData_signup ON (userData_signup.userID = "${uid2}" AND selfEmployed_4.userID = userData_signup.userID) INNER JOIN rate ON (rate.userId = "${uid2}" AND selfEmployed_4.userID = rate.userId)`
        }   
        mysqlConn.query(sqlfetch,async(err,rowdata)=>{
            if(err)
            {
                console.log(err);
            }else{
                
                console.log(rowdata);
                //records = rowdata;
                var sqlstat = `SELECT * FROM connectup.connections WHERE (user1 = "${req.session.userid}" AND user2 = "${uid2}") OR (user1 = "${uid2}" AND user2 = "${req.session.userid}")`
                mysqlConn.query(sqlstat,(err,rec)=>{
                    if(err){
                        console.log(err);
                    }else if(rec.length == 0){
                        var status = 0;
                        res.render('profile',{data : rowdata, status : status});                        
                    }else if(rec[0].stat == 1)
                    {
                        var status = 1;
                        res.render('profile',{data : rowdata, status : status});   
                    }else if(rec[0].sender == uid1)
                    {
                        var status = 2; 
                        res.render('profile',{data : rowdata, status : status}); 
                    }else{
                        var status = 3;
                        res.render('profile',{data : rowdata, status : status});
                    }
                });

                }
            });
        }

    });

});



router.get('/connect/:id',async(req,res)=>{
    res.locals.session = req.session;
    res.locals.userid = req.session.userid;
    var uid1 = req.session.userid;
    var uid2 = req.params.id;
    var sql = `INSERT INTO connectup.connections VALUES ("${req.session.userid}","${uid2}","${req.session.userid}","0")`
    mysqlConn.query(sql, (err,rows)=>{
                if(err){
                        console.log(err);
                    }else{
                        const submitflash =  req.flash('status','Request sent!');
                        res.render('dashboard',{submitflash})
                    }
                                                 
                });

});

router.get('/withdraw/:id',async(req,res)=>{
    res.locals.session = req.session;
    res.locals.userid = req.session.userid;
    var uid1 = req.session.userid;
    var uid2 = req.params.id;
    console.log(uid1);
    var sql = `DELETE FROM connections WHERE user1 = "${req.session.userid}" AND user2 = "${uid2}" AND sender = "${req.session.userid}" AND stat = 0`
    mysqlConn.query(sql, (err,rows)=>{
                if(err){
                        console.log(err);
                    }else{
                        const submitflash =  req.flash('status','Request withdrawn!');
                        res.render('dashboard',{submitflash})
                    }
                                                 
                });


});
router.get('/accept/:id',async(req,res)=>{
    res.locals.session = req.session;
    res.locals.userid = req.session.userid;
    var uid1 = req.session.userid;
    var uid2 = req.params.id;
    var sql = `UPDATE connections SET stat = 1 WHERE sender = "${uid2}" AND (user1 = "${req.session.userid}" OR user2 = "${req.session.userid}")`
    mysqlConn.query(sql, (err,rows)=>{
                if(err){
                        console.log(err);
                    }else{
                        const submitflash =  req.flash('status','Conection Established!');
                        res.render('dashboard',{submitflash})
                    }
                                                 
                });

});

router.get('/disconnect/:id',async(req,res)=>{
    res.locals.session = req.session;
    res.locals.userid = req.session.userid;
    var uid1 = req.session.userid;
    var uid2 = req.params.id;
    var u1 = 0;

    var sql1 = `DELETE FROM connections where ((user1 = "${req.session.userid}" AND user2 = "${uid2}") OR (user1 = "${uid2}" AND user2 = "${req.session.userid}")) AND stat = 1`
    mysqlConn.query(sql1, (err,rows)=>{
                if(err){
                        console.log(err);
                    }else{
                        const submitflash =  req.flash('status','Disconnected successfully!');
                        res.render('dashboard',{submitflash})
                    }
                                                 
                });


});

router.get('/dispReviews/:id',async(req,res)=>{
    res.locals.session = req.session;
    res.locals.userid = req.session.userid;
    var uid = req.params.id;
    var records = [];
    var records2 = [];
    var stat = false;

    var sql = `SELECT * FROM connectup.reviews WHERE reviews.reviewFor = "${uid}"`
    mysqlConn.query(sql,(err,rows)=>{
        if(err)
        {
            console.log(err);
        }else{
            records = rows;
            console.log(records);
            var sql2 = `SELECT * FROM connectup.reviews WHERE reviews.reviewBy = "${uid}"`
            mysqlConn.query(sql2,(err,row)=>{
                if(err)
                {
                    console.log(err);
                }else{
                    records2 = row;
                    console.log(records2);
                    res.render('details',{data1 : records ,data2 : records2, status : true});
                }
            });
        }
    });

});


router.get('/announcements/:id',async(req,res)=>{
    res.locals.session = req.session;
    res.locals.userid = req.session.userid;
    var data = [];
    var uid = req.params.id;
    var sql = `SELECT * FROM connectup.announcements WHERE announcements.userId = "${uid}" ORDER BY DateTime_posted DESC`
    mysqlConn.query(sql,(err,rows)=>{
        if(err)
        {
            console.log(err);
        }else{
            data = rows;
            console.log(data);
            res.render('details',{data : data , status : false});
        }
    });
});


router.post('/addReview/:id',async(req,res)=>{
    res.locals.session = req.session;
    res.locals.userid = req.session.userid;
    var uid1 = req.session.userid;
    var uid2 = req.params.id;
    var stars = req.body.rating;
    var condition = 0;

    var check1 = `select * from connectup.connections where ((user1 = "${uid1}"  and user2 = "${uid2}") OR (user1 = "${uid2}" and user2 = "${uid1}")) and stat = 1`
    mysqlConn.query(check1,(err,rows1)=>{
            if(err){
            console.log(err);
            }
            else if(rows1.length == 0){ // Error 1
            req.flash('submitflash','Only connected users can add reviews!')
            res.redirect('/dashboard');
            }
            else{
                var check2 = `SELECT * FROM  connectup.reviews WHERE reviewFor = "${uid2}" and reviewBy = "${uid1}"`
                mysqlConn.query(check2,(err,rows2)=>{
                if(err){
                    console.log(err);
                }else if(rows2.length > 0){ // Error 1
                    req.flash('submitflash','You have already added your review :)')
                    res.redirect('/dashboard');
                }else if(rows2.length === 0){

                var sql = `INSERT INTO connectup.reviews VALUES("${uid1}","${uid2}","${req.body.rating}",now(),"${req.body.descript}")`
                mysqlConn.query(sql,(err,rows)=>{
                    if(err){
                    console.log(err);
                    }else{
                        console.log(rows);
                        var add = `SELECT COUNT(*) as count,sum(reviews.rating) as sum FROM reviews where reviewFor = "${uid2}"`
                        mysqlConn.query(add,(err,rowadd)=>{
                            if(err)
                            {
                                console.log(err);
                            }else
                            {
                                var avg = rowadd[0]['sum']/rowadd[0]['count'];
                                var update = `UPDATE rate SET ratings = "${avg}" WHERE userId = "${uid2}"`
                                mysqlConn.query(update,(err,r)=>{
                                    if(err)
                                    {
                                        console.log(err);
                                    }
                               
                                    }); 
                        req.flash('submitflash','Review added successfully!')
                        res.redirect('/dashboard');
                        }    //add
                        });
                    }   //sql
                    });
            }   //check2
            });

        }//check1
    }); 

    
}); // post


module.exports = router;