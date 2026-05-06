SET NOCOUNT ON;

/*
  Seed script for the LMS demo database.
  Uses existing procedures where possible so the data shape stays aligned
  with the application.
*/

/* =========================
   Classes
========================= */
EXEC sp_CreateClass @std = '11', @div = 'A', @capacity = 60;
EXEC sp_CreateClass @std = '11', @div = 'B', @capacity = 60;
EXEC sp_CreateClass @std = '12', @div = 'A', @capacity = 60;
EXEC sp_CreateClass @std = '12', @div = 'B', @capacity = 60;

/* =========================
   Office Staff
========================= */
IF NOT EXISTS (SELECT 1 FROM m_users WHERE email = 'anita.office@dkte.local')
BEGIN
    EXEC sp_creation
        @Action = 'create_user',
        @Fname = 'Anita',
        @Mname = 'S',
        @Lname = 'Kulkarni',
        @Address = 'Kolhapur, Maharashtra',
        @Gender = 'Female',
        @Dob = '12-03-1988',
        @Email = 'anita.office@dkte.local',
        @Password = 'pass1234',
        @Phone = '9876501001',
        @Role = 'OfficeStaff';
END

IF NOT EXISTS (SELECT 1 FROM m_users WHERE email = 'sachin.office@dkte.local')
BEGIN
    EXEC sp_creation
        @Action = 'create_user',
        @Fname = 'Sachin',
        @Mname = 'R',
        @Lname = 'Patil',
        @Address = 'Sangli, Maharashtra',
        @Gender = 'Male',
        @Dob = '21-07-1985',
        @Email = 'sachin.office@dkte.local',
        @Password = 'pass1234',
        @Phone = '9876501002',
        @Role = 'OfficeStaff';
END

/* =========================
   Teachers
========================= */
IF NOT EXISTS (SELECT 1 FROM m_users WHERE email = 'meera.teacher@dkte.local')
BEGIN
    EXEC sp_creation
        @Action = 'create_user',
        @Fname = 'Meera',
        @Mname = 'A',
        @Lname = 'Joshi',
        @Address = 'Pune, Maharashtra',
        @Gender = 'Female',
        @Dob = '14-01-1987',
        @Email = 'meera.teacher@dkte.local',
        @Password = 'pass1234',
        @Phone = '9876502001',
        @Role = 'Teacher';
END

IF NOT EXISTS (SELECT 1 FROM m_users WHERE email = 'rohan.teacher@dkte.local')
BEGIN
    EXEC sp_creation
        @Action = 'create_user',
        @Fname = 'Rohan',
        @Mname = 'V',
        @Lname = 'Deshmukh',
        @Address = 'Satara, Maharashtra',
        @Gender = 'Male',
        @Dob = '09-09-1986',
        @Email = 'rohan.teacher@dkte.local',
        @Password = 'pass1234',
        @Phone = '9876502002',
        @Role = 'Teacher';
END

IF NOT EXISTS (SELECT 1 FROM m_users WHERE email = 'kavita.teacher@dkte.local')
BEGIN
    EXEC sp_creation
        @Action = 'create_user',
        @Fname = 'Kavita',
        @Mname = 'N',
        @Lname = 'Shinde',
        @Address = 'Karad, Maharashtra',
        @Gender = 'Female',
        @Dob = '18-11-1989',
        @Email = 'kavita.teacher@dkte.local',
        @Password = 'pass1234',
        @Phone = '9876502003',
        @Role = 'Teacher';
END

IF NOT EXISTS (SELECT 1 FROM m_users WHERE email = 'nilesh.teacher@dkte.local')
BEGIN
    EXEC sp_creation
        @Action = 'create_user',
        @Fname = 'Nilesh',
        @Mname = 'P',
        @Lname = 'Jadhav',
        @Address = 'Miraj, Maharashtra',
        @Gender = 'Male',
        @Dob = '27-04-1984',
        @Email = 'nilesh.teacher@dkte.local',
        @Password = 'pass1234',
        @Phone = '9876502004',
        @Role = 'Teacher';
END

/* =========================
   Mentors
========================= */
IF NOT EXISTS (SELECT 1 FROM m_users WHERE email = 'pooja.mentor@dkte.local')
BEGIN
    EXEC sp_creation
        @Action = 'create_user',
        @Fname = 'Pooja',
        @Mname = 'M',
        @Lname = 'Pawar',
        @Address = 'Kolhapur, Maharashtra',
        @Gender = 'Female',
        @Dob = '30-08-1990',
        @Email = 'pooja.mentor@dkte.local',
        @Password = 'pass1234',
        @Phone = '9876503001',
        @Role = 'Mentor';
