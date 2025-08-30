import asyncHandler from '../config/asyncHandler.js';
import ApiError from '../config/ApiError.js';
import ApiResponse from '../config/ApiResponse.js';
import poolPromise from '../config/dbConnect.js';
import sql from 'mssql';

// Submit new feedback (Student)
const submitFeedback = asyncHandler(async (req, res) => {
    const { studentId, title, purpose, message, toStaffName } = req.body;

    if (!studentId || !title || !purpose || !message) {
        throw new ApiError(400, "Missing required fields");
    }

    const pool = await poolPromise;
    const request = pool.request();
    
    request.input('Action', sql.VarChar(20), 'CREATE');
    request.input('StudentId', sql.Int, studentId);
    request.input('Title', sql.VarChar(100), title);
    request.input('Purpose', sql.VarChar(100), purpose);
    request.input('Message', sql.VarChar(1000), message);
    request.input('ToStaffName', sql.VarChar(100), toStaffName || null);

    const result = await request.execute('sp_feedback');

    if (result.returnValue !== 0) {
        throw new ApiError(400, getErrorMessage(result.returnValue));
    }

    res.status(201).json(
        new ApiResponse(
            201,
            { feedbackId: result.recordset[0].feedback_id },
            "Feedback submitted successfully"
        )
    );
});

// Get all feedbacks (Admin/Superadmin)
const getFeedbacks = asyncHandler(async (req, res) => {
    const { feedbackId, startDate, endDate, std, div } = req.query;

    const pool = await poolPromise;
    const request = pool.request();
    
    request.input('Action', sql.VarChar(20), 'GET');
    if (feedbackId) request.input('FeedbackId', sql.Int, feedbackId);
    if (startDate) request.input('StartDate', sql.DateTime, new Date(startDate));
    if (endDate) request.input('EndDate', sql.DateTime, new Date(endDate));
    if (std) request.input('Std', sql.VarChar(10), std);
    if (div) request.input('Div', sql.VarChar(10), div);

    const result = await request.execute('sp_feedback');

    res.status(200).json(
        new ApiResponse(
            200,
            result.recordset,
            "Feedbacks retrieved successfully"
        )
    );
});

// Update feedback status (Admin/Superadmin)
const updateFeedback = asyncHandler(async (req, res) => {
    const { feedbackId } = req.params;
    const { status, message } = req.body;

    if (status === undefined) {
        throw new ApiError(400, "Status is required");
    }

    const pool = await poolPromise;
    const request = pool.request();
    
    request.input('Action', sql.VarChar(20), 'UPDATE');
    request.input('FeedbackId', sql.Int, feedbackId);
    request.input('Status', sql.Bit, status);
    if (message) request.input('Message', sql.VarChar(1000), message);

    const result = await request.execute('sp_feedback');

    if (result.returnValue !== 0) {
        throw new ApiError(400, getErrorMessage(result.returnValue));
    }

    res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Feedback updated successfully"
        )
    );
});

// Get feedbacks by student (Student view)
const getStudentFeedbacks = asyncHandler(async (req, res) => {
    const { studentId } = req.params;

    const pool = await poolPromise;
    const request = pool.request();
    
    request.input('Action', sql.VarChar(20), 'GET_BY_STUDENT');
    request.input('StudentId', sql.Int, studentId);

    const result = await request.execute('sp_feedback');

    if (result.returnValue !== 0) {
        throw new ApiError(400, getErrorMessage(result.returnValue));
    }

    res.status(200).json(
        new ApiResponse(
            200,
            result.recordset,
            "Student feedbacks retrieved successfully"
        )
    );
});

// Helper function to convert error codes to messages
function getErrorMessage(errorCode) {
    switch(errorCode) {
        case -1: return "Missing required parameters";
        case -2: return "Student not found";
        case -3: return "Feedback not found";
        case -99: return "Invalid action";
        default: return "An error occurred";
    }
}

export {
    submitFeedback,
    getFeedbacks,
    updateFeedback,
    getStudentFeedbacks
};