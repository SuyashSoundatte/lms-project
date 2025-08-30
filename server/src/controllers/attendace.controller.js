import asyncHandler from "../config/asyncHandler.js";
import ApiError from "../config/ApiError.js";
import ApiResponse from "../config/ApiResponse.js";
import { executeQuery } from "../config/executeQuery.js";
import poolPromise from "../config/dbConnect.js";
import sql from "mssql";

// const markAttendance = asyncHandler(async (req, res) => {
//   const { class: studentClass, division, date, students } = req.body;

//   if (!studentClass?.trim() || !division?.trim() || !date || !Array.isArray(students) || students.length === 0) {
//     throw new ApiError(400, 'Please provide valid class, division, date and students data');
//   }

//   const attendanceDate = new Date(date);
//   if (isNaN(attendanceDate.getTime())) {
//     throw new ApiError(400, 'Invalid date format');
//   }

//   const existingAttendance = await executeQuery(
//     'SELECT at_id FROM Attendance WHERE date = @date AND std = @std AND div = @div',
//     [
//       { name: 'date', value: attendanceDate },
//       { name: 'std', value: studentClass },
//       { name: 'div', value: division },
//     ]
//   );

//   if (existingAttendance.recordset.length > 0) {
//     throw new ApiError(400, 'Attendance for this class, division and date already exists');
//   }

//   const attendanceResult = await executeQuery(
//     'INSERT INTO Attendance (date, std, div) OUTPUT INSERTED.at_id VALUES (@date, @std, @div)',
//     [
//       { name: 'date', value: attendanceDate },
//       { name: 'std', value: studentClass },
//       { name: 'div', value: division },
//     ]
//   );

//   const attendanceId = attendanceResult.recordset[0].at_id;

//   for (const student of students) {
//     await executeQuery(
//       'INSERT INTO StudentAttendance_Marked (stu_id, isPresent, at_id) VALUES (@stu_id, @isPresent, @at_id)',
//       [
//         { name: 'stu_id', value: student.id },
//         { name: 'isPresent', value: student.present ? 1 : 0 },
//         { name: 'at_id', value: attendanceId },
//       ]
//     );
//   }

//   const markedAttendance = await executeQuery(`
//     SELECT s.roll_no, s.stu_id, sam.isPresent
//     FROM StudentAttendance_Marked sam
//     JOIN Students s ON s.stu_id = sam.stu_id
//     WHERE sam.at_id = @at_id
//     ORDER BY s.roll_no`,
//     [{ name: 'at_id', value: attendanceId }]
//   );

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       {
//         attendanceId,
//         date: attendanceDate,
//         class: studentClass,
//         division,
//         markedStudents: markedAttendance.recordset
//       },
//       'Attendance marked successfully'
//     )
//   );
// });

const getAttendanceByDateRange = asyncHandler(async (req, res) => {
  const { class: studentClass, division, startDate, endDate } = req.query;

  if (!studentClass || !division || !startDate || !endDate) {
    throw new ApiError(400, "Missing required parameters");
  }

  const attendance = await executeQuery(
    `
    SELECT a.date, a.std, a.div, 
           s.stu_id, s.roll_no, sam.isPresent
    FROM Attendance a
    JOIN StudentAttendance_Marked sam ON a.at_id = sam.at_id
    JOIN Students s ON sam.stu_id = s.stu_id
    WHERE a.std = @std 
    AND a.div = @div 
    AND a.date BETWEEN @startDate AND @endDate
    ORDER BY a.date, s.roll_no`,
    [
      { name: "std", value: studentClass },
      { name: "div", value: division },
      { name: "startDate", value: new Date(startDate) },
      { name: "endDate", value: new Date(endDate) },
    ]
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        attendance.recordset,
        "Attendance records retrieved successfully"
      )
    );
});

