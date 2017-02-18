var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var exercise = new Schema({
    name: String,
    sets: [{
        reps: Number,
        weight: Number
    ]}
};

var daySchema = new Schema({
    date: Date, //day of workout
    name: String, //name of workout day, e.g. "Squat day"
    exercises: [exercise]
};
