require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer for file uploads
const multer = require('multer');
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads', 'avatars');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// Try SQL Server, fall back to JSON file data
let useSQL = false;

async function initDB() {
  try {
    const { getPool } = require('./db.cjs');
    await getPool();
    useSQL = true;
    console.log('Using SQL Server database');
  } catch (err) {
    console.log('SQL Server not available, using JSON fallback:', err.message);
    useSQL = false;
  }
}

// JSON fallback data loader
function loadJsonData() {
  const fs = require('fs');
  const dbPath = path.join(__dirname, '..', 'db.json');
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

// ============================================
// API Routes
// ============================================

// --- News ---
app.get('/api/news', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const result = await query(
        `SELECT Id as id, TitleEn as title, SummaryEn as summary, ImageUrl as image,
                Category as category, Author as author, IsPublished,
                ViewCount as views, LikeCount as likes,
                FORMAT(PublishedAt, 'yyyy-MM-dd') as date,
                (SELECT COUNT(*) FROM NewsComments WHERE NewsId = News.Id) as comments
         FROM News WHERE IsPublished = 1 ORDER BY PublishedAt DESC`
      );
      res.json(result.recordset);
    } else {
      const data = loadJsonData();
      res.json(data.news);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/news/:id', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const result = await query(
        'SELECT * FROM News WHERE Id = @id', { id: parseInt(req.params.id) }
      );
      if (result.recordset.length === 0) return res.status(404).json({ error: 'Not found' });
      await query('UPDATE News SET ViewCount = ViewCount + 1 WHERE Id = @id', { id: parseInt(req.params.id) });
      res.json(result.recordset[0]);
    } else {
      const data = loadJsonData();
      const item = data.news.find(n => n.id == req.params.id);
      item ? res.json(item) : res.status(404).json({ error: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/news', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const { title, titleAr, summary, summaryAr, content, contentAr, image, category, author } = req.body;
      const result = await query(
        `INSERT INTO News (TitleEn, TitleAr, SummaryEn, SummaryAr, ContentEn, ContentAr, ImageUrl, Category, Author)
         OUTPUT INSERTED.Id VALUES (@title, @titleAr, @summary, @summaryAr, @content, @contentAr, @image, @category, @author)`,
        { title, titleAr, summary, summaryAr, content, contentAr, image, category, author }
      );
      res.status(201).json({ id: result.recordset[0].Id, message: 'News created' });
    } else {
      res.status(501).json({ error: 'CMS requires SQL Server connection' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/news/:id', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const { title, titleAr, summary, summaryAr, content, contentAr, image, category, author, isPublished } = req.body;
      await query(
        `UPDATE News SET TitleEn=@title, TitleAr=@titleAr, SummaryEn=@summary, SummaryAr=@summaryAr,
         ContentEn=@content, ContentAr=@contentAr, ImageUrl=@image, Category=@category, Author=@author,
         IsPublished=@isPublished, UpdatedAt=GETUTCDATE() WHERE Id=@id`,
        { title, titleAr, summary, summaryAr, content, contentAr, image, category, author, isPublished: isPublished ? 1 : 0, id: parseInt(req.params.id) }
      );
      res.json({ message: 'News updated' });
    } else {
      res.status(501).json({ error: 'CMS requires SQL Server connection' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/news/:id', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      await query('DELETE FROM News WHERE Id = @id', { id: parseInt(req.params.id) });
      res.json({ message: 'News deleted' });
    } else {
      res.status(501).json({ error: 'CMS requires SQL Server connection' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Announcements ---
app.get('/api/announcements', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const result = await query(
        `SELECT Id as id, TitleEn as title, Type as type, Department as department,
                FORMAT(CreatedAt, 'yyyy-MM-dd HH:mm') as date
         FROM Announcements WHERE IsActive = 1 ORDER BY CreatedAt DESC`
      );
      res.json(result.recordset);
    } else {
      const data = loadJsonData();
      res.json(data.announcements);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/announcements', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const { title, titleAr, description, descriptionAr, type, department } = req.body;
      const result = await query(
        `INSERT INTO Announcements (TitleEn, TitleAr, DescriptionEn, DescriptionAr, Type, Department)
         OUTPUT INSERTED.Id VALUES (@title, @titleAr, @description, @descriptionAr, @type, @department)`,
        { title, titleAr, description, descriptionAr, type, department }
      );
      res.status(201).json({ id: result.recordset[0].Id });
    } else {
      res.status(501).json({ error: 'CMS requires SQL Server' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Applications ---
app.get('/api/applications', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const result = await query(
        `SELECT Id as id, Name as name, Description as description, Category as category,
                Icon as icon, Color as color, Url as url
         FROM Applications WHERE IsActive = 1 ORDER BY SortOrder`
      );
      res.json(result.recordset);
    } else {
      const data = loadJsonData();
      res.json(data.applications);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Employees ---
app.get('/api/employees', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const result = await query(
        `SELECT Id as id, FullNameEn as name, Department as department,
                TitleEn as title, Avatar as avatar, ManagerId as managerId
         FROM Employees WHERE IsActive = 1 ORDER BY FullNameEn`
      );
      res.json(result.recordset);
    } else {
      const data = loadJsonData();
      res.json(data.employees);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Meeting Rooms ---
app.get('/api/meetingRooms', async (req, res) => {
  try {
    if (useSQL) {
      const { query, sql } = require('./db.cjs');
      const result = await query(
        `SELECT r.Id as id, r.Name as name, r.ImageUrl as image, r.Capacity as capacity,
                r.Floor as floor,
                CASE WHEN EXISTS (
                  SELECT 1 FROM RoomBookings b
                  WHERE b.RoomId = r.Id AND b.Status = 'confirmed'
                  AND GETUTCDATE() BETWEEN b.StartTime AND b.EndTime
                ) THEN 'busy' ELSE 'available' END as status
         FROM MeetingRooms r WHERE r.IsActive = 1`
      );
      res.json(result.recordset);
    } else {
      const data = loadJsonData();
      res.json(data.meetingRooms);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Office Locations ---
app.get('/api/officeLocations', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const result = await query(
        `SELECT Id as id, NameEn as name, City as city, AddressEn as address, Type as type
         FROM OfficeLocations WHERE IsActive = 1 ORDER BY Type, NameEn`
      );
      res.json(result.recordset);
    } else {
      const data = loadJsonData();
      res.json(data.officeLocations);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Safe Locations ---
app.get('/api/safeLocations', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const result = await query(
        `SELECT Id as id, NameEn as name, AddressEn as address, ImageUrl as image
         FROM SafeLocations ORDER BY NameEn`
      );
      res.json(result.recordset);
    } else {
      const data = loadJsonData();
      res.json(data.safeLocations);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Chairman Message ---
app.get('/api/chairman', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const result = await query(
        `SELECT TOP 1 NameEn as name, TitleEn as title, MessageEn as message, ImageUrl as image
         FROM ChairmanMessage WHERE IsActive = 1`
      );
      res.json(result.recordset[0] || {});
    } else {
      const data = loadJsonData();
      res.json(data.chairman);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/chairman', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const { name, nameAr, title, titleAr, message, messageAr, image } = req.body;
      await query(
        `UPDATE ChairmanMessage SET NameEn=@name, NameAr=@nameAr, TitleEn=@title, TitleAr=@titleAr,
         MessageEn=@message, MessageAr=@messageAr, ImageUrl=@image, UpdatedAt=GETUTCDATE()
         WHERE IsActive = 1`,
        { name, nameAr, title, titleAr, message, messageAr, image }
      );
      res.json({ message: 'Chairman message updated' });
    } else {
      res.status(501).json({ error: 'CMS requires SQL Server' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Reminder ---
app.get('/api/reminder', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const result = await query(
        `SELECT TOP 1 Id as id, MessageEn as message, IsActive as active
         FROM Reminders WHERE IsActive = 1 AND (ExpiresAt IS NULL OR ExpiresAt > GETUTCDATE())`
      );
      res.json(result.recordset[0] || { id: 0, message: '', active: false });
    } else {
      const data = loadJsonData();
      res.json(data.reminder);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Motivation ---
app.get('/api/motivation', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const result = await query(
        `SELECT TOP 1 QuoteEn as quote, Author as author, BackgroundImageUrl as backgroundImage
         FROM WeeklyMotivation WHERE IsActive = 1 ORDER BY WeekStartDate DESC`
      );
      res.json(result.recordset[0] || {});
    } else {
      const data = loadJsonData();
      res.json(data.motivation);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Org Chart ---
app.get('/api/orgChart', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const result = await query(
        'SELECT Id as id, NameEn as name, TitleEn as title, Avatar as avatar, ParentId as parentId FROM OrgChart ORDER BY SortOrder'
      );
      const rows = result.recordset;
      // Build tree
      const map = {};
      rows.forEach(r => { map[r.id] = { ...r, children: [] }; });
      let root = null;
      rows.forEach(r => {
        if (r.parentId && map[r.parentId]) {
          map[r.parentId].children.push(map[r.id]);
        } else if (!r.parentId) {
          root = map[r.id];
        }
      });
      res.json(root || {});
    } else {
      const data = loadJsonData();
      res.json(data.orgChart);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CMS: Dashboard Stats ---
app.get('/api/admin/stats', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const news = await query('SELECT COUNT(*) as count FROM News');
      const announcements = await query('SELECT COUNT(*) as count FROM Announcements WHERE IsActive=1');
      const employees = await query('SELECT COUNT(*) as count FROM Employees WHERE IsActive=1');
      const rooms = await query('SELECT COUNT(*) as count FROM MeetingRooms WHERE IsActive=1');
      res.json({
        news: news.recordset[0].count,
        announcements: announcements.recordset[0].count,
        employees: employees.recordset[0].count,
        rooms: rooms.recordset[0].count,
      });
    } else {
      const data = loadJsonData();
      res.json({
        news: data.news.length,
        announcements: data.announcements.length,
        employees: data.employees.length,
        rooms: data.meetingRooms.length,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: useSQL ? 'sql-server' : 'json-fallback', timestamp: new Date().toISOString() });
});

// --- Authentication ---
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET || 'tabreed-portal-secret';

// Test users for JSON fallback mode
const testUsers = [
  { id: 1, email: 'admin@sauditabreed.com', password: bcrypt.hashSync('Tabreed@2026', 10), name: 'System Administrator', nameAr: 'مدير النظام', role: 'admin', title: 'IT Administrator', titleAr: 'مدير تقنية المعلومات', department: 'IT', avatar: '' },
  { id: 2, email: 'ahmed.qahtani@sauditabreed.com', password: bcrypt.hashSync('Tabreed@2026', 10), name: 'Ahmed Al-Qahtani', nameAr: 'أحمد القحطاني', role: 'editor', title: 'IT Specialist', titleAr: 'أخصائي تقنية المعلومات', department: 'IT', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face' },
  { id: 3, email: 'sara.malik@sauditabreed.com', password: bcrypt.hashSync('Tabreed@2026', 10), name: 'Sara Al-Malik', nameAr: 'سارة المالك', role: 'user', title: 'VP Human Resources', titleAr: 'نائب رئيس الموارد البشرية', department: 'HR', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face' },
];

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    let user = null;

    if (useSQL) {
      const { query } = require('./db.cjs');
      const result = await query(
        'SELECT Id, Email, PasswordHash, FullNameEn, FullNameAr, TitleEn, TitleAr, Department, Role, Avatar FROM Users WHERE Email = @email AND IsActive = 1',
        { email }
      );
      if (result.recordset.length === 0) return res.status(401).json({ error: 'Invalid email or password' });
      const row = result.recordset[0];
      const valid = await bcrypt.compare(password, row.PasswordHash);
      if (!valid) return res.status(401).json({ error: 'Invalid email or password' });
      user = { id: row.Id, email: row.Email, name: row.FullNameEn, nameAr: row.FullNameAr, role: row.Role, title: row.TitleEn, titleAr: row.TitleAr, department: row.Department, avatar: row.Avatar };
    } else {
      const found = testUsers.find(u => u.email === email);
      if (!found) return res.status(401).json({ error: 'Invalid email or password' });
      const valid = await bcrypt.compare(password, found.password);
      if (!valid) return res.status(401).json({ error: 'Invalid email or password' });
      user = { id: found.id, email: found.email, name: found.name, nameAr: found.nameAr, role: found.role, title: found.title, titleAr: found.titleAr, department: found.department, avatar: found.avatar };
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);

    if (useSQL) {
      const { query } = require('./db.cjs');
      const result = await query(
        'SELECT Id, Email, FullNameEn as name, FullNameAr as nameAr, TitleEn as title, TitleAr as titleAr, Department as department, Role as role, Avatar as avatar FROM Users WHERE Id = @id',
        { id: decoded.id }
      );
      res.json(result.recordset[0] || {});
    } else {
      const found = testUsers.find(u => u.id === decoded.id);
      if (found) {
        const { password, ...user } = found;
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    }
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// --- Profile Photo Upload ---
app.post('/api/auth/avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // If using SQL, update the user record
    const authHeader = req.headers.authorization;
    if (authHeader && useSQL) {
      const decoded = jwt.verify(authHeader.replace('Bearer ', ''), JWT_SECRET);
      const { query } = require('./db.cjs');
      await query('UPDATE Users SET Avatar = @avatar, UpdatedAt = GETUTCDATE() WHERE Id = @id', { avatar: avatarUrl, id: decoded.id });
    }

    res.json({ avatarUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Policies (static data for JSON fallback) ---
app.get('/api/policies', (req, res) => {
  res.json([
    { id: 1, title: 'HSE Guidelines & Standards', category: 'HSE', date: '2026-01-15', fileUrl: '#' },
    { id: 2, title: 'IT Security Policy', category: 'IT', date: '2025-11-20', fileUrl: '#' },
    { id: 3, title: 'Employee Handbook 2026', category: 'HR', date: '2026-01-01', fileUrl: '#' },
    { id: 4, title: 'Emergency Response Procedures', category: 'HSE', date: '2025-09-10', fileUrl: '#' },
    { id: 5, title: 'Data Protection & Privacy Policy', category: 'IT', date: '2025-12-05', fileUrl: '#' },
    { id: 6, title: 'Travel & Expense Policy', category: 'HR', date: '2025-08-15', fileUrl: '#' },
    { id: 7, title: 'Code of Conduct', category: 'HR', date: '2025-06-01', fileUrl: '#' },
    { id: 8, title: 'Work From Home Policy', category: 'HR', date: '2026-02-01', fileUrl: '#' },
    { id: 9, title: 'Plant Operations Manual', category: 'Operations', date: '2025-10-20', fileUrl: '#' },
    { id: 10, title: 'Vendor Management Policy', category: 'Operations', date: '2025-07-15', fileUrl: '#' },
  ]);
});

// Start
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Saudi Tabreed Portal API running on port ${PORT}`);
    console.log(`Database mode: ${useSQL ? 'SQL Server' : 'JSON fallback'}`);
  });
});
