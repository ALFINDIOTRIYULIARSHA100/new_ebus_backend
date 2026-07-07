const express =
  require("express");

const router =
  express.Router();

const {

  getAllCheckpoints,
  getCheckpointsByCity,
  createCheckpoint,
  updateCheckpoint,
  deleteCheckpoint

} = require(
  "../controllers/checkpointController"
);


// GET ALL
router.get(
  "/",
  getAllCheckpoints
);


// GET BY CITY
router.get(
  "/city/:cityId",
  getCheckpointsByCity
);


// CREATE
router.post(
  "/",
  createCheckpoint
);


// UPDATE
router.put(
  "/:id",
  updateCheckpoint
);


// DELETE
router.delete(
  "/:id",
  deleteCheckpoint
);


module.exports = router;