var bcrypt            = require('bcryptjs');//REQUIRE FOR THE HOOK
var Sequelize         = require('sequelize');

require('dotenv').config();
var sequelize = new Sequelize(process.env.JAWSDB_URL);
// var sequelize = new Sequelize('Ragat_db', 'root');


//MODEL FOR USERS
var User = sequelize.define('User', {
  username: {
    type: Sequelize.STRING,
    unique: true,
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
  },
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
    unique: true,
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
  },
  location: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true  
    }
  },
  description: {
    type: Sequelize.TEXT,
    validate: {
      notEmpty: true  
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
  },
  reviewedBy: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
    }
  }
});

/*===============================================================
  MODEL ASSOCIATION
  ===========================================================*/
  Activity.hasMany(Review);
  User.hasMany(Review);

/*===============================================================
  QUERIES
  ===========================================================*/
  var findActivity = function(activityName) {
    return Activity.findAll({
      where: {
        name: activityName
      }
    });
  }

  var findAllActivity = function(){
    return Activity.findAll();
  }

  var findActivitiesOfType = function(type) {
    return Activity.findAll({
      where: {
        activityType: type
      }
    });
  }

  var findReviews = function(activityId) {
    return Review.findAll({
      where: {
        ActivityId: activityId
      }
    });
  }

  var findTopActivities = function(){
    return Activity.findAll({
      order:'rating DESC',
      limit: 3
    })
  };

  var findLatestBuzz = function(){
    return Activity.findAll({
      order:'updatedAt DESC',
      limit: 3
    })
  };

  var findByRatingAll = function(ratings) {
    return Activity.findAll({
      where: {
        rating: ratings
      }
    });
  }

  var findByRating = function(ratings, type) {
    return Activity.findAll({
      where: {
        activityType: type,
        rating: ratings
      }
    });
  }

  var findByRatingAndFood = function(filter) {
    return Activity.findAll({
      where: {
        activityType: 'food',
        rating: filter.ratings,
        foodType: filter.foodType
      }
    });
  }

  var findFoodTypes = function() {
    return sequelize.query('SELECT DISTINCT foodType FROM `Activities` WHERE foodType IS NOT NULL');
  }

  var updateRating = function(activityId) {
    sequelize.query('SELECT AVG(rating) AS avg FROM Reviews WHERE ActivityId=' + activityId)
    .then(function(data) {
    // var avg = Math.round(data[0][0].avg * 2)/2;
    var avg = Math.round(data[0][0].avg);
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

  var deleteReview = function(reviewId) {
    Review.destroy({
      where: {
        id: reviewId
      }
    });
  }

  var updateReview = function(reviewData, user) {
    Review.update({
    review: reviewData.review//need to pass the review text
  },
  {
    where: {
      id: reviewData.id,
      UserId: user
    }
  });
  }

//SYNC SEQUALIZE SO MODEL CAN WORK
sequelize.sync();

/*===============================================================
<<<<<<< HEAD
  EXPORTS
  ===========================================================*/
  exports.User = User;
  exports.Activity = Activity;
  exports.Review = Review;
  exports.findActivity = findActivity;
  exports.updateRating = updateRating;
  exports.findReviews = findReviews;
  exports.deleteReview = deleteReview;
  exports.updateReview = updateReview;
  exports.findAllActivity = findAllActivity;
  exports.findTopActivities = findTopActivities;
  exports.findLatestBuzz = findLatestBuzz;
  exports.deleteReview = deleteReview;
  exports.findActivitiesOfType = findActivitiesOfType;
  exports.findByRating = findByRating;
  exports.findByRatingAll = findByRatingAll;
  exports.findFoodTypes = findFoodTypes;
  exports.findByRatingAndFood = findByRatingAndFood;

