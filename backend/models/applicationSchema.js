import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name!"],
    minLength: [3, "Name must contain at least 3 Characters!"],
    maxLength: [100, "Name cannot exceed 30 Characters!"],
  },
  age: {
    type: Number,
    required: [true, "Please enter your Age!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your Email!"],
    validate: [validator.isEmail, "Please provide a valid Email!"],
  },
  phone: {
    type: Number,
    required: [true, "Please enter your Phone Number!"],
  },
  address: {
    type: String,
    required: false,
  },
  qualification: {
    type: String,
    required: [true, "Please enter your highest Qualification!"],
  },
  degree: {
    type: String,
    required: false,
  },
  branch: {
    type: String,
    required: false,
  },
  college: {
    type: String,
    required: false,
  },
  passingYear: {
    type: Number,
    required: false,
  },
  experience: {
    type: String,
    required: false,
  },
  currentCTC: {
    type: Number,
    required: false,
  },
  skills: {
    type: String,
    required: false,
  },
  resume: {
    public_id: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
  },
  applicantID: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["Job Seeker"],
      required: true,
    },
  },
  employerID: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["Employer"],
      required: true,
    },
  },
});

export const Application = mongoose.model("Application", applicationSchema);
