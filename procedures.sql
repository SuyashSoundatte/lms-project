create   PROCEDURE sp_login
    @Action VARCHAR(20),
    @Email VARCHAR(100) = NULL,
    @Phone VARCHAR(15) = NULL,
    @Password VARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @Action = 'user_login'
    BEGIN
        IF @Email IS NULL
        BEGIN
            SELECT -1 AS status, 'Email is required' AS message;
            RETURN;
        END
        
        SELECT 
            1 AS status,
            'User found' AS message,
            user_id AS id,
            fname,
            mname,
            lname,
            address,
            gender,
            dob,
            email,
            phone,
            password,
            role
        FROM 
            m_users 
        WHERE 
            email = @Email;
    END

    ELSE IF @Action = 'parent_login'
    BEGIN
        IF @Phone IS NULL
        BEGIN
            SELECT -1 AS status, 'Phone number is required' AS message;
            RETURN;
        END
        
        SELECT 
            1 AS status,
            'Student found' AS message,
            student_id AS id,
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
            addmission_date,
            profile_photo,
            div,
            std,
            roll_no,
            'Student' AS role
        FROM m_students
        WHERE father_phone = @Phone OR mother_phone = @Phone;
    END
    ELSE
    BEGIN
        SELECT -1 AS status, 'Invalid action specified' AS message;
    END
END
CREATE   PROCEDURE sp_creation
    @Action VARCHAR(20),
    -- Common parameters
	@StudentId INT = NULL,
    @Fname VARCHAR(50),
    @Mname VARCHAR(50) = NULL,
    @Lname VARCHAR(50),
    @Address VARCHAR(255) = NULL,
    @Gender VARCHAR(10) = NULL,
    @Dob VARCHAR(100),
    @Email VARCHAR(100),
    @Password VARCHAR(255),
    @Phone VARCHAR(15) = NULL,
    -- User-specific parameters
    @Role VARCHAR(50) = NULL,
    -- Student-specific parameters
    @FatherName VARCHAR(100) = NULL,
    @FatherOccu VARCHAR(100) = NULL,
    @MotherName VARCHAR(100) = NULL,
    @MotherOccu VARCHAR(100) = NULL,
    @FatherPhone VARCHAR(15) = NULL,
    @MotherPhone VARCHAR(15) = NULL,
    @StudentCast VARCHAR(50) = NULL,
    @CastGroup VARCHAR(50) = NULL,
    @Course VARCHAR(100) = NULL,
    @AdmissionDate VARCHAR(100) = NULL,
    @ProfilePhoto VARCHAR(255) = NULL,
    @Div VARCHAR(10) = NULL,
    @Std VARCHAR(10) = NULL,
    @RollNo VARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Create User action
        IF @Action = 'create_user'
        BEGIN
            -- Validate required fields
            IF @Role IS NULL
            BEGIN
                SELECT -1 AS id, 'Role is required' AS message;
                RETURN;
            END
            
            -- Check if email exists
            IF EXISTS (SELECT 1 FROM m_users WHERE email = @Email)
            BEGIN
                SELECT -1 AS id, 'Email already in use' AS message;
                RETURN;
            END
            
            -- Insert user
            INSERT INTO m_users (
                fname, mname, lname, address, gender, dob, 
                email, password, phone, role
            )
            OUTPUT INSERTED.user_id AS id, 'User created successfully' AS message
            VALUES (
                @Fname, @Mname, @Lname, @Address, @Gender, @Dob, 
                @Email, @Password, @Phone, @Role
            );
        END
        -- Create Student action
        ELSE IF @Action = 'create_student'
        BEGIN
            -- Validate required fields
            IF @Std IS NULL OR @RollNo IS NULL
            BEGIN
                SELECT -1 AS id, 'Standard and roll number are required' AS message;
                RETURN;
            END
            
            -- Check if email exists
            IF EXISTS (SELECT 1 FROM m_students WHERE email = @Email)
            BEGIN
                SELECT -1 AS id, 'Email already in use' AS message;
                RETURN;
            END
            
            -- Check if roll number exists
            IF EXISTS (SELECT 1 FROM m_students WHERE roll_no = @RollNo)
            BEGIN
                SELECT -1 AS id, 'Roll number already in use' AS message;
                RETURN;
            END
            
            -- Insert student
            INSERT INTO m_students (
                student_id, fname, mname, lname, address, gender, dob, email, password,
                father_name, father_occu, mother_name, mother_occu,
                father_phone, mother_phone, student_cast, cast_group,
                course, addmission_date, profile_photo, div, std, roll_no
            )
            OUTPUT INSERTED.student_id AS id, 'Student created successfully' AS message
            VALUES (
                @StudentId, @Fname, @Mname, @Lname, @Address, @Gender, @Dob, @Email, @Password,
                @FatherName, @FatherOccu, @MotherName, @MotherOccu,
                @FatherPhone, @MotherPhone, @StudentCast, @CastGroup,
                @Course, @AdmissionDate, @ProfilePhoto, @Div, @Std, @RollNo
            );
        END
        ELSE
        BEGIN
            SELECT -1 AS id, 'Invalid action specified' AS message;
            RETURN;
        END
    END TRY
    BEGIN CATCH
        SELECT -1 AS id, ERROR_MESSAGE() AS message;
    END CATCH
