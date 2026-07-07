const express = require("express");
const router = express.Router();

const {
  updateBusLocation,
  getCompanyBusLocations
} = require("../controllers/monitoringController");

router.post(
  "/update-location",
  updateBusLocation
);

router.get(
  "/company/:companyId",
  getCompanyBusLocations
);

module.exports = router;