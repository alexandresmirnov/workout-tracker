// client.js

// packages
let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let morgan = require('morgan');
let path = require('path');
let mustache = require('mustache');
let request = require('request');

// set port
let port = process.env.PORT || 8081;

// config express
let app = express();

// configure app
//app.use(express.static(__dirname + '/web/public'));
app.use(express.static(__dirname + '/../app/dist'));
//app.use(express.static(__dirname + '/test_public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.set('views', path.join(__dirname, './views'));

// config templating
app.set('view engine', 'pug');

// view stuff router
let viewRouter = express.Router();

var days = 'http://localhost:8080/api/days';

viewRouter.route('/days')
    .get(function(req, res) {
        //let test = dayRouter.getAllDays(req, res);

        request.get(
            {
                url: days,
                json: true,
                //headers: {'User-Agent': 'request'}
            }, (err, response, data) => {
                if (err) {
                    console.log('Error:', err);
                }
                else if (res.statusCode !== 200) {
                    console.log('Status:', response.statusCode);
                }
                else {
                    // data is already parsed as JSON:
                    console.log(data[0].workouts[0].exercises[0].sets);

                    //var output = mustache.render('<ul>{{#.}}<li>Date: {{date}}{{.}}</li>{{/.}}</ul>',data);
                    //res.send(output);
                    //res.render('days.ms', data);

                    res.render('days', {days: data});
                    //res.render('index', {title: "Title", message: "Message"});
                }
            }
        );


    });

viewRouter.route('/days/:day_date')
    .get(function(req, res) {
        //let test = dayRouter.getAllDays(req, res);
        let day_date = req.params.day_date

        request.get(
            {
                url: days+"/"+day_date,
                json: true,
                //headers: {'User-Agent': 'request'}
            }, (err, response, data) => {
                if (err) {
                    console.log('Error:', err);
                }
                else if (res.statusCode !== 200) {
                    console.log('Status:', response.statusCode);
                }
                else {
                    // data is already parsed as JSON:
                    //console.log(data[0].workouts[0].exercises[0].sets);

                    //var output = mustache.render('<ul>{{#.}}<li>Date: {{date}}{{.}}</li>{{/.}}</ul>',data);
                    //res.send(output);
                    //res.render('days.ms', data);

                    res.render('day', {day: data});
                    //res.render('index', {title: "Title", message: "Message"});
                }
            }
        );


    });

app.use('/view', viewRouter);

app.listen(port);
console.log('Magic happens on port ' + port);
