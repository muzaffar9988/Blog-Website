import jwt from "jsonwebtoken";
import errorHandler from "./error.js";
export const verifyToken = async (req, res, next) => {
  const token = await req.cookies.access_token;
  console.log(token);
  if (!token) return next(errorHandler(401, "Invalid User"));
  console.log(token);
  console.log(process.env.JWT_SECRET);

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) return next(errorHandler(401, "invalid user"));
    req.user = user;
    next();
  });
};
