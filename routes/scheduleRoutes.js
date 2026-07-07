const express = require("express");

const router = express.Router();

const {
  getSchedulesByCompany,
  createSchedule,
  updateSchedule,
  deleteSchedule

} = require(
  "../controllers/scheduleController"
);

router.get(
  "/company/:companyId",
  getSchedulesByCompany
);

router.post(
  "/",
  createSchedule
);

router.put(
  "/:id",
  updateSchedule
);

router.delete(
  "/:id",
  deleteSchedule
);

module.exports = router;