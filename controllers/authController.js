import usermodel from "../models/usermodel.js";
import mongoose from "mongoose";
import JWT from "jsonwebtoken";

export const registerController = async (req, res, next) => {
  const { fname, lname, email, password } = req.body;
  try {
    if (!fname || !lname || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill out all the fields" });
    }
    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    // const decoded = JWT.verify(otpToken, process.env.JWT_SECRET);
    // if (decoded.otp !== otp) {
    //   return res.status(400).json({ message: "Invalid OTP" });
    // }

    const user = await usermodel.create({
      firstName: fname,
      lastName: lname,
      email,
      password,
    });

    const token = user.createJWT();

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill out all the fields" });
    }

    const user = await usermodel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const token = user.createJWT();

    res.status(200).json({
      success: true,
      message: "Login Successful",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