END
CREATE PROCEDURE sp_getUserByEmail
    @Email VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Return user data if exists
    SELECT 
        user_id,
        fname,
        mname,
        lname,
        address,
        gender,
        dob,
        email,
        phone,
        password,
        role
    FROM 
        m_users 
    WHERE 
        email = @Email;
END
CREATE PROCEDURE sp_CreateUser
    @Fname VARCHAR(50),
    @Mname VARCHAR(50) = NULL,
    @Lname VARCHAR(50),
    @Address VARCHAR(255) = NULL,
    @Gender VARCHAR(10) = NULL,
    @Dob VARCHAR(100),
    @Email VARCHAR(100),
    @Password VARCHAR(255),
    @Phone VARCHAR(15),
    @Role VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if email exists
    IF EXISTS (SELECT 1 FROM m_users WHERE email = @Email)
    BEGIN
        SELECT -1 AS user_id;
        RETURN;
    END
    
    -- Insert user
    INSERT INTO m_users (fname, mname, lname, address, gender, dob, email, password, phone, role)
    OUTPUT INSERTED.user_id
    VALUES (@Fname, @Mname, @Lname, @Address, @Gender, @Dob, @Email, @Password, @Phone, @Role);
END
CREATE PROCEDURE sp_CreateStudent
    @Fname VARCHAR(50),
    @Mname VARCHAR(50),
    @Lname VARCHAR(50),
    @Address VARCHAR(255),
    @Gender VARCHAR(10),
    @Dob DATE,
    @Email VARCHAR(100),
    @Password VARCHAR(255),
    @FatherName VARCHAR(100) = NULL,
    @FatherOccu VARCHAR(100) = NULL,
    @MotherName VARCHAR(100) = NULL,
    @MotherOccu VARCHAR(100) = NULL,
    @FatherPhone VARCHAR(15) = NULL,
    @MotherPhone VARCHAR(15) = NULL,
    @StudentCast VARCHAR(50) = NULL,
    @CastGroup VARCHAR(50) = NULL,
    @Course VARCHAR(100) = NULL,
    @AdmissionDate VARCHAR(100) = NULL,
    @ProfilePhoto VARCHAR(255) = NULL,
    @Div VARCHAR(10) = NULL,
    @Std VARCHAR(10),
    @RollNo VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Check if email exists
        IF EXISTS (SELECT 1 FROM m_students WHERE email = @Email)
        BEGIN
            SELECT -1 AS student_id, 'Email already in use' AS message;
            RETURN;
        END
        
        -- Check if roll number exists
        IF EXISTS (SELECT 1 FROM m_students WHERE roll_no = @RollNo)
        BEGIN
            SELECT -1 AS student_id, 'Roll number already in use' AS message;
            RETURN;
        END
        
        -- Insert student
        INSERT INTO m_students (
            fname, mname, lname, address, gender, dob, email, password,
            father_name, father_occu, mother_name, mother_occu,
            father_phone, mother_phone, student_cast, cast_group,
            course, addmission_date, profile_photo, div, std, roll_no
        )
        OUTPUT INSERTED.student_id
        VALUES (
            @Fname, @Mname, @Lname, @Address, @Gender, @Dob, @Email, @Password,
            @FatherName, @FatherOccu, @MotherName, @MotherOccu,
            @FatherPhone, @MotherPhone, @StudentCast, @CastGroup,
            @Course, @AdmissionDate, @ProfilePhoto, @Div, @Std, @RollNo
        );
        
    END TRY
    BEGIN CATCH
        SELECT -1 AS student_id, ERROR_MESSAGE() AS message;
    END CATCH
END
CREATE PROCEDURE sp_ParentLogin
    @phone VARCHAR(15)
AS
BEGIN
    SELECT 
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
        addmission_date,
        profile_photo,
        div,
        std,
        roll_no 
    FROM m_students
    WHERE father_phone = @phone OR mother_phone = @phone;
END
CREATE PROCEDURE sp_GetAllUsers
AS
BEGIN
    SELECT *
    FROM m_users;
END
CREATE PROCEDURE sp_GetUserById
@user_id INT
AS
BEGIN
SELECT *
FROM m_users
WHERE user_id = @user_id;
END
CREATE PROCEDURE sp_GetAllStudents
AS
BEGIN
    SELECT *
    FROM m_students;
END
CREATE PROCEDURE sp_GetStudentsByStd
    @std VARCHAR(10)
AS
BEGIN
    SELECT *
    FROM m_students
    WHERE std = @std;
END
CREATE PROCEDURE sp_GetStudentById
    @student_id INT
AS
BEGIN
    SELECT 
    student_id,
    fname,
    mname,
    lname,
    address,
    gender,
    dob,
    email,
    father_name,
    father_occu,
    mother_name,
    mother_occu,
    father_phone,
    mother_phone,
    student_cast,
    cast_group,
    course,
    addmission_date,
    profile_photo,
    div,
    std,
    roll_no
    FROM m_students
    WHERE student_id = @student_id;
END
CREATE PROCEDURE sp_GetStudentsByDiv
    @div VARCHAR(10)
AS
BEGIN
    SELECT 
    student_id,
    fname,
    mname,
    lname,
    address,
    gender,
    dob,
    email,
    father_name,
    father_occu,
    mother_name,
    mother_occu,
    father_phone,
    mother_phone,
    student_cast,
    cast_group,
    course,
    addmission_date,
    profile_photo,
    div,
    std,
    roll_no
    FROM m_students
    WHERE div = @div;
