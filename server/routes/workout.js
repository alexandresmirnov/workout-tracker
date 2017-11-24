let Workout = require('./../models/workout');
let Exercise = require('./../models/exercise');

let e = {};

/*
 * Returns all Workout documents.
 * route: /workouts/all
 */
e.getAllWorkouts = function(req, res) {
    Workout.find()
    .sort({
        date: -1
    })
    .populate('exercises')
    .exec(function(err, workout) {
        if(err) res.send(err);
        res.status(200).json(workout);
    });
};

/*
 * Returns Workouts based on workout_name in URL
 * route: /workouts/name/:workout_name
 */
e.getWorkoutsByName = function(req, res) {
    let workout_name = req.params.workout_name;
    Workout.find({
        'name': workout_name,
    })
    .populate('exercises')
    .exec(function(err, workout) {
        if(err) res.send(err);
        res.status(200).json(workout);
    });
};

/*
 * Creates a Workout document and adds it to database.
 * route: /workouts/new/
 */
e.createWorkout = function(req, res) {
	let workout = new Workout();
	workout.date = req.body.date;
  workout.name = req.body.name;
  workout.title = req.body.title;

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

  res.status(201).json({ message: 'Workout ' + workout.name + ' created with id: ' + workout._id + '!' });
};

/*
 * Returns Workout based on workout_id in URL
 * route: /workouts/id/:workout_id
 */
e.getWorkoutById = function(req, res) {
    Workout.findOne({
        '_id': req.params.workout_id
    })
    .populate('exercises')
    .exec(function(err, workout) {
        if(err) res.send(err);
        res.status(200).json(workout);
    });
};

/*
 * Modifies Workout document with supplied workout_id
 * route: /workouts/id/:workout_id
 * TODO: also delete children exercises
 */
e.putWorkout = function(req, res) {
  Workout.findOneAndRemove({
      '_id': req.params.workout_id
  }, function(){
      console.log('deleted existing workout');
  });

  e.createWorkout(req, res);
};

/*
 * Deletes Workout with supplied workout_id
 * route: /workouts/id/:workout_id
 */

e.deleteWorkout = function(req, res) {
    Workout.findOneAndRemove({
        '_id': req.params.workout_id
    }, function(){
        res.status(201).json({ message: 'Workout deleted' });
    });

};

module.exports = e;
