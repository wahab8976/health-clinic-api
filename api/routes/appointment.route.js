const express = require("express");
const router = express.Router();

const Controller = require("../controllers/appointment.controller");
const validate = require("../middlewares/validateReq.middleware");
const Validation = require("../validators/appointment.validator");
const authenticate = require("../middlewares/authenticate.middleware");
const Authorize = require("../middlewares/authorize.middlware");

// Route for creating appointment
router.post(
  "/",
  validate(Validation.createSchema, "BODY"),
  authenticate,
  Authorize.isPatient,
  Controller.createAppointment
);

// Route for getting all appointments
router.get(
  "/",
  validate(Validation.getAllSchema, "QUERY"),
  authenticate,
  Authorize.isPatientOrDoctor,
  Controller.getAllAppointments
);

// Route for getting appointment by id
router.get(
  "/:appointmentId",
  validate(Validation.idSchema("appointmentId"), "PARAM"),
  authenticate,
  Authorize.isPatientOrDoctor,
  Controller.getAppointmentById
);

// Route for updating appointment by id
router.patch(
  "/:appointmentId",
  validate(Validation.idSchema("appointmentId"), "PARAM"),
  authenticate,
  Authorize.isPatientOrDoctor,
  validate(Validation.updateSchema, "BODY"),
  Controller.updateAppointmentById
);

// Route for deleting appointment by id
router.delete(
  "/:appointmentId",
  validate(Validation.idSchema("appointmentId"), "PARAM"),
  authenticate,
  Authorize.isPatient,
  Controller.deleteAppointmentById
);

module.exports = router;