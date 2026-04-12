-- ============================================
-- Create New DB Owner User for TabreedPortal
-- Run this in SSMS connected to your SQL Server
-- ============================================

-- Step 1: Create a SQL Server login
USE master;
GO

CREATE LOGIN TabreedAdmin
WITH PASSWORD = 'Tabreed@DB2026',
     DEFAULT_DATABASE = TabreedPortal,
     CHECK_POLICY = OFF;
GO

-- Step 2: Switch to TabreedPortal database
USE TabreedPortal;
GO

-- Step 3: Create database user mapped to the login
CREATE USER TabreedAdmin FOR LOGIN TabreedAdmin;
GO

-- Step 4: Add to db_owner role (FULL CONTROL)
ALTER ROLE db_owner ADD MEMBER TabreedAdmin;
GO

-- Step 5: Grant all permissions explicitly
GRANT CONTROL ON DATABASE::TabreedPortal TO TabreedAdmin;
GO

-- Verify the user and role
SELECT
    dp.name AS UserName,
    dp.type_desc AS UserType,
    r.name AS RoleName
FROM sys.database_principals dp
JOIN sys.database_role_members drm ON dp.principal_id = drm.member_principal_id
JOIN sys.database_principals r ON drm.role_principal_id = r.principal_id
WHERE dp.name = 'TabreedAdmin';
GO

PRINT '✓ User TabreedAdmin created with db_owner role on TabreedPortal!';
GO

-- ============================================
-- Update server/.env with these values:
--
-- DB_SERVER=localhost
-- DB_DATABASE=TabreedPortal
-- DB_USER=TabreedAdmin
-- DB_PASSWORD=Tabreed@DB2026
-- DB_TRUST_CERT=true
-- ============================================
