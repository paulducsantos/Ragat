var renders = require('../controller/controller.js')

module.exports.routes =  function(app) {

  app.get('/', renders.home);

  app.get('/register', renders.register);

  app.get('/activities', renders.activities);

  app.get('/activities/:name', renders.activityListing);

  app.get('/test', renders.test);

  app.get('/dashboard', renders.checkAuth, renders.dashboard);

  app.post('/register/addUser', renders.newUser, renders.homeRedirect);

  app.post('/login', renders.login);

  app.post('/activities/:name', renders.newReview);

  app.post('/addActivity', renders.newActivity);

}