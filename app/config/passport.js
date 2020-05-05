/* ╔══════════════════════════════════════╦═════════════════════════╦══════════╗
 * ║ passport.js                          ║ Created:   11 Mar. 2020 ║ v1.0.0.2 ║
 * ║ (part of robot.nealblim.com user     ║ Last mod.:  5 May  2020 ╚══════════╣
 * ║ authorization/web server)            ║                                    ║
 * ╠══════════════════════════════════════╩════════════════════════════════════╣
 * ║ Contains strategies for user authentication via Passport.js, as well as   ║
 * ║ authentication in the event of account activation or forgotten password.  ║
 * ║                                                                           ║
 * ║ Coming soon: social media logins (Facebook, Twitter, Google, and more).   ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ For the latest version of this, to report a bug, or to contribute, please ║ 
 * ║ visit:     github.com/snealbli/                                           ║
 * ║    or:     robot.nealblim.com                                             ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                         by Samuel 'teer' Neal-Blim                        ║
 * ║                                                                           ║
 * ║                          Site: prog.nealblim.com                          ║
 * ║                         Git:   github.com/snealbli                        ║
 * ║                     JSfiddle:  jsfiddle.net/user/teeer                    ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */
const jwt               = require('jsonwebtoken'),
      LocalStrategy     = require('passport-local').Strategy,
      CustomStrategy    = require('passport-custom').Strategy,
      Sequelize         = require('sequelize'),
      db                = require('../models/index'),
      verify            = require('./verify'),
      mail              = require('../config/mail');

module.exports = (passport, user) => {
    var User             = user,
        DynamicURL      = db['dynamic_url'],

    //Render a user's display name, either as <first> 'alias' <last>, or
    //  just <alias> if either one or no names were submitted
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
          } else {
              done(null, { id: obj.id, type: 'DynamicURL' });
          }
    });

    passport.deserializeUser((obj, done) => {
        if (obj.type === 'User') {
            User.findByPk(obj.id).then((user) => done(null, user));
        } else {
            DynamicURL.findByPk(obj.id).then((dynamicURL) => done(null, dynamicURL));
        }
    });
    
    //Activate account
    passport.use('user-activate-account', new CustomStrategy((req, done) => {
        DynamicURL.findOne({
            where: { 
                'url':    req.query.link
            }
        }).then(function(dynamic_url) {
            if (!dynamic_url) {
                return done(null, false, { 
                    message: "Invalid URL."
                });
            }
            
            User.findOne({
                where: { 
                    'id':    dynamic_url.id
                }
            }).then((user) => {
                user.update({
                    user_active: true, 
                    last_login: Date.now() 
                }).then(() => {
                    DynamicURL.destroy({
                        where: {
                            id:  dynamic_url.id
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
        DynamicURL.findOne({
            where: {
                url:    req.query.link 
            }
        }).then((dynamic_url) => {           
            if (dynamic_url) {
                if (dynamic_url.expiration_time >= Date.now()) {
                    return done(null, false, { 
                        message: 'URL expired!'
                    });
                }
                
                User.findOne({
                    where: { 
                        'id':     dynamic_url.id    
                    }
                }).then((user) => {
                	DynamicURL.destroy({
                        where: {
                            id:  dynamic_url.id
                        }
                    }).then((deleted) => {                        
                        console.log(7);
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
    }, function(req, loginKey, password, done) {
        User.findOne({
            where: { 
                'login_key':    loginKey
            }
        }).then((user) => {
            if (!user.user_active) {
                return done(null, false, {
                    message: 'Must activate account first!' 
                });
            }

            if (!user.isCorrectPassword(password)) {
                return done(null, false, {
                    message: 'Incorrect password.' 
                });
            }
            
            if (req.body.stay_logged_in) {
                //console.log(user.user_info); //TO DO
            }
             
            return done(null, user);
        }).catch(() => {
            return done(null, false, { 
                message: 'Incorrect username.' 
            });
        });
    }));
    
    //Register with email
    passport.use('user-signup-email', new LocalStrategy({
        usernameField: 'user_email',
        passwordField: 'user_pass1',
        session: true,
        passReqToCallback: true
    }, function(req, loginKey, password, done) {
    	console.log(0);
        var userAlias = req.body.user_alias,
            names,
            errMessage;
        
        if (!verify.isValidEmail(req.body.user_email)) {
        	console.log(1);
            return done(null, false, req.flash('signupMsg','Invalid email address.'));
        }
        
        if (!verify.isValidUserAlias(userAlias)) {
        	console.log(2);
            return done(null, false, req.flash('signupMsg','Invalid alias.'));
        }
        
        //Passwords must match and be otherwise valid
        if (errMessage = verify.evaluatePasswordInput(req.body.user_pass1, req.body.user_pass2)) {
        	console.log(3);
        	return done(null, false, req.flash(null, false, req.flash('signupMsg',errMessage)));
        }
        
        //Check database for existing user_key (in this case, an email address)/user alias
        User.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { login_key:    loginKey }, 
                    { user_alias:   req.body.user_alias }
                ]
            }
        }).then((user) => {
            if (user) {
                if (!(user.user_active || (user.last_login))) {
                	console.log(4);
                    return done(null, false, req.flash('signupMsg','Must activate account'));
                } else {
                	console.log(5);
                    return done(null, false, req.flash('signupMsg','User alias exists'));
                }
            } else {
                //Format user entries for names (if any, as these fields are optional)
                names = [req.body.user_firstname.trim(), 
                         req.body.user_lastname.trim()];

                User.create(userData = {
                        login_auth_type:    0,
                        login_key:          loginKey,
                        login_pass:         password,
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
                	console.log("hello");
                    if (newUser) {
                        mail.sendActivationEmail(req.app, { 
                            recipientAddress: newUser.login_key, 
                            userName: newUser.user_alias, 
                            url: jwt.sign( { data: newUser.id }, newUser.login_pass + "-" + newUser.account_created),
                            id: newUser.id
                        }, (err, newURL) => {
                            if (!newURL) {
                            	console.log(6);
                                return done(null, false, req.flash('signupMsg','Failed to send email.'));
                            }
                            
                            if (newURL) {
                            	console.log(7);
                                console.log('User successfully added! ' + newUser.toString());
                                return done(null, newUser);
                            }
                        });                    
                    }
                }).catch((err) => {
                	console.log(8);
                    return done(null, false, req.flash('signupMsg','Failed to create new User.'));
                });
            }
        }).catch((err) => {
        	return done(null, false, req.flash('signupMsg','Hell if I know what this error means.'));
        });
    }));
};
