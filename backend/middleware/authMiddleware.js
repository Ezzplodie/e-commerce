import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.role || req.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};

export { adminMiddleware };
export default authMiddleware;
