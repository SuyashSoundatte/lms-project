import jwt from "jsonwebtoken";
import ApiError from "../config/ApiError.js";
import ApiResponse from "../config/ApiResponse.js";
import asyncHandler from "../config/asyncHandler.js";
import { executeQuery } from "../config/executeQuery.js";
import { verifyPassword } from "../config/hashPass.js"; // adjust path if needed
import poolPromise from "../config/dbConnect.js";



// const parentLogin = asyncHandler(async (req, res, next) => {
//   const { phone, password } = req.body;

//   if (!phone || !password) {
//       throw new ApiError(400, "Phone and Password are required");
//   }

//   const query = "SELECT * FROM Student_Dummy WHERE phone = @phone and phone = @password";
//   const result = await executeQuery(query, [{ name: "phone", value: phone }, { name: "password", value: password }]);

//   // Ensure result has the expected structure
//   if (!result || !result.recordset || result.recordset.length === 0) {
//       throw new ApiError(401, "Invalid credentials");
//   }

//   const user = result.recordset[0]; // Use recordset instead of rows
// //   console.log(user);

//   const token = jwt.sign(
//       { stu_id: user.stu_id, phone: result.recordset[0].stu_id },
//       process.env.JWT_SEC,
//       { expiresIn: "1h" }
//   );
// //   console.log(result_marks)


//   res.send(new ApiResponse(200, { token }, "Login successful"));
// });


const parentLogin = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    throw new ApiError(400, "Phone and password are required");
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Action', 'parent_login')
      .input('Phone', phone)
      .execute('sp_login');

    if (result.recordset.length === 0 || result.recordset[0].status === -1) {
      throw new ApiError(404, "Account not found");
    }

    const student = result.recordset[0];
    // const isValid = await verifyPassword(student.password, password);

    if (student.password !== password) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: student.id,
        role: student.role,
        phone: phone
      },
      process.env.JWT_SEC,
      { expiresIn: "24h" }
    );

    const { password: _, ...studentWithoutPassword } = student;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict"
    });
    studentWithoutPassword.role = "Student";
    return res.status(200).json(
      new ApiResponse(200, { student: studentWithoutPassword, token }, "Login successful")
    );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Login failed due to server error");
  }
});

export { parentLogin };


