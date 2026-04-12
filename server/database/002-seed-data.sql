-- ============================================
-- Saudi Tabreed Portal - Seed Data
-- Real company content from sauditabreed.com
-- ============================================

USE TabreedPortal;
GO

-- ============================================
-- Admin User (password: Admin@Tabreed2024)
-- ============================================
INSERT INTO Users (EmployeeId, Email, PasswordHash, FullNameEn, FullNameAr, TitleEn, TitleAr, Department, Role)
VALUES
('EMP001', 'admin@sauditabreed.com', '$2b$10$xJ8K1z5hQ9rZ3vE7wT6yGOmN4pL2kI0jHgFdSaQwErTyUiOpAsDf', 'System Administrator', N'مدير النظام', 'IT Administrator', N'مدير تقنية المعلومات', 'IT', 'admin'),
('EMP002', 'ahmed.qahtani@sauditabreed.com', '$2b$10$xJ8K1z5hQ9rZ3vE7wT6yGOmN4pL2kI0jHgFdSaQwErTyUiOpAsDf', 'Ahmed Al-Qahtani', N'أحمد القحطاني', 'IT Specialist', N'أخصائي تقنية المعلومات', 'IT', 'editor'),
('EMP003', 'sara.malik@sauditabreed.com', '$2b$10$xJ8K1z5hQ9rZ3vE7wT6yGOmN4pL2kI0jHgFdSaQwErTyUiOpAsDf', 'Sara Al-Malik', N'سارة المالك', 'HR Manager', N'مديرة الموارد البشرية', 'HR', 'user');
GO

-- ============================================
-- Chairman's Message
-- ============================================
INSERT INTO ChairmanMessage (NameEn, NameAr, TitleEn, TitleAr, MessageEn, MessageAr, ImageUrl, IsActive)
VALUES (
    'Mohammed Abunayyan',
    N'محمد أبو نيان',
    'Chairman of the Board',
    N'رئيس مجلس الإدارة',
    'We are committed to working together as we move forward in our mission to enhance Saudi Arabia''s urban development through innovative, advanced, and highly efficient district cooling solutions. Our position as a market leader continues to strengthen as we support the country''s energy transition and sustainability targets aligned with Vision 2030.',
    N'نحن ملتزمون بالعمل معاً في مسيرتنا لتعزيز التنمية الحضرية في المملكة العربية السعودية من خلال حلول تبريد المناطق المبتكرة والمتقدمة وعالية الكفاءة. يستمر موقعنا كشركة رائدة في السوق في التعزز مع دعمنا لأهداف التحول في الطاقة والاستدامة في المملكة المتوافقة مع رؤية 2030.',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=400&fit=crop&crop=face',
    1
);
GO