const getStudentAttendanceStats = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { startDate, endDate } = req.query;

  const stats = await executeQuery(
    `
    SELECT 
      s.stu_id,
      s.roll_no,
      COUNT(sam.stu_attend_id) as total_days,
      SUM(CASE WHEN sam.isPresent = 1 THEN 1 ELSE 0 END) as present_days,
      CAST(SUM(CASE WHEN sam.isPresent = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(sam.stu_attend_id) AS DECIMAL(5,2)) as attendance_percentage
    FROM Students s
    LEFT JOIN StudentAttendance_Marked sam ON s.stu_id = sam.stu_id
    LEFT JOIN Attendance a ON sam.at_id = a.at_id
    WHERE s.stu_id = @studentId
    AND (@startDate IS NULL OR a.date >= @startDate)
    AND (@endDate IS NULL OR a.date <= @endDate)
    GROUP BY s.stu_id, s.roll_no`,
    [
      { name: "studentId", value: studentId },
      { name: "startDate", value: startDate ? new Date(startDate) : null },
      { name: "endDate", value: endDate ? new Date(endDate) : null },
    ]
  );

  if (stats.recordset.length === 0) {
    throw new ApiError(404, "Student not found or no attendance records exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        stats.recordset[0],
        "Attendance statistics retrieved successfully"
      )
    );
});

const updateAttendance = asyncHandler(async (req, res) => {
  const { attendanceId } = req.params;
  const { students } = req.body;

  if (!Array.isArray(students)) {
    throw new ApiError(400, "Invalid students data");
  }

  for (const student of students) {
    await executeQuery(
      `
      UPDATE StudentAttendance_Marked 
      SET isPresent = @isPresent 
      WHERE at_id = @at_id AND stu_id = @stu_id`,
      [
        { name: "isPresent", value: student.present ? 1 : 0 },
        { name: "at_id", value: attendanceId },
        { name: "stu_id", value: student.id },
      ]
    );
  }

  const updatedAttendance = await executeQuery(
    `
    SELECT s.roll_no, s.stu_id, sam.isPresent
    FROM StudentAttendance_Marked sam
    JOIN Students s ON s.stu_id = sam.stu_id
    WHERE sam.at_id = @at_id
    ORDER BY s.roll_no`,
    [{ name: "at_id", value: attendanceId }]
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedAttendance.recordset,
        "Attendance updated successfully"
      )
    );
});

const getAttendanceByParentPhone = asyncHandler(async (req, res) => {
  const { ParentPhone } = req.params;
  const { startDate, endDate } = req.query;

  const stats = await executeQuery(
    `
    SELECT 
      s.stu_id,
      s.roll_no,
      COUNT(sam.stu_attend_id) as total_days,
      SUM(CASE WHEN sam.isPresent = 1 THEN 1 ELSE 0 END) as present_days,
      CAST(SUM(CASE WHEN sam.isPresent = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(sam.stu_attend_id) AS DECIMAL(5,2)) as attendance_percentage
    FROM Students s
    LEFT JOIN StudentAttendance_Marked sam ON s.stu_id = sam.stu_id
    LEFT JOIN Attendance a ON sam.at_id = a.at_id
    WHERE s.stu_id = @studentId
    AND (@startDate IS NULL OR a.date >= @startDate)
    AND (@endDate IS NULL OR a.date <= @endDate)
    GROUP BY s.stu_id, s.roll_no`,
    [
      { name: "ParentPhone", value: ParentPhone },
      { name: "startDate", value: startDate ? new Date(startDate) : null },
      { name: "endDate", value: endDate ? new Date(endDate) : null },
    ]
  );

  if (stats.recordset.length === 0) {
    throw new ApiError(404, "Student not found or no attendance records exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        stats.recordset[0],
        "Attendance statistics retrieved successfully"
      )
    );
});

const createClass = asyncHandler(async (req, res) => {
  const { std, div, capacity } = req.body;

  if (!std || !div || !capacity) {
    throw new ApiError(400, "std, div, and capacity are required");
  }

  const result = await executeQuery(
    "EXEC sp_CreateClass @std = @std, @div = @div, @capacity = @capacity",
    [
      { name: "std", value: std },
      { name: "div", value: div },
      { name: "capacity", value: capacity },
    ]
  );

  const created = result.recordset[0];

  if (created.class_id === -1) {
    throw new ApiError(400, "Class with the same std and div already exists");
  }

  res
    .status(201)
    .send(new ApiResponse(201, created, "Class created successfully"));
});

