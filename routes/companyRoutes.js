const express = require("express");
const router = express.Router();

const {
  getCompanies,
  createCompany,
  deleteCompany,
  getCompanyById,
  updateCompany,
  changePassword,
  resetAdminPassword
} = require("../controllers/companyController");

// ======================
// COMPANY
// ======================

router.get(
  "/",
  getCompanies
);

router.get(
  "/:id",
  getCompanyById
);

router.post(
  "/",
  createCompany
);

router.put(
  "/:id",
  updateCompany
);

router.delete(
  "/:id",
  deleteCompany
);

router.put(
  "/change-password/:id",
  changePassword
);

router.put(
  "/reset-password/:id",
  resetAdminPassword
);

module.exports = router;