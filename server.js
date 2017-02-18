// server.js

// packages
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// set port
var port = process.env.PORT || 8080;

// config express
var app = express();

// config templating
app.set('view engine', 'pug');

// configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// mongodb
mongoose.connect("mongodb://127.0.0.1:27017/workouts", function(err) {
    if(err){
        console.error("uh oh");
    }
    else {
        console.log("successfully connected");
    }
});

var Workout = require('./app/models/workout');
var Exercise = require('./app/models/exercise');

// routes
var workoutRouter = express.Router();
var exerciseRouter = express.Router();

// simple piece of middleware
workoutRouter.use(function(req, res, next) {
    console.log("something is happening");
    next();
});


workoutRouter.route('/')
    .get(function(req, res) {
        Workout.find(function(err, w){
            res.render('chart', {
                workouts: w
            });
        });

     })
    .post(function(req, res) {
        var workout = new Workout();
            workout.date = Date(); //todo: let client do this
            workout.name = req.body.name;

        var ex = req.body.exercises; //array of exercise objects

        for(var i = 0; i < ex.length; i++){
            //create exercise object, save into database, stick objectid into workout.exercises
            var currEx = new Exercise(ex[i]);

            currEx.save(function(err, ce){
                if(err) return console.error(err);
            });

            workout.exercises.push(currEx._id);
        }

        //and save everything to the db
        workout.save(function(err, workout){
            if(err) return console.error(err);
        });

        res.json({ message: 'Workout ' + workout.name + ' created!' });
    });

workoutRouter.route('/:date_string')
    .get(function(req, res){
        console.log("get on workouts/:date_string");

        var day = new Date(req.params.date_string);
        var nextDay = new Date(req.params.date_string);
            nextDay.setDate(nextDay.getDate() + 1);

        Workout.find({ 'date': {"$gte": day, "$lt": nextDay } }, function(err, results) {
            if(err) return res.send(err);

            var workout = results[0]; //first result is the one we need
            var exercises = []; //need to de-reference the exercises and provide them to client

            console.log(workout.exercises);
            for(var i = 0; i < workout.exercises.length; i++){
                var exercise = Exercise.findOne({
                    '_id': workout.exercises[i]
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
app.use('/workouts', workoutRouter);
app.use('/exercises', exerciseRouter);

app.listen(port);
console.log('Magic happens on port ' + port);

