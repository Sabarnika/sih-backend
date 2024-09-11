const express = require("express");
const User = require("./userSchema.js");
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { generateToken } = require("./util.js");

const userRoute = express.Router();

userRoute.post(
  "/sign-up",
  expressAsyncHandler(async (req, res) => {
    // Validate required fields
    const { name, email, password, userType } = req.body;
    if (!name || !email || !password || !userType) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    // Ensure userType is valid
    if (!["customer", "company"].includes(userType)) {
      return res.status(400).send({ message: "Invalid user type" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "Email already exists" });
    }

    // Prepare user data based on userType
    const userData = {
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      userType,
    };

    if (userType === "customer") {
      const { areaOfInterest, yearsOfExperience } = req.body;
      if (!areaOfInterest || yearsOfExperience === undefined) {
        return res.status(400).send({ message: "Missing freelancer details" });
      }
      userData.areaOfInterest = areaOfInterest;
      userData.yearsOfExperience = yearsOfExperience;
    } else if (userType === "company") {
      const { companyName, companyCode, yearStarted } = req.body;
      if (!companyName || !companyCode || yearStarted === undefined) {
        return res.status(400).send({ message: "Missing company details" });
      }
      userData.companyName = companyName;
      userData.companyCode = companyCode;
      userData.yearStarted = yearStarted;
    }

    try {
      const newUser = new User(userData);
      await newUser.save();
      res.send({
        user: newUser,
        token: generateToken(newUser),
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

userRoute.post(
  "/sign-in",
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: "Missing email or password" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).send({ message: "Account not found!" });
    }

    try {
      const validPassword = bcrypt.compareSync(password, user.password);
      if (validPassword) {
        res.send({ user, token: generateToken(user) });
      } else {
        res.status(401).send({ message: "Invalid password!" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

module.exports = userRoute;
