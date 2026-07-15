const express = require("express");

const router = express.Router();

const {
    getPassengerTracking
} = require("../controllers/passengerTrackingController");

router.get(
    "/:ticket",
    getPassengerTracking
);

module.exports = router;