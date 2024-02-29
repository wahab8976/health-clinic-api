const Doctor = require("../models/user.model");
const { throwError } = require("../utils/error.util");

// CreateDoctor
const createDoctor = async (doctor) => {
  try {
    const newDoctor = await Doctor.create(doctor);

    if (newDoctor) {
      return {
        status: "SUCCESS",
        data: newDoctor,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 422,
          identifier: "0x000C00",
          message: "Failed to create doctor",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000C01");
  }
};

// CountDoctors
const countDoctors = async (filter) => {
  try {
    const count = await Doctor.countDocuments(filter);

    return {
      status: "SUCCESS",
      data: count,
    };
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000C10");
  }
};

// GetDoctors
const getDoctors = async (filter, projection, page, limit) => {
  try {
    const doctors = await Doctor.find(filter, projection, {
      skip: (page - 1) * limit,
      limit: limit,
    });

    if (doctors && doctors.length) {
      return {
        status: "SUCCESS",
        data: doctors,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000C02",
          message: "Doctors not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000C03");
  }
};

// GetDoctorById
const getDoctorById = async (doctorId, projection) => {
  try {
    const doctor = await Doctor.findOne(
      { _id: doctorId, isDeleted: false },
      projection
    );

    if (doctor) {
      return {
        status: "SUCCESS",
        data: doctor,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000C04",
          message: "Doctor not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000C05");
  }
};

// GetDoctorByUsername
const getDoctorByUsername = async (username, projection) => {
  try {
    const doctor = await Doctor.findOne(
      { username, isDeleted: false },
      projection
    );

    if (doctor) {
      return {
        status: "SUCCESS",
        data: doctor,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000C06",
          message: "Doctor not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000C07");
  }
};

// GetDoctorByEmail
const getDoctorByEmail = async (email, projection) => {
  try {
    const doctor = await Doctor.findOne(
      { email, isDeleted: false },
      projection
    );

    if (doctor) {
      return {
        status: "SUCCESS",
        data: doctor,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000C08",
          message: "Doctor not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000C09");
  }
};

// UpdateDoctorById
const updateDoctorById = async (doctorId, update, options = {}) => {
  try {
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { _id: doctorId, isDeleted: false },
      update,
      options
    );

    if (updatedDoctor) {
      return {
        status: "SUCCESS",
        data: updatedDoctor,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000C0A",
          message: "Doctor not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000C0B");
  }
};

// DeleteDoctorById
const deleteDoctorById = async (doctorId, options = {}) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { _id: doctorId, isDeleted: false },
      {
        $set: { isDeleted: true },
      },
      options
    );

    if (doctor.isDeleted) {
      return {
        status: "SUCCESS",
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000C0C",
          message: "Doctor not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000C0D");
  }
};

// CheckUsernameAndEmailAvailability
const checkUsernameAndEmailAvailability = async (username, email) => {
  try {
    const doctor = await Doctor.findOne({
      $or: [{ username }, { email }],
      isDeleted: false,
    });

    if (doctor) {
      let duplicateFields = [];

      if (doctor.username === username) {
        duplicateFields.push("username");
      }

      if (doctor.email === email) {
        duplicateFields.push("email");
      }

      return {
        status: "FAILED",
        error: {
          statusCode: 409,
          identifier: "0x000C0E",
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
    throwError("FAILED", 422, error.message, "0x000C0F");
  }
};

module.exports = {
  createDoctor,
  countDoctors,
  getDoctors,
  getDoctorById,
  getDoctorByUsername,
  getDoctorByEmail,
  updateDoctorById,
  deleteDoctorById,
  checkUsernameAndEmailAvailability,
};
