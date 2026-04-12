-- ============================================
-- Saudi Tabreed Portal - Change User Password
-- Run this in SQL Server Management Studio
-- ============================================

USE TabreedPortal;
GO

-- ============================================
-- OPTION 1: Change password for a specific user
-- Replace 'YourNewPassword' with your desired password
-- Replace the email with the target user
-- ============================================

-- Change Admin password
UPDATE Users
SET PasswordHash = CONVERT(NVARCHAR(255), HASHBYTES('SHA2_256', 'YourNewPassword'), 2),
    UpdatedAt = GETUTCDATE()
WHERE Email = 'admin@sauditabreed.com';

-- ============================================
-- OPTION 2: Change ALL user passwords at once
-- ============================================

-- UPDATE Users SET PasswordHash = CONVERT(NVARCHAR(255), HASHBYTES('SHA2_256', 'NewPassword123'), 2), UpdatedAt = GETUTCDATE();

-- ============================================
-- OPTION 3: Add a new user
-- ============================================

-- INSERT INTO Users (EmployeeId, Email, PasswordHash, FullNameEn, FullNameAr, TitleEn, TitleAr, Department, Role)
-- VALUES (
--     'EMP004',
--     'your.email@sauditabreed.com',
--     CONVERT(NVARCHAR(255), HASHBYTES('SHA2_256', 'YourPassword'), 2),
--     'Your Full Name',
--     N'اسمك الكامل',
--     'Your Title',
--     N'مسمى وظيفي',
--     'IT',
--     'admin'  -- Options: 'admin', 'editor', 'user'
-- );

-- ============================================
-- View all users
-- ============================================
SELECT Id, EmployeeId, Email, FullNameEn, Role, Department, IsActive
FROM Users;

GO
