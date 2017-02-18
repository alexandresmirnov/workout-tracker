// server.js

// packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

app.set('view engine', 'pug');

// configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set port
var port = process.env.PORT || 8080;


// mongodb
mongoose.connect("mongodb://127.0.0.1:27017/workouts", function(err) {
    if(err){
        console.error("uh oh");
    }
    else {
        console.log("successfully connected");
    }

});



var Bear = require('./app/models/bear');
var Workout = require('./app/models/workout');
var Exercise = require('./app/models/exercise');

// routes
var router = express.Router();

router.use(function(req, res, next) {
    console.log("something is happening");
    next();
});

router.get('/', function(req, res) {
    console.log("root get");
    /*
	Workout.find(function(err, w){
        res.render('chart', {
            workouts: w
        });
    });
    */
    /*
    Bear.find(function(err, b){
		res.render('index', { bears: b});
	});
    */
    res.json({message: 'hej'});
});

router.route('/workouts')
    .get(function(req, res) {
        Workout.find(function(err, w){
            res.render('chart', {
                workouts: w
            });
        });

     })
    .post(function(req, res) {
        var workout = new Workout();
        workout.date = Date();
        workout.name = req.body.name;

        var ex = req.body.exercises; //array of exercise objects
        for(var i = 0; i < ex.length; i++){
            //create exercise object, save into database, stick objectid into workout.exercises
            var currEx = new Exercise(ex[i]);
            /*
            for(var j = 0; j < ex.sets.length; j++){
                currEx.sets.push(ex.sets[i]);
            }
            */
            currEx.save(function(err, ce){
                if(err) return console.error(err);
            });
            workout.exercises.push(currEx._id);
        }
        

        workout.save(function(err, workout){
            if(err) return console.error(err);
        });

        res.json({ message: 'Workout ' + workout.name + ' created!' });
    });

router.route('/workouts/:date_string')
    .get(function(req, res){
        console.log("get on workouts/:date_string");
        var day = new Date(req.params.date_string);
        var nextDay = new Date(req.params.date_string);
            nextDay.setDate(nextDay.getDate() + 1);
        Workout.find({ 'date': {"$gte": day, "$lt": nextDay } }, function(err, results) {
            if(err) return res.send(err);

            var workout = results[0];
            var exercises = [];

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

router.route('/workouts/:workout_id') 
    .delete(function(req, res){
        Workout.remove({
            _id: req.params.workout_id
        }, function(err, workout){
            if(err) res.send(err);

            console.log(req.params.workout_id);

            res.json({ message: 'Successfully deleted' });
        });
    });
            

    

router.route('/bears')
    .post(function(req, res) {
        var bear = new Bear();
        bear.name = req.body.name;

        console.log("received request with name: "+req.body.name);
        console.log("creating bear with name: "+bear.name);

   

        bear.save(function (err, bear) {
            if(err) return console.error(err);
        });
        

        res.json({ message: 'Bear '+ bear.name +' created!' });
    })
    
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err) res.send(err);

            res.json(bears);
        });
    });

router.route('/bears/:bear_id')
    .get(function(req, res){
        Bear.findById(req.params.bear_id, function(err, bear) {
            if(err) res.send(err);

            res.json(bear);
        });
    })

    .put(function(req, res){
        Bear.findById(req.params.bear_id, function(err, bear){
            if(err) res.send(err);

            bear.name = req.body.name;

            bear.save(function(err){
                if(err) res.send(err);

                res.json({ message: 'Bear updated!' });
            });

        });
    })
    
    .delete(function(req, res){
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear){
            if(err) send(err);

            res.json({ message: 'Successfully deleted' });

        });
    });

// register all the routes
app.use('/', router);


app.listen(port);
console.log('Magic happens on port ' + port);

