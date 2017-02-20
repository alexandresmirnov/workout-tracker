var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DaySchema = new Schema({
    date: Date,
    workouts: [{
        type: Schema.Types.ObjectId,
        ref: 'Workout',
    }],
});

module.exports = mongoose.model('Day', DaySchema);
