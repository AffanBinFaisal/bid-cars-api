const jwt = require("jsonwebtoken");

const adminOnly = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token is missing" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
    if(user.email=="affanfaisal442@gmail"){
      req.user = user;
    }else{
      return res.status(403).json({error: "Forbidden: Insufficient previleges"});
    }
    next();
  });
}

module.exports = adminOnly;