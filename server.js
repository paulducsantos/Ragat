var express           = require('express');
var expressHandlebars = require('express-handlebars');
var bodyParser        = require('body-parser');
var session           = require('express-session');
var Sequelize         = require('sequelize');
var mysql             = require('mysql');
var bcrypt            = require('bcryptjs');
var app               = express();

const PORT = process.env.PORT || 8080;

var sequelize = new Sequelize('heroku_370e1d69cd8ee8e', 'b42ad8d419aa03', 'b0c89de6');
// var sequelize = new Sequelize('Ragat_db', 'root');

app.use(bodyParser.urlencoded({extended: false}));
app.use('/static', express.static('public'));
app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.get('/', function(req, res) {
  res.send('hello');
});


sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("LISTNEING!");
  });
});