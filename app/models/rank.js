/* ╔═════════════════════════════════════╦═════════════════════════╦═══════════╗
 * ║ rank.js                             ║ Created:   30 Jan. 2020 ║ v1.0.0.9  ║
 * ║                                     ║ Last mod.: 24 Jul. 2020 ╚═══════════╣
 * ╠═════════════════════════════════════╩═════════════════════════════════════╣
 * ║ Description:                                                              ║
 * ║ A Node class for utilizing entries from the Rank table in MySQL using     ║
 * ║ Sequelize.                                                                ║
 * ║ Rank is an indication of a User's rank, which is used for determining     ║
 * ║ access, forum, administration, and many other privileges.                 ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣ 
 * ║ File(s):                                                                  ║
 * ║ /app/models/rank.js                                                       ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ For the latest version of field.js, to report a bug, or to contribute,    ║ 
 * ║ visit:     github.com/snealbli/nealblim.com                               ║
 * ║    or:     code.nealblim.com/nealblim.com                                 ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                         by Samuel "teer" Neal-Blim                        ║
 * ║                                                                           ║
 * ║                          Site: nealblim.com                               ║
 * ║                                code.nealblim.com                          ║ 
 * ║                         Git:   github.com/snealbli                        ║
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

module.exports = function(sequelize, Sequelize) {
    var User_rank = sequelize.define('user_rank', {
        rank_id: {
            allowNull: false,
            unique: true,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.TINYINT.UNSIGNED
        },
        
        rank_priv: {
            allowNull: false,
            type: Sequelize.BIGINT.UNSIGNED
        },
       
        insignia: {
        	type: Sequelize.TEXT('tiny'),
            allowNull: false
        },        
        
        rank_info: {
            type: Sequelize.TEXT,
            allowNull: false,
            defaultValue: "{}",
            get() {
                return (
                  JSON.parse(this.getDataValue("rank_info"))
                )
              },
              set(value) {
                this.setDataValue("rank_info", JSON.stringify(value))
              },
        }
    });
 
    return User_rank;
};