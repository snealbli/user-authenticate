/* ╔═════════════════════════════════════╦═════════════════════════╦═══════════╗
 * ║ temporaryURL.js                     ║ Created:   16 Mar. 2020 ║ v1.0.0.0  ║
 * ║                                     ║ Last mod.: 30 Jul. 2020 ╚═══════════╣
 * ╠═════════════════════════════════════╩═════════════════════════════════════╣
 * ║ Description:                                                              ║
 * ║ A class for handling the creation, deletion and other queries of          ║
 * ║ temporary URLs (i.e., URLs that expire either:                            ║
 * ║    a) after they are accessed once, or                                    ║
 * ║    b) after a set amount of time.                                         ║
 * ║ This is useful for email links that confirm a new user's email and        ║
 * ║ activate their account, or for resetting passwords.                       ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ File(s):                                                                  ║
 * ║ /app/models/temporaryURL.js ..................................... release ║
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
 * ║ option) any later version.                                                ║
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

module.exports = function(sequelize, Sequelize) {
    var temporaryURL = sequelize.define('temporary_url', {      
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
        
        url: {
            type: Sequelize.STRING(256),
            allowNull: false,
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
        
        send_attempts: {
            type: Sequelize.TINYINT.UNSIGNED,
            allowNull: false,
            defaultValue: 1
        },
    }, {
        timestamps: false
    });
    
    return temporaryURL;
};
