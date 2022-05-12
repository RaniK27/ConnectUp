const express = require('express');
const mysql = require('mysql2');
const router = express.Router()
const path = require('path')
const mysqlConn = require('../connect')

router.get('/discoverCon',async(req,res)=>{
    res.locals.session = req.session;
    res.locals.userid = req.session.userid;
    
    var sql = `SELECT * FROM userData_signup WHERE userID = "${req.session.userid}"`
    mysqlConn.query(sql,async(err,rows)=>{
        if(err)
        {
            console.log(err);
        }else{
            var type = rows[0].category;
            if(type == 1){
                var sqlDm = `SELECT * FROM userdata_signup INNER JOIN student_1 ON (userdata_signup.userID = student_1.userID AND userdata_signup.userID = "${req.session.userid}")`
            }else if(type == 2){
                var sqlDm = `SELECT * FROM userdata_signup INNER JOIN company_2 ON (userdata_signup.userID = company_2.userID AND userdata_signup.userID = "${req.session.userid}")`
            }else if(type == 3){
                var sqlDm = `SELECT * FROM userdata_signup INNER JOIN professional_3 ON (userdata_signup.userID = professional_3.userID AND userdata_signup.userID = "${req.session.userid}")`            
            }else if(type == 4){
                var sqlDm = `SELECT * FROM userdata_signup INNER JOIN selfEmployed_4 ON (userdata_signup.userID = selfEmployed_4.userID AND userdata_signup.userID = "${req.session.userid}")`             
            }

            mysqlConn.query(sqlDm,async(err,rows1)=>{
                if(err){
                    console.log(err);
                }else{
                    var dm = rows[0].category;
                    var sqldoms = `SHOW COLUMNS FROM connectup.student_1 WHERE field = 'domain'`;
                    mysqlConn.query(sqldoms,async(err,rows)=>{
                    if(err)
                    {
                        console.log(err);
                    }else{
                    var domstr = rows[0]['Type'];
                    domstr = domstr.slice(6,-1);
                    domstr = domstr.replaceAll("'","");
                    var domdata = domstr.split(',');
                    res.render('discover',{domdata : domdata,dm : dm})
                    //tempdata.forEach(element => {
                    //domdata.push(element);
                    //n++;
                    //global.domdata.push(element);
                    }
                    });
                }
            });
        }

    });



    
});

router.get('/discover/:type/:dom',async(req,res)=>{
    res.locals.session = req.session;
    res.locals.userid = req.session.userid;
    var type = req.params.type;
    var dom = req.params.dom;
    //console.log(dm); //change
    console.log(dom);
    dom = parseInt(dom);



    var sqldoms = `SHOW COLUMNS FROM connectup.student_1 WHERE field = 'domain'`;
    mysqlConn.query(sqldoms,async(err,list)=>{
        if(err)
        {
            console.log(err);
        }else{
                var domstr = list[0]['Type'];
                domstr = domstr.slice(6,-1);
                domstr = domstr.replaceAll("'","");
                var domdata = domstr.split(',');
                var domtype = domdata[dom - 1];
                console.log(domtype);
                if(type == 0){
            
                    var sqlfetch = `SELECT * FROM company_2 INNER JOIN userData_signup ON (company_2.started > now() - INTERVAL 5 YEAR AND userData_signup.userID = company_2.userID AND company_2.domain_interested = "${domtype}" AND NOT company_2.userID = "${req.session.userid}") WHERE NOT EXISTS(SELECT * FROM connections WHERE (user1 = "${req.session.userid}" AND user2 = company_2.userID) OR (user1 = company_2.userID AND user2 = ${req.session.userid}))`        
                }else if(type == 1)
                {
                    
                    var sqlfetch = `SELECT * FROM student_1 INNER JOIN userData_signup ON (userData_signup.userID = student_1.userID AND student_1.domain_interested = "${domtype}" AND NOT student_1.userID = "${req.session.userid}") WHERE NOT EXISTS(SELECT * FROM connections WHERE (user1 = "${req.session.userid}" AND user2 = student_1.userID) OR (user1 = student_1.userID AND user2 = "${req.session.userid}"))`        
                }else if(type == 2)
                {
                    
                    var sqlfetch = `SELECT * FROM company_2 INNER JOIN userData_signup ON (userData_signup.userID = company_2.userID AND company_2.domain_interested = "${domtype}" AND NOT company_2.userID = "${req.session.userid}") WHERE NOT EXISTS(SELECT * FROM connections WHERE (user1 = "${req.session.userid}" AND user2 = company_2.userID) OR (user1 = company_2.userID AND user2 = "${req.session.userid}"))`        
                
                }else if(type == 3)
                {
                    
                    var sqlfetch = `SELECT * FROM professional_3 INNER JOIN userData_signup ON (userData_signup.userID = professional_3.userID AND professional_3.domain_interested = "${domtype}" AND NOT professional_3.userID = "${req.session.userid}") WHERE NOT EXISTS(SELECT * FROM connections WHERE (user1 = "${req.session.userid}" AND user2 = professional_3.userID) OR (user1 = professional_3.userID AND user2 = "${req.session.userid}"))`        
            
                }else{
                    
                    var sqlfetch = `SELECT * FROM selfEmployed_4 INNER JOIN userData_signup ON (userData_signup.userID = selfEmployed_4.userID AND selfEmployed_4.domain_interested = "${domtype}" AND NOT selfEmployed_4.userID = "${req.session.userid}") WHERE NOT EXISTS(SELECT * FROM connections WHERE (user1 = "${req.session.userid}" AND user2 = selfEmployed_4.userID) OR (user1 = selfEmployed_4.userID AND user2 = "${req.session.userid}"))`
                }   
                mysqlConn.query(sqlfetch,async(err,rows)=>{
                    if(err)
                    {
                        console.log(err);
                    }else{
                        
                        console.log(rows);
                        //console.log(rows[0]['username']);
                        res.render('discover',{data : rows, domdata : domdata, dm : dom});
                    }
                });
        }
            //console.log(list);
});


});

module.exports = router