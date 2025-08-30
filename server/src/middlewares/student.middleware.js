import joi from "joi";
import ApiError from "../config/ApiError.js";

// Main student validation schema (expanded to match controller)
const studentSchema = joi
  .object({
    // Personal Info
    student_id: joi.number().required().label("Student ID"),
    fname: joi.string().required().label("First Name"),
    mname: joi.string().allow("").optional().label("Middle Name"),
    lname: joi.string().required().label("Last Name"),
    email: joi.string().email().required().label("Email"),
    password: joi.string().min(6).required().label("Password"),
    address: joi.string().required().label("Address"),
    gender: joi
      .string()
      .valid("Male", "Female", "Other")
      .required()
      .label("Gender"),
    dob: joi.string().required().label("Date of Birth (dd-mm-yyyy)"),

    // Academic Info
    roll_no: joi.string().required().label("Roll Number"),
    std: joi.string().required().label("Standard"),
    div: joi.string().optional().label("Division"),

    // Family Info
    father_name: joi.string().required().label("Father's Name"),
    father_occu: joi.string().optional().label("Father's Occupation"),
    father_phone: joi
      .string()
      .pattern(/^[0-9]{10,15}$/)
      .optional()
      .label("Father's Phone"),
    mother_name: joi.string().required().label("Mother's Name"),
    mother_occu: joi.string().optional().label("Mother's Occupation"),
    mother_phone: joi
      .string()
      .pattern(/^[0-9]{10,15}$/)
      .optional()
      .label("Mother's Phone"),

    // Additional Fields
    student_cast: joi.string().optional().label("Caste"),
    cast_group: joi.string().optional().label("Caste Group"),
    course: joi.string().optional().label("Course"),
    admission_date: joi.string().label("Admission Date (dd-mm-yyyy)"),
    profile_photo: joi.string().uri().optional().label("Profile Photo"),
  })
  .options({ abortEarly: false });

const validStudent = (req, res, next) => {
  const { error } = studentSchema.validate(req.body);

  if (error) {
    const messages = error.details.map((d) => d.message.replace(/"/g, "'"));
    throw new ApiError(400, messages.join(", "));
  }

  next();
};

// Division validation schema (unchanged)
const studentValidationSchema = joi.object({
  userId: joi.string().required(),
});

const validStudentDiv = (req, res, next) => {
  const { error } = studentValidationSchema.validate(req.body);

  if (error) {
    return next(
      new ApiError(
        400,
        `Validation error(s): "${error.details
          .map((x) => x.message)
          .join(", ")}")`
      )
    );
  }
  next();
};

// Student ID validation (improved)
const getStudentId = (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  next();
};

export { validStudent, validStudentDiv, getStudentId };
