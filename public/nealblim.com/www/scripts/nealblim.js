/* ╔══════════════════════════════════════╦═════════════════════════╦══════════╗
 * ║ nealblim.js                          ║ Created:   11 Mar. 2020 ║ v1.0.0.0 ║
 * ║                                      ║ Last mod.:  2 Jul. 2020 ╚══════════╣
 * ╠══════════════════════════════════════╩════════════════════════════════════╣
 * ║ Contains Javascript functionality for nealblim.com.                       ║
 * ║ Uses jQuery and Foundation.                                               ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ For the latest version of field.js, to report a bug, or to contribute,    ║ 
 * ║ visit:     github.com/snealbli/nealblim.com                               ║
 * ║    or:     nealblim.com                                                   ║
 * ║    or:     code.nealblim.com (source code)                                ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                         by Samuel 'teer' Neal-Blim                        ║
 * ║                                                                           ║
 * ║                          Site: code.nealblim.com                          ║
 * ║                         Git:   github.com/snealbli                        ║
 * ║                     JSfiddle:  jsfiddle.net/user/teeer                    ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */
import FieldValidator from './nealium.js';

const USER_EMAIL_VERIFIER = new FieldValidator([/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
                                               /^.{1,64/],
                                              ['Must be a valid email address',
                                               'Must be no more than 64 characters'],
                                              '.email-field-criteria'),
      USER_ALIAS_VERIFIER = new FieldValidator([/^.{4,20}$/,
                                               /^[^_].*?$/,
                                               /^.*[^_]$/], 
                                              ['Between 4-20 characters',
                                               'Cannot start with an underscore \'_\'',
                                               'Cannot end with an underscore \'_\''],
                                               '.alias-field-criteria'),
      USER_PASSWORD_VERIFIER = new FieldValidator([/^.{8,32}$/,  
                                                  /(?=.*[a-z])/,
                                                  /(?=.*[A-Z])/,
                                                  /(?=.*\d)/,   
                                                  /(?=.*[\W_])/],
                                                 ['Between 8-32 characters',      
                                                  'At least one lower case letter',
                                                  'At least one upper case letter',
                                                  'At least one numeric character',
                                                  'At least one symbol',
                                                  'Passwords must match',],
                                                  '.password-field-criteria');

$(document).ready(() => {
  var criteria_list;
  
  $('#login-button').click(() => {
    $('.modal-toggle-mode-a').show();
    $('.modal-toggle-mode-b').hide();
  });
    
  $('#signup-button').click(() => {
    $('.modal-toggle-mode-a').hide(); 
    $('.modal-toggle-mode-b').show(); 
  });
  
  criteria_list = $('.email-field-criteria');
  USER_EMAIL_VERIFIER.applyDescriptors((e) => {
	  criteria_list.append('<li> ❌ <small>' + e + '</small></li>');
  });
  
  USER_EMAIL_VERIFIER.addDefaultListeners('.email-field.verified', 
                                          '.email-box .criteria-list-box',
                                          '.email-field.verified', (results) => {
    var criteria = $('.email-field-criteria').children();
    results.forEach((e, i) => {
      var item = criteria.eq(i);
      item.html((e) ? item.html().replace('❌', '✔️') : item.html().replace('✔️', '❌'));
    });
  });
  
  criteria_list = $('.alias-field-criteria');
  USER_ALIAS_VERIFIER.applyDescriptors((e) => {
	  criteria_list.append('<li> ❌ <small>' + e + '</small></li>');
  });
  
  USER_ALIAS_VERIFIER.addDefaultListeners('.alias-field.verified', 
                                          '.alias-box .criteria-list-box',
                                          '.alias-field.verified', (results) => {
    var criteria = $('.alias-field-criteria').children();
    results.forEach((e, i) => {
      var item = criteria.eq(i);
      item.html((e) ? item.html().replace('❌', '✔️') : item.html().replace('✔️', '❌'));
    });
  });
  
  criteria_list = $('.password-field-criteria');
  USER_PASSWORD_VERIFIER.applyDescriptors((e) => {
	  criteria_list.append('<li> ❌ <small>' + e + '</small></li>');
  });
  
  USER_PASSWORD_VERIFIER.addFocusToggleHandlers('.password-field.verified', 
                                                '.password-box .criteria-list-box');
  $('.password-field.verified').on({
    input: (e) => {
      if (e.target.value.length > 0) {
    	var results = USER_PASSWORD_VERIFIER.verify(e.target.value),
    	    item;
    	
    	if (results !== null) {
    	  var criteria = $('.password-field-criteria').children(),
    	      item;
            
          results.forEach((e, i) => {
            item = criteria.eq(i);
            item.html((e) ? item.html().replace('❌', '✔️') : item.html().replace('✔️', '❌'));
          });
          
          item = $('.password-field-criteria').children().last();
          if ((e.target.value.length > 0) && ($('#signup-password').val() == $('#signup-password-confirm').val())) {
        	  item.html(item.html().replace('❌', '✔️'));
      	  } else {
      		item.html(item.html().replace('✔️', '❌'));
      	  }
    	}
      }
    }
  });
  
  $('.criteria-list-box').hide();
});
