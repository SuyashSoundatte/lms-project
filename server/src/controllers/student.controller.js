import asyncHandler from "../config/asyncHandler.js";
import ApiError from "../config/ApiError.js";
import poolPromise from "../config/dbConnect.js";
import ApiResponse from "../config/ApiResponse.js";
import { executeQuery } from "../config/executeQuery.js";
import { hashPassword } from "../config/hashPass.js";
import sql from "mssql";

const createStudent = asyncHandler(async (req, res) => {
  const {
    student_id,
    fname,
    mname,
    lname,
    address,
    gender,
    dob,
    email,
    password,
    father_name,
    father_occu,
    mother_name,
    mother_occu,
    father_phone,
    mother_phone,
    student_cast,
    cast_group,
    course,
    admission_date,
    profile_photo,
    div,
    std,
    roll_no,
  } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("Action", "create_student")
      .input("studentId", student_id)
      .input("Fname", fname)
      .input("Mname", mname)
      .input("Lname", lname)
      .input("Address", address)
      .input("Gender", gender)
      .input("Dob", dob)
      .input("Email", email)
      .input("Password", password)
      .input("FatherName", father_name)
      .input("FatherOccu", father_occu)
      .input("MotherName", mother_name)
      .input("MotherOccu", mother_occu)
      .input("FatherPhone", father_phone)
      .input("MotherPhone", mother_phone)
      .input("StudentCast", student_cast)
      .input("CastGroup", cast_group)
      .input("Course", course)
      .input("AdmissionDate", admission_date)
      .input("ProfilePhoto", profile_photo)
      .input("Div", div)
      .input("Std", std)
      .input("RollNo", roll_no)
      .execute("sp_creation");

    const response = result.recordset[0];

    if (response.id === -1) {
      throw new ApiError(response.message, 400);
    }

    return res
      .status(201)
      .json(new ApiResponse(201, response, response.message));
  } catch (err) {
    console.error("Error in createStudent:", err);
    throw new ApiError(err.message || "Failed to create student", 500);
  }
});

const allocateStudentDiv = asyncHandler(async (req, res) => {
  const { div, std, studentIds } = req.body;

  if (!div || !Array.isArray(studentIds) || studentIds.length === 0) {
    throw new ApiError(400, "Division and studentIds are required.");
  }

  // Prepare TVP
  const tvp = new sql.Table();
  tvp.columns.add("stu_id", sql.Int);
  tvp.columns.add("status", sql.VarChar(20)); // not used, pass NULL

  studentIds.forEach((id) => tvp.rows.add(id, null));

  const pool = await poolPromise;
  const request = pool.request();
  request.input("Action", sql.NVarChar(100), "allocate_division");
  request.input("div", sql.VarChar(10), div);
  request.input("std", sql.VarChar(10), std || null);
  request.input("Students", tvp);
  // Other inputs left null since not needed here
  request.input("user_id", sql.Int, null);
  request.input("subjects", sql.VarChar(255), null);
  request.input("allocation_id", sql.Int, null);

  const result = await request.execute("dkte_user1.sp_allocation");

  return res.send(
    new ApiResponse(
      200,
      { updatedStudents: studentIds, div, std },
      result.recordset[0].message
    )
  );
});

const updateStudent = asyncHandler(async (req, res) => {
  const { userId, divId } = req.body;

  const updateStudentQuery = `
    UPDATE student 
    SET div = @DivId
    WHERE user_id = @UserId;
  `;
  const updateStudentParams = [
    { name: "DivId", value: divId },
    { name: "UserId", value: userId },
    { name: "StdId", value: stdId },
  ];
  await executeQuery(updateStudentQuery, updateStudentParams);
  return res.send(
    new ApiResponse(
      200,
      { userId, stdId, divId },
      "Student updated successfully"
    )
  );
});

//Get All Students
const getAllStudent = asyncHandler(async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("Action", "get_all_students")
      .execute("sp_getData");

    const students = result.recordset.map((student) => {
      const { status, message, ...studentData } = student;
      return studentData;
    });

    return res
      .status(200)
      .json(new ApiResponse(200, students, "Students retrieved successfully"));
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
});

