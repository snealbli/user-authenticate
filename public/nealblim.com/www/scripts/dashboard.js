$(document).foundation();

//Dashboard
$('[data-app-dashboard-toggle-shrink]').on('click', function(e) {
  e.preventDefault();
  $(this).parents('.app-dashboard').toggleClass('shrink-medium').toggleClass('shrink-large');
});

//Toggle all switch
$('#switch-toggle-all [data-toggle-all]' ).click(function () {
  $('#switch-toggle-all input[type="checkbox"]').prop('checked', this.checked)
})


/*
 * $("[data-app-dashboard-toggle-shrink]").on("click",function(t){t.preventDefault(),$(this).parents(".app-dashboard").toggleClass("shrink-medium").toggleClass("shrink-large")}),$("#switch-toggle-all [data-toggle-all]").click(function(){$('#switch-toggle-all input[type="checkbox"]').prop("checked",this.checked)});
 */