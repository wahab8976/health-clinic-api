const Appointment = require("../models/appointment.model");
const { throwError } = require("../utils/error.util");

// CreateAppointment
const createAppointment = async (appointment) => {
  try {
    const newAppointment = await Appointment.create(appointment);

    if (newAppointment) {
      return {
        status: "SUCCESS",
        data: newAppointment,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 422,
          identifier: "0x000D00",
          message: "Failed to create appointment",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000D01");
  }
};

// CountAppointments
const countAppointments = async (filter) => {
  try {
    const count = await Appointment.countDocuments(filter);

    return {
      status: "SUCCESS",
      data: count,
    };
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000D12");
  }
};

// GetAppointments
const getAppointments = async (filter, projection, page, limit) => {
  try {
    const appointments = await Appointment.find(filter, projection, {
      sort: { start: 1 },
      skip: (page - 1) * limit,
      limit,
    });

    if (appointments && appointments.length) {
      return {
        status: "SUCCESS",
        data: appointments,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000D02",
          message: "No appointments found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000D03");
  }
};

// GetAppointment
const getAppointment = async (filter, projection) => {
  try {
    const appointment = await Appointment.findOne(filter, projection);

    if (appointment) {
      return {
        status: "SUCCESS",
        data: appointment,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000D04",
          message: "Appointment not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000D05");
  }
};

// CheckAppointmentAvailability
const checkAvailability = async (doctor, start, end, _id = null) => {
  try {
    // If any existing appointment is found, slot is not available
    const appointment = await Appointment.findOne({
      doctor,
      $and: [{ end: { $gt: start } }, { start: { $lt: end } }],
      status: { $ne: "REJECTED" },
      isDeleted: false,
    });

    if (appointment && appointment._id.toString() !== _id) {
      return {
        status: "FAILED",
        error: {
          statusCode: 409,
          identifier: "0x000D0C",
          message: "Appointment not available",
        },
      };
    } else {
      return {
        status: "SUCCESS",
        message: "Appointment available",
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000D0D");
  }
};

// UpdateAppointment
const updateAppointment = async (filter, update, options) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      filter,
      update,
      options
    );

    if (appointment) {
      return {
        status: "SUCCESS",
        data: appointment,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000D0E",
          message: "Appointment not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000D0F");
  }
};

// DeleteAppointmentById
const deleteAppointment = async (appointmentId, patientId, options) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, patient: patientId, isDeleted: false },
      {
        $set: { isDeleted: true },
      },
      options
    );

    if (appointment.isDeleted) {
      return {
        status: "SUCCESS",
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000D10",
          message: "Appointment not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000D11");
  }
};

module.exports = {
  createAppointment,
  countAppointments,
  getAppointments,
  getAppointment,
  checkAvailability,
  updateAppointment,
  deleteAppointment,
};
