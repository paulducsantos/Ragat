var bcrypt            = require('bcryptjs');//REQUIRE FOR THE HOOK
var Sequelize         = require('sequelize');

require('dotenv').config();
// var sequelize = new Sequelize(process.env.JAWSDB_URL);
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
    validate: {
      notEmpty: true  
    }
  },
  firstname: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true  
    }
  },
  lastname: {
    type: Sequelize.STRING,
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

//MODEL FOR ACTIVITIES
var Activity = sequelize.define('Activity', {
  activityType: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
      isIn: [['food', 'dorm', 'other', 'cafe']]
    }
  },
  name: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true  
    }
  },
  rating: {
    type: Sequelize.DECIMAL(3,2)
  },
  foodType: {
    type: Sequelize.STRING,
    validate: {
      isIn: [['american', 'japanese', 'korean', 'italian', 'indian', 'chinese', 'filipino', 'dining hall', 'mexican', 'ethiopian', 'grease truck', 'middle-eastern']]
    }
  }
});

//MODEL FOR REVIEWS
var Review = sequelize.define('Review', {
  review: {
    type: Sequelize.TEXT,
    validate: {
      notEmpty: true,
    }
  },
  rating: {
    type: Sequelize.INTEGER,
    validate: {
      notEmpty: true,
    }
  }
});

var findActivity = function(activityName) {
  return Activity.findAll({
    where: {
      name: activityName
    }
  });
}

Activity.hasMany(Review);
User.hasMany(Review);

var updateRating = function(activityId) {
  sequelize.query('SELECT AVG(rating) AS avg FROM Reviews WHERE ActivityId=' + activityId)
  .then(function(data) {
    var avg = Math.round(data[0][0].avg * 2)/2;
    debugger;
    Activity.update(
      {
        rating: avg
      },
      {
        where: {id: activityId}
      }
    );
  });
}

//SYNC SEQUALIZE SO MODEL CAN WORK
sequelize.sync();

//EXPORTS
exports.User = User;
exports.Activity = Activity;
exports.Review = Review;
exports.findActivity = findActivity;
exports.updateRating = updateRating;