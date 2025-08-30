import asyncHandler from "../config/asyncHandler.js";
import ApiError from "../config/ApiError.js";
import ApiResponse from "../config/ApiResponse.js";
import poolPromise from "../config/dbConnect.js";

const executeQuery = async (query, params) => {
  const pool = await poolPromise;
  const request = pool.request();
  if (params) {
    params.forEach((param) => request.input(param.name, param.value));
  }
  return request.query(query);
};

const assignTeacherSubjects = asyncHandler(async (req, res) => {
    const { userId, subjects, std, div } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Action', 'assign_teacher_subject')
            .input('userId', userId)
            .input('subjects', subjects)
            .input('std', std)
            .input('div', div)
            .execute('sp_assignStdDiv');

        const [statusResult, allocationResult] = result.recordsets;
        
        if (statusResult[0].status < 0) {
            throw new ApiError(statusResult[0].message, 400);
        }

        return res.status(200).json(
            new ApiResponse(200, {
                status: statusResult[0].status,
                message: statusResult[0].message,
                allocation: allocationResult[0]
            }, statusResult[0].message)
        );
    } catch (err) {
        console.error("Error in assignTeacherSubjects:", err);
        throw new ApiError(err.message || "Failed to assign teacher subjects", 500);
    }
});


const getAllTeacher = asyncHandler(async (req, res) => {
    try {

        const pool = await poolPromise;

        
        const result = await pool.request()
            .execute('sp_GetAllTeachersWithAllocations');

        // Group teachers and their allocations
        const teachersMap = new Map();
        
        result.recordset.forEach(row => {
            if (!teachersMap.has(row.teacherId)) {
                teachersMap.set(row.teacherId, {
                    teacherId: row.teacherId,
                    email: row.email,
                    fname: row.fname,
                    mname: row.mname,
                    lname: row.lname,
                    role: row.role,
                    phone: row.phone,
                    gender: row.gender,
                    allocations: []
                });
            }
            
            if (row.allocationId) {
                teachersMap.get(row.teacherId).allocations.push({
                    allocationId: row.allocationId,
                    subjects: row.subjects,
                    std: row.std,
                    div: row.div
                });
            }
        });

        const teachers = Array.from(teachersMap.values());
        
        return res.status(200).json(
            new ApiResponse(
                200, 
                teachers,
                "Teachers data fetched successfully"
            )
        );
    } catch (err) {
        console.error("Error in getAllTeacher:", err);
        throw new ApiError("Failed to fetch teachers data", 500);
    } finally {
        sql.close();
    }
});

const getTeacherById = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Action', 'get_teacher_by_id')
      .input('teacherId', teacherId)
      .execute('sp_getData');

    if (result.recordset[0].status === -1) {
      throw new ApiError(400, result.recordset[0].message);
    }

    const { status, message, ...teacherData } = result.recordset[0];

    return res.status(200).json(
      new ApiResponse(200, teacherData, "Teacher retrieved successfully")
    );
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
});

const getTeacherByStd = asyncHandler(async (req, res) => {
  const { std } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Action', 'get_teachers_by_std')
      .input('std', std)
      .execute('sp_getData');

    if (result.recordset[0].status === -1) {
      throw new ApiError(400, result.recordset[0].message);
    }

    const teachers = result.recordset.map(teacher => {
      const { status, message, ...teacherData } = teacher;
      return teacherData;
    });

    return res.status(200).json(
      new ApiResponse(200, teachers, "Teachers retrieved successfully")
    );
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
});

const getTeacherByAllocation = asyncHandler(async (req, res) => {
    const { std, div, subject } = req.body;

    if (!std || !div || !subject) {
        throw new ApiError("Standard, division, and subject are required", 400);
    }

    try {
        const pool = await poolPromise;
        
        const result = await pool.request()
            .input('std', std)
            .input('div', div)
            .input('subject', subject)
            .execute('sp_GetTeachersByAllocation');

        return res.status(200).json(
            new ApiResponse(200, result.recordset, "Teachers fetched successfully")
        );
    } catch (err) {
        console.error("Error in getTeacherByAllocation:", err);
        throw new ApiError("Failed to fetch teachers by allocation", 500);
    } 
});