END
CREATE PROCEDURE sp_CreateClass
    @std VARCHAR(10),
    @div VARCHAR(10),
    @capacity INT
AS
BEGIN
    -- Prevent duplicates
    IF EXISTS (
        SELECT 1 FROM m_class WHERE std = @std AND div = @div
    )
    BEGIN
        SELECT -1 AS class_id; -- Signal duplicate
        RETURN;
    END

    -- Insert new class
    INSERT INTO m_class (std, div, capacity)
    VALUES (@std, @div, @capacity);

    -- Return the full inserted row
    SELECT * FROM m_class WHERE class_id = SCOPE_IDENTITY();
END
CREATE PROCEDURE sp_MarkAttendance
    @class_id INT,
    @attendance_date VARCHAR(100),
    @student_id INT,
    @status VARCHAR(20)
AS
BEGIN
    -- Prevent duplicate attendance entry for same student on same date in same class
    IF EXISTS (
        SELECT 1 FROM tdl_Attendance
        WHERE class_id = @class_id AND attendance_date = @attendance_date AND student_id = @student_id
    )
    BEGIN
        SELECT -1 AS at_id; -- Indicates duplicate entry
        RETURN;
    END

    -- Insert attendance
    INSERT INTO tdl_Attendance (class_id, attendance_date, student_id, status)
    VALUES (@class_id, @attendance_date, @student_id, @status);

    -- Return inserted record
    SELECT * FROM tdl_Attendance WHERE at_id = SCOPE_IDENTITY();
END
CREATE   PROCEDURE sp_AssignClassTeacherByStdDiv
    @user_id INT,
    @std VARCHAR(10),
    @div VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if a class teacher is already assigned
    IF EXISTS (
        SELECT 1 FROM tdl_ClassTeacher_Allocate
        WHERE std = @std AND div = @div
    )
    BEGIN
        SELECT -1 AS status, 'A class teacher is already assigned to this class and division' AS message;
        RETURN;
    END

    -- Check if user is a ClassTeacher
    IF NOT EXISTS (
        SELECT 1 FROM m_users
        WHERE user_id = @user_id AND role = 'ClassTeacher'
    )
    BEGIN
        SELECT -2 AS status, 'User is not a class teacher' AS message;
        RETURN;
    END

    -- Insert into the allocation table
    INSERT INTO tdl_ClassTeacher_Allocate (user_id, std, div)
    VALUES (@user_id, @std, @div);

    SELECT 1 AS status, 'Class teacher assigned successfully' AS message;
END
CREATE PROCEDURE sp_AssignStudentsToDivision
  @studentIds VARCHAR(MAX),
  @div VARCHAR(10)
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE m_students
  SET div = @div
  WHERE student_id IN (
    SELECT CAST(value AS INT) FROM STRING_SPLIT(@studentIds, ',')
  );
END
CREATE   PROCEDURE sp_GetStudentsByClassOrStdDiv
    @class_id INT = NULL,
    @std VARCHAR(10) = NULL,
    @div VARCHAR(10) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validate parameters
    IF @class_id IS NULL AND (@std IS NULL OR @div IS NULL)
    BEGIN
        RAISERROR('Either class_id or both std and div must be provided', 16, 1);
        RETURN;
    END
    
    -- Get students by class_id if provided
    IF @class_id IS NOT NULL
    BEGIN
        SELECT 
            s.student_id,
            s.fname, 
            s.mname, 
            s.lname,
            s.email,
            s.father_phone,
            s.mother_phone,
            s.father_name,
            s.mother_name,
            s.roll_no,
            s.profile_photo,
            c.std,
            c.div
        FROM m_students s
        JOIN m_class c ON s.std = c.std AND s.div = c.div
        WHERE c.class_id = @class_id
        ORDER BY s.roll_no;
    END
    ELSE -- Get by std and div
    BEGIN
        SELECT 
            s.student_id,
            s.fname, 
            s.mname, 
            s.lname,
            s.email,
            s.father_phone,
            s.mother_phone,
            s.father_name,
            s.mother_name,
            s.roll_no,
            s.profile_photo,
            s.std,
            s.div
        FROM m_students s
        WHERE s.std = @std AND s.div = @div
        ORDER BY s.roll_no;
    END
END
CREATE PROCEDURE sp_AllocateTeacherSubject
    @teacherId INT,
    @subject VARCHAR(255),
    @std VARCHAR(10),
    @div VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check if allocation already exists
        IF EXISTS (
            SELECT 1 FROM tdl_Teacher_Allocate 
            WHERE user_id = @teacherId AND std = @std AND div = @div
        )
        BEGIN
            -- Update existing allocation
            UPDATE tdl_Teacher_Allocate
            SET subjects = @subject
            WHERE user_id = @teacherId AND std = @std AND div = @div;
        END
        ELSE
        BEGIN
            -- Insert new allocation
            INSERT INTO tdl_Teacher_Allocate (user_id, subjects, std, div)
            VALUES (@teacherId, @subject, @std, @div);
        END
        
        COMMIT TRANSACTION;
        
        SELECT 
            t_allocation_id AS allocationId,
            user_id AS teacherId,
            subjects,
            std,
            div
        FROM tdl_Teacher_Allocate
        WHERE user_id = @teacherId AND std = @std AND div = @div;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        THROW;
    END CATCH
