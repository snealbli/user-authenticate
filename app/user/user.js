var bCrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, Sequelize) {
    var User = sequelize.define('user', {
        user_id: {
            allowNull: false,
            unique: true,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER.UNSIGNED
        },
        
        auth_type: {
            type: Sequelize.ENUM('email', 'facebook', 'git', 'google', 'linkedin', 'reddit', 'stackoverflow', 'twitter'),
            allowNull: false
        },
        
        user_login_key: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        
        user_pass: {
            type: Sequelize.STRING(64),
            defaultValue: null
        },
 
        user_name: {
            type: Sequelize.STRING(25),
            defaultValue: null
        },
        
        user_alias: {
            type: Sequelize.STRING(16),
            allowNull: false,
            unique: true,
        },
        
        account_created: {
        	type: 'TIMESTAMP',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        
        last_login: {
        	type: 'TIMESTAMP'
        },
 
        user_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, {
        timestamps: false
    });
    
	User.prototype.correctPassword = function(password) {
		return bCrypt.compareSync(password, this.user_pass);
	};
	
	/*
	User.hook("beforeCreate", function(user) {
    	  user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
	});*/
 
    return User;
};