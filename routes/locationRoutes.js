const express = require("express");

const router = express.Router();

const {

    updateLocation,
    getBusLocation,
    getLocationHistory

}=require("../controllers/locationController");

// update realtime

router.post(
    "/update",
    updateLocation
);

// posisi terakhir bus

router.get(
    "/bus/:busId",
    getBusLocation
);

// histori lokasi

router.get(
    "/history/:driverId",
    getLocationHistory
);

module.exports=router;