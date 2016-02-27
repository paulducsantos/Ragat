var bcrypt            = require('bcryptjs');//REQUIRE FOR THE HOOK
var Sequelize         = require('sequelize');

require('dotenv').config();
var sequelize = new Sequelize(process.env.JAWSDB_URL);
// var sequelize = new Sequelize('Ragat_db', 'root');


//MODEL FOR USERS
var User = sequelize.define('User', {
  username: {
    type: sequelize.STRING,
    isUnique: true,
    validate: {
      len: [6,30]
    }
  },
  userPassword: {
    type: sequelize.STRING,
    validate: {
      notEmpty: true  
    }
  },
  firstname: {
    type: sequelize.STRING,
    validate: {
      notEmpty: true  
    }
  },
  lastname: {
    type: sequelize.STRING,
    validate: {
      notEmpty: true  
    }
  }
}, {
  hooks: {
    beforeCreate: function(input){
      input.userPassword = bcrypt.hashSync(input.userPassword, 10);
    }
  }
});

var Activity = sequelize.define('Activity', {
  activityType: {
    type: sequelize.STRING,
    validate: {
      notEmpty: true,
      isIn: [['food', 'dorm', 'other', 'cafe']]
    }
  },
  name: {
    type: sequelize.STRING,
    validate: {
      notEmpty: true  
    }
  },
  rating: {
    type: sequelize.DECIMAL
  },
  foodType: {
    type: sequelize.STRING,
    validate: {
      isIn: [['american', 'japanese', 'korean', 'italian', 'indian', 'chinese', 'filipino', 'dining hall', 'mexican', 'ethiopian', 'grease truck', 'middle eastern']]
    }
  }
});


//SYNC SEQUALIZE SO MODEL CAN WORK
sequelize.sync();

exports.User = User;
exports.Activity = Activity;