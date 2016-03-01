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
    res.redirect('/activities/' + activity);
  });
}


exports.activitiesRedirect = function(req,res,next) {
  res.redirect('/activities/:name');
}


exports.newActivity = function(req, res, next) {
  models.Activity.create(req.body).then(function() {
    res.redirect('/activities/' + req.body.name);
  });
}

exports.activityListing = function(req, res, next) {
  var name = req.params.name;
  models.findActivity(name).then(function(data){
    var activityID = data[0].id;
    models.updateRating(activityID);
    var pageData = {
      activity: data
    }
    models.findReviews(activityID).then(function(activityReviews){
      pageData.reviews = activityReviews
      res.render('view_activity', pageData);
    });
  });
}