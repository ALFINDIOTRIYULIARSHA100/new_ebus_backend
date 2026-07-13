const express = require("express");

const router = express.Router();

const {

    getDriverTracking,
    startTracking,
    stopTracking,
    updateLocation

} = require("../controllers/driverTrackingController");

/*
====================================
GET TRACKING
====================================
*/

router.get(
    "/tracking/:busId",
    getDriverTracking
);

/*
====================================
START TRACKING
====================================
*/

router.post(
    "/tracking/start",
    startTracking
);

/*
====================================
STOP TRACKING
====================================
*/

router.post(
    "/tracking/stop",
    stopTracking
);

/*
====================================
UPDATE LOCATION
====================================
*/

router.post(
    "/tracking/update-location",
    updateLocation
);

module.exports = router;