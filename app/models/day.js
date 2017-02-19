var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DaySchema = new Schema({
    date: Date,
    workouts: [Schema.Types.ObjectId]
});

module.exports = mongoose.model('Day', DaySchema);