END
CREATE PROCEDURE sp_GetAllTeachersWithAllocations
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        u.user_id AS teacherId,
        u.email,
        u.fname,
        u.mname,
        u.lname,
        u.role,
        u.phone,
        u.gender,
        ta.subjects,
        ta.std,
        ta.div,
        ta.t_allocation_id AS allocationId
    FROM 
        m_users u
    LEFT JOIN 
        tdl_Teacher_Allocate ta ON u.user_id = ta.user_id
    WHERE 
        u.role = 'Teacher'
    ORDER BY 
        u.lname, u.fname;
END
CREATE PROCEDURE sp_GetTeacherById
    @teacherId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        u.user_id,
        u.email,
        u.fname,
        u.mname,
        u.lname,
        u.role,
        u.phone,
        u.gender,
        u.address,
        u.dob,
        ta.subjects,
        ta.std,
        ta.div
    FROM 
        m_users u
    LEFT JOIN 
        tdl_Teacher_Allocate ta ON u.user_id = ta.user_id
    WHERE 
        u.role = 'Teacher' AND 
        u.user_id = @teacherId;
END
CREATE PROCEDURE sp_GetTeachersByStd
    @std VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        u.user_id,
        u.fname,
        u.mname,
        u.lname,
        u.email,
        u.phone,
        ta.subjects,
        ta.std,
        ta.div
    FROM 
        m_users u
    JOIN 
        tdl_Teacher_Allocate ta ON u.user_id = ta.user_id
    WHERE 
        u.role = 'Teacher' AND 
        ta.std = @std
    ORDER BY 
        u.lname, u.fname;
END
CREATE PROCEDURE sp_GetTeachersByAllocation
    @std VARCHAR(10),
    @div VARCHAR(10),
    @subject VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        u.user_id,
        u.fname,
        u.mname,
        u.lname,
        ta.subjects,
        ta.std,
        ta.div,
        ta.t_allocation_id AS allocationId
    FROM 
        m_users u
    JOIN 
        tdl_Teacher_Allocate ta ON u.user_id = ta.user_id
    WHERE 
        ta.std = @std AND
        ta.div = @div AND
        ta.subjects LIKE '%' + @subject + '%'
    ORDER BY 
        u.lname, u.fname;
END
CREATE PROCEDURE sp_AssignMentorByStdDiv
    @userId INT,
    @std VARCHAR(10),
    @div VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Verify user is a mentor
        IF NOT EXISTS (SELECT 1 FROM m_users WHERE user_id = @userId AND role = 'Mentor')
        BEGIN
            RAISERROR('The user is not a mentor', 16, 1);
            RETURN;
        END
        
        -- Insert new mentor assignment
        INSERT INTO tdl_Mentor_Allocate (user_id, std, div)
        VALUES (@userId, @std, @div);
        
        -- Return the created assignment
        SELECT 
            m_allocation_id AS allocationId,
            user_id AS userId,
            std,
            div
        FROM tdl_Mentor_Allocate
        WHERE m_allocation_id = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        -- Re-throw the error
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
CREATE PROCEDURE sp_GetAllMentors
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        u.user_id,
        u.email,
        u.fname,
        u.mname,
        u.lname,
        u.role,
        u.phone,
        u.gender,
        ma.std,
        ma.div,
        ma.m_allocation_id AS mentor_allocation_id
    FROM 
        m_users u
    LEFT JOIN 
        tdl_Mentor_Allocate ma ON u.user_id = ma.user_id
    WHERE 
        u.role = 'Mentor'
    ORDER BY 
        u.lname, u.fname;
END
CREATE PROCEDURE sp_GetAllocatedStudents
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        s.student_id,
        s.fname,
        s.mname,
        s.lname,
        s.gender,
        s.roll_no,
        s.std,
        s.div,
        s.profile_photo
    FROM 
        m_students s
    WHERE 
        s.div IS NOT NULL
    ORDER BY 
        s.std, s.div, s.roll_no;
END
CREATE PROCEDURE sp_GetAttendanceByPhone
    @phone VARCHAR(15)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Get student IDs associated with this phone number (either father or mother)
    DECLARE @StudentIds TABLE (student_id INT);
    
    INSERT INTO @StudentIds
    SELECT student_id FROM m_students 
    WHERE father_phone = @phone OR mother_phone = @phone;
    
    -- Return attendance records for these students
    SELECT 
        s.student_id,
        s.fname,
        s.mname,
        s.lname,
        s.roll_no,
        s.std,
        s.div,
        a.attendance_date,
        a.status,
        c.std AS class_std,
        c.div AS class_div
    FROM 
        tdl_Attendance a
    JOIN 
        m_students s ON a.student_id = s.student_id
    JOIN
        m_class c ON a.class_id = c.class_id
    WHERE 
        s.student_id IN (SELECT student_id FROM @StudentIds)
    ORDER BY 
        a.attendance_date DESC;
END
CREATE PROCEDURE sp_GetUserDataByRole
    @user_id INT,
    @role VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @role = 'Teacher'
    BEGIN
        SELECT 
            t_allocation_id AS allocation_id,
            std,
            div,
            subjects
        FROM tdl_Teacher_Allocate
        WHERE user_id = @user_id;
    END
    ELSE IF @role = 'ClassTeacher'
    BEGIN
        SELECT 
            ct_allocation_id AS allocation_id,
            std,
            div
        FROM tdl_ClassTeacher_Allocate
        WHERE user_id = @user_id;
    END
    ELSE IF @role = 'Mentor'
    BEGIN
        SELECT 
            m_allocation_id AS allocation_id,
            std,
            div
        FROM tdl_Mentor_Allocate
        WHERE user_id = @user_id;
    END
    ELSE
    BEGIN
        -- Return empty result for unknown roles
        SELECT NULL AS allocation_id, NULL AS std, NULL AS div, NULL AS subjects WHERE 1=0;
    END