const getTeacherBySubject = asyncHandler(async (req, res) => {
  const subject = req.params.sub;

  const teacherBySubjectQuery = `
    SELECT u.user_id, u.fname, u.lname, u.email, u.phone 
    FROM Users u
    JOIN Teachers t ON u.user_id = t.user_id
    WHERE u.role = 'Teacher' AND t.subjects = @Subject;
  `;

  const teacherBySubjectResult = await executeQuery(teacherBySubjectQuery, [
    { name: "Subject", value: subject },
  ]);

  return res.send(
    new ApiResponse(
      200,
      teacherBySubjectResult.recordset,
      "Teacher fetched successfully"
    )
  );
});

// const createTeacher = asyncHandler(async (req, res) => {
//   const {
//     fname,
//     mname,
//     lname,
//     address,
//     gender,
//     dob,
//     email,
//     password,
//     phone,
//     role,
//     subjects,
//   } = req.body;

//   if (
//     !fname ||
//     !lname ||
//     !address ||
//     !gender ||
//     !dob ||
//     !email ||
//     !password ||
//     !phone ||
//     !role ||
//     !subjects
//   ) {
//     throw new ApiError(400, "All fields are required.");
//   }

//   if (!Array.isArray(subjects) || subjects.length === 0) {
//     throw new ApiError(400, "Subjects must be a non-empty array.");
//   }

//   // Step 1: Insert teacher into Teachers table
//   const teacherInsertQuery = `
//       INSERT INTO Teachers (FirstName, MiddleName, LastName, Address, Gender, DOB, Email, Password, Phone, Role)
//       OUTPUT INSERTED.TeacherID
//       VALUES (@fname, @mname, @lname, @address, @gender, @dob, @password, @phone, @role)
//     `;

//   const teacherParams = [
//     { name: "fname", value: fname },
//     { name: "mname", value: mname },
//     { name: "lname", value: lname },
//     { name: "address", value: address },
//     { name: "gender", value: gender },
//     { name: "dob", value: dob },
//     { name: "email", value: email },
//     { name: "password", value: password },
//     { name: "phone", value: phone },
//     { name: "role", value: role },
//   ];

//   const teacherResult = await executeQuery(teacherInsertQuery, teacherParams);
//   const teacherID = teacherResult.recordset[0].TeacherID;

//   // Step 2: Insert subjects into TeacherSubjects table
//   const subjectInsertQuery = `
//       INSERT INTO Teachers (TeacherID, Subject)
//       VALUES (@teacherID, @subject)
//     `;

//   for (const subject of subjects) {
//     const subjectParams = [
//       { name: "teacherID", value: teacherID },
//       { name: "subject", value: subject },
//     ];
//     await executeQuery(subjectInsertQuery, subjectParams);
//   }

//   // Step 3: Send response
//   res.send(
//     new ApiResponse(
//       201,
//       teacherResult.recordset,

//       "Teacher and subjects created successfully."
//     )
//   );
// });

const assignMentor = asyncHandler(async (req, res) => {
    const { userId, std, div } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Action', 'assign_mentor')
            .input('userId', userId)
            .input('std', std)
            .input('div', div)
            .execute('sp_assignStdDiv');

        const response = result.recordset[0];
        
        if (response.status < 0) {
            throw new ApiError(response.message, 400);
        }

        return res.status(200).json(
            new ApiResponse(200, response, response.message)
        );
    } catch (err) {
        console.error("Error in assignMentor:", err);
        throw new ApiError(err.message || "Failed to assign mentor", 500);
    }
});

const assignClassTeacher = asyncHandler(async (req, res, next) => {
    const { userId, std, div } = req.body;

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('Action', 'assign_class_teacher')
            .input('userId', userId)
            .input('std', std)
            .input('div', div)
            .execute('sp_assignStdDiv');

        const response = result.recordset[0];

        if (response.status < 0) {
            // Custom error from SQL
            return next(new ApiError(400, response.message));
        }

        return res.status(200).json(
            new ApiResponse(200, response, response.message)
        );
    } catch (err) {
        console.error("Error in assignClassTeacher:", err);

        // Use next() to forward error to middleware
        return next(
            new ApiError(500, err.message || "Failed to assign class teacher")
        );
    }
});



export {
  assignTeacherSubjects,
  getAllTeacher,
  getTeacherById,
  getTeacherByStd,
  getTeacherBySubject,
  assignClassTeacher,
  assignMentor,
  getTeacherByAllocation,
};
