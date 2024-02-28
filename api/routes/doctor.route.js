const express = require("express");
const router = express.Router();

const Controller = require("../controllers/doctor.controller");
const validate = require("../middlewares/validateReq.middleware");
const Validation = require("../validators/doctor.validator");
const authenticate = require("../middlewares/authenticate.middleware");
const Authorize = require("../middlewares/authorize.middlware");

// Route for registering doctor
router.post(
  "/register",
  validate(Validation.registerSchema, "BODY"),
  authenticate,
  Authorize.isAdmin,
  Controller.registerDoctor
);

// Route for logging in doctor
router.post(
  "/login",
  validate(Validation.loginSchema, "BODY"),
  Controller.loginDoctor
);

// Route for getting doctors
router.get("/", authenticate, Authorize.isAdmin, Controller.getDoctors);

// Route for getting doctor profile
router.get(
  "/profile",
  authenticate,
  Authorize.isDoctor,
  Controller.getDoctorProfile
);

// Route for updating doctor profile
router.patch(
  "/profile",
  validate(Validation.updateProfileSchema, "BODY"),
  authenticate,
  Authorize.isDoctor,
  Controller.updateDoctorProfile
);

// Route for deleting doctor profile
router.delete(
  "/profile",
  authenticate,
  Authorize.isDoctor,
  Controller.deleteDoctorProfile
);

module.exports = router;
