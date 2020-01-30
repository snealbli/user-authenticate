module.exports = function(app, passport) {
	app.get('/', function(req, res) {
	    res.sendfile("/index.html");
	});
	
    app.get('/dashboard', isLoggedIn, function(req, res) {
    	res.sendfile("../dashboard/index.html");
    });
	
	app.get('/welcome', function(req, res) {
	    res.sendfile("../welcome/index.html");
	});
	
    app.post('/login', function(req, res, next) {
    		passport.authenticate('user-login-email', {
    			successRedirect: '/dashboard',
    			failureRedirect: '/',
    			failureFlash: true
    		});
    	}
    );
    
    app.post('/register', 
    	passport.authenticate('user-register', {
            successRedirect: '../welcome',
            failureRedirect: '/',
            failureFlash: true
        }
    ));

    app.get('/logout', function(req, res) {
        req.session.destroy(function(err) {
           res.redirect('/');
        });
    });

    function isLoggedIn(req, res, next) {
       if (req.isAuthenticated()) {
    	    console.log("is AUTH");
            return next();
       }
       
       console.log("is not AUTH");
       res.redirect('/login'); 
    }
    
    //app.get('/auth/facebook', passport.authenticate('facebook'));

    // Facebook will redirect the user to this URL after approval.  Finish the
    // authentication process by attempting to obtain an access token.  If
    // access was granted, the user will be logged in.  Otherwise,
    // authentication has failed.
    
    //app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));
};