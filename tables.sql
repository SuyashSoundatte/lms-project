CREATE TABLE [dbo].[m_class] (
  [class_id] int NOT NULL,
  [std] varchar(10) NULL,
  [div] varchar(10) NULL,
  [capacity] int NULL
);
CREATE TABLE [dbo].[m_doc_types] (
  [doc_type_id] int NOT NULL,
  [doc_name] varchar(100) NULL,
  [type] varchar(50) NULL
);
CREATE TABLE [dbo].[m_students] (
  [id] int NOT NULL,
  [student_id] int NULL,
  [fname] varchar(50) NULL,
  [mname] varchar(50) NULL,
  [lname] varchar(50) NULL,
  [address] varchar(255) NULL,
  [gender] varchar(10) NULL,
  [dob] date NULL,
  [email] varchar(100) NULL,
  [password] varchar(255) NULL,
  [father_name] varchar(100) NULL,
  [father_occu] varchar(100) NULL,
  [mother_name] varchar(100) NULL,
  [mother_occu] varchar(100) NULL,
  [father_phone] varchar(15) NULL,
  [mother_phone] varchar(15) NULL,
  [student_cast] varchar(50) NULL,
  [cast_group] varchar(50) NULL,
  [course] varchar(100) NULL,
  [addmission_date] varchar(100) NULL,
  [profile_photo] varchar(255) NULL,
  [div] varchar(10) NULL,
  [std] varchar(10) NULL,
  [roll_no] varchar(20) NULL
);
CREATE TABLE [dbo].[m_users] (
  [user_id] int NOT NULL,
  [fname] varchar(50) NULL,
  [mname] varchar(50) NULL,
  [lname] varchar(50) NULL,
  [address] varchar(255) NULL,
  [gender] varchar(10) NULL,
  [dob] varchar(100) NULL,
  [email] varchar(100) NULL,
  [phone] varchar(15) NULL,
  [password] varchar(255) NULL,
  [role] varchar(50) NULL
);
CREATE TABLE [dbo].[tdl_Attendance] (
  [at_id] int NOT NULL,
  [class_id] int NULL,
  [attendance_date] date NULL,
  [student_id] int NULL,
  [status] varchar(20) NULL
);
CREATE TABLE [dbo].[tdl_ClassTeacher_Allocate] (
  [ct_allocation_id] int NOT NULL,
  [user_id] int NULL,
  [std] varchar(10) NULL,
  [div] varchar(10) NULL
);
CREATE TABLE [dbo].[tdl_Documents] (
  [doc_id] int NOT NULL,
  [user_id] int NULL,
  [doc_type_id] int NULL,
  [file_url] varchar(255) NULL
);
CREATE TABLE [dbo].[tdl_Feedbacks] (
  [feedback_id] int NOT NULL,
  [student_id] int NOT NULL,
  [title] varchar(100) NOT NULL,
  [Purpose] varchar(100) NOT NULL,
  [message] varchar(1000) NOT NULL,
  [status] bit NULL,
  [created_at] datetime NULL,
  [To_staff_name] varchar(100) NULL
);
CREATE TABLE [dbo].[tdl_Mentor_Allocate] (
  [m_allocation_id] int NOT NULL,
  [user_id] int NULL,
  [std] varchar(10) NULL,
  [div] varchar(10) NULL
);
CREATE TABLE [dbo].[tdl_Teacher_Allocate] (
  [t_allocation_id] int NOT NULL,
  [user_id] int NULL,
  [std] varchar(10) NULL,
  [div] varchar(10) NULL,
  [subjects] varchar(255) NULL
);
