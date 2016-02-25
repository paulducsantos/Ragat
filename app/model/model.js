var bcrypt            = require('bcryptjs');
var Sequelize         = require('sequelize');
// var sequelize = new Sequelize(process.env.DATABASE_URL);
var sequelize = new Sequelize('Ragat_db', 'root');

var User = sequelize.define('User', {
  username: {
    type: Sequelize.STRING,
    isUnique: true,
    validate: {
      len: [6,30]
    }
  },
  password: {
    type: Sequelize.STRING,
    notEmpty: true
  },
  firstname: {
    type: Sequelize.STRING,
    notEmpty: true
  },
  lastname: {
    type: Sequelize.STRING,
    notEmpty: true
  }
}, {
  hooks: {
    beforeCreate: function(input){
      input.password = bcrypt.hashSync(input.password, 10);
    }
  }
});

sequelize.sync();

exports.User = User;