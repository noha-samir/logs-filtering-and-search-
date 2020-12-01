let app = require('express')();
let express = require('express');
let compression = require("compression");
let bodyParser = require('body-parser');
let morgan = require('morgan');
let conn = require('./database');
let async = require('async');
require('dotenv').config()

app.use(express.static('AdminLTE-3.0.5') );

var server = app.listen(process.env.PORT, function (req, res, next) {
    console.log("App is listening on port: "+process.env.PORT+".");

    async.waterfall([
        function (callback) {
            conn.connectionDB(function (error, connection) {
                if (error === null) {
                    console.log('Connection test succeeded. You connected to Exadata Express');
                } else if (error instanceof Error) {
                    console.log('Connection test failed. Check the settings and redeploy app!\n');
                    console.log(error);
                } else {
                    console.log('Connection test pending. Refresh after a few seconds...');
                }
                callback(error, connection)
            });
        }
    ], function (err, connection) {
        if (err) {
            throw err;
        } else {
            conn.releaseDBConnection(err, connection, function () {
                if (err) {
                    throw err;
                }
                else {
                    console.log('Database is ready :)');
                }
            });
        }
    });
});
app.use(morgan('dev'));
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('WELCOME TO ESB'));

//handling /api route
app.use('/api', require('./indexRoutes'));

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 400);
    res.json({
        "custom-error-code": error.code,
        "developer-message": error.developerMessage,
        "user-message": error.message,
        "additional-data": error.additionalData
    });
});

module.exports = app;