let Day = require('./../models/day');
let Workout = require('./../models/workout');
let Exercise = require('./../models/exercise');

let mustache = require('mustache');

// this will be the exports object
let e = {};

/**
 * Returns an array of Workouts based on day_date in URL.
 */
e.getDay = function(req, res) {
    Workout.find({
        'date': req.params.day_date
    })
    .populate({
      path: 'exercises'
    })
    .exec(function(err, workouts) {
        if(err) res.send(err);
        res.status(200).json(workouts);
    });
};

module.exports = e;
