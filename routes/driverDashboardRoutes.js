const express = require("express");

const router = express.Router();

const {
  getDriverDashboard,
} = require("../controllers/driverDashboardController");

router.get(
  "/:userId",
  getDriverDashboard,
);

module.exports = router;