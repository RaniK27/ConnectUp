const express = require('express')
const router = express.Router()
const mysqlConn = require('../connect')

router.get('/connections',async(req,res)=>{
    res.locals.session = req.session;
    res.locals.userid = req.session.userid;
    var uid= req.session.userid;

    var recordC = [];
    var recordR = [];
    var recordS= [];

    var sql = `SELECT DISTINCT * FROM userData_signup INNER JOIN connections ON (userdata_signup.userId = connections.user1 OR userdata_signup.userId = connections.user2) WHERE(connections.user1 = "${req.session.userid}" OR connections.user2 = "${req.session.userid}") AND NOT userdata_signup.userID = "${req.session.userid}"`

    mysqlConn.query(sql,async(err,rows)=>{
        if(err){
            console.log(err);
        }else if(rows.length == 0){
            res.render('connections',{data1 : recordC},{data2 : recordR},{data3 : recordS});
        }else{
            for(var i = 0;i<rows.length ;i++){
                if(rows[i].stat == 1)
                {
                    recordC.push(rows[i]);
                }else if(rows[i].sender == uid){
                    recordS.push(rows[i]);
                }else{
                    recordR.push(rows[i]);
                }
            }
            console.log(recordC);
            console.log(recordR);
            console.log(recordS);
            res.render('connections',{dataC : recordC , dataR : recordR , dataS : recordS})
        }
    });


    
});

module.exports = router;