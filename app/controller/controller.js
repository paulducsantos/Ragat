var models = require('../model/model.js');
var session = require('express-session');
var passport      = require('passport');
var passportLocal     = require('passport-local');
var express = require('express');
var app = express();



app.use(require('express-session')({
    secret: 'eatmyshorts',
    resave: true,
    saveUninitialized: true,
    cookie : { secure : false, maxAge : (4 * 60 * 60 * 1000) }, // 4 hours
}));

// use method as callback when being authenticated
passport.use(new passportLocal.Strategy(function(username, password, done) {
    // check the password in database
    User.findOne({
        where: {
            username: username
        }
    }).then(function(user) {
        // check the password against hash
        if(user){
            bcrypt.compare(password, user.dataValues.password, function(err, user) {
                if (user) {
                  // if password is valid -- authenticate the user with cookie
                  done(null, { id: username, username: username });
                } else{
                  done(null, null);
                }
            });
        } else {
            done(null, null);
        }
    });

}));

app.use(passport.initialize());
app.use(passport.session());

// change the object used to authenticate to a smaller token, and protects the server from attacks
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    done(null, { id: id, username: id })
});

exports.checkAuth = function(req, res, next) {
   if (req.isAuthenticated()) {
     next();
   } else {
     res.redirect('/');
   }
 }

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

exports.login = function(req, res, next) {
  passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/?msg=Login failed'
});
}

exports.dashboard = function(req, res, next) {
  res.send('hello');
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
      res.render('view_activity', pageData)
    });
  });
}