let Exercise = require('./../models/exercise');

// this will be the exports object
let e = {};
/*
 * Returns all Exercise documents.
 * route: /exercises/all
 */
e.getAllExercises = function(req, res) {
    Exercise.find()
    .exec(function(err, exercises) {
        if(err) res.send(err);
        res.status(200).json(exercises);
    });
};

/*
 * Returns Exercises based on exercise_name in URL
 * route: /exercises/:exercise_type
 */
e.getExercisesByType = function(req, res) {
    let exercise_name = req.params.exercise_type;
    Exercise.find({
        'type': exercise_type,
    })
    .populate('sets')
    .exec(function(err, exercise) {
        if(err) res.send(err);
        res.status(200).json(exercise);
    });
};

/*
 * Returns Exercise based on workout_id in URL
 * route: /exercises/id/:exercise_id
 */
e.getExerciseById = function(req, res) {
    Exercise.findOne({
        '_id': req.params.exercise_id
    })
    .populate('exercises')
    .exec(function(err, exercise) {
        if(err) res.send(err);
        res.status(200).json(exercise);
    });
};

module.exports = e;
