let Workout = require('./../models/workout');
let Exercise = require('./../models/exercise');

// this will be the exports object
let e = {};
/**
 * Returns all Workout documents.
 */
e.getAllWorkouts = function(req, res) {
    Workout.find()
    .populate('exercises')
    .exec(function(err, workout) {
        if(err) res.send(err);
        res.status(200).json(workout);
    });
};

/**
 * Returns a specific Workout based on workout_id in URL
 * @param {number} workout_id - the _id in the URL, provided by Express.
 */
e.getWorkout = function(req, res) {
    let workout_id = req.params.workout_id;
    Workout.findOne({
        '_id': workout_id,
    })
    .populate('exercises')
    .exec(function(err, workout) {
        if(err) res.send(err);
        res.status(200).json(workout);
    });
};

/**
 * Creates a Workout document and adds it to database.
 */
e.createWorkout = function(req, res) {
	let workout = new Workout();
	workout.date = Date(); // TODO: change this to reference to container Day object
    workout.name = req.body.name;

    for(let reqExercise of req.body.exercises){
        // create exercise object, save into database, stick objectid into workout.exercises
        let exercise = new Exercise(reqExercise);

        exercise.save(function(err, e){
            if(err) return console.error(err);
        });

        workout.exercises.push(exercise._id);
    }

    // and save everything to the db
    workout.save(function(err, workout){
        if(err) return console.error(err);
    });

    res.status(201).json({ message: 'Workout ' + workout.name + ' created!' });
}; 

module.exports = e;
