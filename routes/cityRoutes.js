const express = require("express");

const router = express.Router();

const {
  getCitiesByProvince,
} = require("../controllers/cityController");

router.get(
  "/province/:provinceId",
  getCitiesByProvince
);

module.exports = router;