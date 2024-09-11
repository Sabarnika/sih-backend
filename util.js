const jwt = require("jsonwebtoken");
exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};
exports.isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        console.error('Error verifying token:', err);
        res.status(400).send({ message: "Invalid Token!" });
      } else {
        console.log('Decoded Token:', decode);
        req.user = decode;
        next();
      }
    });
  } else {
    console.error('No token provided.');
    res.status(400).send({ message: "No token" });
  }
};
