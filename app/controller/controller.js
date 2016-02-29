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
  console.log(models.Review);
  models.Review.create(req.body);
  next();

}

exports.activitiesRedirect = function(req,res,next) {
  res.redirect('/activities/:name');
}