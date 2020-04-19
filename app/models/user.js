/* ╔══════════════════════════════════════╦═════════════════════════╦══════════╗
 * ║ user.js                              ║ Created:   30 Jan. 2020 ║ v1.0.0.1 ║
 * ║ (part of robot.nealblim.com user     ║ Last mod.: 19 Apr. 2020 ╚══════════╣
 * ║ authorization/web server)            ║                                    ║
 * ╠══════════════════════════════════════╩════════════════════════════════════╣
 * ║ A Node class for handling Users in MySQL using Sequelize.                 ║
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
const bCrypt            = require('bcrypt-nodejs');		//For password hashing

module.exports = function(sequelize, Sequelize) {
    var User = sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        
        login_auth_type: {
            type: Sequelize.TINYINT.UNSIGNED,
            allowNull: false
        },
        
        login_key: {
            type: Sequelize.STRING(256),
            allowNull: false
        },
        
        login_pass: {
            type: Sequelize.STRING(64),
            defaultValue: null,
            get() {
            	return this.getDataValue('login_pass');
            },
            set(value) {
                this.setDataValue('login_pass', bCrypt.hashSync(value, bCrypt.genSaltSync(10), null))
            },
        },
        
        user_alias: {
            type: Sequelize.STRING(25),
            allowNull: false,
            unique: true,
        },
        
        user_rank: {
            type: Sequelize.TINYINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        },
 
        user_info: {
            type: Sequelize.TEXT,
            defaultValue: '{}',
            get() {
                return (
                    JSON.parse(this.getDataValue('user_info'))
                )
              },
            set(value) {
                this.setDataValue('user_info', JSON.stringify(value))
            },
        },
        
        account_created: {
            type: Sequelize.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        
        last_login: {
            type: Sequelize.DATE
        },
 
        user_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, {
        timestamps: false
    });
    
    User.prototype.isCorrectPassword = function(password) {
        return bCrypt.compareSync(password, this.login_pass.toString());
    };
     
    return User;
};