-- ============================================
-- News Articles - Real Saudi Tabreed News
-- ============================================
INSERT INTO News (TitleEn, TitleAr, SummaryEn, SummaryAr, Category, Author, ImageUrl, IsPublished, IsFeatured, PublishedAt)
VALUES
(
    'PIF Completes Acquisition of 30% Stake in Saudi Tabreed',
    N'صندوق الاستثمارات العامة يستكمل الاستحواذ على 30% من أسهم تبريد السعودية',
    'The Public Investment Fund (PIF) has announced the completion of the acquisition of a 30% stake in Saudi Tabreed District Cooling Company, reinforcing Saudi Arabia''s commitment to sustainable urban infrastructure and energy efficiency in line with Vision 2030.',
    N'أعلن صندوق الاستثمارات العامة عن إتمام الاستحواذ على حصة 30% في شركة تبريد السعودية لخدمات تبريد المناطق، مما يعزز التزام المملكة العربية السعودية بالبنية التحتية الحضرية المستدامة وكفاءة الطاقة.',
    'Corporate',
    'Communications Department',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop',
    1, 1, DATEADD(DAY, -3, GETUTCDATE())
),
(
    'Saudi Tabreed Secures 10-Year Contract Extension with KAFD',
    N'تبريد السعودية تحصل على تمديد عقد لمدة 10 سنوات مع كافد',
    'Saudi Tabreed has consolidated its leadership position through a 10-year contract extension with King Abdullah Financial District (KAFD) for the operation and maintenance of two district cooling plants with a total capacity of 100,000 TR.',
    N'عززت تبريد السعودية موقعها الريادي من خلال تمديد عقد لمدة 10 سنوات مع حي الملك عبدالله المالي (كافد) لتشغيل وصيانة محطتي تبريد مناطق بسعة إجمالية 100,000 طن تبريد.',
    'Projects',
    'Business Development',
    'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=400&h=250&fit=crop',
    1, 0, DATEADD(DAY, -7, GETUTCDATE())
),
(
    'King Salman Park District Cooling Plant Awarded to Saudi Tabreed',
    N'ترسية مشروع محطة تبريد المناطق في حديقة الملك سلمان على تبريد السعودية',
    'Saudi Tabreed has been awarded the District Cooling Plant Project at King Salman Park with a capacity of 60,000 TR over a 25-year period. The park, the largest urban park in the world, sits at the heart of Riyadh.',
    N'تم ترسية مشروع محطة تبريد المناطق في حديقة الملك سلمان على تبريد السعودية بسعة 60,000 طن تبريد على مدى 25 عاماً. الحديقة هي أكبر حديقة حضرية في العالم وتقع في قلب الرياض.',
    'Projects',
    'Project Management',
    'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=250&fit=crop',
    1, 0, DATEADD(DAY, -14, GETUTCDATE())
),
(
    'Saudi Tabreed Partners with Araner for NEOM Oxagon District Cooling',
    N'تبريد السعودية تتشارك مع أرانر لتبريد مناطق نيوم أوكساغون',
    'Saudi Tabreed, in partnership with Araner, has signed a DBO contract with NEOM Oxagon to build a district cooling plant with a capacity of 25,000 TR to serve the first phase of the innovative Oxagon project.',
    N'وقعت تبريد السعودية بالشراكة مع أرانر عقد تصميم وبناء وتشغيل مع نيوم أوكساغون لبناء محطة تبريد مناطق بسعة 25,000 طن تبريد لخدمة المرحلة الأولى من مشروع أوكساغون المبتكر.',
    'Innovation',
    'Communications Department',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop',
    1, 0, DATEADD(DAY, -21, GETUTCDATE())
);
GO

-- ============================================
-- Announcements
-- ============================================
INSERT INTO Announcements (TitleEn, TitleAr, DescriptionEn, Type, Department, IsActive)
VALUES
('Quarterly HSE Report Submission Due', N'موعد تقديم تقرير السلامة الفصلي', 'All departments must submit Q1 2026 HSE reports by end of week.', 'Important', 'HSE', 1),
('Ramadan Working Hours Announcement', N'إعلان ساعات العمل في رمضان', 'Updated working hours will be effective starting next week.', 'Announcement', 'HR', 1),
('Plant Maintenance Schedule - Dhahran', N'جدول صيانة المحطة - الظهران', 'Scheduled maintenance for Dhahran cooling plant Unit 3 this weekend.', 'Scheduled', 'Operations', 1),
('New Employee Onboarding - April 2026', N'تعيين موظفين جدد - أبريل 2026', 'Welcome new team members joining the Operations and Engineering departments.', 'Announcement', 'HR', 1),
('Emergency Evacuation Drill - Khobar HQ', N'تدريب إخلاء طوارئ - مقر الخبر', 'Mandatory evacuation drill scheduled for all Khobar office staff.', 'Important', 'HSE', 1);
GO

