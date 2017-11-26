var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WorkoutSchema = new Schema({
    date: String,
    type: String, //group identifier
    name: String, //TODO change to lookup by type to keep titles consistent
    exercises: [{
        type: Schema.Types.ObjectId,
        ref: 'Exercise',
    }],
});

module.exports = mongoose.model('Workout', WorkoutSchema);
