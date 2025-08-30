// import asyncHandler from "../config/asyncHandler.js";
// import ApiResponse from "../config/ApiResponse.js";
// import poolPromise from "../config/dbConnect.js";

// // const getAllMentor = asyncHandler(async (req, res) => {
// //   try {
// //     const pool = await poolPromise;
// //     const result = await pool
// //       .request()
// //       .input("Action", "get_all_mentors")
// //       .execute("sp_getData");

// //     if (result.recordset.length === 0 || result.recordset[0].status === -1) {
// //       throw new ApiError(404, "No mentors found");
// //     }

// //     // Remove status and message fields from each record
// //     const mentors = result.recordset.map((mentor) => {
// //       const { status, message, ...mentorData } = mentor;
// //       return mentorData;
// //     });

// //     return res
// //       .status(200)
// //       .json(new ApiResponse(200, mentors, "Mentors retrieved successfully"));
// //   } catch (error) {
// //     console.error("Error in getAllMentors:", error);
// //     throw new ApiError(
// //       error.statusCode || 500,
// //       error.message || "Failed to retrieve mentors"
// //     );
// //   }
// // });

// export { getAllMentor };
