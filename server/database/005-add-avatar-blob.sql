-- ============================================
-- Add Avatar BLOB column to Users table
-- Run this in SSMS
-- ============================================

USE TabreedPortal;
GO

-- Add BLOB column for avatar image
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'AvatarBlob')
BEGIN
    ALTER TABLE Users ADD AvatarBlob VARBINARY(MAX) NULL;
    ALTER TABLE Users ADD AvatarMimeType NVARCHAR(50) NULL;
    PRINT 'Added AvatarBlob and AvatarMimeType columns to Users table';
END
GO
