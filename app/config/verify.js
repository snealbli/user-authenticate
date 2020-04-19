/* ╔══════════════════════════════════════╦═════════════════════════╦══════════╗
 * ║ verify.js                            ║ Created:   30 Jan. 2020 ║ v1.0.0.1 ║
 * ║ (part of robot.nealblim.com user     ║ Last mod.: 19 Apr. 2020 ╚══════════╣
 * ║ authorization/web server)            ║                                    ║
 * ╠══════════════════════════════════════╩════════════════════════════════════╣
 * ║ A class for validating user input (e.g. raw data submitted via forms).    ║
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
const alias_regex = /^(?![_\d])(?!(.*(_)\1){2})\w{4,20}.*[^_]$/,
      email_regex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
      password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[A-Z])(?=.*[!@#$%^&*=|;:'/?.,\"\-\[\]\{\}\\\(\)\<\>\"]).{8,32}$/;

exports.isValidEmail = (email_address) => {
	return email_regex.test(email_address);
};

exports.evaluatePasswordInput = (password1, password2) => {
    if (!password1.localeCompare(password2) === 0) {
        return 'Passwords must match!';
    } else if (!password_regex.test(password1))  {
        return 'Invalid password!';
    }
    
    return null;
};

exports.isValidUserAlias = (user_alias) => {
	return alias_regex.test(user_alias);
};
