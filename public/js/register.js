$(document).ready(function(){
jQuery.validator.setDefaults({
  debug: true,
  success: "valid"
});

$("#myform").validate({
  rules:{
    password: {
      required: true
    },
    password_check: {
      required: true
    }
  }
});

}); 