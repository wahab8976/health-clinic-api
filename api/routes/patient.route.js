const express = require("express");
const router = express.Router();

const Controller = require("../controllers/patient.controller");
const validate = require("../middlewares/validateReq.middleware");
const Validation = require("../validators/patient.validator");
const authenticate = require("../middlewares/authenticate.middleware");
const Authorize = require("../middlewares/authorize.middlware");

// Route for registering patient
router.post(
  "/register",
  validate(Validation.registerSchema, "BODY"),
  Controller.registerPatient
);

// Route for logging in patient
router.post(
  "/login",
  validate(Validation.loginSchema, "BODY"),
  Controller.loginPatient
);

// Route for getting patients
router.get("/", authenticate, Authorize.isAdmin, Controller.getPatients);

// Route for getting patient profile
router.get(
  "/profile",
  authenticate,
  Authorize.isPatient,
  Controller.getPatientProfile
);

// Route for updating patient profile
router.patch(
  "/profile",
  validate(Validation.updateProfileSchema, "BODY"),
  authenticate,
  Authorize.isPatient,
  Controller.updatePatientProfile
);

// Route for deleting patient profile
router.delete(
  "/profile",
  authenticate,
  Authorize.isPatient,
  Controller.deletePatientProfile
);

module.exports = router;
