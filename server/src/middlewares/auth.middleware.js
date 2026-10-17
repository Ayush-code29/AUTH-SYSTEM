
import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      {
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
      }
    );

    req.user = {
      id: decoded.sub || decoded._id,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};
