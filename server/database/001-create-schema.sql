-- ============================================
-- Saudi Tabreed Internal Portal - Database Setup
-- SQL Server 2019+
-- Run this script in SQL Server Management Studio
-- ============================================

-- Step 1: Create Database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'TabreedPortal')
BEGIN
    CREATE DATABASE TabreedPortal;
END
GO

USE TabreedPortal;
GO

-- ============================================
-- TABLES
-- ============================================

-- Users & Authentication
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeId NVARCHAR(20) UNIQUE NOT NULL,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    FullNameEn NVARCHAR(200) NOT NULL,
    FullNameAr NVARCHAR(200),
    TitleEn NVARCHAR(100),
    TitleAr NVARCHAR(100),
    Department NVARCHAR(100),
    Phone NVARCHAR(50),
    Avatar NVARCHAR(500),
    Role NVARCHAR(20) DEFAULT 'user' CHECK (Role IN ('admin', 'editor', 'user')),
    IsActive BIT DEFAULT 1,
    LastLogin DATETIME2,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- News Articles
CREATE TABLE News (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TitleEn NVARCHAR(500) NOT NULL,
    TitleAr NVARCHAR(500),
    SummaryEn NVARCHAR(MAX),
    SummaryAr NVARCHAR(MAX),
    ContentEn NVARCHAR(MAX),
    ContentAr NVARCHAR(MAX),
    ImageUrl NVARCHAR(500),
    Category NVARCHAR(100),
    Author NVARCHAR(200),
    IsPublished BIT DEFAULT 1,
    IsFeatured BIT DEFAULT 0,
    ViewCount INT DEFAULT 0,
    LikeCount INT DEFAULT 0,
    PublishedAt DATETIME2 DEFAULT GETUTCDATE(),
    CreatedBy INT REFERENCES Users(Id),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- News Comments
CREATE TABLE NewsComments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    NewsId INT NOT NULL REFERENCES News(Id) ON DELETE CASCADE,
    UserId INT NOT NULL REFERENCES Users(Id),
    Comment NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Announcements
CREATE TABLE Announcements (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TitleEn NVARCHAR(500) NOT NULL,
    TitleAr NVARCHAR(500),
    DescriptionEn NVARCHAR(MAX),
    DescriptionAr NVARCHAR(MAX),
    Type NVARCHAR(20) NOT NULL CHECK (Type IN ('Important', 'Scheduled', 'Announcement')),
    Department NVARCHAR(100),
    IsActive BIT DEFAULT 1,
    ExpiresAt DATETIME2,
    CreatedBy INT REFERENCES Users(Id),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Applications
CREATE TABLE Applications (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    NameAr NVARCHAR(200),
    Description NVARCHAR(500),
    Category NVARCHAR(30) NOT NULL CHECK (Category IN ('Favorites', 'Core Systems', 'Tools')),
    Icon NVARCHAR(50),
    Color NVARCHAR(20),
    Url NVARCHAR(500),
    SortOrder INT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Employees (Directory)
CREATE TABLE Employees (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FullNameEn NVARCHAR(200) NOT NULL,
    FullNameAr NVARCHAR(200),
    TitleEn NVARCHAR(100),
    TitleAr NVARCHAR(100),
    Department NVARCHAR(100),
    Email NVARCHAR(255),
    Phone NVARCHAR(50),
    Avatar NVARCHAR(500),
    ManagerId INT REFERENCES Employees(Id),
    OfficeLocationId INT,
    IsActive BIT DEFAULT 1,
    JoinDate DATE,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Organization Chart (separate from employees for flexibility)
CREATE TABLE OrgChart (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeId INT REFERENCES Employees(Id),
    NameEn NVARCHAR(200) NOT NULL,
    NameAr NVARCHAR(200),
    TitleEn NVARCHAR(200),
    TitleAr NVARCHAR(200),
    Avatar NVARCHAR(500),
    ParentId INT REFERENCES OrgChart(Id),
    SortOrder INT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Meeting Rooms
CREATE TABLE MeetingRooms (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    NameAr NVARCHAR(100),
    ImageUrl NVARCHAR(500),
    Capacity INT DEFAULT 0,
    Floor NVARCHAR(50),
    Location NVARCHAR(200),
    HasVideoConf BIT DEFAULT 0,
    HasWhiteboard BIT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Room Bookings
CREATE TABLE RoomBookings (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    RoomId INT NOT NULL REFERENCES MeetingRooms(Id) ON DELETE CASCADE,
    UserId INT NOT NULL REFERENCES Users(Id),
    Title NVARCHAR(200),
    StartTime DATETIME2 NOT NULL,
    EndTime DATETIME2 NOT NULL,
    Status NVARCHAR(20) DEFAULT 'confirmed' CHECK (Status IN ('confirmed', 'cancelled', 'completed')),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Office Locations
CREATE TABLE OfficeLocations (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    NameEn NVARCHAR(200) NOT NULL,
    NameAr NVARCHAR(200),
    City NVARCHAR(100),
    AddressEn NVARCHAR(500),
    AddressAr NVARCHAR(500),
    Type NVARCHAR(20) DEFAULT 'branch' CHECK (Type IN ('hq', 'branch', 'plant')),
    Phone NVARCHAR(50),
    Latitude DECIMAL(10, 7),
    Longitude DECIMAL(10, 7),
    ImageUrl NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Safe/Emergency Locations
CREATE TABLE SafeLocations (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    NameEn NVARCHAR(200) NOT NULL,
    NameAr NVARCHAR(200),
    AddressEn NVARCHAR(500),
    AddressAr NVARCHAR(500),
    ImageUrl NVARCHAR(500),
    Latitude DECIMAL(10, 7),
    Longitude DECIMAL(10, 7),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Chairman's Message
CREATE TABLE ChairmanMessage (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    NameEn NVARCHAR(200) NOT NULL,
    NameAr NVARCHAR(200),
    TitleEn NVARCHAR(100),
    TitleAr NVARCHAR(100),
    MessageEn NVARCHAR(MAX),
    MessageAr NVARCHAR(MAX),
    ImageUrl NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Reminders / Banners
CREATE TABLE Reminders (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    MessageEn NVARCHAR(500) NOT NULL,
    MessageAr NVARCHAR(500),
    Type NVARCHAR(20) DEFAULT 'info' CHECK (Type IN ('info', 'warning', 'urgent')),
    IsActive BIT DEFAULT 1,
    ExpiresAt DATETIME2,
    CreatedBy INT REFERENCES Users(Id),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Weekly Motivation
CREATE TABLE WeeklyMotivation (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    QuoteEn NVARCHAR(500) NOT NULL,
    QuoteAr NVARCHAR(500),
    Author NVARCHAR(200),
    BackgroundImageUrl NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    WeekStartDate DATE,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Policies & Procedures
CREATE TABLE Policies (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TitleEn NVARCHAR(500) NOT NULL,
    TitleAr NVARCHAR(500),
    ContentEn NVARCHAR(MAX),
    ContentAr NVARCHAR(MAX),
    Category NVARCHAR(100),
    FileUrl NVARCHAR(500),
    IsPublished BIT DEFAULT 1,
    CreatedBy INT REFERENCES Users(Id),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Audit Log
CREATE TABLE AuditLog (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT REFERENCES Users(Id),
    Action NVARCHAR(50) NOT NULL,
    TableName NVARCHAR(100),
    RecordId INT,
    Details NVARCHAR(MAX),
    IpAddress NVARCHAR(50),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Add foreign key for OfficeLocationId in Employees
ALTER TABLE Employees ADD CONSTRAINT FK_Employee_Office
    FOREIGN KEY (OfficeLocationId) REFERENCES OfficeLocations(Id);

GO

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IX_News_Published ON News(IsPublished, PublishedAt DESC);
CREATE INDEX IX_News_Category ON News(Category);
CREATE INDEX IX_Announcements_Active ON Announcements(IsActive, CreatedAt DESC);
CREATE INDEX IX_Employees_Dept ON Employees(Department);
CREATE INDEX IX_RoomBookings_Time ON RoomBookings(RoomId, StartTime, EndTime);
CREATE INDEX IX_AuditLog_User ON AuditLog(UserId, CreatedAt DESC);

GO

PRINT 'Saudi Tabreed Portal database schema created successfully!';
GO
