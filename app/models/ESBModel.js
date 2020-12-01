const oracledb = require('oracledb');
const async = require('async');

function ESB() {
}
//get All Payloads During Dates
ESB.prototype.getAllPayloadsDuringDates = function (gConnection, fromDate, toDate, msgRefId, RqUID, ConsumerId, finalCallback) {

    let whereMsgIDCond = null;
    let whereRqUIDCond = null;
    let whereConsumerIDCond = null;
    if (msgRefId == '') {
        whereMsgIDCond = '';
    } else {
        whereMsgIDCond = " AND EXTRACTVALUE (ED.PAYLOAD, '//MSG_ID') LIKE '%" + msgRefId + "%'";
    }
    if (RqUID == '') {
        whereRqUIDCond = '';
    } else {
        whereRqUIDCond = " AND EXTRACTVALUE (ED.PAYLOAD, '//RqUID') like '%" + RqUID + "%'";
    }
    if (ConsumerId == '') {
        whereConsumerIDCond = '';
    } else {
        whereConsumerIDCond = " AND EXTRACTVALUE (ED.PAYLOAD, '//ConsumerId') = '" + ConsumerId + "'";
    }

    async.waterfall([
        function (callback) {
            let query = "SELECT ET.GLOBAL_TRANSACTION_ID,ED.LOG_TIME ,ED.SERVICE_TYPE,EB.BROKER_NAME,EB.EXEGROUP,EF.FLOW_NAME,EF.FLOW_SERVICE, "
                + " EN.NODE_TERMINAl,EN.EVENT_NAME,ES.SERVICE_GROUP,ES.SERVICE_NAME,ED.EVENT_TIME,ED.EVENT_STATUS, "
                + " ED.PAYLOAD_TYPE,ED.PAYLOAD_SIZE,ET.TRANSPORT_PROTOCOL ,ED.PAYLOAD.getCLOBVal() as payload"
                + " FROM EVENT_DATA ED "
                + " INNER JOIN EVENT_SERVICE ES ON ED.SERVICE_ID = ES.SERVICE_ID "
                + " INNER JOIN EVENT_NODE EN ON ED.NODE_ID = EN.NODE_ID "
                + " INNER JOIN EVENT_TRANSACTION ET ON ED.TRANSACTION_ID = ET.TRANSACTION_ID "
                + " INNER JOIN EVENT_FLOW EF ON EN.FLOW_ID = EF.FLOW_ID "
                + " INNER JOIN EVENT_BROKER EB ON ET.BROKER_ID = EB.BROKER_ID "
                + " WHERE "
                + " ED.LOG_TIME BETWEEN " + fromDate + " AND " + toDate + " "
                + whereMsgIDCond
                + whereRqUIDCond
                + whereConsumerIDCond
                + " AND ED.PAYLOAD IS NOT NULL "
                + " AND ES.SERVICE_NAME not in ('exchange_rate_records','getCurrRate','currencies') "
                + " ORDER BY ED.EVENT_TIME desc ";

            oracledb.fetchAsString = [oracledb.CLOB];
            gConnection.execute(query, [],
                {
                    outFormat: oracledb.OBJECT
                }, function (err, result) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null, result.rows);
                    }
                });
        }
    ],
        function (err, results) {
            finalCallback(err, results);
        });
};

//get Req Life Cycle
ESB.prototype.getReqLifeCycle = function (gConnection, globalTransactionID, finalCallback) {
    var self = this;
    async.waterfall([

        function (callback) {
            let query = "SELECT ET.GLOBAL_TRANSACTION_ID, ED.LOG_TIME , ED.SERVICE_TYPE , EB.BROKER_NAME , EB.EXEGROUP , EF.FLOW_NAME , EF.FLOW_SERVICE , "
                + " EN.NODE_TERMINAl , EN.EVENT_NAME , ES.SERVICE_GROUP , ES.SERVICE_NAME , ED.EVENT_TIME , ED.EVENT_STATUS , "
                + " ED.PAYLOAD_TYPE , ED.PAYLOAD_SIZE , ET.TRANSPORT_PROTOCOL , ED.PAYLOAD.getCLOBVal() as payload"
                + " FROM EVENT_DATA ED "
                + " INNER JOIN EVENT_SERVICE ES ON ED.SERVICE_ID = ES.SERVICE_ID "
                + " INNER JOIN EVENT_NODE EN ON ED.NODE_ID = EN.NODE_ID "
                + " INNER JOIN EVENT_TRANSACTION ET ON ED.TRANSACTION_ID = ET.TRANSACTION_ID "
                + " INNER JOIN EVENT_FLOW EF ON EN.FLOW_ID = EF.FLOW_ID "
                + " INNER JOIN EVENT_BROKER EB ON ET.BROKER_ID = EB.BROKER_ID "
                + " WHERE "
                + " ET.GLOBAL_TRANSACTION_ID = '" + globalTransactionID + "' "
                + " AND ED.PAYLOAD IS NOT NULL "
                + " ORDER BY ED.EVENT_TIME desc ";

            oracledb.fetchAsString = [oracledb.CLOB];
            gConnection.execute(query, [],
                {
                    outFormat: oracledb.OBJECT
                }, function (err, result) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null, result.rows);
                    }
                });
        }
    ],
        function (err, results) {
            finalCallback(err, results);
        });
};

module.exports = ESB;