END
CREATE PROCEDURE sp_MarkAttendanceMultiple
    @class_id INT,
    @attendance_date VARCHAR(100),
    @Students dbo.StudentAttendanceType READONLY
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Inserted TABLE (
        at_id INT,
        class_id INT,
        attendance_date VARCHAR(100),
        student_id INT,
        status VARCHAR(20)
    );

    INSERT INTO tdl_Attendance (class_id, attendance_date, student_id, status)
    OUTPUT inserted.at_id, inserted.class_id, inserted.attendance_date, inserted.student_id, inserted.status
    INTO @Inserted
    SELECT
        @class_id,
        @attendance_date,
        s.student_id,
        s.status
    FROM @Students s
    WHERE NOT EXISTS (
        SELECT 1
        FROM tdl_Attendance a
        WHERE
            a.class_id = @class_id
            AND a.attendance_date = @attendance_date
            AND a.student_id = s.student_id
    );

    SELECT * FROM @Inserted;

    SELECT student_id
    FROM @Students
    WHERE student_id NOT IN (SELECT student_id FROM @Inserted);
END
create   PROCEDURE [sp_feedback]
    @Action VARCHAR(20),               -- 'CREATE', 'GET', 'UPDATE', 'GET_BY_STUDENT'
    @FeedbackId INT = NULL,            -- For UPDATE and single GET
    @StudentId INT = NULL,             -- For CREATE and GET_BY_STUDENT
    @Title VARCHAR(100) = NULL,        -- For CREATE
    @Purpose VARCHAR(100) = NULL,      -- For CREATE
    @Message VARCHAR(1000) = NULL,     -- For CREATE and UPDATE
    @Status BIT = NULL,                -- For UPDATE (0=Not Resolved, 1=Resolved)
    @ToStaffName VARCHAR(100) = NULL,  -- For CREATE
    @StartDate DATETIME = NULL,        -- For date range filtering
    @EndDate DATETIME = NULL,          -- For date range filtering
    @Std VARCHAR(10) = NULL,           -- For standard filtering
    @Div VARCHAR(10) = NULL            -- For division filtering
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- CREATE ACTION: Student submits new feedback
        IF @Action = 'CREATE'
        BEGIN
            -- Validate required parameters
            IF @StudentId IS NULL OR @Title IS NULL OR @Purpose IS NULL OR @Message IS NULL
            BEGIN
                RETURN -1; -- Missing required parameters
            END
            
            -- Validate student exists
            IF NOT EXISTS (SELECT 1 FROM m_students WHERE student_id = @StudentId)
            BEGIN
                RETURN -2; -- Student not found
            END
            
            -- Insert new feedback
            INSERT INTO tdl_Feedbacks (
                student_id, 
                title, 
                Purpose, 
                message, 
                To_staff_name
            )
            VALUES (
                @StudentId, 
                @Title, 
                @Purpose, 
                @Message, 
                @ToStaffName
            );
            
            -- Return the new feedback ID
            SELECT SCOPE_IDENTITY() AS feedback_id;
            RETURN 0; -- Success
        END
        
        -- GET ACTION: Get all feedbacks with optional filters
        ELSE IF @Action = 'GET'
        BEGIN
            SELECT 
                f.feedback_id,
                f.title,
                f.Purpose,
                f.message,
                CASE f.status WHEN 1 THEN 'Resolved' ELSE 'Not Resolved' END AS status,
                f.created_at,
                f.To_staff_name,
                s.student_id,
                s.fname + ' ' + COALESCE(s.mname + ' ', '') + s.lname AS student_name,
                s.std,
                s.div,
                s.roll_no
            FROM 
                tdl_Feedbacks f
                INNER JOIN m_students s ON f.student_id = s.student_id
            WHERE 
                (@FeedbackId IS NULL OR f.feedback_id = @FeedbackId)
                AND (@StartDate IS NULL OR f.created_at >= @StartDate)
                AND (@EndDate IS NULL OR f.created_at <= @EndDate)
                AND (@Std IS NULL OR s.std = @Std)
                AND (@Div IS NULL OR s.div = @Div)
            ORDER BY 
                f.created_at DESC;
                
            RETURN 0; -- Success
        END
        
        -- UPDATE ACTION: Update feedback status (resolve/unresolve)
        ELSE IF @Action = 'UPDATE'
        BEGIN
            -- Validate required parameters
            IF @FeedbackId IS NULL OR @Status IS NULL
            BEGIN
                RETURN -1; -- Missing required parameters
            END
            
            -- Validate feedback exists
            IF NOT EXISTS (SELECT 1 FROM tdl_Feedbacks WHERE feedback_id = @FeedbackId)
            BEGIN
                RETURN -3; -- Feedback not found
            END
            
            -- Update feedback
            UPDATE tdl_Feedbacks
            SET 
                status = @Status,
                message = COALESCE(@Message, message)
            WHERE 
                feedback_id = @FeedbackId;
                
            RETURN 0; -- Success
        END
        
        -- GET_BY_STUDENT ACTION: Get all feedbacks for a specific student
        ELSE IF @Action = 'GET_BY_STUDENT'
        BEGIN
            -- Validate required parameters
            IF @StudentId IS NULL
            BEGIN
                RETURN -1; -- Missing required parameters
            END
            
            -- Validate student exists
            IF NOT EXISTS (SELECT 1 FROM m_students WHERE student_id = @StudentId)
            BEGIN
                RETURN -2; -- Student not found
            END
            
            SELECT 
                f.feedback_id,
                f.title,
                f.Purpose,
                f.message,
                CASE f.status WHEN 1 THEN 'Resolved' ELSE 'Not Resolved' END AS status,
                f.created_at,
                f.To_staff_name
            FROM 
                tdl_Feedbacks f
            WHERE 
                f.student_id = @StudentId
            ORDER BY 
                f.created_at DESC;
                
            RETURN 0; -- Success
        END
        
        -- Invalid action
        ELSE
        BEGIN
            RETURN -99; -- Invalid action
        END
    END TRY
    BEGIN CATCH
        RETURN -98; -- General error
    END CATCH
