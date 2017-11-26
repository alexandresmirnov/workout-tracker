// server.js

// packages
let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let morgan = require('morgan');
let path = require('path');
let mustache = require('mustache');
let request = require('request');

// set port
let port = process.env.PORT || 8080;

// config express
let app = express();

// configure app
//app.use(express.static(__dirname + '/web/public'));
app.use(express.static(__dirname + '/../app/dist'));
//app.use(express.static(__dirname + '/test_public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.set('views', path.join(__dirname, './../app/views'));

// config templating
app.set('view engine', 'pug');
//app.set('view engine', 'mustache');

// mongodb
mongoose.connect('mongodb://127.0.0.1:27017/workout_tracker', function(err) {
    if(err){
        console.error('uh oh');
    } else {
        console.log('successfully connected');
    }
});

// routes
let dayRouter = require('./routes/day');
let workoutRouter = require('./routes/workout');
let exerciseRouter = require('./routes/exercise');

let apiRouter = express.Router();

apiRouter.use(function(req, res, next) {
    console.log('apiRouter doing its job');
    res.header('Access-Control-Allow-Origin', 'http://localhost:8082');
    next();
});

apiRouter.get('/test', function(req, res) {
    console.log('test working');
});

// days
//apiRouter.route('/days')
//  .get(dayRouter.getAllDays);
//  .post(dayRouter.createDay);
apiRouter.route('/days/:day_date')
  .get(dayRouter.getDay);
  //.put(dayRouter.putDay);

// workouts
apiRouter.route('/workouts/all')
  .get(workoutRouter.getAllWorkouts);

apiRouter.route('/workouts/meta')
  .get(workoutRouter.getMetaWorkouts);

apiRouter.route('/workouts/type/:workout_type')
  .get(workoutRouter.getWorkoutsByType);

apiRouter.route('/workouts/id/:workout_id')
  .get(workoutRouter.getWorkoutById)
  .put(workoutRouter.putWorkout)
  .delete(workoutRouter.deleteWorkout);

apiRouter.route('/workouts/date/:workout_date')
  .get(workoutRouter.getWorkoutByDate);

apiRouter.route('/workouts/new/')
  .post(workoutRouter.createWorkout);


// exercises
apiRouter.route('/exercises/all')
  .get(exerciseRouter.getAllExercises);

apiRouter.route('/exercises/type/:exercise_type')
  .get(exerciseRouter.getExercisesByType);

apiRouter.route('/exercises/id/:exercise_id')
  .get(exerciseRouter.getExerciseById);

app.use('/api', apiRouter);

app.listen(port);
console.log('Magic happens on port ' + port);
