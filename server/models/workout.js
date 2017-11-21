var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WorkoutSchema = new Schema({
    date: String,
    name: String,
    title: String, //TODO change to lookup by name to keep titles consistent
    exercises: [{
        type: Schema.Types.ObjectId,
        ref: 'Exercise',
    }],
});

module.exports = mongoose.model('Workout', WorkoutSchema);
