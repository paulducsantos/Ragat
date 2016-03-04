$(document).ready(function(){

  $('.modal-trigger').leanModal();

  $('.parallax').parallax();

  $('#login').webuiPopover({url:'#login-form'});

  $('select').material_select();

  $(".updateBtn").hide();

  $(".deleteBtn").on("click", function(e) {
    e.preventDefault();
    var id = $(this).data("id");
    var that = $(this);
    $.ajax({
      url: '/deleteReview/' + id,
      type: 'DELETE',
      success: function(result) {
        that.closest(".review").fadeOut();
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(thrownError);
        alert(xhr);
        alert(thrownError);
      }
    });
  });

  $(".editBtn").on("click", function(e) {
    e.preventDefault();
    var reviewContent = $(this).parent().siblings(".review-text").text();
    $(this).parent().siblings(".review-text").replaceWith("<textarea class='materialize-textarea review-text'>" + reviewContent + "</textarea>");
    $(this).parent().siblings(".updateBtn").toggle();
  });

  $(".updateBtn").on("click", function(e) {
    e.preventDefault();
    var id = $(this).data("id");
    var that = $(this);
    var reviewContent = $(this).siblings(".review-text").val();
    $.ajax({
      url: '/updateReview/' + id,
      type: 'POST',
      data: {review: reviewContent,
              id: id},
      success: function(result) {
        that.siblings(".review-text").replaceWith("<p class='review-text'>" + reviewContent + "</p>");
        that.hide();
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(thrownError);
        alert(xhr);
        alert(thrownError);
      }
    });
  });

  $(".deleteEdit").hide();
  $(".deleteEdit").each(function() {
    if(parseInt($("#userID").text()) === $(this).siblings(".username-review").data("userid")) {
      $(this).show();
    }
  });
  



});