-- ============================================
-- Applications
-- ============================================
INSERT INTO Applications (Name, NameAr, Description, Category, Icon, Color, Url, SortOrder)
VALUES
('Facilio', N'فاسيليو', 'Facility Management', 'Favorites', 'building', '#4A90D9', 'https://facilio.com', 1),
('CyberOne', N'سايبر ون', 'Cybersecurity', 'Favorites', 'shield', '#14B8A6', '#', 2),
('Sign IT', N'ساين آي تي', 'Digital Signatures', 'Favorites', 'pen-tool', '#22C55E', '#', 3),
('Outlook', N'أوتلوك', 'Email & Calendar', 'Favorites', 'mail', '#0078D4', 'https://outlook.office.com', 4),
('Microsoft Dynamics 365', N'مايكروسوفت ديناميكس', 'ERP System', 'Core Systems', 'box', '#1B3A6B', '#', 5),
('SAP', N'ساب', 'Enterprise Resource Planning', 'Core Systems', 'database', '#0FAAFF', '#', 6),
('ManageEngine', N'مانج إنجن', 'IT Service Management', 'Core Systems', 'settings', '#EF4444', '#', 7),
('SharePoint', N'شير بوينت', 'Document Management', 'Tools', 'layout', '#0078D4', 'https://sharepoint.com', 8),
('Power BI', N'باور بي آي', 'Business Analytics', 'Tools', 'bar-chart-3', '#F2C811', '#', 9),
('Microsoft Teams', N'مايكروسوفت تيمز', 'Communication', 'Tools', 'users', '#6264A7', 'https://teams.microsoft.com', 10);
GO