//get student by std
const getStudentByStd = asyncHandler(async (req, res) => {
  const { std } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("Action", "get_students_by_std")
      .input("std", std)
      .execute("sp_getData");

    if (result.recordset[0].status === -1) {
      throw new ApiError(400, result.recordset[0].message);
    }

    const students = result.recordset.map((student) => {
      const { status, message, ...studentData } = student;
      return studentData;
    });

    return res
      .status(200)
      .json(new ApiResponse(200, students, "Students retrieved successfully"));
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
});

const getAllocatedStudent = asyncHandler(async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("Action", "get_allocated_students")
      .execute("sp_getData");

    const students = result.recordset.map((student) => {
      const { status, message, ...studentData } = student;
      return studentData;
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          students,
          "Allocated students retrieved successfully"
        )
      );
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
});

const getStudentById = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("Action", "get_student_by_id")
      .input("student_id", studentId)
      .execute("sp_getData");

    if (result.recordset[0].status === -1) {
      throw new ApiError(400, result.recordset[0].message);
    }

    const { status, message, ...studentData } = result.recordset[0];

    return res
      .status(200)
      .json(
        new ApiResponse(200, studentData, "Student retrieved successfully")
      );
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
});

const getStudentByDiv = asyncHandler(async (req, res) => {
  const { div } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("Action", "get_students_by_div")
      .input("div", div)
      .execute("sp_getData");

    if (result.recordset[0].status === -1) {
      throw new ApiError(400, result.recordset[0].message);
    }

    const students = result.recordset.map((student) => {
      const { status, message, ...studentData } = student;
      return studentData;
    });

    return res
      .status(200)
      .json(new ApiResponse(200, students, "Students retrieved successfully"));
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
});

const assignStudentsToDivision = asyncHandler(async (req, res) => {
  const { studentIds, div } = req.body;

  if (
    !studentIds ||
    !Array.isArray(studentIds) ||
    studentIds.length === 0 ||
    !div
  ) {
    throw new ApiError(
      400,
      "Invalid input. Provide studentIds as an array and a division."
    );
  }

  if (!studentIds.every((id) => Number.isInteger(id))) {
    throw new ApiError(
      400,
      "Invalid student IDs provided. Ensure all IDs are integers."
    );
  }

  // Convert array of IDs to comma-separated string
  const studentIdsStr = studentIds.join(",");

  const query =
    "EXEC sp_AssignStudentsToDivision @studentIds = @studentIds, @div = @div";

  const params = [
    { name: "studentIds", value: studentIdsStr },
    { name: "div", value: div },
  ];

  const result = await executeQuery(query, params);

  res.status(200).send({
    message: "Students assigned to the division successfully.",
    affectedRows: result.rowsAffected[0],
  });
});

const getStudentByStdDiv = asyncHandler(async (req, res) => {
  const std = req.params.std;
  const div = req.params.div;

  const getStudentByStdDivQuery = `
    select s.stu_id, u.fname, u.lname, u.gender, s.div, s.std, s.roll_no
    from Users u
    join Students s on u.user_id = s.user_id
    where s.div = @Div and s.std = @Std 
  `;

  const divStdParams = [
    { name: "Std", value: std },
    { name: "Div", value: div },
  ];

  const divStdResult = await executeQuery(
    getStudentByStdDivQuery,
    divStdParams
  );

  return res.send(
    new ApiResponse(200, divStdResult.recordset, "student get by std and div")
  );
});

const getStudentsByClassOrStdDiv = asyncHandler(async (req, res) => {
  const { classId } = req.params;
  const { std, div } = req.query;

  try {
    const pool = await poolPromise;
    const request = pool
      .request()
      .input("Action", "get_students_by_class_or_stddiv");

    if (classId) {
      request.input("class_id", classId);
    } else {
      request.input("std", std).input("div", div);
    }

    const result = await request.execute("sp_getData");

    if (result.recordset[0].status === -1) {
      throw new ApiError(400, result.recordset[0].message);
    }

    const students = result.recordset.map((student) => {
      const { status, message, ...studentData } = student;
      return studentData;
    });

    return res
      .status(200)
      .json(new ApiResponse(200, students, "Students retrieved successfully"));
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
});

export {
  createStudent,
  allocateStudentDiv,
  updateStudent,
  getAllStudent,
  getStudentByStd,
  getAllocatedStudent,
  getStudentById,
  getStudentByDiv,
  assignStudentsToDivision,
  getStudentByStdDiv,
  getStudentsByClassOrStdDiv,
};
