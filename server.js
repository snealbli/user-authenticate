var flash = require('flash');
var express = require('express');
var session = require('express-session');

var app = express();

var passport = require('passport');	/*, 
	linkedinStrategy = require('passport-linkedin').Strategy,
	githubStrategy = require('passport-github').Strategy,
	facebookStrategy = require('passport-facebook').Strategy,
	googleStrategy = require('passport-google').Strategy,
	twitterStrategy = require('passport-twitter').Strategy,
	stackExchangeStrategy = require('passport-stack-exchange').Strategy,
	redditStrategy = require('passport-reddit').Strategy;*/
var bodyParser = require('body-parser');
var env = require('dotenv').config();

app.use(express.static(__dirname + "/public/public_html"));

//bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//passport
app.use(passport.initialize());
app.use(passport.session(
		{ 
			secret: 'Qo?Up#CRe*O22me@rU8h7?ot&o_uBr9=', 
			cookie: {
				maxAge: 259200,	//30 days
				secure: false
			},
			resave: false,
			saveUninitialized: false
})); // session secret

app.use(flash());

//Models
var users = require("./app/user");

//Routes
var authRoute = require('./app/routes/auth.js')(app, passport);

//load passport strategies
require('./app/config/passport.js')(passport, users.user);
 
//Sync Database
users.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine');
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!");
});

app.listen(5000, function(err) {
    if (!err) {
        console.log("Site is live");
    } else {
    	console.log(err);
    }
});