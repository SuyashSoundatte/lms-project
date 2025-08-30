import asyncHandler from '../config/asyncHandler.js';
import ApiError from '../config/ApiError.js';
import ApiResponse from '../config/ApiResponse.js';
import poolPromise from '../config/dbConnect.js';
import sql from 'mssql'


// Get Allocated Teachers
const getAllocatedTeachers = asyncHandler(async (req, res) => {
    const { std, div } = req.query;

    try {
        const pool = await poolPromise;
        const request = pool.request();
        
        request.input('Action', 'allocated_teachers');
        if (std) request.input('std', std);
        if (div) request.input('div', div);

        const result = await request.execute('sp_allocation');

        res.status(200).json(
            new ApiResponse(200, result.recordset, "Allocated teachers fetched successfully")
        );
    } catch (err) {
        console.error("Error in getAllocatedTeachers:", err);
        throw new ApiError(500, "Failed to fetch allocated teachers");
    }
});

// Get Allocated Class Teachers
const getAllocatedClassTeachers = asyncHandler(async (req, res) => {
    const { std, div } = req.query;

    try {
        const pool = await poolPromise;
        const request = pool.request();
        
        request.input('Action', 'allocated_classteachers');
        if (std) request.input('std', std);
        if (div) request.input('div', div);

        const result = await request.execute('sp_allocation');

        res.status(200).json(
            new ApiResponse(200, result.recordset, "Allocated class teachers fetched successfully")
        );
    } catch (err) {
        console.error("Error in getAllocatedClassTeachers:", err);
        throw new ApiError(500, "Failed to fetch allocated class teachers");
    }
});

// Get Allocated Mentors
const getAllocatedMentors = asyncHandler(async (req, res) => {
    const { std, div } = req.query;

    try {
        const pool = await poolPromise;
        const request = pool.request();
        
        request.input('Action', 'allocated_mentors');
        if (std) request.input('std', std);
        if (div) request.input('div', div);

        const result = await request.execute('sp_allocation');

        res.status(200).json(
            new ApiResponse(200, result.recordset, "Allocated mentors fetched successfully")
        );
    } catch (err) {
        console.error("Error in getAllocatedMentors:", err);
        throw new ApiError(500, "Failed to fetch allocated mentors");
    }
});

// Get Unallocated Teachers
const getUnallocatedTeachers = asyncHandler(async (req, res) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();
        
        request.input('Action', 'unallocated_teachers');

        const result = await request.execute('sp_allocation');

        res.status(200).json(
            new ApiResponse(200, result.recordset, "Unallocated teachers fetched successfully")
        );
    } catch (err) {
        console.error("Error in getUnallocatedTeachers:", err);
        throw new ApiError(500, "Failed to fetch unallocated teachers");
    }
});

// Get Unallocated Class Teachers
const getUnallocatedClassTeachers = asyncHandler(async (req, res) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();
        
        request.input('Action', 'unallocated_classteachers');

        const result = await request.execute('sp_allocation');

        res.status(200).json(
            new ApiResponse(200, result.recordset, "Unallocated class teachers fetched successfully")
        );
    } catch (err) {
        console.error("Error in getUnallocatedClassTeachers:", err);
        throw new ApiError(500, "Failed to fetch unallocated class teachers");
    }
});

// Get Unallocated Mentors
const getUnallocatedMentors = asyncHandler(async (req, res) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();
        
        request.input('Action', 'unallocated_mentors');

        const result = await request.execute('sp_allocation');

        res.status(200).json(
            new ApiResponse(200, result.recordset, "Unallocated mentors fetched successfully")
        );
    } catch (err) {
        console.error("Error in getUnallocatedMentors:", err);
        throw new ApiError(500, "Failed to fetch unallocated mentors");
    }
});

// Remove Allocation
const removeAllocation = asyncHandler(async (req, res) => {
    const { allocation_id } = req.params;

    if (!allocation_id) {
        throw new ApiError(400, "Allocation ID is required");
    }

    try {
        const pool = await poolPromise;
        const request = pool.request();
        
        request.input('Action', 'remove_allocation');
        request.input('allocation_id', allocation_id);

        const result = await request.execute('sp_allocation');

        res.status(200).json(
            new ApiResponse(200, result.recordset[0], "Allocation removed successfully")
        );
    } catch (err) {
        console.error("Error in removeAllocation:", err);
        throw new ApiError(500, "Failed to remove allocation");
    }
});

const getAllocatedStudents = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("Action", sql.NVarChar(100), "allocated_students")
      .execute("dkte_user1.sp_allocation");

    res.status(200).json({
      success: true,
      data: result.recordset,
      message: "Allocated students fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getUnallocatedStudents = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("Action", sql.NVarChar(100), "unallocated_students")
      .execute("dkte_user1.sp_allocation");

    res.status(200).json({
      success: true,
      data: result.recordset,
      message: "Unallocated students fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


export {
    getAllocatedTeachers,
    getAllocatedClassTeachers,
    getAllocatedMentors,
    getUnallocatedTeachers,
    getUnallocatedClassTeachers,
    getUnallocatedMentors,
    removeAllocation,
    getAllocatedStudents,
    getUnallocatedStudents
};