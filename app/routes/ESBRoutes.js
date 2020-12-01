var router = require('express').Router();
var ESBController = require('../controllers/ESBController');
//var ESBValidation = require('../validations/ESBValidation');

//get All Payloads During Dates
router.get('/all/payloads/:fromDate/:toDate', ESBController.controllerGetAllPayloadsDuringDates);

//get req life cycle
router.get('/req/life/cycle/:globalTransactionID', ESBController.controllerGetReqLifeCycle);

module.exports = router;