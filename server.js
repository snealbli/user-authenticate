/* ╔══════════════════════════════════════╦═════════════════════════╦══════════╗
 * ║ server.js                            ║ Created:   16 Dec. 2020 ║ v1.0.0.1 ║
 * ║ (part of robot.nealblim.com user     ║ Last mod.: 19 Apr. 2020 ╚══════════╣
 * ║ authorization/web server)            ║                                    ║
 * ╠══════════════════════════════════════╩════════════════════════════════════╣
 * ║ Entry point for this Node.js application.                                 ║
 * ║ Used for authenticating users based on login credentials stored in a      ║
 * ║ MySQL database, using Express, Passport, Sequelize and more.              ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ For the latest version of field.js, to report a bug, or to contribute,    ║ 
 * ║ visit:     github.com/snealbli/                                           ║
 * ║    or:     robot.nealblim.com/                                            ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                         by Samuel 'teer' Neal-Blim                        ║
 * ║                                                                           ║
 * ║                          Site: prog.nealblim.com                          ║
 * ║                         Git:   github.com/snealbli                        ║
 * ║                     JSfiddle:  jsfiddle.net/user/teeer                    ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */
const express                = require('express'),
      expHandlebars          = require('express-handlebars'),
      session                = require('express-session'),
      cookieParser           = require('cookie-parser'),
      bodyParser             = require('body-parser'),
                             
      app                    = express(),
      fs                     = require('fs'),
      path                   = require('path'),
      flash                  = require('connect-flash');
      
const passport               = require('passport'),
      env                    = require('dotenv').config();

app.engine('handlebars',       require('express-handlebars')
    .create({
        extname:       '.handlebars', 
        defaultLayout: 'main',
        layoutsDir:    path.join(__dirname, '/views/layouts/'),
        partialsDir:   path.join(__dirname, 'views/partials/')
    }).engine
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

//BodyParser
app.use(bodyParser.urlencoded({ 
    extended: true 
}));
app.use(bodyParser.json());

//Passport
app.use(session(
        { 
            secret:            'wOuLdN\'t_YoU_lIkE_t0_KnOW? ;)', 
            cookie: {
                maxAge:        259200,    //30 days
                secure:        false
            },
            resave:            true,
            saveUninitialized: true
})); 

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Models
var models = require('./app/models/');

//Routes
var authRoute = require('./app/routes/auth.js')(app, passport);

//load passport strategies
require('./app/config/passport.js')(passport, models.user);

app.listen(9999, function(err) {
    if (!err) {
        console.log("Site is live");
    } else {
        console.log(err);
    }
});
