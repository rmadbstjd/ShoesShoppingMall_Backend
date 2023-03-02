const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  let authHeader = req.headers["authorization"];
  let token = authHeader;

  if (!token) {
    console.log("wrong token format or token is not sended");
    return res.json({ isAuth: false });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) {
      console.log(error);
      return res.sendStatus(401);
    }
    res.locals.user = user;
    req.user = user;
    next();
  });
};
