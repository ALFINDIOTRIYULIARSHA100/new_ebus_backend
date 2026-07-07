const express = require("express");

const router = express.Router();

const {
  getTerminals,
  createTerminal,
  updateTerminal,
  deleteTerminal,
} = require("../controllers/terminalController");

router.get(
  "/",
  getTerminals,
);

router.post(
  "/",
  createTerminal,
);

router.put(
  "/:id",
  updateTerminal,
);

router.delete(
  "/:id",
  deleteTerminal,
);

module.exports = router;