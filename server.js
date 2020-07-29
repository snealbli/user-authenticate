/* ╔═════════════════════════════════════╦═════════════════════════╦═══════════╗
 * ║ server.js                           ║ Created:   16 Dec. 2020 ║ v1.0.1.0  ║
 * ║                                     ║ Last mod.: 24 Jul. 2020 ╚═══════════╣
 * ╠═════════════════════════════════════╩═════════════════════════════════════╣
 * ║ Description:                                                              ║
 * ║ Entry point for the Nealblim.com user authorization service.              ║
 * ║ Used for authenticating users based on login credentials stored in a      ║
 * ║ MySQL (MariaDB) database, using Express, Passport, Sequelize (and more).  ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣ 
 * ║ File(s):                                                                  ║
 * ║ /app/models/server.js                                                     ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ For the latest version of field.js, to report a bug, or to contribute,    ║ 
 * ║ visit:     github.com/snealbli/nealblim.com                               ║
 * ║    or:     code.nealblim.com/nealblim.com                                 ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                         by Samuel 'teer' Neal-Blim                        ║
 * ║                                                                           ║
 * ║                          Site: nealblim.com                               ║
 * ║                                code.nealblim.com                          ║ 
 * ║                         Git:   github.com/snealbli                        ║
 * ║                     JSfiddle:  jsfiddle.net/user/teeer                    ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ Copyright (C) 2020  Samuel Neal-Blim                                      ║
 * ║                                                                           ║
 * ║ This program is free software: you can redistribute it and/or modify it   ║
 * ║ under the terms of the GNU General Public License as published by the     ║
 * ║ Free Software Foundation, either version 3 of the License, or (at your    ║
 * ║  option) any later version.                                               ║
 * ║                                                                           ║
 * ║ This program is distributed in the hope that it will be useful, but       ║
 * ║ WITHOUT ANY WARRANTY; without even the implied warranty of                ║
 * ║ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General ║
 * ║ Public License for more details.                                          ║
 * ║                                                                           ║
 * ║ You should have received a copy of the GNU General Public License along   ║
 * ║ with this program.  If not, see https://www.gnu.org/licenses/gpl-3.0.html.║
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
{           secret:            'wOuLdN\'t_YoU_lIkE_t0_KnOW? ;)', 
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

//Load passport strategies
require('./app/config/passport.js')(passport, models.user);

app.listen(3847, function(err) {
    if (!err) {
        console.log("Site is live");
    } else {
        console.log(err);
    }
});
