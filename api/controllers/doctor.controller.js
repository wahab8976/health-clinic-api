const bcrypt = require("bcrypt");
const Doctor = require("../services/doctor.service");
const { throwError } = require("../utils/error.util");
const { isEmailOrUsername } = require("../utils/isEmailOrUsername.util");
const { generateToken } = require("../utils/jwt.util");

/**
 * @desc    Register a new doctor
 * @route   POST /api/doctor/register
 * @access  Private/Admin
 */
const registerDoctor = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    const doctorExists = await Doctor.checkUsernameAndEmailAvailability(
      username,
      email
    );

    if (doctorExists.status === "FAILED") {
      throwError(
        doctorExists.status,
        doctorExists.error.statusCode,
        doctorExists.error.message,
        doctorExists.error.identifier
      );
    }

    req.body.role = "DOCTOR";
    const newDoctor = await Doctor.createDoctor(req.body);

    if (newDoctor.status === "FAILED") {
      throwError(
        newDoctor.status,
        newDoctor.error.statusCode,
        newDoctor.error.message,
        newDoctor.error.identifier
      );
    }

    const signedToken = await generateToken(newDoctor.data._id, "DOCTOR");

    // Soft delete properties
    newDoctor.data.weight = undefined;
    newDoctor.data.password = undefined;
    newDoctor.data.isDeleted = undefined;

    res.status(201).json({
      status: "SUCCESS",
      data: newDoctor.data,
      token: signedToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login doctor
 * @route   POST /api/doctor/login
 * @access  Public
 */
const loginDoctor = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    const isEmailOrUsernameProvided = isEmailOrUsername(emailOrUsername);

    let doctorExists;
    const projection = { password: 1 };
    if (isEmailOrUsernameProvided === "email") {
      doctorExists = await Doctor.getDoctorByEmail(emailOrUsername, projection);
    } else {
      doctorExists = await Doctor.getDoctorByUsername(
        emailOrUsername,
        projection
      );
    }

    if (doctorExists.status === "FAILED") {
      throwError(
        doctorExists.status,
        401,
        "Incorrect Credentials",
        doctorExists.error.identifier
      );
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      doctorExists.data.password
    );

    if (!isPasswordMatch) {
      throwError("FAILED", 422, "Invalid credentials", "0x001100");
    }

    const signedToken = await generateToken(doctorExists.data._id, "DOCTOR");

    res.status(200).json({
      status: "SUCCESS",
      token: signedToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all doctors
 * @route   GET /api/doctor
 * @access  Private/Admin
 */
const getDoctors = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, ...restQuery } = req.query;
    const filter = { isDeleted: false, ...restQuery };
    const projection = { password: 0, isDeleted: 0, weight: 0 };
    const countDoctors = await Doctor.countDoctors(filter);
    const doctors = await Doctor.getDoctors(filter, projection, page, limit);

    if (doctors.status === "FAILED") {
      throwError(
        doctors.status,
        doctors.error.statusCode,
        doctors.error.message,
        doctors.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      pagination: {
        total: countDoctors.data,
        returned: doctors.data.length,
        limit: parseInt(limit),
        page: parseInt(page),
      },
      data: doctors.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get doctor profile
 * @route   GET /api/doctor/profile
 * @access  Private/Doctor
 */
const getDoctorProfile = async (req, res, next) => {
  try {
    const doctorId = req.user._id;

    const projection = { password: 0, isDeleted: 0, weight: 0 };
    const doctor = await Doctor.getDoctorById(doctorId, projection);

    if (doctor.status === "FAILED") {
      throwError(
        doctor.status,
        doctor.error.statusCode,
        doctor.error.message,
        doctor.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: doctor.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update doctor profile
 * @route   PUT /api/doctor/profile
 * @access  Private/Doctor
 */
const updateDoctorProfile = async (req, res, next) => {
  try {
    const doctorId = req.user._id;

    if (req.body.password) {
      let doctor = await Doctor.getDoctorById(doctorId, { password: 1 });

      if (doctor.status === "FAILED") {
        throwError(
          doctor.status,
          doctor.error.statusCode,
          doctor.error.message,
          doctor.error.identifier
        );
      }

      const isPasswordCorrect = await bcrypt.compare(
        req.body.oldPassword,
        doctor.data.password
      );

      if (!isPasswordCorrect) {
        throwError("FAILED", 401, "Incorrect Credentials", "0x001101");
      }
    }

    const options = {
      new: true,
      fields: { password: 0, isDeleted: 0, weight: 0 },
    };
    const updatedDoctor = await Doctor.updateDoctorById(
      doctorId,
      req.body,
      options
    );

    if (updatedDoctor.status === "FAILED") {
      throwError(
        updatedDoctor.status,
        updatedDoctor.error.statusCode,
        updatedDoctor.error.message,
        updatedDoctor.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: updatedDoctor.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete doctor profile
 * @route   DELETE /api/doctor/profile
 * @access  Private/Doctor
 */
const deleteDoctorProfile = async (req, res, next) => {
  try {
    const doctorId = req.user._id;

    const options = { new: true };
    const deletedDoctor = await Doctor.deleteDoctorById(doctorId, options);

    if (deletedDoctor.status === "FAILED") {
      throwError(
        deletedDoctor.status,
        deletedDoctor.error.statusCode,
        deletedDoctor.error.message,
        deletedDoctor.error.identifier
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
  registerDoctor,
  loginDoctor,
  getDoctors,
  getDoctorProfile,
  updateDoctorProfile,
  deleteDoctorProfile,
};