END
create     PROCEDURE [sp_allocation]
    @Action NVARCHAR(100),
    @user_id INT = NULL,
    @std VARCHAR(10) = NULL,
    @div VARCHAR(10) = NULL,
    @subjects VARCHAR(255) = NULL,
    @allocation_id INT = NULL,
	@Students dbo.StudentAttendanceType READONLY 
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Allocated Teachers
        IF (@Action = 'allocated_teachers')
        BEGIN
            SELECT 
                ta.t_allocation_id,
                ta.user_id,
                u.fname + ' ' + COALESCE(u.mname + ' ', '') + u.lname AS teacher_name,
                ta.std,
                ta.div,
                ta.subjects,
				u.email,
				u.phone
            FROM 
                tdl_Teacher_Allocate ta
            JOIN 
                m_users u ON ta.user_id = u.user_id
            WHERE 
                (@std IS NULL OR ta.std = @std)
                AND (@div IS NULL OR ta.div = @div);
        END

        -- Allocated Class Teachers
        ELSE IF (@Action = 'allocated_classteachers')
        BEGIN
            SELECT 
                cta.ct_allocation_id,
                cta.user_id,
                u.fname + ' ' + COALESCE(u.mname + ' ', '') + u.lname AS teacher_name,
                cta.std,
                cta.div,
				u.email,
				u.phone
            FROM 
                tdl_ClassTeacher_Allocate cta
            JOIN 
                m_users u ON cta.user_id = u.user_id
            WHERE 
                (@std IS NULL OR cta.std = @std)
                AND (@div IS NULL OR cta.div = @div);
        END

        -- Allocated Mentors
        ELSE IF (@Action = 'allocated_mentors')
        BEGIN
            SELECT 
                ma.m_allocation_id,
                ma.user_id,
                u.fname + ' ' + COALESCE(u.mname + ' ', '') + u.lname AS teacher_name,
                ma.std,
                ma.div,
				u.email,
				u.phone
            FROM 
                tdl_Mentor_Allocate ma
            JOIN 
                m_users u ON ma.user_id = u.user_id
            WHERE 
                (@std IS NULL OR ma.std = @std)
                AND (@div IS NULL OR ma.div = @div);
        END

        -- Unallocated Teachers (not assigned to any class)
        ELSE IF (@Action = 'unallocated_teachers')
        BEGIN
            SELECT 
                u.user_id,
                u.fname + ' ' + COALESCE(u.mname + ' ', '') + u.lname AS teacher_name,
                u.email,
                u.phone
            FROM 
                m_users u
            WHERE 
                u.role = 'Teacher'
                AND NOT EXISTS (
                    SELECT 1 FROM tdl_Teacher_Allocate ta 
                    WHERE ta.user_id = u.user_id
                );
        END

        -- Unallocated Class Teachers
        ELSE IF (@Action = 'unallocated_classteachers')
        BEGIN
            SELECT 
                u.user_id,
                u.fname + ' ' + COALESCE(u.mname + ' ', '') + u.lname AS teacher_name,
                u.email,
                u.phone
            FROM 
                m_users u
            WHERE 
                u.role = 'ClassTeacher'
                AND NOT EXISTS (
                    SELECT 1 FROM tdl_ClassTeacher_Allocate cta 
                    WHERE cta.user_id = u.user_id
                );
        END

        -- Unallocated Mentors
        ELSE IF (@Action = 'unallocated_mentors')
        BEGIN
            SELECT 
                u.user_id,
                u.fname + ' ' + COALESCE(u.mname + ' ', '') + u.lname AS teacher_name,
                u.email,
                u.phone
            FROM 
                m_users u
            WHERE 
                u.role = 'Mentor'
                AND NOT EXISTS (
                    SELECT 1 FROM tdl_Mentor_Allocate ma 
                    WHERE ma.user_id = u.user_id
                );
        END

		ELSE IF (@Action = 'allocate_division')
        BEGIN
            IF @div IS NULL
            BEGIN
                RAISERROR('Division is required', 16, 1);
                RETURN;
            END

            -- Always update div
UPDATE m_students
SET div = @div
WHERE student_id IN (SELECT student_id FROM @Students);

-- Conditionally update std
IF @std IS NOT NULL
BEGIN
    UPDATE m_students
    SET std = @std
    WHERE student_id IN (SELECT student_id FROM @Students);
