// Middleware for authorizing user roles (Admin, Doctor, Patient)
const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      status: "FAILED",
      error: {
        statusCode: 403,
        message: "Forbidden",
        identifier: "0x001300",
      },
    });
  }
  next();
};

const isDoctor = (req, res, next) => {
  if (req.user.role !== "DOCTOR") {
    return res.status(403).json({
      status: "FAILED",
      error: {
        statusCode: 403,
        message: "Forbidden",
        identifier: "0x001301",
      },
    });
  }
  next();
};

const isPatient = (req, res, next) => {
  if (req.user.role !== "PATIENT") {
    return res.status(403).json({
      status: "FAILED",
      error: {
        statusCode: 403,
        message: "Forbidden",
        identifier: "0x001303",
      },
    });
  }
  next();
};

const isPatientOrDoctor = (req, res, next) => {
  if (req.user.role !== "PATIENT" && req.user.role !== "DOCTOR") {
    return res.status(403).json({
      status: "FAILED",
      error: {
        statusCode: 403,
        message: "Forbidden",
        identifier: "0x001302",
      },
    });
  }
  next();
};

module.exports = {
  isAdmin,
  isDoctor,
  isPatient,
  isPatientOrDoctor,
};
