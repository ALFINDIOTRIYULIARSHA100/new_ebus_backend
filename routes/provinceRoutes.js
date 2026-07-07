const express = require("express");

const router = express.Router();

const {
  getProvinces,
} = require("../controllers/provinceController");

router.get("/", getProvinces);

module.exports = router;