END

            SELECT 'Division allocation updated successfully' AS message;
        END

			-- Allocated Students
ELSE IF (@Action = 'allocated_students')
BEGIN
    SELECT 
        s.student_id,
        s.fname + ' ' + COALESCE(s.mname + ' ', '') + s.lname AS student_name,
        s.std,
        s.div,
        s.father_phone
    FROM 
        m_students s
    WHERE 
        s.std IS NOT NULL AND s.div IS NOT NULL;
END

-- Unallocated Students
ELSE IF (@Action = 'unallocated_students')
BEGIN
    SELECT 
        s.student_id,
        s.fname + ' ' + COALESCE(s.mname + ' ', '') + s.lname AS student_name,
        s.std,
        s.div,
        s.father_phone
    FROM 
        m_students s
    WHERE 
        s.std IS NULL OR s.div IS NULL;
END
		
		

        -- Remove Allocation
        ELSE IF (@Action = 'remove_allocation')
        BEGIN
            DECLARE @table_name NVARCHAR(50);
            
            -- Determine which table to delete from based on allocation_id ranges
            IF EXISTS (SELECT 1 FROM tdl_Teacher_Allocate WHERE t_allocation_id = @allocation_id)
            BEGIN
                DELETE FROM tdl_Teacher_Allocate WHERE t_allocation_id = @allocation_id;
                SELECT 'Teacher allocation removed' AS message;
            END
            ELSE IF EXISTS (SELECT 1 FROM tdl_ClassTeacher_Allocate WHERE ct_allocation_id = @allocation_id)
            BEGIN
                DELETE FROM tdl_ClassTeacher_Allocate WHERE ct_allocation_id = @allocation_id;
                SELECT 'Class teacher allocation removed' AS message;
            END
            ELSE IF EXISTS (SELECT 1 FROM tdl_Mentor_Allocate WHERE m_allocation_id = @allocation_id)
            BEGIN
                DELETE FROM tdl_Mentor_Allocate WHERE m_allocation_id = @allocation_id;
                SELECT 'Mentor allocation removed' AS message;
            END
            ELSE
            BEGIN
                SELECT 'Allocation not found' AS message;
            END
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        SELECT 
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage,
            ERROR_PROCEDURE() AS ErrorProcedure,
            ERROR_LINE() AS ErrorLine;
    END CATCH
END
CREATE PROCEDURE [sp_assignStdDiv]
    @Action NVARCHAR(50),
    @user_id INT = NULL,
    @userId INT = NULL, -- Alias for user_id for compatibility
    @std VARCHAR(10) = NULL,
    @div VARCHAR(10) = NULL,
    @subjects VARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        IF @userId IS NOT NULL AND @user_id IS NULL
            SET @user_id = @userId;
        
        IF NOT EXISTS (SELECT 1 FROM m_users WHERE user_id = @user_id)
        BEGIN
            SELECT -1 AS status, 'User does not exist' AS message;
            RETURN;
        END
        
        -- Assign Class Teacher
        IF @Action = 'assign_class_teacher'
        BEGIN
            IF @std IS NULL OR @div IS NULL
            BEGIN
                SELECT -1 AS status, 'Standard and division are required' AS message;
                RETURN;
            END

            IF EXISTS (
                SELECT 1 FROM tdl_ClassTeacher_Allocate
                WHERE std = @std AND div = @div
            )
            BEGIN
                SELECT -2 AS status, 'A class teacher is already assigned to this class and division' AS message;
                RETURN;
            END

            -- Check if user is a ClassTeacher
            IF NOT EXISTS (
                SELECT 1 FROM m_users
                WHERE user_id = @user_id AND role = 'ClassTeacher'
            )
            BEGIN
                SELECT -3 AS status, 'User is not a class teacher' AS message;
                RETURN;
            END

            INSERT INTO tdl_ClassTeacher_Allocate (user_id, std, div)
            VALUES (@user_id, @std, @div);

            SELECT 
                1 AS status, 
                'Class teacher assigned successfully' AS message,
                SCOPE_IDENTITY() AS allocationId, 
                @user_id AS userId, 
                @std AS std, 
                @div AS div;
        END
        
        -- Assign Mentor
        ELSE IF @Action = 'assign_mentor'
        BEGIN
            IF @std IS NULL OR @div IS NULL
            BEGIN
                SELECT -1 AS status, 'Standard and division are required' AS message;
                RETURN;
            END

            IF NOT EXISTS (SELECT 1 FROM m_users WHERE user_id = @user_id AND role = 'Mentor')
            BEGIN
                SELECT -2 AS status, 'The user is not a mentor' AS message;
                RETURN;
            END
            
            INSERT INTO tdl_Mentor_Allocate (user_id, std, div)
            VALUES (@user_id, @std, @div);
            
            SELECT 
                1 AS status,
                'Mentor assigned successfully' AS message,
                m_allocation_id AS allocationId,
                user_id AS userId,
                std,
                div
            FROM tdl_Mentor_Allocate
            WHERE m_allocation_id = SCOPE_IDENTITY();
        END
        
        -- Assign Teacher with Subjects
        ELSE IF @Action = 'assign_teacher_subject'
        BEGIN
            IF @subjects IS NULL OR @std IS NULL OR @div IS NULL
            BEGIN
                SELECT -1 AS status, 'Subjects, standard and division are required' AS message;
                RETURN;
            END

            IF EXISTS (
                SELECT 1 FROM tdl_Teacher_Allocate 
                WHERE user_id = @user_id AND std = @std AND div = @div
            )
            BEGIN
                UPDATE tdl_Teacher_Allocate
                SET subjects = @subjects
                WHERE user_id = @user_id AND std = @std AND div = @div;
                
                SELECT 1 AS status, 'Teacher subject allocation updated successfully' AS message;
            END
            ELSE
            BEGIN
                INSERT INTO tdl_Teacher_Allocate (user_id, subjects, std, div)
                VALUES (@user_id, @subjects, @std, @div);
                
                SELECT 1 AS status, 'Teacher subject allocated successfully' AS message;
            END
            
            SELECT 
                t_allocation_id AS allocationId,
                user_id AS userId,
                subjects,
                std,
                div
            FROM tdl_Teacher_Allocate
            WHERE user_id = @user_id AND std = @std AND div = @div;
        END
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        SELECT 
            -99 AS status,
            ERROR_MESSAGE() AS message,
            ERROR_NUMBER() AS errorNumber;
    END CATCH
