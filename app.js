const port = 3000;
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require('ejs')
const app = express();

// temp

const mysql = require("mysql2");
const session = require('express-session');
const store =new session.MemoryStore();
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const path = require("path");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");



//static files
//app.use('/public',express.static('/public'))

app.use('/css',express.static(__dirname + '/public/css'))
app.use('/img',express.static(__dirname + '/public/img'))
app.use('/js',express.static(__dirname + '/public/js'))

//Template Engine
app.set('views','./views')
app.set('view engine','ejs')
app.get('', (res, res) => {
    res.render('index')
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true 
}));

app.use(cookieParser());

app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    store
}));

app.use(flash());

//Routes

const homerouter = require('./routes/index.js')
const faqsrouter = require('./routes/faqs.js')
const aboutrouter = require('./routes/contactus.js')
const contactrouter = require('./routes/aboutus.js')
const dashboardrouter = require('./routes/dashboard.js')
const signinrouter = require('./routes/signin.js')
const signuprouter = require('./routes/signup.js')
const studentrouter = require('./routes/signup_student.js')
const companyrouter = require('./routes/signup_company.js')
const profrouter = require('./routes/signup_prof.js')
const freerouter = require('./routes/signup_free.js')
const subrouter = require('./routes/submit.js')
const pfrouter = require('./routes/profile.js')
const drouter = require('./routes/discover.js')
const connrouter = require('./routes/connections.js')
const topfiverouter = require('./routes/topfive.js')

// Use the imported utility

app.use(homerouter)
app.use(faqsrouter)
app.use(contactrouter)
app.use(aboutrouter)
app.use(dashboardrouter)
app.use(signinrouter)
app.use(signuprouter)
app.use(studentrouter)
app.use(companyrouter)
app.use(profrouter)
app.use(freerouter)
app.use(subrouter)
app.use(pfrouter)
app.use(drouter)
app.use(connrouter)
app.use(topfiverouter)


app.get('/signout',async(req,res)=>{
    req.session.destroy();
    res.render('index');

});


//Listen on port 3000
app.listen(port,()=>console.log(`Listening on port ${port}`))




