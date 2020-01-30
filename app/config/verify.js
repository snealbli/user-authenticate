var RegExp = require("regex");

const alias_regex = /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
const email_regex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[A-Z])(?=.*[!@#$%^&*=|;:'/?.,\"\-\[\]\{\}\\\(\)\<\>\"]).{8,32}$/;

exports.isValidEmail = (email_address) => {
	return email_regex.test(email_address);
};

exports.isValidUserPassword = (user_password) => {
	return password_regex.test(user_password);
};

exports.isValidUserAlias = (user_alias) => {
	return alias_regex.test(user_alias);
};

