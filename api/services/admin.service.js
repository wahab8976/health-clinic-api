const Admin = require("../models/admin.model");
const { throwError } = require("../utils/error.util");

// CreateAdmin
const createAdmin = async (admin) => {
  try {
    const newAdmin = await Admin.create(admin);

    if (newAdmin) {
      return {
        status: "SUCCESS",
        data: newAdmin,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 422,
          identifier: "0x000A00",
          message: "Failed to create admin",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A01");
  }
};

// GetAdminById
const getAdminById = async (adminId, projection) => {
  try {
    const admin = await Admin.findOne(
      { _id: adminId, isDeleted: false },
      projection
    );

    if (admin) {
      return {
        status: "SUCCESS",
        data: admin,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000A02",
          message: "Admin not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A03");
  }
};

// GetAdminByUsername
const getAdminByUsername = async (username, projection) => {
  try {
    const admin = await Admin.findOne(
      { username, isDeleted: false },
      projection
    );

    if (admin) {
      return {
        status: "SUCCESS",
        data: admin,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000A04",
          message: "Admin not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A05");
  }
};

// GetAdminByEmail
const getAdminByEmail = async (email, projection) => {
  try {
    const admin = await Admin.findOne({ email, isDeleted: false }, projection);

    if (admin) {
      return {
        status: "SUCCESS",
        data: admin,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000A06",
          message: "Admin not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A07");
  }
};

// UpdateAdminById
const updateAdminById = async (adminId, update, options) => {
  try {
    const updatedAdmin = await Admin.findOneAndUpdate(
      { _id: adminId, isDeleted: false },
      update,
      options
    );

    if (updatedAdmin) {
      return {
        status: "SUCCESS",
        data: updatedAdmin,
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000A08",
          message: "Admin not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A09");
  }
};

// DeleteAdminById
const deleteAdminById = async (adminId, options = {}) => {
  try {
    const deletedAdmin = await Admin.findOneAndUpdate(
      { _id: adminId, isDeleted: false },
      { $set: { isDeleted: true } },
      options
    );

    if (deletedAdmin.isDeleted) {
      return {
        status: "SUCCESS",
      };
    } else {
      return {
        status: "FAILED",
        error: {
          statusCode: 404,
          identifier: "0x000A0A",
          message: "Admin not found",
        },
      };
    }
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000A0B");
  }
};

// CheckUsernameAndEmailAvailability
const checkUsernameAndEmailAvailability = async (username, email) => {
  try {
    const admin = await Admin.findOne({
      $or: [{ username }, { email }],
      isDeleted: false,
    });

    if (admin) {
      let duplicateFields = [];

      if (admin.username === username) {
        duplicateFields.push("Username");
      }

      if (admin.email === email) {
        duplicateFields.push("Email");
      }

      return {
        status: "FAILED",
        error: {
          statusCode: 409,
          identifier: "0x000A0C",
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
    throwError("FAILED", 422, error.message, "0x000A0D");
  }
};

module.exports = {
  createAdmin,
  getAdminById,
  getAdminByUsername,
  getAdminByEmail,
  updateAdminById,
  deleteAdminById,
  checkUsernameAndEmailAvailability,
};
