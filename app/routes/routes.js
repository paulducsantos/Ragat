var renders = require('../controller/controller.js')

module.exports.routes =  function(app) {

  app.get('/', renders.home);

  app.get('/register', renders.register);
}