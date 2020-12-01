var conn = require('../../database');
var async = require('async');
var ESBModel = require('../models/ESBModel')

function controllerSteps(req, res, next, UserAction) {
    let aConnection = null;

    async.waterfall([
        function (callback) {
            conn.connectionDB(function (err, connection) {
                aConnection = connection;
                callback(err);
            });
        }, function (callback) {
            UserAction(aConnection, function (err, returnedObject) {
                callback(err, returnedObject);
            });
        }
    ],
        function (err, output) {
            conn.releaseDBConnection(err, aConnection, function (err) {
                if (err) {
                    next(err);
                }
                else {
                    res.status(200).json(output);
                }
            })
        });
};

//get req life cycle
module.exports.controllerGetAllPayloadsDuringDates = function (req, res, next) {
    controllerSteps(req, res, next, function (connection, callback) {
        let fromDate = req.params.fromDate;
        let toDate = req.params.toDate;
        let msgRefId = req.query.msgRefId;
        let RqUID = req.query.RqUID;
        let ConsumerId = req.query.ConsumerId;
        let aESBModel = new ESBModel();
        aESBModel.getAllPayloadsDuringDates(connection, fromDate, toDate, msgRefId, RqUID, ConsumerId, function (err, returnedObject) {
            callback(err, returnedObject);
        });
    });
};

module.exports.controllerGetReqLifeCycle = function (req, res, next) {
    controllerSteps(req, res, next, function (connection, callback) {
        let globalTransactionID = req.params.globalTransactionID;
        let aESBModel = new ESBModel();
        aESBModel.getReqLifeCycle(connection, globalTransactionID, function (err, returnedObject) {
            callback(err, returnedObject);
        });
    });
};