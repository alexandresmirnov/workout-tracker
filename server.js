// server.js

// packages
let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let morgan = require('morgan');

// set port
let port = process.env.PORT || 8080;

// config express
let app = express();

// configure app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));  

// config templating
app.set('view engine', 'pug');

// mongodb
mongoose.connect('mongodb://127.0.0.1:27017/workout_tracker', function(err) {
  if(err){
    console.error('uh oh');
  } else {
    console.log('successfully connected');
  }
});

let Day = require('./app/models/day');
let Workout = require('./app/models/workout');
let Exercise = require('./app/models/exercise');

// routes
let dayRouter = express.Router();
let workoutRouter = express.Router();
let exerciseRouter = express.Router();

// simple piece of middleware
workoutRouter.use(function(req, res, next) {
  console.log('something is happening');
  next();
});


dayRouter.use(function(req, res, next) {
  console.log('dayRouter used');
  next();
});

dayRouter.route('/')
    .get(function(req, res){
      Day.find(function(err, d){
        if(err) res.send(err);

        res.render('day', {
          days: d,
        });
      });
    })
    .post(function(req, res) {
      let day = new Day();
      day.date = Date(); //todo: let client do this

      // loop through workouts
      for(let reqWorkout of req.body.workouts){
        let workout = new Workout({
          date: Date(),
          name: reqWorkout.name,
          exercises: [],
        });

        for(let reqExercise of reqWorkout.exercises){
          let exercise = new Exercise({
            date: Date(),
            id: reqExercise.id,
            name: reqExercise.name,
            sets: [],
          });

          for(let set of reqExercise.sets){
            exercise.sets.push(set);
          }

          exercise.save(function(err, ex){
            if(err) return console.error(err);
          });

          workout.exercises.push(exercise._id);
        }

        workout.save(function(err, wk){
          if(err) return console.err(err);
        });

        day.workouts.push(workout._id);
      }

      day.save(function(err, d){
        if(err) return console.err(err);
      });

      res.json({ message: 'Workout created' });
      //res.json({ message: 'Workout ' + workout.name + ' created!' });
    });

dayRouter.route('/:date_string')
    .get(function(req, res){
      console.log('get on days/:date_string');

      let day = new Date(req.params.date_string);
      let nextDay = new Date(req.params.date_string);
      nextDay.setDate(nextDay.getDate() + 1);

      Day.findOne({ 'date': { '$gte': day, '$lt': nextDay }})
          .populate({
            path: 'workouts',
            populate: {
              path: 'exercises',
            }
          })
          .exec(function(err, day){
            console.log(day);
            res.send(day);
          });

      /*
      Day.find({ 'date': { '$gte': day, '$lt': nextDay }}, function(err, results) {
        if(err) return res.send(err);

        let day = results[0]; // first result is the one we need
        let workouts = [];

        for(let workoutId of day.workout){
          let workout = Workout.findOne({
            '_id': workoutId,
          });
          for(let j = 0; j < workout.length; j++){
            workout.exercises[j] = Exercise.findOne({
              '_id': workout.exercises[j], // overwriting objectid with object
            });
          }
          workouts.push(workout);
        }

        res.render('day', {
          name: day.name,
          date: day.date.toString(),
          workouts: workouts,
        });
      });
      */
    });

workoutRouter.route('/')
    .get(function(req, res) {
      Workout.find(function(err, w){
        if(err) res.send(err);
        res.render('chart', {
          workouts: w,
        });
      });
    })
    .post(function(req, res) {
      let workout = new Workout();
      workout.date = Date(); // todo: let client do this
      workout.name = req.body.name;

      for(let reqExercise of req.body.exercises){
        // create exercise object, save into database, stick objectid into workout.exercises
        let exercise = new Exercise(reqExercise);

        exercise.save(function(err, e){
          if(err) return console.error(err);
        });

        workout.exercises.push(currEx._id);
      }

      // and save everything to the db
      workout.save(function(err, workout){
        if(err) return console.error(err);
      });

      res.json({ message: 'Workout ' + workout.name + ' created!' });
    });

workoutRouter.route('/:date_string')
    .get(function(req, res){
      console.log('get on workouts/:date_string');

      let day = new Date(req.params.date_string);
      let nextDay = new Date(req.params.date_string);
      nextDay.setDate(nextDay.getDate() + 1);

      Workout.find({'date': {'$gte': day, '$lt': nextDay}}, function(err, results) {
        if(err) return res.send(err);

        let workout = results[0]; // first result is the one we need
        let exercises = []; // need to de-reference the exercises and provide them to client

        console.log(workout.exercises);
        for(let exerciseId in workout.exercises){
          let exercise = Exercise.findOne({
            '_id': workout.exerciseId
          });
          exercises.push(exercise);
        }

        res.render('workout', {
          name: workout.name,
          date: workout.date.toString(),
          exercises: exercises
        });
      });
    });

workoutRouter.route('/:workout_id') 
    .delete(function(req, res){
      Workout.remove({
        _id: req.params.workout_id
      }, function(err, workout){
        if(err) res.send(err);

        console.log(req.params.workout_id);

        res.json({ message: 'Successfully deleted' });
      });
    });

exerciseRouter.route('/')
    .get(function(req, res){
      Exercise.find(function(err, exercises){
        res.json(exercises);
      });
    });



// register all the routes
app.use('/days', dayRouter);
app.use('/workouts', workoutRouter);
app.use('/exercises', exerciseRouter);

app.listen(port);
console.log('Magic happens on port ' + port);
