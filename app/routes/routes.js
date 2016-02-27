var renders = require('../controller/controller.js')

module.exports.routes =  function(app) {

  app.get('/', renders.home);

  app.get('/register', renders.register);

<<<<<<< HEAD
  app.get('/activities', renders.activities);

  app.get('/test', renders.test)
=======
  app.post('/register/addUser', renders.newUser, renders.homeRedirect);
>>>>>>> 6265a4f7039bf73af206d48cacbf41be716c1fc1
}