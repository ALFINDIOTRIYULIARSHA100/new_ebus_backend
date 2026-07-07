const express = require("express");
const router = express.Router();

const {
  superAdminReport,
} = require("../controllers/reportController");

router.get(
  "/super-admin",
  superAdminReport,
);

module.exports = router;