/* ╔══════════════════════════════════════╦═════════════════════════╦══════════╗
 * ║ script.js                            ║ Created:   11 Mar. 2020 ║ v1.0.0.1 ║
 * ║ (part of robot.nealblim.com)         ║ Last mod.: 19 Apr. 2020 ╚══════════╣
 * ╠══════════════════════════════════════╩════════════════════════════════════╣
 * ║ Contains Javascript/jQuery functionality for nealblim.com that is         ║
 * ║ specific to robot.nealblim.com                                            ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ For the latest version of this, to report a bug, or to contribute, please ║ 
 * ║ visit:     github.com/snealbli/                                           ║
 * ║    or:     robot.nealblim.com/                                            ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                         by Samuel 'teer' Neal-Blim                        ║
 * ║                                                                           ║
 * ║                          Site: prog.nealblim.com                          ║
 * ║                          Git:  github.com/snealbli                        ║
 * ║                      JSfiddle:  jsfiddle.net/user/teeer                   ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

$(document).ready(() => {
  $('#login-button').click(() => {
	  $('.modal-toggle-mode-a').show();
	  $('.modal-toggle-mode-b').hide();
  });
		
  $('#signup-button').click(() => {
	  $('.modal-toggle-mode-a').hide(); 
	  $('.modal-toggle-mode-b').show(); 
  });

  //Open modals that are set to open on load
  $('.initial-open-reveal').foundation('open');
  
  /* TO DO -- AJAX
  $("#form-signup").submit((e) => {	
    postForm(data, '/signup', e);
  });

  postForm = (data, url, e) => {
    e.preventDefault();

    $.post(url, data, function(data, status){
      console.log("Data: " + data + "\nStatus: " + status);
	});  
  }*/
});