const express = require("express");

const router = express.Router();

const {
  getDriverTracking,
  startTracking,
  stopTracking,
  updateLocation,
} = require("../controllers/driverTrackingController");

/*
========================================
GET TRACKING
========================================
*/

router.get(
  "/:busId",
  getDriverTracking
);

/*
========================================
START TRACKING
========================================
*/

router.post(
  "/start",
  startTracking
);

/*
========================================
STOP TRACKING
========================================
*/

router.post(
  "/stop",
  stopTracking
);

/*
========================================
UPDATE LOCATION
========================================
*/

router.post(
  "/update-location",
  updateLocation
);

module.exports = router;