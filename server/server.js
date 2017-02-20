// server.js

// packages
let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let morgan = require('morgan');

// set port
let port = process.env.PORT || 8080;

// config express
let app = express();

// configure app
app.use(express.static(__dirname + '/web/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));  

// config templating
app.set('view engine', 'pug');

// mongodb
mongoose.connect('mongodb://127.0.0.1:27017/workout_tracker', function(err) {
    if(err){
        console.error('uh oh');
    } else {
        console.log('successfully connected');
    }
});

// routes
var dayRouter = require('./routes/day');
var workoutRouter = require('./routes/workout');

var apiRouter = express.Router();

apiRouter.use(function(req, res, next) {
    console.log('apiRouter doing its job');
    next();
});

apiRouter.get('/test', function(req, res) {
    console.log('test working');
});

// days
apiRouter.route('/days')
    .get(dayRouter.getAllDays)
    .post(dayRouter.createDay);
apiRouter.route('/days/:day_date')
    .get(dayRouter.getDay);

// workouts
apiRouter.route('/workouts')
    .get(workoutRouter.getAllWorkouts)
    .post(workoutRouter.createWorkout);
apiRouter.route('/workouts/:workout_id')
    .get(workoutRouter.getWorkout);

app.use('/api', apiRouter);

app.listen(port);
console.log('Magic happens on port ' + port);
