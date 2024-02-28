const jwt = require("jsonwebtoken");

// Middleware for checking if JWT token exists and verifying it if it does
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({
      status: "FAILED",
      error: {
        statusCode: 401,
        message: "Unauthorized",
        identifier: "0x001200",
      },
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (err) {
    res.status(401).json({
      status: "FAILED",
      error: {
        statusCode: 401,
        message: "Unauthorized",
        identifier: "0x001201",
      },
    });
  }
};

module.exports = authenticateJWT;