END
CREATE   PROCEDURE dbo.sp_attendance
    @Action NVARCHAR(100),
    @phone VARCHAR(15) = NULL,
    @std VARCHAR(10) = NULL,
    @div VARCHAR(10) = NULL,
    @attendance_date DATE = NULL,
    @start_date DATE = NULL,
    @end_date DATE = NULL,
    @Students dbo.temp_attendance_insert READONLY
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        /* ============================================
           1. GET ATTENDANCE BY PHONE
        ============================================ */
        IF (@Action = 'GetAttendanceByPhone')
        BEGIN
            SELECT 
                s.student_id,
                s.fname,
                s.mname,
                s.lname,
                s.roll_no,
                s.std,
                s.div,
                a.attendance_date,
                a.status,

                -- Attendance Percentage
                (
                    SELECT 
                        CASE 
                            WHEN COUNT(*) = 0 THEN 0 
                            ELSE CAST(
                                SUM(CASE WHEN att.status = 'Present' THEN 1 ELSE 0 END) * 100.0 
                                / COUNT(*) 
                                AS DECIMAL(5,2)
                            )
                        END
                    FROM tdl_Attendance att
                    WHERE att.student_id = s.student_id
                ) AS attendance_percentage

            FROM tdl_Attendance a
            INNER JOIN m_students s 
                ON a.student_id = s.student_id

            WHERE 
                (@phone IS NOT NULL) AND
                (s.father_phone = @phone OR s.mother_phone = @phone)

                AND (@start_date IS NULL OR a.attendance_date >= @start_date)
                AND (@end_date IS NULL OR a.attendance_date <= @end_date)

            ORDER BY a.attendance_date DESC;
        END

        /* ============================================
           2. MARK MULTIPLE ATTENDANCE
        ============================================ */
        ELSE IF (@Action = 'MarkAttendanceMultiple')
        BEGIN
            BEGIN TRANSACTION;

            DECLARE @Inserted TABLE (
                at_id INT, 
                attendance_date DATE, 
                student_id INT, 
                status VARCHAR(20)
            );

            INSERT INTO tdl_Attendance (attendance_date, student_id, status)
            OUTPUT 
                inserted.at_id, 
                inserted.attendance_date, 
                inserted.student_id, 
                inserted.status
            INTO @Inserted
            SELECT
                @attendance_date,
                s.student_id,
                s.status
            FROM @Students s
            WHERE NOT EXISTS (
                SELECT 1
                FROM tdl_Attendance a
                WHERE 
                    a.student_id = s.student_id
                    AND a.attendance_date = @attendance_date
            );

            -- Inserted Records
            SELECT * FROM @Inserted;

            -- Duplicate Records (Skipped)
            SELECT student_id
            FROM @Students
            WHERE student_id NOT IN (SELECT student_id FROM @Inserted);

            COMMIT TRANSACTION;
        END

        /* ============================================
           3. ATTENDANCE REPORT (STD + DIV)
        ============================================ */
        ELSE IF (@Action = 'GetAttendanceReport')
        BEGIN
            IF (@start_date IS NULL OR @end_date IS NULL OR @std IS NULL OR @div IS NULL)
            BEGIN
                RAISERROR('start_date, end_date, std, and div are required', 16, 1);
                RETURN;
            END

            SELECT 
                s.student_id,
                CONCAT(s.fname, ' ', s.mname, ' ', s.lname) AS student_name,
                s.roll_no,
                s.std,
                s.div,

                COUNT(*) AS total_days,

                SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present_days,
                SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) AS absent_days,

                CAST(
                    SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) * 100.0
                    / NULLIF(COUNT(*), 0)
                    AS DECIMAL(5,2)
                ) AS attendance_percentage

            FROM tdl_Attendance a
            INNER JOIN m_students s 
                ON a.student_id = s.student_id

            WHERE 
                a.attendance_date BETWEEN @start_date AND @end_date
                AND s.std = @std
                AND s.div = @div

            GROUP BY 
                s.student_id, s.fname, s.mname, s.lname,
                s.roll_no, s.std, s.div

            ORDER BY 
                s.roll_no;
        END

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        SELECT 
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage,
            ERROR_PROCEDURE() AS ErrorProcedure,
            ERROR_LINE() AS ErrorLine;
    END CATCH
END
