//load bcrypt
var bCrypt = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;
var Sequelize = require("sequelize");
var verify = require('./verify');
 
module.exports = function(passport, user) {
    var User = user;
    var userAlias;
    
    //serialize
    passport.serializeUser(function(user, done) {
    	done(null, user.user_id);
    });

    // deserialize user 
    passport.deserializeUser(function(id, done) {
        User.findById(user_id).then(function(user) {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });
	
    var generateHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
    };
	
	//Login with email
	passport.use('user-login-email', new LocalStrategy({
		usernameField: 'user_email',
		passwordField: 'user_password',
		passReqToCallback: true
	}, function(req, userKey, password, done) {
		User.findOne({
				where: { 
					'user_login_key':	userKey
				}
		}).then(function(user) {
			console.log("X:");
		   	if (!user) {
		   		console.log("1:");
		   		console.log("B");
		   		return done(null, false, { 
		   			message: 'Incorrect username.' 
		   		});
		   	}
		   	console.log("Y:");
		   	if (!user.correctPassword(password)) {
		   		console.log("C");
		   		return done(null, false, {
		   			message: 'Incorrect password.' 
		   		});
		   	}
		    	
		   	console.log("A");
		   	return done(null, user);
		});
	}));

	//Register with email
    passport.use('user-register', new LocalStrategy({
    	usernameField: 'user_email',
    	passwordField: 'user_pass1',
    	session: true,
        passReqToCallback: true
    }, 
    function(req, userKey, password, done) {
    	if (verify.isValidEmail(req.body.user_email)) {
    		console.log("Email: VALID");
    	} else {
    		//TO DO: flash user
    		console.log("Email: INVALID");
    		return done(null, false, {
                message: 'Invalid email!'
            });
    	}
    	
    	userAlias = req.body.user_alias;
    	if (verify.isValidUserAlias(userAlias)) {
    		console.log("Alias: VALID");
    	} else {
    		//TO DO: flash user
    		console.log("Alias: INVALID");
    		return done(null, false, {
                message: 'Invalid alias!'
            });
    	}
    	
    	if (req.body.user_pass1.localeCompare(req.body.user_pass2) === 0) {
    		console.log("Password: MATCH");
    		
        	if (verify.isValidUserPassword(req.body.user_pass1)) {
        		console.log("Password: VALID");
        	} else {
        		//TO DO: flash user
        		console.log("Password: INVALID");
        		return done(null, false, {
                    message: 'Invalid password!'
                });
        	}
    	} else {
    		//TO DO: flash user
    		console.log("Password: DO NOT MATCH");
    		return done(null, false, {
                message: 'Passwords must match!'
            });
    	}
        
        //Check database for existing user_key (in this case, an email address)/user alias
        User.findOne(
    	{
    		where: {
    			[Sequelize.Op.or]: [
    				{ user_login_key:	userKey }, 
    				{ user_alias:		req.body.user_alias	}
    			]
    		}
    	}).then(function(user) {
        	if (user) {
        		console.log("DERP");
        		return done(null, false, {
                    message: 'User email/alias already exists!'
                });
            } else {
            	console.log("0");
               	var userPassword = generateHash(password);
               	var userFullName = ((req.body.user_name_first === "") && (req.body.user_name_last === "")) ? null : 
               																							     req.body.user_name_first.concat(' ', req.body.user_name_last).trim();
               	var data = {
	               	auth_type: 			'email',
	               	user_login_key: 	userKey,
	               	user_pass: 			userPassword,
	                user_name: 			userFullName,
	                user_alias: 		userAlias,
	                last_login:			null
	            };
	               
	            User.create(data).then(function(newUser, created) {
	                   if (!newUser) {
	                	   console.log("1");
	                       return done(null, false);
	                   }
	
	                   if (newUser) {
	                	   console.log("2");
	                       return done(null, newUser);
	                   }    
	            });
	            console.log("3");
            }
        });
    }));
};