import mongoose from "mongoose";
import bcrypt from "bcrypt";

// CREATE the Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// configuring pre-save callback to convert password into hash + add Salt
userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

// Adding a method to the User class to compare provided password and in database hashed password
userSchema.methods.comparePassword = function (providedPassword) {
  const user = this;
  // user.password === hashed + salted password

  return new Promise((resolve, reject) => {
    bcrypt.compare(providedPassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }

      if (!isMatch) {
        return reject(false);
      }

      resolve(true);
    });
  });
};

// ASSOCIATE the schema with mongoose.model
mongoose.model("User", userSchema);

// NB, no export needed, only used Once
