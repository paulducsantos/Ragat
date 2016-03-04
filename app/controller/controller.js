var models = require('../model/model.js');

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
      models.findTopActivities().then(function(topActivities){
        models.findLatestBuzz().then(function(topBuzz){
        res.render('home',{
          topActivities: topActivities,
          topBuzz: topBuzz
        })
        })
      })
    }

    exports.homeRedirect = function(req, res, next) {
      res.redirect('/');
    }

    exports.register = function(req, res, next) {
      res.render('register');
    }

    exports.dashboard = function(req, res, next) {
      res.send('hello');
    }

    exports.activities = function(req, res, next) {
      models.findAllActivity().then(function(activities){
        res.render('activities',{
          activities: activities
        })
      })
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
          ActivityId: activityId,
          UserId: req.user.id
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

    exports.destroyReview = function(req, res, next) {
      models.deleteReview(req.params.id);
      res.json({});
    }

    exports.updateReview = function(req, res, next) {
      models.updateReview(req.body);
      res.json({});
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
          pageData.reviews = activityReviews;
          debugger;
          if(req.isAuthenticated()) {
            pageData.userID = req.user.id;  
            pageData.loggedIn = true;  
          }
          console.log(pageData);
          res.render('view_activity', pageData);
        });
      });
    }
