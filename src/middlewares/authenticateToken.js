const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.status(402).send({
      err: true,
      message: "No Auth Token Found",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({
        err: true,
        message: "Auth Token Invalid",
      });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