-- ============================================
-- Employees Directory
-- ============================================
INSERT INTO Employees (FullNameEn, FullNameAr, TitleEn, TitleAr, Department, Email, Avatar, IsActive)
VALUES
('Abdulhamid Aalmansour', N'عبدالحميد المنصور', 'Chief Executive Officer', N'الرئيس التنفيذي', 'Executive', 'ceo@sauditabreed.com', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face', 1),
('Khalid Al-Rashidi', N'خالد الرشيدي', 'VP Finance', N'نائب رئيس المالية', 'Finance', 'k.rashidi@sauditabreed.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 1),
('Sara Al-Malik', N'سارة المالك', 'VP Human Resources', N'نائب رئيس الموارد البشرية', 'HR', 'sara.malik@sauditabreed.com', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face', 1),
('Omar Al-Harbi', N'عمر الحربي', 'VP Projects & Engineering', N'نائب رئيس المشاريع والهندسة', 'Engineering', 'o.harbi@sauditabreed.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 1),
('Fatima Al-Dosari', N'فاطمة الدوسري', 'Operations Manager', N'مديرة العمليات', 'Operations', 'f.dosari@sauditabreed.com', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 1),
('Mohammed Al-Shehri', N'محمد الشهري', 'Senior Engineer', N'مهندس أول', 'Engineering', 'm.shehri@sauditabreed.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', 1),
('Noura Al-Zahrani', N'نورة الزهراني', 'HSE Manager', N'مديرة السلامة والصحة', 'HSE', 'n.zahrani@sauditabreed.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', 1),
('Ahmed Al-Qahtani', N'أحمد القحطاني', 'IT Specialist', N'أخصائي تقنية المعلومات', 'IT', 'a.qahtani@sauditabreed.com', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face', 1);
GO

-- ============================================
-- Organization Chart
-- ============================================
INSERT INTO OrgChart (NameEn, NameAr, TitleEn, TitleAr, Avatar, ParentId, SortOrder) VALUES
('Mohammed Abunayyan', N'محمد أبو نيان', 'Chairman', N'رئيس مجلس الإدارة', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', NULL, 1);

INSERT INTO OrgChart (NameEn, NameAr, TitleEn, TitleAr, Avatar, ParentId, SortOrder) VALUES
('Abdulhamid Aalmansour', N'عبدالحميد المنصور', 'CEO', N'الرئيس التنفيذي', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face', 1, 1);

INSERT INTO OrgChart (NameEn, NameAr, TitleEn, TitleAr, Avatar, ParentId, SortOrder) VALUES
('Khalid Al-Rashidi', N'خالد الرشيدي', 'VP Finance', N'نائب رئيس المالية', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face', 2, 1),
('Omar Al-Harbi', N'عمر الحربي', 'VP Projects & Engineering', N'نائب رئيس المشاريع', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face', 2, 2),
('Sara Al-Malik', N'سارة المالك', 'VP Human Resources', N'نائب رئيس الموارد البشرية', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face', 2, 3);
GO

-- ============================================
-- Office Locations
-- ============================================
INSERT INTO OfficeLocations (NameEn, NameAr, City, AddressEn, AddressAr, Type, Latitude, Longitude, IsActive)
VALUES
('Khobar Head Office', N'المقر الرئيسي - الخبر', 'Khobar', 'PO Box 239, Khobar, Eastern Province, 31952', N'ص.ب 239، الخبر، المنطقة الشرقية', 'hq', 26.2172, 50.1971, 1),
('Riyadh Office', N'مكتب الرياض', 'Riyadh', 'King Fahd Road, Riyadh', N'طريق الملك فهد، الرياض', 'branch', 24.7136, 46.6753, 1),
('Dhahran Plant', N'محطة الظهران', 'Dhahran', 'Saudi Aramco Complex, Dhahran', N'مجمع أرامكو السعودية، الظهران', 'plant', 26.2361, 50.0393, 1),
('Makkah Plant', N'محطة مكة المكرمة', 'Makkah', 'Jabal Omar Development, Makkah', N'مشروع جبل عمر، مكة المكرمة', 'plant', 21.4225, 39.8262, 1),
('KAFD Plant', N'محطة كافد', 'Riyadh', 'King Abdullah Financial District', N'حي الملك عبدالله المالي', 'plant', 24.7648, 46.6460, 1);
GO

-- ============================================
-- Safe/Emergency Locations
-- ============================================
INSERT INTO SafeLocations (NameEn, NameAr, AddressEn, AddressAr, ImageUrl)
VALUES
('Khobar HQ Assembly Point', N'نقطة التجمع - المقر الرئيسي', 'Main Parking Area, Khobar HQ', N'موقف السيارات الرئيسي، المقر الرئيسي', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=200&h=120&fit=crop'),
('Dhahran Plant Emergency Zone', N'منطقة الطوارئ - محطة الظهران', 'Gate 2 Assembly Area', N'منطقة التجمع - البوابة 2', 'https://images.unsplash.com/photo-1546412414-e1885259563a?w=200&h=120&fit=crop'),
('Riyadh Office Safe Zone', N'المنطقة الآمنة - مكتب الرياض', 'Ground Floor Lobby', N'بهو الطابق الأرضي', 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=200&h=120&fit=crop'),
('Makkah Plant Muster Point', N'نقطة التجمع - محطة مكة', 'North Gate Area', N'منطقة البوابة الشمالية', 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=200&h=120&fit=crop'),
('KAFD Plant Emergency Exit', N'مخرج الطوارئ - محطة كافد', 'Parking Level B1', N'موقف السيارات - الطابق السفلي', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=120&fit=crop');
GO

-- ============================================
-- Meeting Rooms
-- ============================================
INSERT INTO MeetingRooms (Name, NameAr, ImageUrl, Capacity, Floor, Location, HasVideoConf, HasWhiteboard)
VALUES
('Al Rimal', N'الرمال', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop', 10, '2nd Floor', 'Khobar HQ', 1, 1),
('Al Nakheel', N'النخيل', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=250&fit=crop', 16, '3rd Floor', 'Khobar HQ', 1, 1),
('Al Corniche', N'الكورنيش', 'https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=400&h=250&fit=crop', 6, '1st Floor', 'Khobar HQ', 0, 1),
('Innovation Hub', N'مركز الابتكار', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop', 24, '4th Floor', 'Khobar HQ', 1, 1);
GO

-- ============================================
-- Reminders
-- ============================================
INSERT INTO Reminders (MessageEn, MessageAr, Type, IsActive)
VALUES
('Please submit your end-of-quarter HSE reports by Thursday.', N'يرجى تقديم تقارير السلامة والصحة المهنية لنهاية الربع بحلول يوم الخميس.', 'info', 1);
GO

-- ============================================
-- Weekly Motivation
-- ============================================
INSERT INTO WeeklyMotivation (QuoteEn, QuoteAr, Author, BackgroundImageUrl, IsActive, WeekStartDate)
VALUES (
    'Innovation distinguishes between a leader and a follower. Together we cool the future of Saudi Arabia.',
    N'الابتكار هو ما يميز القائد عن التابع. معاً نبرّد مستقبل المملكة العربية السعودية.',
    'Saudi Tabreed Leadership',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    1,
    CAST(GETUTCDATE() AS DATE)
);
GO

PRINT 'Seed data inserted successfully!';
GO
