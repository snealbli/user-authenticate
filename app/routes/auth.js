/* ╔═════════════════════════════════════╦═════════════════════════╦═══════════╗
 * ║ auth.js                             ║ Created:   11 Mar. 2020 ║ v1.0.0.0  ║
 * ║                                     ║ Last mod.: 30 Jul. 2020 ╚═══════════╣
 * ╠═════════════════════════════════════╩═════════════════════════════════════╣
 * ║ Description:                                                              ║
 * ║ Express.js routing for robot.nealblim.com.  User authentication is done   ║
 * ║ via passport.js.                                                          ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ File(s):                                                                  ║
 * ║ /app/routes/auth.js ............................................. release ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ For the latest version of field.js, to report a bug, or to contribute,    ║
 * ║ visit:     github.com/snealbli/nealblim.com                               ║
 * ║    or:     code.nealblim.com/nealblim.com                                 ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                         by Samuel "teer" Neal-Blim                        ║
 * ║                                                                           ║
 * ║                          Site: nealblim.com                               ║
 * ║                                code.nealblim.com                          ║
 * ║                          Git:  github.com/snealbli                        ║
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
'use strict';

const mail              = require('../config/mail'),        //Sending emails
      validate          = require('../config/validate');    //User input validation

module.exports = (app, passport) => {
    app.get('/', (req, res) => {
        res.render('home', {
            page_title: 'Seeing is Believing',
            inc_style: true,
            style_sheet: 'home.css'
        });
    });

    app.post('/', (req, res) => {
    	if (req.body.form_name == "home_login") {
            res.redirect(307, '/login');
        } else if (req.body.form_name == "home_signup") {
            res.redirect(307, '/signup');
        } else {
            res.redirect(404, '/404');
        }
    });
    
    app.get('/activate', passport.authenticate('user-activate-account', {
        successRedirect:    '/welcome',
        failureRedirect:    '/',
        failureFlash:       true
    }));
    
    app.post('/activate', (req, res) => {
        res.send();    //TO DO
    });
        
    //Routing for 'forgot password' functionality
    app.get('/forgot', (req, res) => {
        if (req.isAuthenticated()) {
            return res.redirect('/dashboard/reset');
        }
        
        res.render('splash', {
            page_title: 'Reset Your Password',
            portal: () => {
                return 'forgot-prompt';
            }
        });
    });
    
    app.post('/forgot', (req, res) => {
        mail.sendResetEmail(app, { recipientAddress: req.body.user_email }, (err, email) => {
            if (email) {
                res.render('splash', { 
                    page_title:     'An email has been sent!',
                    inc_style:      true,
                    style_sheet:    'style/splash.css',
                    bgimage:        'images/bg/confirm.jpg',
                    showButton:     true,
                    buttonText:     'Send Again',
                    buttonURL:		req.hostname,
                    portal:         () => {
                                        return 'forgot';
                                    }
                });
            }
        });
    });
    
    app.get('/login', (req, res) => {
        res.send();        //TO DO AJAX
    });
    
    app.post('/login', passport.authenticate('user-login-email', {
        successRedirect:    '/dashboard',
        failureRedirect:    '/',
        failureFlash:       true
    }));
    
    app.get('/reset', passport.authenticate('user-forgot-password', {
        successRedirect:    '/dashboard',
        failureRedirect:    '/404',    //TO DO custom err "invalid URL, would you like to resend, etc"
        failureFlash:       true
    }));
    
    app.post('/reset', isLoggedIn, (req, res) => {
        var errMessage;
        if (errMessage = validate.evaluatePasswordInput(req.body.user_pass1, req.body.user_pass2)) {
            console.log("Error: " + errMessage);        //TO DO LOG
        } else {
            req.user.user_password = req.body.user_pass1;
            req.user.save().then(() => {
                return res.redirect('/dashboard');
            });
        }
    });
    
    app.get('/signup', (req, res) => {
        res.render('home', {
            page_title: 'Seeing is Believing',
            inc_style: true,
            style_sheet: 'home.css'
        });
    });
    
    app.post('/signup', passport.authenticate('user-signup-email', {
        successRedirect: '/confirm',
	    failureRedirect: '/',
	    failureFlash:     true
    }));

    /******************************* END POINTS *******************************/
    app.get('/404', (req, res) => {
        res.render('404', { 
            page_title: 'Ruh-roh, 404!'
        });
    });

    app.get('/confirm', (req, res) => {
        res.render('splash', { 
            page_title: 'Welcome ' + req.user.user_alias + '!',
            inc_style: true,
            style_sheet: 'splash.css',
            bgimage: 'https://robot.nealblim.com/www/images/bg/confirm.jpg',
            showButton: true,
            buttonText: 'Resend',
            buttonLink: '',
            portal: () => {
                 return 'confirm';
            }
        });
    });
    
    /***************************** REQUIRES LOGIN *****************************/
    app.get('/dashboard', isLoggedIn, (req, res) => {
        res.render('inside', { 
            page_title: req.user.user_alias + '\'s Profile',
            inc_style: true,
            style_sheet: 'style/dashboard.css',
            portal: () => {
                 return 'dashboard';
            }
        });
    });
    
    app.get('/dashboard/reset', isLoggedIn, (req, res) => {
        res.send();
    });
    
    app.get('/logout', isLoggedIn, (req, res) => {
        req.session.destroy((err) => {
           res.redirect('/');
        });
    });
    
    app.get('/welcome', isLoggedIn, (req, res) => {
        res.render('welcome', { 
            page_title: 'Welcome!',
            inc_style: true,
            style_sheet: 'splash.css',
            bgimage: 'https://robot.nealblim.com/www/images/bg/solar.jpg',
        });
    });

    function isLoggedIn(req, res, next) {
       if (req.isAuthenticated()) {
            return next();
       }
       
       res.redirect('/login'); 
    }
};
