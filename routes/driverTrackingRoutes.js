const express = require("express");
const router = express.Router();

const {
    getDriverTracking,
    startTracking,
    stopTracking,
    updateLocation
} = require("../controllers/driverTrackingController");

/*
==================================
START
==================================
*/
router.post(
    "/tracking/start",
    startTracking
);

/*
==================================
STOP
==================================
*/
router.post(
    "/tracking/stop",
    stopTracking
);

/*
==================================
UPDATE LOCATION
==================================
*/
router.post(
    "/tracking/update-location",
    updateLocation
);

/*
==================================
GET TRACKING
==================================
*/
router.get(
    "/tracking/:busId",
    getDriverTracking
);

module.exports = router;