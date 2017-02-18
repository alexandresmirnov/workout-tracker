var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ExerciseSchema = new Schema({
    date: Date,
    name: String, //possibly add an ID later, look into if that'd make it faster
    sets: [{
        reps: Number,
        weight: Number,
        notes: String
    }]
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
