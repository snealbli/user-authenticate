/* ╔═════════════════════════════════════╦═════════════════════════╦═══════════╗
 * ║ user.js                             ║ Created:   30 Jan. 2020 ║ v1.0.0.0  ║
 * ║                                     ║ Last mod.: 30 Jul. 2020 ╚═══════════╣
 * ╠═════════════════════════════════════╩═════════════════════════════════════╣
 * ║ Description:                                                              ║
 * ║ A Node class for handling Users in MySQL using Sequelize.                 ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ File(s):                                                                  ║
 * ║ /app/models/user.js ............................................. release ║
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
        
        user_email: {
            type: Sequelize.STRING(64),
            allowNull: true,
            defaultValue: null
        },
        
        user_password: {
            type: Sequelize.STRING(64),
            defaultValue: null,
            get() {
            	return this.getDataValue('user_password');
            },
            set(value) {
                this.setDataValue('user_password', bCrypt.hashSync(value, bCrypt.genSaltSync(10), null))
            },
        },

        login_auth_type: {
            type: Sequelize.TINYINT.UNSIGNED,
            allowNull: false
        },
        
        login_key_facebook: {
        	type: Sequelize.STRING(64),
        	allowNull: true,
        	defaultValue: null
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
        return bCrypt.compareSync(password, this.user_password.toString());
    };
     
    return User;
};
