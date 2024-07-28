const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const jwtAuthMiddleware = (req, res, next) => {
  try {
    //check if request header has authorization or not
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "Token Not Found!" });

    // extract the token from the request header
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ error: Unauthorized });

    //verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

const generateToken = (userData) => {
  //Generate a JSON Web Token with the user data
  return jwt.sign({ userData }, process.env.JWT_SECRET, { expiresIn: "10m" });
};

module.exports = { jwtAuthMiddleware, generateToken };
