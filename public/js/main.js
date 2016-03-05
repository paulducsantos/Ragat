$(document).ready(function(){

  $('.modal-trigger').leanModal();

  $('.parallax').parallax();

  $('#login').webuiPopover({url:'#login-form'});

  $('select').material_select();

  $(".updateBtn").hide();

/*===============================================================
  DELETE BUTTON TO DO AJAX REQUEST TO API AND DELETE REVIEW
===========================================================*/
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

/*===============================================================
  WHEN EDIT BUTTON IS PRESSED THE TEXTAREA SHOWS UP
===========================================================*/
  $(".editBtn").on("click", function(e) {
    e.preventDefault();
    var reviewContent = $(this).parent().siblings(".review-text").text();
    $(this).parent().siblings(".review-text").replaceWith("<textarea class='materialize-textarea review-text'>" + reviewContent + "</textarea>");
    $(this).parent().siblings(".updateBtn").toggle();
  });

/*===============================================================
  HITS THE API TO UPDATE THE REVIEW
===========================================================*/
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

/*===============================================================
  HIDE THE EDIT BUTTONS FROM USERS NOT LOGGED IN. BACKEND WILL PREVENT JS HACKS
===========================================================*/
  $(".deleteEdit").hide();
  $(".deleteEdit").each(function() {
    if(parseInt($("#userID").text()) === $(this).siblings(".username-review").data("userid")) {
      $(this).show();
    }
  });
  $(".food-type-container").hide();
  if($("#filterType").val() === "food" || $("#filterType").val() === "all") {
    $(".food-type-container").show();
  }

/*===============================================================
  FILTER BY TYPE WILL HIT API TO SHOW THAT TYPE ONLY
===========================================================*/
  $("#filterType").on("change", function(e) {
    e.preventDefault();
    console.log($("#filterType").val() === "food");
    if($("#filterType").val() === "food" || $("#filterType").val() === "all") {
      $(".food-type-container").show();
    } else {
      $(".food-type-container").hide();
    }
    $(".ratingCheck").attr("checked", false);
    $(".food-type").attr("checked", false);
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

/*===============================================================
  FILTER BY RATING WILL HIT API AND SHOW SELECTED RATINGS
===========================================================*/
  $(".ratingCheck").on("change", function() {
    var checkbox_value = [];
    $(".ratingCheck").each(function () {
        var ischecked = $(this).is(":checked");
        if (ischecked) {
            checkbox_value.push($(this).val());
        }
    });
    console.log(checkbox_value);
    // your awesome code calling ajax
    $.ajax({
      url: '/filterRating',
      type: 'POST',
      data: {ratings: checkbox_value,
              filterType: $("#filterType").val()},
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
  
  $(".food-type").on("change", function() {
    var foodtype_value = [];
    $(".food-type").each(function () {
        var ischecked = $(this).is(":checked");
        if (ischecked) {
            foodtype_value.push($(this).val());
        }
    });
    var rating_value = [];
    $(".ratingCheck").each(function () {
        var ischecked = $(this).is(":checked");
        if (ischecked) {
            rating_value.push($(this).val());
        }
    });
    $.ajax({
      url: '/filterRating',
      type: 'POST',
      data: {foodType: foodtype_value,
              ratings: rating_value,
              filterType: $("#filterType").val()},
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

/*===============================================================
  FILTER BY RATING WILL HIT API AND SHOW SELECTED RATINGS
===========================================================*/
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
