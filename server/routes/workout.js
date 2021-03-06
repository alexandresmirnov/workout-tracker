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
 * Returns meta Workout documents (without populating exercises).
 * route: /workouts/meta
 */
e.getMetaWorkouts = function(req, res) {
    Workout.find()
    .sort({
        date: -1
    })
    .exec(function(err, workout) {
        if(err) res.send(err);
        res.status(200).json(workout);
    });
};

/*
 * Returns Workouts based on workout_type in URL
 * route: /workouts/name/:workout_type
 */
e.getWorkoutsByType = function(req, res) {
    let workout_type = req.params.workout_type;
    Workout.find({
        'type': workout_type,
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
  workout.type = req.body.type;
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

  res.status(201).json({ message: 'Workout ' + workout.name + ' created with id: ' + workout._id + '!' });
};


/*
 * Returns Workout based on workout_date in URL
 * route: /workouts/date/:workout_date
 */
e.getWorkoutByDate = function(req, res) {
    Workout.findOne({
        'date': req.params.workout_date
    })
    .populate('exercises')
    .exec(function(err, workout) {
        if(err) res.send(err);
        res.status(200).json(workout);
    });
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
 * note that this expects a full copy of workout with modified fields,
 * not just a delta
 * 'exercises' should also just be an array of _ids
 */
e.putWorkout = function(req, res) {
  let workout = new Workout();
  workout.date = req.body.date;
  workout.type = req.body.type;
  workout.name = req.body.name;
  workout.exercises = req.body.exercises;

  Workout.update({ _id: req.params.workout_id }, {date: workout.date, type: workout.type, name: workout.name, exercises: workout.exercises}, {overwrite: false}, function (err, raw) {
    //if (err) return handleError(err);
    //console.log('The raw response from Mongo was ', raw);
    res.status(201).json({ message: 'Workout ' + workout.name + ' updated with id: ' + workout._id + '!' });
  });
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
