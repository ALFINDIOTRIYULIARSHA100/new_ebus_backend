const express = require("express");

const router = express.Router();

const {
  getAllBuses,
  createBus,
  updateBus,
  deleteBus,
  getBusByCompany
} = require("../controllers/busController");

router.get("/", getAllBuses);

router.get(
  "/company/:companyId",
  getBusByCompany
);

router.post("/", createBus);

router.put("/:id", updateBus);

router.delete("/:id", deleteBus);

router.get("/mesin", async (req, res) => {

  try {

    const pool = require("../config/database");

    const result = await pool.query(`
      SELECT *
      FROM mesin
      ORDER BY nama_mesin
    `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch(err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

});

module.exports = router;