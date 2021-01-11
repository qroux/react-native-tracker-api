import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const User = mongoose.model("User");

export default function (req, res, next) {
  // extract token inside req.headers. Require to setup 'Authorization' header before sending the request
  const { authorization } = req.headers;
  // authorization === 'Bearer adzpioehgpze51416zgdzaadaz61'

  if (!authorization) {
    return res.status(401).send({ error: "You must be logged in." });
  }

  // cleanup token
  const token = authorization.replace("Bearer ", "");

  // decode token
  jwt.verify(token, "MY_SECRET_KEY", async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: "You must be logged in." });
    }

    const { userId } = payload;
    const user = await User.findById(userId);

    //assign user value to req
    req.user = user;

    //call next() to pass to the next route/action
    next();
  });
}
