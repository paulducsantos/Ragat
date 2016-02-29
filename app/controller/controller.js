var models = require('../model/model.js');

/* ============================================================================================
    RENDERS
  ==================================================================================*/
exports.home = function(req, res, next) {
  res.render('home');
}

exports.homeRedirect = function(req, res, next) {
  res.redirect('/');
}

exports.register = function(req, res, next) {
  res.render('register');
}

exports.activities = function(req, res, next) {
  res.render('activities');
}

exports.test = function(req, res, next) {
  res.render('view_activity');
}

exports.newUser = function(req, res, next) {
  console.log(models.User);
  models.User.create(req.body);
  next();
}

exports.newReview = function(req, res, next) {
  var activity = req.params.name;
  models.findActivity(activity).then(function(data){
    var activityId = data[0].id;
    models.Review.create({
      review: req.body.review,
      rating: req.body.rating,
      ActivityId: activityId
    });
  });
}

/*exports.reviewListing = function(req, res, next) {
  var review = req.params.review;
  console.log(review);
  res.redirect('/activities/' + req.params.name);
  }
}*/

exports.newActivity = function(req, res, next) {
  models.Activity.create(req.body).then(function() {
    res.redirect('/activities/' + req.body.name);
  });
}

exports.activityListing = function(req, res, next) {
  var name = req.params.name;
  models.findActivity(name).then(function(data){
    models.updateRating(data[0].id);
    res.render('view_activity', {data});
  });
}