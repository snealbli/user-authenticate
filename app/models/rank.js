/* ╔══════════════════════════════════════╦═════════════════════════╦══════════╗
 * ║ rank.js                              ║ Created:   30 Jan. 2020 ║ v1.0.0.1 ║
 * ║ (part of robot.nealblim.com user     ║ Last mod.: 19 Apr. 2020 ╚══════════╣
 * ║ authorization/web server)            ║                                    ║
 * ╠══════════════════════════════════════╩════════════════════════════════════╣
 * ║ A Node class for handling Rank in MySQL using Sequelize.                  ║
 * ║ Rank is an indication of a User's rank, which is used for determining     ║
 * ║ access, forum, administration, and many other privileges.                 ║
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