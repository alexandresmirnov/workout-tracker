var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WorkoutSchema = new Schema({
    date: Date,
    name: String,
    exercises: [{
        type: Schema.Types.ObjectId,
        ref: 'Exercise',
    }],
});

module.exports = mongoose.model('Workout', WorkoutSchema);
