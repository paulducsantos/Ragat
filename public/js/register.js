$(document).ready(function(){
  jQuery.validator.setDefaults({
    debug: true,
    success: "valid"
  });

  $("#myform").validate({
    rules:{
      username: {
        rangelength: [6, 30]
      },
      userPassword: {
        required: true,
        minlength: 8
      },
      password_check: {
        equalTo: "#userPassword"
      }
    },
    submitHandler: function(form) {
      // e.preventDefault();
    // do other things for a valid form
      form.submit();
    }
      
  });

}); 