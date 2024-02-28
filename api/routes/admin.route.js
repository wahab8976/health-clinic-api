const express = require("express");
const router = express.Router();

const Controller = require("../controllers/admin.controller");
const validate = require("../middlewares/validateReq.middleware");
const Validation = require("../validators/admin.validator");
const authenticate = require("../middlewares/authenticate.middleware");
const Authorize = require("../middlewares/authorize.middlware");

// Route for registering admin
router.post(
  "/register",
  validate(Validation.registerSchema, "BODY"),
  authenticate,
  Authorize.isAdmin,
  Controller.registerAdmin
);

// Route for logging in admin
router.post(
  "/login",
  validate(Validation.loginSchema, "BODY"),
  Controller.loginAdmin
);

// Route for getting admin profile
router.get(
  "/profile",
  authenticate,
  Authorize.isAdmin,
  Controller.getAdminProfile
);

// Route for updating admin profile
router.patch(
  "/profile",
  validate(Validation.updateProfileSchema, "BODY"),
  authenticate,
  Authorize.isAdmin,
  Controller.updateAdminProfile
);

// Route for deleting admin profile
router.delete(
  "/profile",
  authenticate,
  Authorize.isAdmin,
  Controller.deleteAdminProfile
);

module.exports = router;
