const Appointment = require("../services/appointment.service");
const { throwError } = require("../utils/error.util");

/**
 * @desc    Create a new appointment
 * @route   POST /api/appointment
 * @access  Private/Patient
 */
const createAppointment = async (req, res, next) => {
  try {
    const patientId = req.user._id;
    const { doctor, start, end } = req.body;

    // Check appointment availability
    const isAvailable = await Appointment.checkAvailability(doctor, start, end);

    if (isAvailable.status === "FAILED") {
      throwError(
        isAvailable.status,
        isAvailable.error.statusCode,
        isAvailable.error.message,
        isAvailable.error.identifier
      );
    }

    req.body.patient = patientId;
    const newAppointment = await Appointment.createAppointment(req.body);

    if (newAppointment.status === "FAILED") {
      throwError(
        newAppointment.status,
        newAppointment.error.statusCode,
        newAppointment.error.message,
        newAppointment.error.identifier
      );
    }

    // soft delete fields
    newAppointment.data.isDeleted = undefined;

    res.status(201).json({
      status: "SUCCESS",
      data: newAppointment.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all appointments
 * @route   GET /api/appointment
 * @access  Private/Patient, Doctor
 */
const getAllAppointments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, start, end, ...restQuery } = req.query;
    const filter = { isDeleted: false, ...restQuery };
    const projection = { isDeleted: 0 };

    if (start) filter.start = { $gte: new Date(start) };
    if (end) filter.end = { $lte: new Date(end) };

    // Ensure that only the user's own appointments are returned
    const userRole = req.user.role;
    if (userRole === "PATIENT") filter.patient = req.user._id;
    if (userRole === "DOCTOR") filter.doctor = req.user._id;

    const countAppointments = await Appointment.countAppointments(filter);
    const appointments = await Appointment.getAppointments(
      filter,
      projection,
      page,
      limit
    );

    if (appointments.status === "FAILED") {
      throwError(
        appointments.status,
        appointments.error.statusCode,
        appointments.error.message,
        appointments.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      pagination: {
        total: countAppointments.data,
        returned: appointments.data.length,
        limit: parseInt(limit),
        page: parseInt(page),
      },
      data: appointments.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get appointment by id
 * @route   GET /api/appointment/:appointmentId
 * @access  Private/Patient, Doctor
 */
const getAppointmentById = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;

    const filter = { _id: appointmentId, isDeleted: false };
    const projection = { isDeleted: 0 };

    // Ensure that only the user's own appointments are returned
    const userRole = req.user.role;
    if (userRole === "PATIENT") filter.patient = req.user._id;
    if (userRole === "DOCTOR") filter.doctor = req.user._id;

    const appointment = await Appointment.getAppointment(filter, projection);

    if (appointment.status === "FAILED") {
      throwError(
        appointment.status,
        appointment.error.statusCode,
        appointment.error.message,
        appointment.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: appointment.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update appointment by id
 * @route   PUT /api/appointment/:appointmentId
 * @access  Private/Patient, Doctor
 */
const updateAppointmentById = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;

    const filter = { _id: appointmentId, isDeleted: false };
    const options = { new: true, fields: { isDeleted: 0 } }; // exclude isDeleted field

    // Ensure that only the user's own appointments are returned
    const userRole = req.user.role;
    if (userRole === "PATIENT") filter.patient = req.user._id;
    if (userRole === "DOCTOR") filter.doctor = req.user._id;

    const appointment = await Appointment.getAppointment(filter);

    if (appointment.status === "FAILED") {
      throwError(
        appointment.status,
        appointment.error.statusCode,
        appointment.error.message,
        appointment.error.identifier
      );
    }

    // Avoid the update changes if appointment is approved (not applicable for doctor)
    if (
      req.user.role !== "DOCTOR" &&
      appointment.data.status === "APPROVED"
    ) {
      throwError(
        "FAILED",
        422,
        "Appointment is already approved, cannot be update",
        "0x000D081"
      );
    }

    // Check availability with updated changes
    const isAvailable = await Appointment.checkAvailability(
      appointment.data.doctor,
      req.body.start || appointment.data.start,
      req.body.end || appointment.data.end,
      appointmentId
    );

    if (isAvailable.status === "FAILED") {
      throwError(
        isAvailable.status,
        isAvailable.error.statusCode,
        isAvailable.error.message,
        isAvailable.error.identifier
      );
    }

    // Reset the status to PENDING if the start or end time is updated
    if (req.body.start || req.body.end) req.body.status = "PENDING";

    const updatedAppointment = await Appointment.updateAppointment(
      filter,
      req.body,
      options
    );

    if (updatedAppointment.status === "FAILED") {
      throwError(
        updatedAppointment.status,
        updatedAppointment.error.statusCode,
        updatedAppointment.error.message,
        updatedAppointment.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: updatedAppointment.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete appointment by id
 * @route   DELETE /api/appointment/:appointmentId
 * @access  Private/Patient
 */
const deleteAppointmentById = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const patientId = req.user._id;

    const filter = { _id: appointmentId, isDeleted: false };
    const appointment = await Appointment.getAppointment(filter);

    if (appointment.status === "FAILED") {
      throwError(
        appointment.status,
        appointment.error.statusCode,
        appointment.error.message,
        appointment.error.identifier
      );
    }

    // If the appointment is already approved, it cannot be deleted
    if (appointment.data.status === "APPROVED") {
      throwError(
        "FAILED",
        422,
        "Appointment is already approved, cannot be deleted",
        "0x000D082"
      );
    }

    const options = { new: true, fields: { isDeleted: 1 } };
    const deletedAppointment = await Appointment.deleteAppointment(
      appointmentId,
      patientId,
      options
    );

    if (deletedAppointment.status === "FAILED") {
      throwError(
        deletedAppointment.status,
        deletedAppointment.error.statusCode,
        deletedAppointment.error.message,
        deletedAppointment.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentById,
  deleteAppointmentById,
};
