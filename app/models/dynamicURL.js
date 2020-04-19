/* ╔══════════════════════════════════════╦═════════════════════════╦══════════╗
 * ║ dynamicURL.js                        ║ Created:   16 Mar. 2020 ║ v1.0.0.1 ║
 * ║ (part of robot.nealblim.com user     ║ Last mod.: 19 Apr. 2020 ╚══════════╣
 * ║ authorization/web server)            ║                                    ║
 * ╠══════════════════════════════════════╩════════════════════════════════════╣
 * ║ A class for handling the creation, deletion and other queries of          ║
 * ║ temporary URLs (i.e., URLs that expire either:                            ║ 
 * ║    a) after they are accessed once, or                                    ║
 * ║    b) after a set amount of time.                                         ║
 * ║ This is useful for email links that confirm a new user's email and        ║
 * ║ activate their account, or for resetting passwords.                       ║
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
module.exports = function(sequelize, Sequelize) {
    var dynamicURL = sequelize.define('dynamic_url', {
        url: {
            type: Sequelize.STRING(256),
            allowNull: false,
        },
        
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        
        expiration_time: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
        
        email_info: {
            type: Sequelize.TEXT('medium'),
            allowNull: false,
            get: function () {
                return JSON.parse(this.getDataValue('email_info'));
            },
            set: function (value) {
                this.setDataValue('email_info', JSON.stringify(value));
            }
        },
        
        attempts: {
            type: Sequelize.TINYINT.UNSIGNED,
            allowNull: false,
            defaultValue: 1
        },
    }, {
        timestamps: false
    });
    
    return dynamicURL;
};