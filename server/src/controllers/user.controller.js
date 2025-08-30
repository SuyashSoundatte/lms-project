import ApiError from "../config/ApiError.js";
import ApiResponse from "../config/ApiResponse.js";
import { verifyPassword } from "../config/hashPass.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../config/asyncHandler.js";
import poolPromise from "../config/dbConnect.js";

const executeQuery = async (query, params) => {
  const pool = await poolPromise;
  const request = pool.request();
  if (params) {
    params.forEach((param) => request.input(param.name, param.value));
  }
  return request.query(query);
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password");
  }

  const pool = await poolPromise;

  try {
    const result = await pool
      .request()
      .input("Action", "user_login")
      .input("Email", email)
      .execute("sp_login");

    if (result.recordset.length === 0 || result.recordset[0].status === -1) {
      throw new ApiError(404, "User not found");
    }

    const user = result.recordset[0];
    // const isPasswordValid = await verifyPassword(user.password, password);

    if (user.password !== password) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SEC,
      { expiresIn: "24h" }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: userWithoutPassword, token },
          "Login successful"
        )
      );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Login failed due to server error");
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("Action", "get_all_users")
      .execute("sp_getData");

    const users = result.recordset.map((user) => {
      const { status, message, ...userData } = user;
      return userData;
    });

    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users retrieved successfully"));
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("Action", "get_user_by_id")
      .input("user_id", userId)
      .execute("sp_getData");

    if (result.recordset[0].status === -1) {
      throw new ApiError(400, result.recordset[0].message);
    }

    const { status, message, ...userData } = result.recordset[0];

    return res
      .status(200)
      .json(new ApiResponse(200, userData, "User retrieved successfully"));
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
});

const logOutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  return res.send(new ApiResponse(200, "User logged out successfully"));
});

const getAllMentor = asyncHandler(async (req, res) => {
  try {
    const pool = await poolPromise;

    // Execute stored procedure
    const result = await pool
      .request()
      .input("Action", "get_all_mentors")
      .execute("sp_getData");

    // Check if we got a valid response
    if (!result.recordset || result.recordset.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, [], "No mentors found in the database"));
    }

    // Handle potential error response from SP
    if (result.recordset[0].status === -1) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, result.recordset[0].message));
    }

    // Transform the data - remove status/message and handle null values
    const mentors = result.recordset.map((mentor) => {
      const { status, message, ...mentorData } = mentor;
      return {
        ...mentorData,
        std: mentorData.std || null,
        div: mentorData.div || null,
        mentor_allocation_id: mentorData.mentor_allocation_id || null,
      };
    });

    return res
      .status(200)
      .json(new ApiResponse(200, mentors, "Mentors retrieved successfully"));
  } catch (error) {
    console.error("Database error in getAllMentor:", {
      error: error.message,
      stack: error.stack,
    });

    // Handle specific MSSQL errors
    if (error.name === "RequestError") {
      return res
        .status(500)
        .json(new ApiResponse(500, null, "Database request error occurred"));
    }

    // Handle other errors
    const statusCode = error.statusCode || 500;
    const message =
      error.message || "Failed to retrieve mentors due to server error";

    return res
      .status(statusCode)
      .json(new ApiResponse(statusCode, null, message));
  }
});

// const getAllClassTeacher = asyncHandler(async (req, res) => {
//   const classTeacherQuery = `
//     select u.user_id, u.fname, u.lname, u.email, u.phone, u.role, u.gender, ct.std, ct.div
//     from users u
//     LEFT JOIN ClassTeacher_Allocates ct ON u.user_id = ct.user_id
//     where u.role = 'ClassTeacher'`;
//   const classTeacherResult = await executeQuery(classTeacherQuery);
//   return res.send(
//     new ApiResponse(
//       200,
//       classTeacherResult.recordset,
//       "Class Teachers fetched successfully"
//     )
//   );
// });

const GetUserDataByRole = asyncHandler(async (req, res) => {
  const { userId, role } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("Action", "get_user_data_by_role")
      .input("user_id", userId)
      .input("role", role)
      .execute("sp_getData");

    if (result.recordset[0].status === -1) {
      throw new ApiError(400, result.recordset[0].message);
    }

    const data = result.recordset.map((item) => {
      const { status, message, ...cleanData } = item;
      return cleanData;
    });

    return res
      .status(200)
      .json(new ApiResponse(200, data, "User data retrieved successfully"));
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
});

export {
  loginUser,
  getAllUsers,
  getUserById,
  logOutUser,
  getAllMentor,
  GetUserDataByRole,
};
