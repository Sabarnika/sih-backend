const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  userType: {
    type: String,
    required: true,
    enum: ["customer", "company"], // 'customer' for freelancers
  },
  areaOfInterest: {
    type: String,
    validate: {
      validator: function(value) {
        return this.userType === "customer" ? !!value : true;
      },
      message: "Area of Interest is required for freelancers.",
    },
  },
  yearsOfExperience: {
    type: Number,
    validate: {
      validator: function(value) {
        return this.userType === "customer" ? value > 0 : true;
      },
      message: "Years of Experience is required for freelancers and must be greater than 0.",
    },
  },
  companyName: {
    type: String,
    validate: {
      validator: function(value) {
        return this.userType === "company" ? !!value : true;
      },
      message: "Company Name is required for companies.",
    },
  },
  companyCode: {
    type: String,
    validate: {
      validator: function(value) {
        return this.userType === "company" ? !!value : true;
      },
      message: "Company Code is required for companies.",
    },
  },
  yearStarted: {
    type: Number,
    validate: {
      validator: function(value) {
        return this.userType === "company" ? value > 0 : true;
      },
      message: "Year Started is required for companies and must be a valid year.",
    },
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
