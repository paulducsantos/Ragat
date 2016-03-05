var models = require('../model/model.js');

/*===============================================================
  CHECK AUTH FOR LOGGED IN USERS
===========================================================*/
exports.checkAuth = function(req, res, next) {
 if (req.isAuthenticated()) {
   next();
 } else {
   res.redirect('/');
 }
}

/* ==========================================================================
    CONTROLLER FOR HANDLING ROUTES
==========================================================================*/
    exports.home = function(req, res, next) {
      models.findTopActivities().then(function(topActivities){
        models.findLatestBuzz().then(function(topBuzz){
        res.render('home',{
          topActivities: topActivities,
          topBuzz: topBuzz,
          isAuthenticated: req.isAuthenticated()
        });
        });
      });
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
      models.findFoodTypes().then(function(foodTypes) {
        var pageData = {};
        pageData.foodTypes = foodTypes[0];
        models.findAllActivity().then(function(activities){
          pageData.activities = activities;
          res.render('activities', pageData);
        })
      });
      
      
    }

    exports.filterActivitiesByType = function(req, res, next) {
      if(req.body.type === "all") {
        models.findAllActivity().then(function(activities) {
          res.json({activities});
        });
      } else {
        models.findActivitiesOfType(req.body.type).then(function(activities){
          res.json({activities});
        });
      }
    }

    exports.filterActivitiesByRating = function(req, res, next) {
      if(req.body.filterType === "all") {
        models.findByRatingAll(req.body.ratings).then(function(activities) {
          res.json({activities});
        });
      } else {
        models.findByRating(req.body.ratings, req.body.filterType).then(function(activities){
          res.json({activities});
        });
      }
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
          reviewedBy: req.user.username,
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
      }).catch(function(error) {
        res.redirect('/activities/' + req.body.name);
      });
    }

    exports.destroyReview = function(req, res, next) {
      models.deleteReview(req.params.id);
      res.json({});
    }

    exports.updateReview = function(req, res, next) {
      if(parseInt(req.body.UserId) === req.user.id) {
        models.updateReview(req.body, req.user.id);
        res.json({err: false});
      } else {
        res.json({err: "You can't edit this post"});
      }
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
          debugger;
          pageData.reviews = activityReviews;
          if(req.isAuthenticated()) {
            pageData.userID = req.user.id;  
            pageData.loggedIn = true;
            pageData.isAuthenticated = req.isAuthenticated();
          }
          res.render('view_activity', pageData);
        });
      });
    }
