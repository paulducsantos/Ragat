/* ============================================================================================
    RENDERS
  ==================================================================================*/
exports.home = function(req, res, next) {
  res.render('home');
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