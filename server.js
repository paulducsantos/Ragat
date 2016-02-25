var express           = require('express');
var expressHandlebars = require('express-handlebars');
var bodyParser        = require('body-parser');
var session           = require('express-session');
var Sequelize         = require('sequelize');
var mysql             = require('mysql');
var bcrypt            = require('bcryptjs');
var routes            = require('./app/routes/routes.js')
var app               = express();

app.set('views', __dirname + '/app/views');

const PORT = process.env.PORT || 8080;

// var sequelize = new Sequelize(process.env.DATABASE_URL);
var sequelize = new Sequelize('Ragat_db', 'root');

app.use(bodyParser.urlencoded({extended: false}));
app.use('/static', express.static('public'));
app.engine('handlebars', expressHandlebars({
                                    defaultLayout: __dirname + '/app/views/layouts/main.handlebars',
                                    layoutsDir: __dirname + '/app/views/layouts'}));
app.set('view engine', 'handlebars');

routes.routes(app);

sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("LISTNEING!");
  });
});