/* ╔═════════════════════════════════════╦═════════════════════════╦═══════════╗
 * ║ passport.js                         ║ Created:   11 Mar. 2020 ║ v1.0.0.0  ║
 * ║                                     ║ Last mod.: 30 Jul. 2020 ╚═══════════╣
 * ╠═════════════════════════════════════╩═════════════════════════════════════╣
 * ║ Description:                                                              ║
 * ║ Contains strategies for user authentication via Passport.js, as well as   ║
 * ║ authentication in the event of account activation or forgotten password.  ║
 * ║                                                                           ║
 * ║ Coming soon: social media logins (Facebook, Twitter, Google, and more).   ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣ 
 * ║ File(s):                                                                  ║
 * ║ /app/config/passport.js ......................................... release ║
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

const jwt               = require('jsonwebtoken'),
      LocalStrategy     = require('passport-local').Strategy,
      CustomStrategy    = require('passport-custom').Strategy,
      Sequelize         = require('sequelize'),
      db                = require('../models/index'),
      validate          = require('./validate'),
      mail              = require('./mail');

module.exports = (passport, user) => {
    var User             = user,
        TemporaryURL     = db['temporary_url'],

    // Render a user's display name, either as <first> 'alias' <last>, or
    // just <alias> if either one or no names were submitted
    getDisplayName = (alias, first, last) => {
        var name = alias;
        
        if (first.length > 0) {
            name = first + ' \"' + name + '\"';
            if (last.length > 0) {
                name = ' ' + last;
            }
        }
        
        return name;
    }
    
    passport.serializeUser((obj, done) => {
          if (obj instanceof User) {
              done(null, { id: obj.id, type: 'User' });
          } else if (obj instanceof TemporaryURL) {
              done(null, { id: obj.id, type: 'TemporaryURL' });
          }
    });

    passport.deserializeUser((obj, done) => {
        if (obj.type === 'User') {
            User.findByPk(obj.id).then((user) => done(null, user));
        } else if (obj.type === 'TemporaryURL') {
        	TemporaryURL.findByPk(obj.id).then((temporaryURL) => done(null, temporaryURL));
        }
    });
    
    //Activate account
    passport.use('user-activate-account', new CustomStrategy((req, done) => {
    	TemporaryURL.findOne({
            where: { 
                'url':    req.query.link
            }
        }).then(function(temporary_url) {
            if (!temporary_url) {
                return done(null, false, { 
                    message: "Invalid URL."
                });
            }
            
            User.findOne({
                where: { 
                    'id':    temporary_url.id
                }
            }).then((user) => {
                user.update({
                    user_active: true, 
                    last_login: Date.now() 
                }).then(() => {
                	TemporaryURL.destroy({
                        where: {
                            id:  temporary_url.id
                        }
                    }).then((deleted) => {
                        if(!deleted) {
                            return done(null, false);
                        }
                        
                        return done(null, user);
                        
                    }).catch(() => {
                        console.log('Could not destroy URL!'); 
                    });
                }).catch(() => {
                    console.log('Could not update user!'); 
                });
            
            }).catch(() => {
                console.log('Could not find user!'); 
            });
        });
    }));
    
    //If given valid token (temporary URL) display password dialog
    passport.use('user-forgot-password', new CustomStrategy((req, done) => {
    	TemporaryURL.findOne({
            where: {
                url:    req.query.link 
            }
        }).then((temporary_url) => {           
            if (temporary_url) {
                if (temporary_url.expiration_time >= Date.now()) {
                    return done(null, false, { 
                        message: 'URL expired!'
                    });
                }
                
                User.findOne({
                    where: { 
                        'id':     temporary_url.id    
                    }
                }).then((user) => {
                	
                	
                	TemporaryURL.destroy({
                        where: {
                            id:  temporary_url.id
                        }
                    }).then((deleted) => {
                        if (deleted) {
                        	return done(null, user);
                        }
                    }).catch(() => {
                        return done(null, false, { 
                            message: 'Could not delete URL'
                        });
                    });
                }).catch(() => {
                    return done(null, false, { 
                        message: 'Temporary TO DO: This should never happen D:'
                    });
                });
            }
        }).catch(() => {
            return done(null, false, { 
                message: 'Invalid URL.'
            });
        });
    }));
        
    // Login with email
    passport.use('user-login-email', new LocalStrategy({
        usernameField: 'user_email',
        passwordField: 'user_pass',
        passReqToCallback: true
    }, function(req, userEmail, userPassword, done) {
        User.findOne({
            where: { 
                'user_email':    userEmail
            }
        }).then((user) => {
            if (!user.isCorrectPassword(userPassword)) {
                return done(null, false, {
                    message: 'Incorrect password.' 
                });
            }
            
            if (!user.user_active) {
                return done(null, false, {
                    message: 'Must activate account first!' 
                });
            }
            
            if (req.body.stay_logged_in) {
                //console.log(user.user_info); //TO DO
            }
             
            return done(null, user);
        }).catch(() => {
            return done(null, false, { 
                message: 'Username not found.  Incorrect username.' 
            });
        });
    }));
    
    //Register with email
    passport.use('user-signup-email', new LocalStrategy({
        usernameField: 'user_email',
        passwordField: 'user_pass1',
        session: true,
        passReqToCallback: true
    }, function(req, userEmail, userPassword, done) {
        var userAlias = req.body.user_alias,
            names,
            errMessage;
        
        if (!validate.isValidEmail(req.body.user_email)) {
            return done(null, false, req.flash('signupMsg','Invalid email address.'));
        }

        if (!validate.isValidUserAlias(userAlias)) {
            return done(null, false, req.flash('signupMsg','Invalid alias.'));
        }
        
        //Passwords must match and be otherwise valid
        if (errMessage = validate.evaluatePasswordInput(req.body.user_pass1, req.body.user_pass2)) {
        	return done(null, false, req.flash(null, false, req.flash('signupMsg',errMessage)));
        }

        //Check database for existing user_key (in this case, an email address)/user alias
        User.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { user_email:   userEmail }, 
                    { user_alias:   req.body.user_alias }
                ]
            }
        }).then((user) => {
            if (user) {
                if (!(user.user_active || (user.last_login))) {
                    return done(null, false, req.flash('signupMsg', 'Must activate account'));
                } else {
                    return done(null, false, req.flash('signupMsg', 'User alias exists'));
                }
            } else {
                //Format user entries for names (if any, as these fields are optional)
                names = [req.body.user_firstname.trim(), 
                         req.body.user_lastname.trim()];
				console.log("email: " + userEmail);
                User.create({
                        login_auth_type:    0,
                        user_email:         userEmail,
                        user_password:      userPassword,
                        user_alias:         userAlias,
                        last_login:         null,
                        user_info:          {   
                            name: { 
                                display:    getDisplayName(userAlias, names[0], names[1]),
                                first:      names[0],
                                last:       names[1] 
                            }, 
                            privacy: {    
                            }, 
                            settings: {
                                stay_logged_in: 1,                                          
                            }
                        },
                }).then((newUser) => {
                    if (newUser) {
                        mail.sendActivationEmail(req.app, { 
                            recipientAddress: newUser.user_email, 
                            userName: newUser.user_alias, 
                            url: jwt.sign( { data: newUser.id }, newUser.user_password + "-" + newUser.account_created),
                            id: newUser.id
                        }, (err, newURL) => {
                            if (!newURL) {
                                return done(null, false, req.flash('signupMsg', 'Failed to send email.'));
                            }
                            
                            if (newURL) {
                                console.log('User successfully added! ' + newUser.toString());
                                return done(null, newUser);
                            }
                        });
                    }
                }).catch((err) => {
                    return done(null, false, req.flash('signupMsg', 'Failed to create new User.'));
                });
            }
        }).catch((err) => {
        	return done(null, false, req.flash('signupMsg', 'Hell if I know what this error means.'));
        });
    }));
};
