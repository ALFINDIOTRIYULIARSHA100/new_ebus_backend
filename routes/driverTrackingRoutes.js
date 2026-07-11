const express = require("express");

const router = express.Router();

const {
  getDriverTracking
} = require("../controllers/driverTrackingController");

/*
========================================
GET TRACKING
========================================
*/
router.get(
"/tracking/:busId",
getDriverTracking
);


module.exports = router;