const bcrypt = require("bcrypt");
const Patient = require("../services/patient.service");
const { throwError } = require("../utils/error.util");
const { isEmailOrUsername } = require("../utils/isEmailOrUsername.util");
const { generateToken } = require("../utils/jwt.util");

/**
 * @desc    Register a new patient
 * @route   POST /api/patient/register
 * @access  Public
 */
const registerPatient = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    const patientExists = await Patient.checkUsernameAndEmailAvailability(
      username,
      email
    );

    if (patientExists.status === "FAILED") {
      throwError(
        patientExists.status,
        patientExists.error.statusCode,
        patientExists.error.message,
        patientExists.error.identifier
      );
    }

    const newPatient = await Patient.createPatient(req.body);

    if (newPatient.status === "FAILED") {
      throwError(
        newPatient.status,
        newPatient.error.statusCode,
        newPatient.error.message,
        newPatient.error.identifier
      );
    }

    const signedToken = await generateToken(newPatient.data._id, "PATIENT");

    // Soft delete properties
    newPatient.data.password = undefined;
    newPatient.data.isDeleted = undefined;

    res.status(201).json({
      status: "SUCCESS",
      data: newPatient.data,
      token: signedToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login patient
 * @route   POST /api/patient/login
 * @access  Public
 */
const loginPatient = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    const isEmailOrUsernameProvided = isEmailOrUsername(emailOrUsername);

    let patientExists;
    const projection = { password: 1 };
    if (isEmailOrUsernameProvided === "email") {
      patientExists = await Patient.getPatientByEmail(
        emailOrUsername,
        projection
      );
    } else {
      patientExists = await Patient.getPatientByUsername(
        emailOrUsername,
        projection
      );
    }

    if (patientExists.status === "FAILED") {
      throwError(
        patientExists.status,
        401,
        "Incorrect Credentials",
        patientExists.error.identifier
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      patientExists.data.password
    );

    if (!isPasswordCorrect) {
      throwError("FAILED", 401, "Incorrect Credentials", "0x001000");
    }

    const signedToken = await generateToken(patientExists.data._id, "PATIENT");

    res.status(200).json({
      status: "SUCCESS",
      token: signedToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all patients
 * @route   GET /api/patient
 * @access  Private/Admin
 */
const getPatients = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, ...restQuery } = req.query;
    const filter = { isDeleted: false, ...restQuery };
    const projection = { password: 0, isDeleted: 0 };
    const countPatients = await Patient.countPatients(filter);
    const patients = await Patient.getPatients(filter, projection, page, limit);

    if (patients.status === "FAILED") {
      throwError(
        patients.status,
        patients.error.statusCode,
        patients.error.message,
        patients.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      pagination: {
        total: countPatients.data,
        returned: patients.data.length,
        limit: parseInt(limit),
        page: parseInt(page),
      },
      data: patients.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get patient profile
 * @route   GET /api/patient/profile
 * @access  Private/Patient
 */
const getPatientProfile = async (req, res, next) => {
  try {
    const patientId = req.user._id;

    const projection = { password: 0, isDeleted: 0 };
    const patient = await Patient.getPatientById(patientId, projection);

    if (patient.status === "FAILED") {
      throwError(
        patient.status,
        patient.error.statusCode,
        patient.error.message,
        patient.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: patient.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update patient profile
 * @route   PUT /api/patient/profile
 * @access  Private/Patient
 */
const updatePatientProfile = async (req, res, next) => {
  try {
    const patientId = req.user._id;

    if (req.body.password) {
      let patient = await Patient.getPatientById(patientId, { password: 1 });

      if (patient.status === "FAILED") {
        throwError(
          patient.status,
          patient.error.statusCode,
          patient.error.message,
          patient.error.identifier
        );
      }

      const isPasswordCorrect = await bcrypt.compare(
        req.body.oldPassword,
        patient.data.password
      );

      if (!isPasswordCorrect) {
        throwError("FAILED", 401, "Incorrect Credentials", "0x001001");
      }
    }

    const options = { new: true, fields: { password: 0, isDeleted: 0 } };
    const updatedPatient = await Patient.updatePatientById(
      patientId,
      req.body,
      options
    );

    if (updatedPatient.status === "FAILED") {
      throwError(
        updatedPatient.status,
        updatedPatient.error.statusCode,
        updatedPatient.error.message,
        updatedPatient.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: updatedPatient.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete patient profile
 * @route   DELETE /api/patient/profile
 * @access  Private/Patient
 */
const deletePatientProfile = async (req, res, next) => {
  try {
    const patientId = req.user._id;

    const options = { new: true };
    const deletedPatient = await Patient.deletePatientById(patientId, options);

    if (deletedPatient.status === "FAILED") {
      throwError(
        deletedPatient.status,
        deletedPatient.error.statusCode,
        deletedPatient.error.message,
        deletedPatient.error.identifier
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
  registerPatient,
  loginPatient,
  getPatients,
  getPatientProfile,
  updatePatientProfile,
  deletePatientProfile,
};
