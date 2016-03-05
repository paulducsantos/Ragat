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
    var reviewedBy = $(this).data("reviewedby");
    $.ajax({
      url: '/updateReview/' + id,
      type: 'POST',
      data: {review: reviewContent,
              id: id,
              UserId: reviewedBy},
      success: function(result) {
        console.log(result);
        if(result.err) {
          that.hide();
          alert(result.err);
        } else {
          that.siblings(".review-text").replaceWith("<p class='review-text'>" + reviewContent + "</p>");
          that.hide();
        }
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

  $("#filterType").on("change", function(e) {
    e.preventDefault();
    var type = $(this).val();
    var that = $(this);
    $.ajax({
      url: '/filterActivities/',
      type: 'POST',
      data: {type},
      success: function(result) {
        $(".listOfActivities").remove();
        filterSuccessHandler(result);
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(thrownError);
        alert(xhr);
        alert(thrownError);
      }
    });
  });

  var filterSuccessHandler = function(listOfActivities) {
    var shortendActivityList = listOfActivities.activities
    for(var i=0; i < shortendActivityList.length; i++) {
      var row = $("<div>").addClass("row listOfActivities");
      var nameOfActivity = $("<div>").addClass("col m4 url").append($("<a href='activities/" + shortendActivityList[i].name + "'>").html(shortendActivityList[i].name));
      var rating = $("<div class='col m3'>").html(shortendActivityList[i].rating);
      var activity = row.append(nameOfActivity).append(rating);
      $(".activity-content").append(activity);
    }
  }
  
  $(".animsition").animsition({
    inClass: 'fade-in',
    outClass: 'fade-out',
    inDuration: 1000,
    outDuration: 500,
    linkElement: '.animsition-link',
    // e.g. linkElement: 'a:not([target="_blank"]):not([href^=#])'
    loading: true,
    loadingParentElement: 'body', //animsition wrapper element
    loadingClass: 'animsition-loading',
    loadingInner: '', // e.g '<img src="loading.svg" />'
    timeout: false,
    timeoutCountdown: 5000,
    onLoadEvent: true,
    browser: [ 'animation-duration', '-webkit-animation-duration'],
    // "browser" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
    // The default setting is to disable the "animsition" in a browser that does not support "animation-duration".
    overlay : false,
    overlayClass : 'animsition-overlay-slide',
    overlayParentElement : 'body',
    transition: function(url){ window.location.href = url; }
  });

});
