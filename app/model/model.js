var bcrypt            = require('bcryptjs');//REQUIRE FOR THE HOOK
var Sequelize         = require('sequelize');
// var sequelize = new Sequelize(process.env.DATABASE_URL);
var sequelize = new Sequelize('Ragat_db', 'root');


//MODEL FOR USERS
var User = sequelize.define('User', {
  username: {
    type: Sequelize.STRING,
    isUnique: true,
    validate: {
      len: [6,30]
    }
  },
  userPassword: {
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
      input.userPassword = bcrypt.hashSync(input.userPassword, 10);
    }
  }
});


//SYNC SEQUALIZE SO MODEL CAN WORK
sequelize.sync();

exports.User = User;