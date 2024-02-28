const bcrypt = require("bcrypt");
const Admin = require("../services/admin.service");
const { throwError } = require("../utils/error.util");
const { isEmailOrUsername } = require("../utils/isEmailOrUsername.util");
const { generateToken } = require("../utils/jwt.util");
/**
 * @desc    Register a new admin
 * @route   POST /api/admin/register
 * @access  Private/Admin
 */
const registerAdmin = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    const adminExists = await Admin.checkUsernameAndEmailAvailability(
      username,
      email
    );

    if (adminExists.status === "FAILED") {
      throwError(
        adminExists.status,
        adminExists.error.statusCode,
        adminExists.error.message,
        adminExists.error.identifier
      );
    }

    const newAdmin = await Admin.createAdmin(req.body);

    if (newAdmin.status === "FAILED") {
      throwError(
        newAdmin.status,
        newAdmin.error.statusCode,
        newAdmin.error.message,
        newAdmin.error.identifier
      );
    }

    const signedToken = await generateToken(newAdmin.data._id, "ADMIN");

    // Soft delete properties
    newAdmin.data.password = undefined;
    newAdmin.data.isDeleted = undefined;

    res.status(201).json({
      status: "SUCCESS",
      data: newAdmin.data,
      token: signedToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login admin
 * @route   POST /api/admin/login
 * @access  Public
 */
const loginAdmin = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    const isEmailOrUsernameProvided = isEmailOrUsername(emailOrUsername);

    let adminExists;
    const projection = { password: 1 };
    if (isEmailOrUsernameProvided === "email") {
      adminExists = await Admin.getAdminByEmail(emailOrUsername, projection);
    } else {
      adminExists = await Admin.getAdminByUsername(emailOrUsername, projection);
    }

    if (adminExists.status === "FAILED") {
      throwError(
        adminExists.status,
        401,
        "Incorrect Credentials",
        adminExists.error.identifier
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      adminExists.data.password
    );

    if (!isPasswordCorrect) {
      throwError("FAILED", 401, "Incorrect Credentials", "0x000F00");
    }

    const signedToken = await generateToken(adminExists.data._id, "ADMIN");

    res.status(200).json({
      status: "SUCCESS",
      token: signedToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get admin profile
 * @route   GET /api/admin/profile
 * @access  Private/Admin
 */
const getAdminProfile = async (req, res, next) => {
  try {
    const adminId = req.user._id;

    const projection = { password: 0, isDeleted: 0 };
    const admin = await Admin.getAdminById(adminId, projection);

    if (admin.status === "FAILED") {
      throwError(
        admin.status,
        admin.error.statusCode,
        admin.error.message,
        admin.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: admin.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update admin profile
 * @route   PUT /api/admin/profile
 * @access  Private/Admin
 */
const updateAdminProfile = async (req, res, next) => {
  try {
    const adminId = req.user._id;

    if (req.body.password) {
      let admin = await Admin.getAdminById(adminId, { password: 1 });

      if (admin.status === "FAILED") {
        throwError(
          admin.status,
          admin.error.statusCode,
          admin.error.message,
          admin.error.identifier
        );
      }

      const isPasswordCorrect = await bcrypt.compare(
        req.body.oldPassword,
        admin.data.password
      );

      if (!isPasswordCorrect) {
        throwError("FAILED", 401, "Incorrect Credentials", "0x000F01");
      }
    }

    const options = { new: true, fields: { password: 0, isDeleted: 0 } };
    const updatedAdmin = await Admin.updateAdminById(
      adminId,
      req.body,
      options
    );

    if (updatedAdmin.status === "FAILED") {
      throwError(
        updatedAdmin.status,
        updatedAdmin.error.statusCode,
        updatedAdmin.error.message,
        updatedAdmin.error.identifier
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: updatedAdmin.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete admin profile
 * @route   DELETE /api/admin/profile
 * @access  Private/Admin
 */
const deleteAdminProfile = async (req, res, next) => {
  try {
    const adminId = req.user._id;

    const options = { new: true };
    const deletedAdmin = await Admin.deleteAdminById(adminId, options);

    if (deletedAdmin.status === "FAILED") {
      throwError(
        deletedAdmin.status,
        deletedAdmin.error.statusCode,
        deletedAdmin.error.message,
        deletedAdmin.error.identifier
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
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  deleteAdminProfile,
};
