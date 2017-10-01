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

e.returnAllDays = function() {
    let testing;
    Day.find()
    .populate({
        path: 'workouts',
        populate: {
            path: 'exercises',
        }
    })
    .exec(function(err, days) {
        if(err) {
            console.log(err);
        }
        else {
            testing = "TESTINGGDSKFJLDSF";
            //console.log("days: ", days);
        }
    });
}

e.test = function() {
    return "TEST";
}

e.showAllDays = function(req, res) {
    console.log('show all days called');
    Day.find()
    .populate({
        path: 'workouts',
        populate: {
            path: 'exercises',
        }
    })
    .exec(function(err, days) {
        if(err) res.send(err);

        var view = {
          title: "Joe",
          calc: function () {
            return 2 + 4;
          }
        };

        //var output = mustache.render("{{title}} spends {{calc}}", view);
        //res.send(output);

        var output = mustache.render('<ul>{{#.}}<li>Date: {{date}}{{.}}</li>{{/.}}</ul>',days);


        res.send(output);

        //console.log(days[0]);
        //res.render('index', {title: "title", message: "message"});
        //res.render('days', days);
        //res.status(200).json(days);
    });
};

/**
 * Returns a specific Day based on date_string in URL.
 * @param {string} day_date - date in URL requested, provided by Express.
 */
e.getDay = function(req, res) {
    let targetDate = new Date(req.params.day_date);
    let nextDay = new Date();
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

/**
 * Creates a Day document and adds it to database.
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

    res.status(201).json({ message: 'Workout created' });
};

module.exports = e;