const markAttendance = asyncHandler(async (req, res) => {
  const { std, div, attendance_date, students } = req.body;

  if (
    !std ||
    !div ||
    !attendance_date ||
    !Array.isArray(students) ||
    students.length === 0
  ) {
    throw new ApiError(
      400,
      "std (standard), div (division), attendance_date, and students array are required"
    );
  }

  const pool = await poolPromise;
  const request = pool.request();

  // Table-Valued Parameter setup
  const tvp = new sql.Table();
  tvp.columns.add("student_id", sql.Int);
  tvp.columns.add("status", sql.VarChar(20));

  students.forEach((student) => {
    tvp.rows.add(student.student_id, student.status);
  });

  request.input("Action", sql.VarChar(100), "MarkAttendanceMultiple");
  request.input("std", std);
  request.input("div", sql.VarChar(10), div);
  request.input("attendance_date", sql.Date, attendance_date);
  request.input("Students", tvp);

  const result = await request.execute("sp_attendance");

  const inserted = result.recordsets[0] || [];
  const duplicates = result.recordsets[1] || [];

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { inserted, duplicates },
        "Attendance processed successfully"
      )
    );
});

const getAttendanceByPhone = asyncHandler(async (req, res) => {
  const { phone } = req.params;
  const { start_date, end_date } = req.query;

  if (!phone) {
    throw new ApiError(400, "Phone number is required");
  }

  const pool = await poolPromise;
  const request = pool.request();

  request.input("Action", sql.VarChar(100), "GetAttendanceByPhone");
  request.input("phone", sql.VarChar(15), phone);

  // Add date filters conditionally
  if (start_date) {
    request.input("start_date", sql.Date, new Date(start_date));
  } else {
    request.input("start_date", sql.Date, null);
  }

  if (end_date) {
    request.input("end_date", sql.Date, new Date(end_date));
  } else {
    request.input("end_date", sql.Date, null);
  }

  const result = await request.execute("sp_attendance");

  if (result.recordset.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No attendance records found"));
  }

  const attendanceByStudent = {};

  result.recordset.forEach((record) => {
    if (!attendanceByStudent[record.student_id]) {
      attendanceByStudent[record.student_id] = {
        student_id: record.student_id,
        fname: record.fname,
        mname: record.mname,
        lname: record.lname,
        roll_no: record.roll_no,
        std: record.std,
        div: record.div,
        attendance_percentage: record.attendance_percentage,
        attendance: [],
      };
    }

    attendanceByStudent[record.student_id].attendance.push({
      date: record.attendance_date,
      status: record.status,
    });
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        Object.values(attendanceByStudent),
        "Attendance records fetched successfully"
      )
    );
});

const getAllAttendanceReport = asyncHandler(async (req, res) => {
  const { start_date, end_date, std, div } = req.query;

  if (!start_date || !end_date || !std || !div) {
    throw new ApiError(
      400,
      "start_date, end_date, std, and div are required for the report"
    );
  }

  const pool = await poolPromise;
  const request = pool.request();

  const result = await request
    .input("Action", sql.VarChar(100), "GetAttendanceReport")
    .input("start_date", sql.Date, new Date(start_date))
    .input("end_date", sql.Date, new Date(end_date))
    .input("std", sql.VarChar(10), std)
    .input("div", sql.VarChar(10), div)
    .execute("sp_attendance");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.recordset,
        `Attendance report for std: ${std}, div: ${div} generated successfully`
      )
    );
});

export {
  markAttendance,
  getAttendanceByDateRange,
  getStudentAttendanceStats,
  updateAttendance,
  createClass,
  getAttendanceByPhone,
  getAllAttendanceReport,
};
