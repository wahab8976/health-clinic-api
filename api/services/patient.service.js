const Patient = require("../models/user.model");
const { throwError } = require("../utils/error.util");

// CreatePatient
const createPatient = async (patient) => {
  try {
    const newPatient = await Patient.create(patient);

    if (newPatient) {
      return {
        status: "SUCCESS",
        data: newPatient,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 422,
          identifier: "0x000B00",
          message: "Failed to create patient",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B01");
  }
};

// CountPatients
const countPatients = async (filter) => {
  try {
    const count = await Patient.countDocuments(filter);

    return {
      status: "SUCCESS",
      data: count,
    };
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B10");
  }
};

// GetPatients
const getPatients = async (filter, projection, page, limit) => {
  try {
    const patients = await Patient.find(filter, projection, {
      skip: (page - 1) * limit,
      limit: limit,
    });

    if (patients && patients.length) {
      return {
        status: "SUCCESS",
        data: patients,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B02",
          message: "Patients not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B03");
  }
};

// GetPatientById
const getPatientById = async (patientId, projection) => {
  try {
    const patient = await Patient.findOne(
      { _id: patientId, isDeleted: false },
      projection
    );

    if (patient) {
      return {
        status: "SUCCESS",
        data: patient,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B04",
          message: "Patient not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B05");
  }
};

// GetPatientByUsername
const getPatientByUsername = async (username, projection) => {
  try {
    const patient = await Patient.findOne(
      { username, isDeleted: false },
      projection
    );

    if (patient) {
      return {
        status: "SUCCESS",
        data: patient,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B06",
          message: "Patient not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B07");
  }
};

// GetPatientByEmail
const getPatientByEmail = async (email, projection) => {
  try {
    const patient = await Patient.findOne(
      { email, isDeleted: false },
      projection
    );

    if (patient) {
      return {
        status: "SUCCESS",
        data: patient,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B08",
          message: "Patient not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B09");
  }
};

// UpdatePatientById
const updatePatientById = async (patientId, update, options = {}) => {
  try {
    const updatedPatient = await Patient.findOneAndUpdate(
      { _id: patientId, isDeleted: false },
      update,
      options
    );

    if (updatedPatient) {
      return {
        status: "SUCCESS",
        data: updatedPatient,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B0A",
          message: "Patient not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B0B");
  }
};

// DeletePatientById
const deletePatientById = async (patientId, options = {}) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { _id: patientId, isDeleted: false },
      {
        $set: { isDeleted: true },
      },
      options
    );

    if (patient.isDeleted) {
      return {
        status: "SUCCESS",
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000B0C",
          message: "Patient not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B0D");
  }
};

// CheckUsernameAndEmailAvailability
const checkUsernameAndEmailAvailability = async (username, email) => {
  try {
    const patient = await Patient.findOne({
      $or: [{ username }, { email }],
      isDeleted: false,
    });

    if (patient) {
      let duplicateFields = [];

      if (patient.username === username) {
        duplicateFields.push("Username");
      }

      if (patient.email === email) {
        duplicateFields.push("Email");
      }

      return {
        status: "FAILED",
        error: {
          statusCode: 409,
          identifier: "0x000B0E",
          message: `${duplicateFields.join(" and ")} already exists`,
        },
      };
    } else {
      return {
        status: "SUCCESS",
        message: "Username and email are available",
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000B0F");
  }
};

module.exports = {
  createPatient,
  countPatients,
  getPatients,
  getPatientById,
  getPatientByUsername,
  getPatientByEmail,
  updatePatientById,
  deletePatientById,
  checkUsernameAndEmailAvailability,
};