END

IF NOT EXISTS (SELECT 1 FROM m_users WHERE email = 'vikram.mentor@dkte.local')
BEGIN
    EXEC sp_creation
        @Action = 'create_user',
        @Fname = 'Vikram',
        @Mname = 'T',
        @Lname = 'Salunkhe',
        @Address = 'Ichalkaranji, Maharashtra',
        @Gender = 'Male',
        @Dob = '05-02-1988',
        @Email = 'vikram.mentor@dkte.local',
        @Password = 'pass1234',
        @Phone = '9876503002',
        @Role = 'Mentor';
END

/* =========================
   Class Teachers
========================= */
IF NOT EXISTS (SELECT 1 FROM m_users WHERE email = 'sneha.class@dkte.local')
BEGIN
    EXEC sp_creation
        @Action = 'create_user',
        @Fname = 'Sneha',
        @Mname = 'K',
        @Lname = 'More',
        @Address = 'Kolhapur, Maharashtra',
        @Gender = 'Female',
        @Dob = '19-06-1987',
        @Email = 'sneha.class@dkte.local',
        @Password = 'pass1234',
        @Phone = '9876504001',
        @Role = 'ClassTeacher';
END

IF NOT EXISTS (SELECT 1 FROM m_users WHERE email = 'amol.class@dkte.local')
BEGIN
    EXEC sp_creation
        @Action = 'create_user',
        @Fname = 'Amol',
        @Mname = 'D',
        @Lname = 'Gaikwad',
        @Address = 'Sangli, Maharashtra',
        @Gender = 'Male',
        @Dob = '08-12-1985',
        @Email = 'amol.class@dkte.local',
        @Password = 'pass1234',
        @Phone = '9876504002',
        @Role = 'ClassTeacher';
END

/* =========================
   Students
========================= */
IF NOT EXISTS (SELECT 1 FROM m_students WHERE email = 'aarav.shah11a@dkte.local')
BEGIN
    EXEC sp_creation
        @Action = 'create_student',
        @StudentId = 11001,
        @Fname = 'Aarav',
        @Mname = 'R',
        @Lname = 'Shah',
        @Address = 'Kolhapur, Maharashtra',
        @Gender = 'Male',
        @Dob = '2008-01-11',
        @Email = 'aarav.shah11a@dkte.local',
        @Password = 'pass1234',
        @FatherName = 'Rajesh Shah',
        @FatherOccu = 'Business',
        @MotherName = 'Neha Shah',
        @MotherOccu = 'Teacher',
        @FatherPhone = '9811100001',
        @MotherPhone = '9822200001',
        @StudentCast = 'Open',
        @CastGroup = 'General',
        @Course = 'Science',
        @AdmissionDate = '2024-06-10',
        @ProfilePhoto = 'https://example.com/profiles/aarav-shah.jpg',
        @Div = 'A',
        @Std = '11',
        @RollNo = '11A01';
END

IF NOT EXISTS (SELECT 1 FROM m_students WHERE email = 'ananya.patil11a@dkte.local')
BEGIN
    EXEC sp_creation
        @Action = 'create_student',
        @StudentId = 11002,
        @Fname = 'Ananya',
        @Mname = 'S',
        @Lname = 'Patil',
        @Address = 'Sangli, Maharashtra',
        @Gender = 'Female',
        @Dob = '2008-03-24',
        @Email = 'ananya.patil11a@dkte.local',
        @Password = 'pass1234',
        @FatherName = 'Sunil Patil',
        @FatherOccu = 'Engineer',
        @MotherName = 'Archana Patil',
        @MotherOccu = 'Homemaker',
        @FatherPhone = '9811100002',
        @MotherPhone = '9822200002',
        @StudentCast = 'Maratha',
        @CastGroup = 'SEBC',
        @Course = 'Science',
        @AdmissionDate = '2024-06-10',
        @ProfilePhoto = 'https://example.com/profiles/ananya-patil.jpg',
        @Div = 'A',
        @Std = '11',
        @RollNo = '11A02';
END

IF NOT EXISTS (SELECT 1 FROM m_students WHERE email = 'aditya.kadam11b@dkte.local')
BEGIN
    EXEC sp_creation
        @Action = 'create_student',
        @StudentId = 11003,
        @Fname = 'Aditya',
        @Mname = 'P',
        @Lname = 'Kadam',
        @Address = 'Karad, Maharashtra',
        @Gender = 'Male',
        @Dob = '2008-05-16',
        @Email = 'aditya.kadam11b@dkte.local',
        @Password = 'pass1234',
        @FatherName = 'Prakash Kadam',
        @FatherOccu = 'Farmer',
        @MotherName = 'Madhuri Kadam',
        @MotherOccu = 'Homemaker',
        @FatherPhone = '9811100003',
        @MotherPhone = '9822200003',
        @StudentCast = 'Open',
        @CastGroup = 'General',
        @Course = 'Commerce',
        @AdmissionDate = '2024-06-11',
        @ProfilePhoto = 'https://example.com/profiles/aditya-kadam.jpg',
        @Div = 'B',
        @Std = '11',
        @RollNo = '11B01';
