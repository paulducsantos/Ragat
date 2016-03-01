var express           = require('express');
var expressHandlebars = require('express-handlebars');
var bodyParser        = require('body-parser');
// var session           = require('express-session');
var Sequelize         = require('sequelize');
var mysql             = require('mysql');
var bcrypt            = require('bcryptjs');
var routes            = require('./app/routes/routes.js');
var passport 		  = require('passport');
var passportLocal 	  = require('passport-local');
var app               = express();


app.set('views', __dirname + '/app/views');

const PORT = process.env.PORT || 8080;

app.use(require('express-session')({
    secret: 'eatmyshorts',
    resave: true,
    saveUninitialized: true,
    cookie : { secure : false, maxAge : (4 * 60 * 60 * 1000) }, // 4 hours
}));
app.use(passport.initialize());
app.use(passport.session());

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

// change the object used to authenticate to a smaller token, and protects the server from attacks
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    done(null, { id: id, username: id })
});

require('dotenv').config();
// var sequelize = new Sequelize(process.env.JAWSDB_URL);
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