/* ╔══════════════════════════════════════╦═════════════════════════╦══════════╗
 * ║ index.js                             ║ Created:   16 Dec. 2019 ║ v1.0.0.1 ║
 * ║ (part of robot.nealblim.com user     ║ Last mod.: 19 Apr. 2020 ╚══════════╣
 * ║ authorization/web server)            ║                                    ║
 * ╠══════════════════════════════════════╩════════════════════════════════════╣
 * ║ Index class for loading model classes from the file system into           ║
 * ║ Sequelize.                                                                ║
 * ║ In this manner full  MySQL functionality can be implemented.              ║
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
const fs = require('fs'),
      path = require('path'),
      Sequelize = require('sequelize'),
      env = process.env.NODE_ENV || 'development',
      config = require(path.join(__dirname, '..', '..', 'config', 'config.json'))[env],
      sequelize = new Sequelize(config.database, config.username, config.password, config),
      db = {};

//Read the models (whose location was first described in server.js) one by one
fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== 'index.js');
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });
 
Object.keys(db).forEach(function(modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
 
module.exports = db;