END

IF NOT EXISTS (SELECT 1 FROM m_students WHERE email = 'siya.jadhav11b@dkte.local')
BEGIN
    EXEC sp_creation
        @Action = 'create_student',
        @StudentId = 11004,
        @Fname = 'Siya',
        @Mname = 'A',
        @Lname = 'Jadhav',
        @Address = 'Satara, Maharashtra',
        @Gender = 'Female',
        @Dob = '2008-09-09',
        @Email = 'siya.jadhav11b@dkte.local',
        @Password = 'pass1234',
        @FatherName = 'Ajit Jadhav',
        @FatherOccu = 'Police Officer',
        @MotherName = 'Kiran Jadhav',
        @MotherOccu = 'Nurse',
        @FatherPhone = '9811100004',
        @MotherPhone = '9822200004',
        @StudentCast = 'Open',
        @CastGroup = 'General',
        @Course = 'Commerce',
        @AdmissionDate = '2024-06-11',
        @ProfilePhoto = 'https://example.com/profiles/siya-jadhav.jpg',
        @Div = 'B',
        @Std = '11',
        @RollNo = '11B02';
END

IF NOT EXISTS (SELECT 1 FROM m_students WHERE email = 'ishaan.pawar12a@dkte.local')
BEGIN
    EXEC sp_creation
        @Action = 'create_student',
        @StudentId = 12001,
        @Fname = 'Ishaan',
        @Mname = 'M',
        @Lname = 'Pawar',
        @Address = 'Kolhapur, Maharashtra',
        @Gender = 'Male',
        @Dob = '2007-02-18',
        @Email = 'ishaan.pawar12a@dkte.local',
        @Password = 'pass1234',
        @FatherName = 'Mahesh Pawar',
        @FatherOccu = 'Bank Clerk',
        @MotherName = 'Sujata Pawar',
        @MotherOccu = 'Teacher',
        @FatherPhone = '9811100005',
        @MotherPhone = '9822200005',
        @StudentCast = 'Open',
        @CastGroup = 'General',
        @Course = 'Science',
        @AdmissionDate = '2023-06-12',
        @ProfilePhoto = 'https://example.com/profiles/ishaan-pawar.jpg',
        @Div = 'A',
        @Std = '12',
        @RollNo = '12A01';
END

IF NOT EXISTS (SELECT 1 FROM m_students WHERE email = 'saanvi.kulkarni12a@dkte.local')
BEGIN
    EXEC sp_creation
        @Action = 'create_student',
        @StudentId = 12002,
        @Fname = 'Saanvi',
        @Mname = 'R',
        @Lname = 'Kulkarni',
        @Address = 'Pune, Maharashtra',
        @Gender = 'Female',
        @Dob = '2007-07-28',
        @Email = 'saanvi.kulkarni12a@dkte.local',
        @Password = 'pass1234',
        @FatherName = 'Ravindra Kulkarni',
        @FatherOccu = 'Professor',
        @MotherName = 'Madhavi Kulkarni',
        @MotherOccu = 'Doctor',
        @FatherPhone = '9811100006',
        @MotherPhone = '9822200006',
        @StudentCast = 'Brahmin',
        @CastGroup = 'General',
        @Course = 'Science',
        @AdmissionDate = '2023-06-12',
        @ProfilePhoto = 'https://example.com/profiles/saanvi-kulkarni.jpg',
        @Div = 'A',
        @Std = '12',
        @RollNo = '12A02';
END

IF NOT EXISTS (SELECT 1 FROM m_students WHERE email = 'vedant.more12b@dkte.local')
BEGIN
    EXEC sp_creation
        @Action = 'create_student',
        @StudentId = 12003,
        @Fname = 'Vedant',
        @Mname = 'S',
        @Lname = 'More',
        @Address = 'Ichalkaranji, Maharashtra',
        @Gender = 'Male',
        @Dob = '2007-04-14',
        @Email = 'vedant.more12b@dkte.local',
        @Password = 'pass1234',
        @FatherName = 'Suresh More',
        @FatherOccu = 'Textile Worker',
        @MotherName = 'Pratibha More',
        @MotherOccu = 'Homemaker',
        @FatherPhone = '9811100007',
        @MotherPhone = '9822200007',
        @StudentCast = 'Open',
        @CastGroup = 'General',
        @Course = 'Commerce',
        @AdmissionDate = '2023-06-13',
        @ProfilePhoto = 'https://example.com/profiles/vedant-more.jpg',
        @Div = 'B',
        @Std = '12',
        @RollNo = '12B01';
