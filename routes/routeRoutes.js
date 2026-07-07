const express = require("express");
const router = express.Router();

const {
  getRoutesByCompany,
  getRouteByBus,

  createRoute,
  updateRoute,
  deleteRoute
} = require("../controllers/routeController");

// GET ROUTES COMPANY
router.get(
  "/company/:companyId",
  getRoutesByCompany
);

// GET ROUTE BUS
router.get(
  "/bus/:busId",
  getRouteByBus
);

// CREATE ROUTE
router.post(
  "/",

  (req, res, next) => {

    console.log("POST /api/routes HIT");
    console.log(req.body);

    next();
  },

  createRoute
);

// UPDATE ROUTE
router.put(
  "/:id",
  updateRoute
);

// DELETE ROUTE
router.delete(
  "/:id",
  deleteRoute
);

router.post("/test", (req, res) => {

  console.log("TEST ROUTE");
  console.log(req.body);

  res.json({
    success: true
  });

});

module.exports = router;