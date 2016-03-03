$(document).ready(function(){

  $('.modal-trigger').leanModal();

  $('.parallax').parallax();

  $('#login').webuiPopover({url:'#login-form'});

  $('select').material_select();

  $(".deleteBtn").on("click", function(e) {
    e.preventDefault();
    var id = $(this).data("id");
    var that = $(this);
    $.ajax({
      url: '/deleteReview/' + id,
      type: 'DELETE',
      success: function(result) {
        console.log(that.parent(".review"));
        that.closest(".review").fadeOut();
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(thrownError);
        alert(xhr);
        alert(thrownError);
      }
    });
  });

});