END

IF NOT EXISTS (SELECT 1 FROM m_students WHERE email = 'prisha.salunkhe12b@dkte.local')
BEGIN
    EXEC sp_creation
        @Action = 'create_student',
        @StudentId = 12004,
        @Fname = 'Prisha',
        @Mname = 'V',
        @Lname = 'Salunkhe',
        @Address = 'Miraj, Maharashtra',
        @Gender = 'Female',
        @Dob = '2007-10-05',
        @Email = 'prisha.salunkhe12b@dkte.local',
        @Password = 'pass1234',
        @FatherName = 'Vilas Salunkhe',
        @FatherOccu = 'Government Employee',
        @MotherName = 'Shubhangi Salunkhe',
        @MotherOccu = 'Teacher',
        @FatherPhone = '9811100008',
        @MotherPhone = '9822200008',
        @StudentCast = 'Open',
        @CastGroup = 'General',
        @Course = 'Commerce',
        @AdmissionDate = '2023-06-13',
        @ProfilePhoto = 'https://example.com/profiles/prisha-salunkhe.jpg',
        @Div = 'B',
        @Std = '12',
        @RollNo = '12B02';
END

/* =========================
   Sample Allocations
========================= */
DECLARE @MeeraTeacherId INT = (SELECT user_id FROM m_users WHERE email = 'meera.teacher@dkte.local');
DECLARE @RohanTeacherId INT = (SELECT user_id FROM m_users WHERE email = 'rohan.teacher@dkte.local');
DECLARE @KavitaTeacherId INT = (SELECT user_id FROM m_users WHERE email = 'kavita.teacher@dkte.local');
DECLARE @PoojaMentorId INT = (SELECT user_id FROM m_users WHERE email = 'pooja.mentor@dkte.local');
DECLARE @VikramMentorId INT = (SELECT user_id FROM m_users WHERE email = 'vikram.mentor@dkte.local');
DECLARE @SnehaClassTeacherId INT = (SELECT user_id FROM m_users WHERE email = 'sneha.class@dkte.local');
DECLARE @AmolClassTeacherId INT = (SELECT user_id FROM m_users WHERE email = 'amol.class@dkte.local');

IF @MeeraTeacherId IS NOT NULL
BEGIN
    EXEC sp_assignStdDiv
        @Action = 'assign_teacher_subject',
        @user_id = @MeeraTeacherId,
        @subjects = 'mathematics',
        @std = '11',
        @div = 'A';
END

IF @RohanTeacherId IS NOT NULL
BEGIN
    EXEC sp_assignStdDiv
        @Action = 'assign_teacher_subject',
        @user_id = @RohanTeacherId,
        @subjects = 'physics',
        @std = '12',
        @div = 'A';
END

IF @KavitaTeacherId IS NOT NULL
BEGIN
    EXEC sp_assignStdDiv
        @Action = 'assign_teacher_subject',
        @user_id = @KavitaTeacherId,
        @subjects = 'english',
        @std = '11',
        @div = 'B';
END

IF @PoojaMentorId IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM tdl_Mentor_Allocate WHERE user_id = @PoojaMentorId AND std = '11' AND div = 'A')
BEGIN
    EXEC sp_assignStdDiv
        @Action = 'assign_mentor',
        @user_id = @PoojaMentorId,
        @std = '11',
        @div = 'A';
END

IF @VikramMentorId IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM tdl_Mentor_Allocate WHERE user_id = @VikramMentorId AND std = '12' AND div = 'B')
BEGIN
    EXEC sp_assignStdDiv
        @Action = 'assign_mentor',
        @user_id = @VikramMentorId,
        @std = '12',
        @div = 'B';
END

IF @SnehaClassTeacherId IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM tdl_ClassTeacher_Allocate WHERE std = '11' AND div = 'A')
BEGIN
    EXEC sp_assignStdDiv
        @Action = 'assign_class_teacher',
        @user_id = @SnehaClassTeacherId,
        @std = '11',
        @div = 'A';
END

IF @AmolClassTeacherId IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM tdl_ClassTeacher_Allocate WHERE std = '12' AND div = 'B')
BEGIN
    EXEC sp_assignStdDiv
        @Action = 'assign_class_teacher',
        @user_id = @AmolClassTeacherId,
        @std = '12',
        @div = 'B';
END
