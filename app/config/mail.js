/* ╔══════════════════════════════════════╦═════════════════════════╦══════════╗
 * ║ mail.js                              ║ Created:    1 Apr. 2020 ║ v1.0.0.1 ║
 * ║ (part of nealblim.com auth server)   ║ Last mod.: 19 Apr. 2020 ╚══════════╣
 * ╠══════════════════════════════════════╩════════════════════════════════════╣
 * ║ Using nodemailer and JSON web token, will generate and send emails.       ║
 * ║ For right now, just sends emails with temporary URL links (activation,    ║
 * ║ password reset).                                                          ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ For the latest version of this, to report a bug, or to contribute, please ║ 
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
const nodemailer        = require('nodemailer'),
      jwt               = require('jsonwebtoken'),
      db                = require('../models/index');

//Local constants
const adminEmailAddress = 'dev@nealblim.com',
      transporter       = nodemailer.createTransport({  //How email will be sent
          sendmail: true,
          newline: 'unix',
          path: '/usr/sbin/sendmail'
      }),
      User              = db['user'],			//For Sequelize/database
      DynamicURL        = db['dynamic_url'];    //For Sequelize/database


/*
 * sendActivationEmail:
 *     Sends an activation to a recently-registered user, containing a temporary
 * URL (good for 24 hours) that upon clicking, will complete their registration 
 * and allow them to login.
 * 
 * @param {app} reference to Express object.
 * @param {info} JSON object corresponding to the relevant email fields (e.g.
 *     recipient address) and rendering fields (e.g. user name).  Requires 
 *     minimum of recipient, user name, user ID number, and temporary URL.
 * @param {done} verify callback function.
 */
exports.sendActivationEmail = (app, info, done) => {
    composeTemporaryLinkEmail(app, { 
        template:       'activate',
        timespan:       24,
        layout:         false,
        page_title:     'Please confirm your account, ' + info.userName,
        url:            info.url,
        id:             info.id
    }, {
        to:             info.recipientAddress,
        subject:        'Welcome to nealblim.com ' + info.userName + '!',
        text:           'TO DO'
    }, (err, email) => {
        if (err) {
            return done(err);
        }
        
        if (!email) {
            return done(err, false);
        }
        
        if (email) {
            return done(null, email);
        }
    });
};

/*
 * sendResetEmail:
 *     Sends an email to a user that has forgotten their password, with a reset
 * link that is valid for two (2) hours.  Upon clicking the link, the user
 * regains access to their account, at which point they will be prompted to
 * enter a new password.
 * 
 * @param {app} reference to Express object.
  * @param {info} JSON object corresponding to the relevant email fields (e.g.
 *     recipient address).
 *     Requires minimum of recipient's email address.
 * @param {done} verify callback function.
 */
exports.sendResetEmail = (app, info, done) => {
    User.findOne({
        where: { 
            'login_key':    info.recipientAddress
        }
    }).then(function(user) {        
        //User account does not exist
        if (!user) {
            return done(err, false, {
                message: "Invalid login: could not find username \'" + 
                         user.login_key + "\'."
            });
        }
        
        if (user) {
            //User account exists, but has not been activated
            if (!(user.user_active || (user.last_login))) {
                return done(null, false, { 
                    message: "You must activate your account first."
                });
            }
            
            composeTemporaryLinkEmail(app, { 
                template:       'reset',
                timespan:       2,
                layout:         false,
                page_title:     'How to Reset Your Password',
                url:            jwt.sign( 
                                    { data: user.id }, 
                                    user.login_pass + '-' + user.last_login),
                id:             user.id
            }, {
                to:             info.recipientAddress,
                subject:        'nealblim.com -- Reset your Password',
                text:           'TO DO'
            }, (err, email) => {
                if (err) {
                    return done(err);
                }
                
                if (!email) {
                    return done(err, false);
                }
                
                    
                if (email) {
                    return done(null, email);
                }
            });
        }
    });
};

/*
 * composeTemporaryLinkEmail:
 *     Helper method for creating and sending emails that require a temporary
 * link.  Will compose/render an email, add the temporary URL to the dynamic_url
 * table, and (if successful) send it.
 * 
 * @param {app} reference to Express object.
 * @param {renderInfo} JSON object corresponding to the relevant Handlebars 
 *     fields for the template being rendered.
 * @param {emailInfo} JSON object corresponding to the relevant email fields 
 *     (recipient address, subject, etc).
 * @param {done} verify callback function.
 */
composeTemporaryLinkEmail = (app, renderInfo, emailInfo, done) => {
    app.render('emails/' + renderInfo.template + '_email', renderInfo, 
        ((err, HTML) => {
        if (err) {
            return done(err);
        }
        
        if (!HTML) {
            return done(null, false);
        }
        
        if (HTML) {
            DynamicURL.create({ 
                url:                renderInfo.url,
                id:                 renderInfo.id,
                expiration_time:    Date.now() + 
                                    (renderInfo.timespan * 3600000),  //Hours to milliseconds
                email_info: {  
                    from:       (emailInfo.from == null) ? adminEmailAddress : 
                    	                                   emailInfo.from,
                    to:         emailInfo.to,
                    cc:         (emailInfo.cc == null) ? false : emailInfo.cc,
                    bcc:        (emailInfo.bcc == null) ? false : emailInfo.bcc,
                    subject:    emailInfo.subject,
                    html:       HTML.toString(),
                    text:       emailInfo.text
                }
            }).then((newURL) => {                
                if (newURL) {
                    sendEmail(newURL.email_info);
                    return done(null, newURL);
                }
            }).catch((err) => {
                return done(null, false, {
                        message: err
                });
            });
        }
    }));
};

/*
 * sendEmail:
 *     Attempts to send an email using Nodemailer (see: nodemailer.com).
 * 
 * @param {email_info} JSON object corresponding to all of the relevant 
 *     information necessary to send an email with Nodemailer, from the header 
 *     fields (sender recipient address, subject, bcc, etc) to the email body.
 */
sendEmail = (email_info) => {
    transporter.sendMail(email_info, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    }); 
};
