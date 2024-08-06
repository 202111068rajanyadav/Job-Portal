import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import cloudinary from "cloudinary";
import { sendMail } from "../helper/sendMail.js";

export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(new ErrorHandler("Employer not allowed to access this resource.", 400));
  }

  const { name, age, email, phone, address, qualification, degree, branch, college, passingYear, experience, currentCTC, skills, jobId } = req.body;

  if (!name || !age || !email || !phone || !address || !qualification) {
    return next(new ErrorHandler("Please fill all required fields.", 400));
  }

  if (!jobId) {
    return next(new ErrorHandler("Job not found!", 404));
  }
  
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler("Job not found!", 404));
  }

  let resumeData = null;

  if (req.files && req.files.resume) {
    const { resume } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
    if (!allowedFormats.includes(resume.mimetype)) {
      return next(new ErrorHandler("Invalid file type. Please upload a PNG, JPEG, WEBP, or PDF file.", 400));
    }

    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath);
      resumeData = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    } catch (error) {
      console.error("Cloudinary Error:", error);
      return next(new ErrorHandler("Failed to upload Resume to Cloudinary", 500));
    }
  }

  const applicantID = { user: req.user._id, role: "Job Seeker" };
  const employerID = { user: jobDetails.postedBy, role: "Employer" };

  const application = await Application.create({
    name,
    age,
    email,
    phone,
    address,
    qualification,
    degree,
    branch,
    college,
    passingYear,
    experience,
    currentCTC,
    skills,
    applicantID,
    employerID,
    resume: resumeData,
  });

  const emailSubject = "Application Submitted Successfully";
  const emailBody = `You have successfully applied for the job.\n\nJob Title: ${jobDetails.title} \nCategory: ${jobDetails.category}\nCompany: ${jobDetails.company}`;
  try {
    await sendMail(email, emailSubject, emailBody);
  } catch (error) {
    console.error("Error sending email:", error);
    // No need to return next(error) here since application submission is successful even if email fails
  }

  res.status(200).json({
    success: true,
    message: "Application Submitted!",
    application,
  });
});


export const employerGetAllApplications = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(new ErrorHandler("Job Seeker not allowed to access this resource.", 400));
  }
  const { _id } = req.user;
  const applications = await Application.find({ "employerID.user": _id });
  res.status(200).json({
    success: true,
    applications,
  });
});

export const jobseekerGetAllApplications = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(new ErrorHandler("Employer not allowed to access this resource.", 400));
  }
  const { _id } = req.user;
  const applications = await Application.find({ "applicantID.user": _id });
  res.status(200).json({
    success: true,
    applications,
  });
});

export const jobseekerDeleteApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(new ErrorHandler("Employer not allowed to access this resource.", 400));
  }
  const { id } = req.params;
  const application = await Application.findById(id);
  if (!application) {
    return next(new ErrorHandler("Application not found!", 404));
  }
  await application.deleteOne();
  res.status(200).json({
    success: true,
    message: "Application Deleted!",
  });
});
