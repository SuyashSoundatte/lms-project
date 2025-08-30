import asyncHandler from "../config/asyncHandler.js";
import ApiError from "../config/ApiError.js";
import ApiResponse from "../config/ApiResponse.js";
import { hashPassword } from "../config/hashPass.js";
import { executeQuery } from "../config/executeQuery.js";
import poolPromise from "../config/dbConnect.js";

const createUser = asyncHandler(async (req, res) => {
  const {
    fname,
    mname,
    lname,
    address,
    gender,
    dob,
    email,
    password,
    phone,
    role,
  } = req.body;

  try {
    // const hashedPassword = await hashPassword(password);

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("Action", "create_user")
      .input("Fname", fname)
      .input("Mname", mname)
      .input("Lname", lname)
      .input("Address", address)
      .input("Gender", gender)
      .input("Dob", dob)
      .input("Email", email)
      .input("Password", password)
      .input("Phone", phone)
      .input("Role", role)
      .execute("sp_creation");

    const response = result.recordset[0];

    if (response.id === -1) {
      throw new ApiError(response.message, 400);
    }

    return res
      .status(201)
      .json(new ApiResponse(201, response, response.message));
  } catch (err) {
    console.error("Error in createUser:", err);
    throw new ApiError(err.message || "Failed to create user", 500);
  }
});

export { createUser };
