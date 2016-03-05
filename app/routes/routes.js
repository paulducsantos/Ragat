var renders = require('../controller/controller.js')
var passport      = require('passport');
var passportLocal     = require('passport-local');
var models = require('../model/model.js');
var bcrypt            = require('bcryptjs');
var session = require('express-session');

module.exports.routes =  function(app) {

  app.use(require('express-session')({
    secret: 'eatmyshorts',
    resave: true,
    saveUninitialized: true,
    cookie : { secure : false, maxAge : (4 * 60 * 60 * 1000) }, // 4 hours
  }));


  app.use(passport.initialize());
  app.use(passport.session());

/*===============================================================
  THESE ARE THE POSSIBLE ROUTES
===========================================================*/

  app.get('/', renders.home);

  app.get('/register', renders.register);

  app.get('/activities', renders.activities);

  app.get('/activities/:name', renders.activityListing);

  app.get('/test', renders.test);

  app.get('/dashboard', renders.checkAuth, renders.dashboard);

  app.post('/register/addUser', renders.newUser, renders.homeRedirect);

  app.post('/login',  
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/?msg=Login failed'
    })
    );
  

  app.post('/activities/:name', renders.newReview);

  app.post('/addActivity', renders.newActivity);

  app.get('/logout', function (req, res){
    req.session.destroy(function (err) {
      res.redirect('/');
    });
  });

/*===============================================================
  HIT MY API WITH THESE ROUTES
===========================================================*/
  app.post('/filterActivities', renders.filterActivitiesByType);

  app.delete('/deleteReview/:id', renders.destroyReview);

  app.post('/updateReview/:id', renders.updateReview);

  app.post('/filterRating', renders.filterActivitiesByRating);
/*===============================================================
  PASSPORT SESSION SETUP
===========================================================*/
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  // use method as callback when being authenticated
  passport.use(new passportLocal.Strategy(function(username, password, done) {
    // check the password in database
    models.User.findOne({
      where: {
        username: username
      }
    }).then(function(user) {
        // check the password against hash
        if(user){
          bcrypt.compare(password, user.dataValues.userPassword, function(err, userlogin) {
            if (userlogin) {
                  // if password is valid -- authenticate the user with cookie
                  done(null, {id: user.id, username: user.username});
                } else{
                  done(null, null);
                }
              });
        } else {
          done(null, null);
        }
      });

  }));
}