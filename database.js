const async = require('async');
const { Console } = require('console');
//const constants = require('./constants');
const oracledb = require('oracledb');


module.exports.connectionDB = function (finalCallback) {

    async.waterfall([
        function (callback) {
            oracledb.getConnection(
                {
                    user: process.env.DATABASEUSER, 
                    password: process.env.DATABASEPASSWORD,
                    connectString: process.env.DATABASECONNECTSTRING
                },
                function (err, connection) {
                    if (err) {
                        callback(err);
                    }else{
                        callback(null,connection);
                    }
                }
            );
        }
    ], function (err,connection) {
        finalCallback(err, connection);
    });
}

module.exports.releaseDBConnection = function (err, aConnection, callback) {
    if (!aConnection) {
        let error = new Error();
        error.code = "DATABASE_ERROR";
        error.developerMessage = "DB Connection error";
        error.message = "Something went wrong..";
        callback(error);
    }
    else if (err) {
        aConnection.close(function (innerErr) {
            if (innerErr) {
                callback (innerErr);
            } else {
                callback(err);                            
            }
        });
    }
    else {
        aConnection.close(function (innerErr) {
            if (innerErr) {
                callback (innerErr);
            } else {
                callback(null);                            
            }
        });
    }
}