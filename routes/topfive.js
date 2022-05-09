const express = require('express')
const router = express.Router()
const mysqlConn = require('../connect')

router.get('/topfive',async(req,res)=>{
    res.locals.session = req.session;
    res.locals.userid = req.session.userid;
    var data = [];
    

    var sql = `SELECT userData_signup.userID,username,ratings FROM userdata_signup INNER JOIN company_2 ON (userdata_signup.userID = company_2.userID AND company_2.started > now() - INTERVAL 5 YEAR) INNER JOIN rate on (rate.userId = company_2.userID) ORDER BY rate.ratings DESC LIMIT 5`
    mysqlConn.query(sql,(err,rows)=>{
        if(err){
            console.log(err);
        }else{
            data = rows;
            console.log(data);
            res.render('topfive',{data : data});
        }

    });
   
    
});

router.get('/topfiveMonthly',async(req,res)=>{
    res.locals.session = req.session;
    res.locals.userid = req.session.userid;
    var data = [];
    
    var sql = `SELECT reviewFor,username,sum(reviews.rating) as ratings from reviews  INNER JOIN userdata_signup on(userdata_signup.userID = reviewFor) inner join company_2 on (company_2.userID = reviewFor and company_2.started > now() - INTERVAL 5 year) where (reviews.added > now()- INTERVAL 30 DAY) group by reviewFor ORDER BY ratings DESC limit 5`
   
    mysqlConn.query(sql,(err,rows)=>{
        if(err){
            console.log(err);
        }else{
            data = rows;
            console.log(data);
            res.render('topfive',{data : data});
        }

    });

});
router.get('/topfiveDaily',async(req,res)=>{
    res.locals.session = req.session;
    res.locals.userid = req.session.userid;
    var data = [];
    
    var sql = `SELECT reviewFor,username,sum(reviews.rating) as ratings from reviews  INNER JOIN userdata_signup on(userdata_signup.userID = reviewFor) inner join company_2 on (company_2.userID = reviewFor and company_2.started > now() - INTERVAL 5 year) where (reviews.added > now()- INTERVAL 1 DAY) group by reviewFor ORDER BY ratings DESC limit 5`
   
    mysqlConn.query(sql,(err,rows)=>{
        if(err){
            console.log(err);
        }else{
            data = rows;
            console.log(data);
            res.render('topfive',{data : data});
        }

    });

});

module.exports = router