/* ╔═════════════════════════════════════╦═════════════════════════╦═══════════╗
 * ║ nealblim_com.sql                    ║ Created:    1 Apr. 2020 ║ v1.0.0.0  ║
 * ║                                     ║ Last mod.: 30 Jul. 2020 ╚═══════════╣
 * ╠═════════════════════════════════════╩═════════════════════════════════════╣
 * ║ Description:                                                              ║
 * ║ File for creating database, users, and tables in MySQL that are necessary ║
 * ║ for Passport.js to authenticate users.  Uses Sequelize for database       ║
 * ║ interaction, bcrypt for password hashing/comparision, and nodemailer for  ║
 * ║ sending emails with temporary URLs for activation accounts/resetting      ║
 * ║ passwords.                                                                ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ File(s):                                                                  ║
 * ║ /docs/nealblim_com.sql .......................................... release ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ For the latest version of field.js, to report a bug, or to contribute,    ║
 * ║ visit:     github.com/snealbli/nealblim.com                               ║
 * ║    or:     code.nealblim.com/nealblim.com                                 ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                         by Samuel 'teer' Neal-Blim                        ║
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

CREATE USER 'nb_com_test'@'localhost' IDENTIFIED BY 'password1';
CREATE USER 'nb_com_auth'@'localhost' IDENTIFIED BY 'password2';
CREATE USER 'nb_com_wiki'@'localhost' IDENTIFIED BY 'password3'

CREATE DATABASE nealblim_com;

USE nealblim_com;

CREATE TABLE user_auth_types (
	auth_id TINYINT UNSIGNED NOT NULL,
	auth_name VARCHAR(20) UNIQUE NOT NULL,

	PRIMARY KEY(auth_id),
	INDEX (auth_name)
) ENGINE=InnoDB;

INSERT INTO user_auth_types (auth_id, auth_name) VALUES (0, "email");
INSERT INTO user_auth_types (auth_id, auth_name) VALUES (1, "facebook");
INSERT INTO user_auth_types (auth_id, auth_name) VALUES (2, "git");
INSERT INTO user_auth_types (auth_id, auth_name) VALUES (3, "google");
INSERT INTO user_auth_types (auth_id, auth_name) VALUES (4, "instagram");
INSERT INTO user_auth_types (auth_id, auth_name) VALUES (5, "linkedin");
INSERT INTO user_auth_types (auth_id, auth_name) VALUES (6, "reddit");
INSERT INTO user_auth_types (auth_id, auth_name) VALUES (7, "spotify");
INSERT INTO user_auth_types (auth_id, auth_name) VALUES (8, "stack overflow");
INSERT INTO user_auth_types (auth_id, auth_name) VALUES (9, "steam");
INSERT INTO user_auth_types (auth_id, auth_name) VALUES (10, "twitter");
INSERT INTO user_auth_types (auth_id, auth_name) VALUES (11, "twitch");

GRANT SELECT ON nealblim_com.user_auth_types TO 'nb_com_auth'@'localhost';


CREATE TABLE user_ranks (
	rank_id TINYINT UNSIGNED NOT NULL UNIQUE,
	rank_priv BIGINT UNSIGNED NOT NULL,
	insignia VARCHAR(1024) NOT NULL,
	rank_info TEXT NOT NULL,

	PRIMARY KEY(rank_id)
) ENGINE=InnoDB;

GRANT SELECT ON nealblim_com.user_ranks TO 'nb_com_auth'@'localhost';

INSERT INTO user_ranks (rank_id, rank_priv, insignia, rank_info) VALUES (0, 0, "rank000.png", '"0":{"en":{"name":"Recruit","abbr":"Recruit","desc":"An raw, untested newbie."}}');
INSERT INTO user_ranks (rank_id, rank_priv, insignia, rank_info) VALUES (1, 0, "rank001.png", "1:{en:{name:Novice I,abbr:Nov. I,desc:A newcomer whose only limitation is the scope of their ambition.}}");

CREATE TABLE users ( 
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	user_email VARCHAR(64) NOT NULL UNIQUE,
	user_password VARBINARY(80) DEFAULT NULL, 
	login_auth_type TINYINT UNSIGNED NOT NULL,
	login_key_facebook VARCHAR(64) UNIQUE DEFAULT NULL,
	login_key_github VARCHAR(128) UNIQUE DEFAULT NULL,
	login_key_google VARCHAR(64) UNIQUE DEFAULT NULL,
	login_key_instagram VARCHAR(64) UNIQUE DEFAULT NULL,
	login_key_linkedin VARCHAR(64) UNIQUE DEFAULT NULL,
	login_key_reddit VARCHAR(64) UNIQUE DEFAULT NULL,
	login_key_spotify VARCHAR(64) UNIQUE DEFAULT NULL,
	login_key_stackoverflow VARCHAR(64) UNIQUE DEFAULT NULL,
	login_key_steam VARCHAR(64) UNIQUE DEFAULT NULL,
	login_key_twitter VARCHAR(64) UNIQUE DEFAULT NULL,
	login_key_twitch VARCHAR(64) UNIQUE DEFAULT NULL,

	user_alias VARCHAR(25) NOT NULL UNIQUE, 
	user_rank TINYINT UNSIGNED NOT NULL DEFAULT 0,
	user_info TEXT NOT NULL DEFAULT "{}",
	user_active BOOLEAN DEFAULT FALSE,
	account_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
	last_login DATETIME,

	PRIMARY KEY(id),
	INDEX (user_alias),
	INDEX (user_email),
	INDEX (login_key_facebook),

	FOREIGN KEY (login_auth_type) 
		REFERENCES user_auth_types(auth_id)
		ON UPDATE CASCADE 
		ON DELETE NO ACTION,
	FOREIGN KEY (user_rank)
		REFERENCES user_ranks(rank_id)
		ON UPDATE CASCADE 
		ON DELETE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=1025;

GRANT CREATE, SELECT, INSERT, DELETE, UPDATE ON nealblim_com.users TO 'nb_com_auth'@'localhost';

CREATE TABLE temporary_urls (
	id INT UNSIGNED UNIQUE NOT NULL,
	expiration_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	url VARCHAR(256) NOT NULL,
	email_info MEDIUMTEXT NOT NULL,
	send_attempts TINYINT UNSIGNED NOT NULL DEFAULT 1,

	PRIMARY KEY(id),
	INDEX(expiration_time),
	INDEX(url),
	FOREIGN KEY (id)
		REFERENCES users(id)
		ON UPDATE CASCADE 
		ON DELETE CASCADE
) ENGINE=InnoDB;

# Round up timestamps to the nearest minute
CREATE TRIGGER `round_up_timestamps`
	BEFORE INSERT ON `temporary_urls`
	FOR EACH ROW SET NEW.expiration_time = date_format(now(),'%Y-%m-%d %H:%i');

GRANT CREATE, SELECT, INSERT, DELETE, UPDATE ON nealblim_com.temporary_urls TO 'nb_com_auth'@'localhost';