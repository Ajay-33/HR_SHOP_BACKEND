import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const searchSchema = new mongoose.Schema(
  {
    searchName: {
      type: String,
      required: [true, "Search name is required"],
      unique: true,
    },
    previousSearchContent: [
      {
        type: String,
      },
    ],
    shortlistedCandidates: [
      {
        name: String,
        role: {
          type: String,
          default: "Unknown Role",
        },
        organization: {
          type: String,
          default: "Unknown Organization",
        },
        education: {
          type: String,
          default: "Not Specified",
        },
        location: {
          type: String,
          default: "Unknown Location",
        },
        status: {
          type: String,
          default: "Not Contacted",
        },
        owner: String,
        linkedin: {
          type: String,
          default: null,
        },
        github: {
          type: String,
          default: null,
        },
        email: {
          type: String,
          default: null,
        },
        phone: {
          type: String,
          default: null,
        },
      },
    ],
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
      minlength: [8, "Password should be at least 8 characters long"],
      validate: {
        validator: function (v) {
          return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
            v
          );
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      },
      select: false,
    },
    searches: [searchSchema], // Embedded array of search objects
  },
  { timestamps: true }
);

// Password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison method
userSchema.methods.comparePassword = async function (userPassword) {
  return bcrypt.compare(userPassword, this.password);
};

// JWT creation method
userSchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default mongoose.model("User", userSchema);
