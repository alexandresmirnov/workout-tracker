var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WorkoutSchema = new Schema({
    date: Date,
    name: String,
    exercises: [Schema.Types.ObjectId]
});

module.exports = mongoose.model('Workout', WorkoutSchema);
