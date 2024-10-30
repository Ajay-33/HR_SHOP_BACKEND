import JWT from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    next("Auth Failed");
  }
  const token = authHeader.split(" ")[1];
  try {
    // console.log(token);
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    // console.log(payload);
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    res.status(400).json({ message: "Session Expired" });
  }
};

export default userAuth;
