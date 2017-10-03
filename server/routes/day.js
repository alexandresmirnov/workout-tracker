let Day = require('./../models/day');
let Workout = require('./../models/workout');
let Exercise = require('./../models/exercise');

let mustache = require('mustache');

// this will be the exports object
let e = {};

/**
 * Returns all Day documents.
 */
e.getAllDays = function(req, res) {
    Day.find()
    .sort({
        date: -1
    })
    .populate({
        path: 'workouts',
        populate: {
            path: 'exercises',
        }
    })
    .exec(function(err, days) {
        if(err) res.send(err);
        res.status(200).json(days);
    });
};

/**
 * Returns a specific Day based on date_string in URL.
 * @param {string} day_date - date in URL requested, provided by Express.
 */
e.getDay = function(req, res) {
    let targetDate = new Date(req.params.day_date);
    let nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1);

    Day.findOne({
        'date': {
            '$gte': targetDate,
            '$lt': nextDay,
        }
    })
    .populate({
        path: 'workouts',
        populate: {
            path: 'exercises',
        },
    })
    .exec(function(err, day) {
        if(err) res.send(err);
        res.status(200).json(day);
    });
};

/* deletes day with user-supplied date */

e.deleteDay = function(req, res) {
    let targetDate = new Date(req.params.day_date);
    let nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1);
    console.log('nextDay: '+nextDay);

    Day.findOneAndRemove({
        'date': {
            '$gte': targetDate,
            '$lt': nextDay,
        }
    }, function(){
        res.status(201).json({ message: 'Day deleted' });
    });

};

/* creates day with user-supplied date and adds to database */

e.putDay = function(req, res) {
    let day = new Day();
    let d = new Date(req.params.day_date);
    day.date =  d;

    let nextDay = new Date();
    nextDay.setDate(d.getDate() + 1);

    Day.findOneAndRemove({
        'date': {
            '$gte': d,
            '$lt': nextDay,
        }
    }, function(){
        console.log('deleted existing day')
    });

    // loop through workouts
    for(let reqWorkout of req.body.workouts){
        let workout = new Workout({
            date: d,
            name: reqWorkout.name,
            exercises: [],
        });

        for(let reqExercise of reqWorkout.exercises){
            let exercise = new Exercise({
                date: d,
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

    res.status(201).json({ message: 'Day put' });

};


/**
 * Creates a Day document (with current date) and adds it to database.
 */
e.createDay = function(req, res) {
	let day = new Day();
    day.date = Date(); // TODO: let client do this

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

    res.status(201).json({ message: 'Day created' });
};


module.exports = e;
