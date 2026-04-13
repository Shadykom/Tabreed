require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Security: Sanitize text input (strip HTML tags)
function sanitize(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '').trim();
}

function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitize(req.body[key]);
      }
    }
  }
  next();
}
app.use(sanitizeBody);

// Security: Rate limiting for login (max 10 attempts per minute per IP)
const loginAttempts = {};
function loginRateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  if (!loginAttempts[ip]) loginAttempts[ip] = [];
  loginAttempts[ip] = loginAttempts[ip].filter(t => now - t < 60000);
  if (loginAttempts[ip].length >= 10) {
    return res.status(429).json({ error: 'Too many login attempts. Please wait 1 minute.' });
  }
  loginAttempts[ip].push(now);
  next();
}

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

// In-memory data cache for JSON fallback CRUD
let memoryData = null;
const dbFilePath = path.join(__dirname, '..', 'db.json');

function getData() {
  if (!memoryData) {
    const fs = require('fs');
    memoryData = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
  }
  return memoryData;
}

// Persist changes to db.json (debounced to avoid excessive writes)
let saveTimer = null;
function saveData() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      const fs = require('fs');
      fs.writeFileSync(dbFilePath, JSON.stringify(memoryData, null, 2), 'utf8');
      console.log('Data saved to db.json');
    } catch (err) {
      console.error('Failed to save db.json:', err.message);
    }
  }, 500);
}

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
      const data = getData();
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
      const data = getData();
      const item = data.news.find(n => n.id == req.params.id);
      item ? res.json(item) : res.status(404).json({ error: 'Not found' });
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
      const data = getData();
      res.json(data.announcements);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/announcements-legacy', async (req, res) => {
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
      const data = getData();
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
      const data = getData();
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
      const data = getData();
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
      const data = getData();
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
      const data = getData();
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
      const data = getData();
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
      res.json({ message: 'Chairman message updated' }); saveData();
    } else {
      const data = getData();
      Object.assign(data.chairman, req.body);
      res.json({ message: 'Chairman message updated' }); saveData();
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CRUD for News ---
app.post('/api/news', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const { title, summary, category, author, image } = req.body;
      const result = await query(`INSERT INTO News (TitleEn, SummaryEn, Category, Author, ImageUrl) OUTPUT INSERTED.Id VALUES (@title, @summary, @category, @author, @image)`, { title, summary, category, author, image });
      res.status(201).json({ id: result.recordset[0].Id, ...req.body });
    } else {
      const data = getData();
      const maxId = data.news.reduce((m, n) => Math.max(m, n.id), 0);
      const item = { id: maxId + 1, comments: 0, likes: 0, date: 'Just now', ...req.body };
      data.news.unshift(item);
      res.status(201).json(item); saveData();
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/news/:id', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const { title, summary, category, author, image } = req.body;
      await query(`UPDATE News SET TitleEn=@title, SummaryEn=@summary, Category=@category, Author=@author, ImageUrl=@image, UpdatedAt=GETUTCDATE() WHERE Id=@id`, { title, summary, category, author, image, id: parseInt(req.params.id) });
      res.json({ message: 'Updated' });
    } else {
      const data = getData();
      const idx = data.news.findIndex(n => n.id == req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      data.news[idx] = { ...data.news[idx], ...req.body };
      res.json(data.news[idx]); saveData();
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/news/:id', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      await query('DELETE FROM NewsComments WHERE NewsId=@id', { id: parseInt(req.params.id) });
      await query('DELETE FROM News WHERE Id=@id', { id: parseInt(req.params.id) });
      res.json({ message: 'Deleted' });
    } else {
      const data = getData();
      data.news = data.news.filter(n => n.id != req.params.id);
      res.json({ message: 'Deleted' }); saveData();
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- CRUD for Announcements ---
app.post('/api/announcements', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const { title, type, department } = req.body;
      const result = await query(`INSERT INTO Announcements (TitleEn, Type, Department) OUTPUT INSERTED.Id VALUES (@title, @type, @department)`, { title, type, department });
      res.status(201).json({ id: result.recordset[0].Id, ...req.body });
    } else {
      const data = getData();
      const maxId = data.announcements.reduce((m, a) => Math.max(m, a.id), 0);
      const item = { id: maxId + 1, date: 'Just now', ...req.body };
      data.announcements.unshift(item);
      res.status(201).json(item); saveData();
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/announcements/:id', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const { title, type, department } = req.body;
      await query(`UPDATE Announcements SET TitleEn=@title, Type=@type, Department=@department, UpdatedAt=GETUTCDATE() WHERE Id=@id`, { title, type, department, id: parseInt(req.params.id) });
      res.json({ message: 'Updated' });
    } else {
      const data = getData();
      const idx = data.announcements.findIndex(a => a.id == req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      data.announcements[idx] = { ...data.announcements[idx], ...req.body };
      res.json(data.announcements[idx]); saveData();
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/announcements/:id', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      await query('DELETE FROM Announcements WHERE Id=@id', { id: parseInt(req.params.id) });
      res.json({ message: 'Deleted' });
    } else {
      const data = getData();
      data.announcements = data.announcements.filter(a => a.id != req.params.id);
      res.json({ message: 'Deleted' }); saveData();
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- CRUD for Employees ---
app.post('/api/employees', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const { name, department, title, avatar } = req.body;
      const result = await query(`INSERT INTO Employees (FullNameEn, Department, TitleEn, Avatar) OUTPUT INSERTED.Id VALUES (@name, @department, @title, @avatar)`, { name, department, title, avatar });
      res.status(201).json({ id: result.recordset[0].Id, ...req.body });
    } else {
      const data = getData();
      const maxId = data.employees.reduce((m, e) => Math.max(m, e.id), 0);
      const item = { id: maxId + 1, ...req.body };
      data.employees.push(item);
      res.status(201).json(item); saveData();
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const { name, department, title, avatar } = req.body;
      await query(`UPDATE Employees SET FullNameEn=@name, Department=@department, TitleEn=@title, Avatar=@avatar, UpdatedAt=GETUTCDATE() WHERE Id=@id`, { name, department, title, avatar, id: parseInt(req.params.id) });
      res.json({ message: 'Updated' });
    } else {
      const data = getData();
      const idx = data.employees.findIndex(e => e.id == req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      data.employees[idx] = { ...data.employees[idx], ...req.body };
      res.json(data.employees[idx]); saveData();
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      await query('DELETE FROM Employees WHERE Id=@id', { id: parseInt(req.params.id) });
      res.json({ message: 'Deleted' });
    } else {
      const data = getData();
      data.employees = data.employees.filter(e => e.id != req.params.id);
      res.json({ message: 'Deleted' }); saveData();
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- CRUD for Meeting Rooms ---
app.post('/api/meetingRooms', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const { name, image, capacity, floor } = req.body;
      const result = await query(`INSERT INTO MeetingRooms (Name, ImageUrl, Capacity, Floor) OUTPUT INSERTED.Id VALUES (@name, @image, @capacity, @floor)`, { name, image, capacity: parseInt(capacity) || 0, floor });
      res.status(201).json({ id: result.recordset[0].Id, ...req.body });
    } else {
      const data = getData();
      const maxId = data.meetingRooms.reduce((m, r) => Math.max(m, r.id), 0);
      const item = { id: maxId + 1, status: 'available', ...req.body };
      data.meetingRooms.push(item);
      res.status(201).json(item); saveData();
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/meetingRooms/:id', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const { name, image, capacity, floor } = req.body;
      await query(`UPDATE MeetingRooms SET Name=@name, ImageUrl=@image, Capacity=@capacity, Floor=@floor WHERE Id=@id`, { name, image, capacity: parseInt(capacity) || 0, floor, id: parseInt(req.params.id) });
      res.json({ message: 'Updated' });
    } else {
      const data = getData();
      const idx = data.meetingRooms.findIndex(r => r.id == req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      data.meetingRooms[idx] = { ...data.meetingRooms[idx], ...req.body };
      res.json(data.meetingRooms[idx]); saveData();
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/meetingRooms/:id', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      await query('DELETE FROM RoomBookings WHERE RoomId=@id', { id: parseInt(req.params.id) });
      await query('DELETE FROM MeetingRooms WHERE Id=@id', { id: parseInt(req.params.id) });
      res.json({ message: 'Deleted' });
    } else {
      const data = getData();
      data.meetingRooms = data.meetingRooms.filter(r => r.id != req.params.id);
      res.json({ message: 'Deleted' }); saveData();
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
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
      const data = getData();
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
      const data = getData();
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
      const data = getData();
      res.json(data.orgChart);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- JSON Fallback CRUD for Applications ---
app.post('/api/applications', (req, res) => {
  const data = getData();
  const maxId = data.applications.reduce((m, a) => Math.max(m, a.id), 0);
  const item = { id: maxId + 1, ...req.body };
  data.applications.push(item);
  res.status(201).json(item); saveData();
});

app.put('/api/applications/:id', (req, res) => {
  const data = getData();
  const idx = data.applications.findIndex(a => a.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.applications[idx] = { ...data.applications[idx], ...req.body };
  res.json(data.applications[idx]); saveData();
});

app.delete('/api/applications/:id', (req, res) => {
  const data = getData();
  data.applications = data.applications.filter(a => a.id != req.params.id);
  res.json({ message: 'Deleted' }); saveData();
});

// --- JSON Fallback CRUD for Office Locations ---
app.post('/api/officeLocations', (req, res) => {
  const data = getData();
  const maxId = data.officeLocations.reduce((m, l) => Math.max(m, l.id), 0);
  const item = { id: maxId + 1, ...req.body };
  data.officeLocations.push(item);
  res.status(201).json(item); saveData();
});

app.put('/api/officeLocations/:id', (req, res) => {
  const data = getData();
  const idx = data.officeLocations.findIndex(l => l.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.officeLocations[idx] = { ...data.officeLocations[idx], ...req.body };
  res.json(data.officeLocations[idx]); saveData();
});

app.delete('/api/officeLocations/:id', (req, res) => {
  const data = getData();
  data.officeLocations = data.officeLocations.filter(l => l.id != req.params.id);
  res.json({ message: 'Deleted' }); saveData();
});

// --- JSON Fallback CRUD for Safe Locations ---
app.post('/api/safeLocations', (req, res) => {
  const data = getData();
  const maxId = data.safeLocations.reduce((m, l) => Math.max(m, l.id), 0);
  const item = { id: maxId + 1, ...req.body };
  data.safeLocations.push(item);
  res.status(201).json(item); saveData();
});

app.put('/api/safeLocations/:id', (req, res) => {
  const data = getData();
  const idx = data.safeLocations.findIndex(l => l.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.safeLocations[idx] = { ...data.safeLocations[idx], ...req.body };
  res.json(data.safeLocations[idx]); saveData();
});

app.delete('/api/safeLocations/:id', (req, res) => {
  const data = getData();
  data.safeLocations = data.safeLocations.filter(l => l.id != req.params.id);
  res.json({ message: 'Deleted' }); saveData();
});

// --- PUT for Motivation ---
app.put('/api/motivation', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const { quote, author, backgroundImage } = req.body;
      await query(
        `UPDATE WeeklyMotivation SET QuoteEn=@quote, Author=@author, BackgroundImageUrl=@backgroundImage
         WHERE IsActive = 1`,
        { quote, author, backgroundImage }
      );
      res.json({ message: 'Motivation updated' }); saveData();
    } else {
      const data = getData();
      Object.assign(data.motivation, req.body);
      res.json({ message: 'Motivation updated' }); saveData();
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PUT for Reminder ---
app.put('/api/reminder', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const { message, type, active } = req.body;
      await query(
        `UPDATE Reminders SET MessageEn=@message, Type=@type, IsActive=@active
         WHERE IsActive = 1`,
        { message, type: type || 'info', active: active ? 1 : 0 }
      );
      res.json({ message: 'Reminder updated' }); saveData();
    } else {
      const data = getData();
      Object.assign(data.reminder, req.body);
      res.json({ message: 'Reminder updated' }); saveData();
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Org Chart flat endpoint & CRUD ---
app.get('/api/orgChart/flat', async (req, res) => {
  try {
    if (useSQL) {
      const { query } = require('./db.cjs');
      const result = await query(
        'SELECT Id as id, NameEn as name, TitleEn as title, Avatar as avatar, ParentId as parentId FROM OrgChart ORDER BY SortOrder'
      );
      res.json(result.recordset);
    } else {
      const data = getData();
      // Flatten the tree from db.json
      const flat = [];
      function flattenNode(node, parentId) {
        const { children, ...rest } = node;
        flat.push({ ...rest, parentId: parentId || null });
        if (children) children.forEach(c => flattenNode(c, node.id));
      }
      if (data.orgChart && data.orgChart.id) flattenNode(data.orgChart, null);
      res.json(flat);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orgChart', (req, res) => {
  const data = getData();
  // Flatten tree to find max id
  const flat = [];
  function flattenNode(node, parentId) {
    const { children, ...rest } = node;
    flat.push({ ...rest, parentId: parentId || null });
    if (children) children.forEach(c => flattenNode(c, node.id));
  }
  if (data.orgChart && data.orgChart.id) flattenNode(data.orgChart, null);
  const maxId = flat.reduce((m, n) => Math.max(m, n.id), 0);
  const newNode = { id: maxId + 1, ...req.body };
  // Add to the tree: find parent and push to its children
  function addToTree(node) {
    if (!newNode.parentId) return; // root—shouldn't happen for POST
    if (node.id == newNode.parentId) {
      if (!node.children) node.children = [];
      const { parentId, ...nodeData } = newNode;
      node.children.push(nodeData);
      return;
    }
    if (node.children) node.children.forEach(c => addToTree(c));
  }
  if (newNode.parentId) {
    addToTree(data.orgChart);
  }
  res.status(201).json(newNode);
});

app.put('/api/orgChart/:id', (req, res) => {
  const data = getData();
  function updateInTree(node) {
    if (node.id == req.params.id) {
      Object.assign(node, { name: req.body.name, title: req.body.title, avatar: req.body.avatar });
      return true;
    }
    if (node.children) return node.children.some(c => updateInTree(c));
    return false;
  }
  const found = updateInTree(data.orgChart);
  if (!found) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Updated' }); saveData();
});

app.delete('/api/orgChart/:id', (req, res) => {
  const data = getData();
  function removeFromTree(node) {
    if (node.children) {
      node.children = node.children.filter(c => c.id != req.params.id);
      node.children.forEach(c => removeFromTree(c));
    }
  }
  removeFromTree(data.orgChart);
  res.json({ message: 'Deleted' }); saveData();
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
      const data = getData();
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

app.post('/api/auth/login', loginRateLimit, async (req, res) => {
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

// --- Service Requests ---

const deptEmails = {
  'IT':          'it@sauditabreed.com',
  'HR':          'hr@sauditabreed.com',
  'Finance':     'finance@sauditabreed.com',
  'Engineering': 'engineering@sauditabreed.com',
  'Operations':  'operations@sauditabreed.com',
  'HSE':         'hse@sauditabreed.com',
  'Marketing':   'marketing@sauditabreed.com',
  'Executive':   'executive@sauditabreed.com',
};

const serviceRequests = [];

/**
 * Build a branded HTML email for a new service request.
 */
function buildServiceRequestEmail(req) {
  const priorityColors = {
    Urgent: { bg: '#FEE2E2', text: '#DC2626', dot: '#EF4444' },
    High:   { bg: '#FEF3C7', text: '#D97706', dot: '#F59E0B' },
    Normal: { bg: '#DBEAFE', text: '#2563EB', dot: '#3B82F6' },
  };
  const pc = priorityColors[req.priority] || priorityColors.Normal;

  const attachmentsHtml = req.attachments && req.attachments.length
    ? `<p style="margin:0 0 6px;color:#6B7280;font-size:13px;">
         <strong style="color:#374151;">Attachments:</strong>
         ${req.attachments.map(a => a.originalname || a).join(', ')}
       </p>`
    : '';

  const portalUrl = process.env.PORTAL_URL || 'http://localhost:5173';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Service Request – Saudi Tabreed</title>
</head>
<body style="margin:0;padding:0;background:#EEF2FB;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2FB;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1B3A6B 0%,#2E5BA0 100%);
                        border-radius:16px 16px 0 0;padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:rgba(255,255,255,0.15);
                                    border-radius:12px;padding:10px;
                                    vertical-align:middle;margin-right:14px;">
                          <!-- Snowflake SVG -->
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                               xmlns="http://www.w3.org/2000/svg" style="display:block;">
                            <line x1="12" y1="2" x2="12" y2="22"
                                  stroke="white" stroke-width="2" stroke-linecap="round"/>
                            <line x1="2" y1="12" x2="22" y2="12"
                                  stroke="white" stroke-width="2" stroke-linecap="round"/>
                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"
                                  stroke="white" stroke-width="2" stroke-linecap="round"/>
                            <line x1="19.07" y1="4.93" x2="4.93" y2="19.07"
                                  stroke="white" stroke-width="2" stroke-linecap="round"/>
                            <circle cx="12" cy="2"  r="1.5" fill="white"/>
                            <circle cx="12" cy="22" r="1.5" fill="white"/>
                            <circle cx="2"  cy="12" r="1.5" fill="white"/>
                            <circle cx="22" cy="12" r="1.5" fill="white"/>
                          </svg>
                        </td>
                        <td style="padding-left:14px;">
                          <div style="color:white;font-size:20px;font-weight:700;
                                      letter-spacing:-0.3px;">Saudi Tabreed</div>
                          <div style="color:rgba(255,255,255,0.7);font-size:13px;
                                      margin-top:2px;">Internal Portal</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right">
                    <div style="background:rgba(255,255,255,0.15);
                                border-radius:8px;padding:8px 14px;
                                display:inline-block;">
                      <div style="color:rgba(255,255,255,0.8);font-size:11px;
                                  text-transform:uppercase;letter-spacing:0.08em;">
                        New Request</div>
                      <div style="color:white;font-size:14px;font-weight:700;
                                  margin-top:2px;">${req.id}</div>
                    </div>
                  </td>
                </tr>
              </table>
              <div style="margin-top:24px;">
                <div style="color:rgba(255,255,255,0.8);font-size:13px;
                            text-transform:uppercase;letter-spacing:0.1em;
                            margin-bottom:6px;">New Service Request</div>
                <div style="color:white;font-size:24px;font-weight:700;
                            line-height:1.3;">${req.summary}</div>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#FFFFFF;padding:36px 40px;">

              <!-- Requester Info -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#F8FAFF;border-radius:12px;
                            padding:20px;margin-bottom:24px;
                            border:1px solid #E8F0FE;">
                <tr>
                  <td>
                    <div style="font-size:11px;font-weight:700;
                                color:#4A7FD4;text-transform:uppercase;
                                letter-spacing:0.08em;margin-bottom:14px;">
                      Requester Information
                    </div>
                    <table width="100%" cellpadding="0" cellspacing="6">
                      <tr>
                        <td width="50%" style="padding:4px 0;">
                          <span style="color:#6B7280;font-size:13px;">Name</span><br/>
                          <span style="color:#111827;font-size:14px;font-weight:600;">
                            ${req.requesterName || 'Not specified'}
                          </span>
                        </td>
                        <td width="50%" style="padding:4px 0;">
                          <span style="color:#6B7280;font-size:13px;">Department</span><br/>
                          <span style="color:#111827;font-size:14px;font-weight:600;">
                            ${req.requesterDepartment || 'Not specified'}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding:8px 0 0;">
                          <span style="color:#6B7280;font-size:13px;">Email</span><br/>
                          <span style="color:#111827;font-size:14px;font-weight:600;">
                            ${req.requesterEmail || 'Not specified'}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Request Details -->
              <div style="font-size:11px;font-weight:700;color:#4A7FD4;
                          text-transform:uppercase;letter-spacing:0.08em;
                          margin-bottom:16px;">Request Details</div>

              <table width="100%" cellpadding="0" cellspacing="0"
                     style="margin-bottom:20px;">
                <tr>
                  <td width="50%" style="padding:0 12px 16px 0;">
                    <div style="background:#F9FAFB;border-radius:10px;
                                padding:14px 16px;border:1px solid #E5E7EB;">
                      <div style="color:#9CA3AF;font-size:11px;
                                  text-transform:uppercase;letter-spacing:0.06em;
                                  margin-bottom:6px;">Target Department</div>
                      <div style="color:#111827;font-size:15px;font-weight:700;">
                        ${req.department}
                      </div>
                    </div>
                  </td>
                  <td width="50%" style="padding:0 0 16px 0;">
                    <div style="background:#F9FAFB;border-radius:10px;
                                padding:14px 16px;border:1px solid #E5E7EB;">
                      <div style="color:#9CA3AF;font-size:11px;
                                  text-transform:uppercase;letter-spacing:0.06em;
                                  margin-bottom:6px;">Service Type</div>
                      <div style="color:#111827;font-size:15px;font-weight:700;">
                        ${req.service}
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <div style="background:#F9FAFB;border-radius:10px;
                                padding:14px 16px;border:1px solid #E5E7EB;
                                margin-bottom:16px;">
                      <div style="color:#9CA3AF;font-size:11px;
                                  text-transform:uppercase;letter-spacing:0.06em;
                                  margin-bottom:8px;">Priority</div>
                      <span style="background:${pc.bg};color:${pc.text};
                                   border-radius:20px;padding:5px 14px;
                                   font-size:13px;font-weight:700;
                                   display:inline-flex;align-items:center;gap:6px;">
                        <span style="display:inline-block;width:8px;height:8px;
                                     border-radius:50%;background:${pc.dot};"></span>
                        ${req.priority}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Description -->
              ${req.description ? `
              <div style="background:#F9FAFB;border-radius:10px;
                          padding:16px 18px;border:1px solid #E5E7EB;
                          margin-bottom:20px;">
                <div style="color:#9CA3AF;font-size:11px;text-transform:uppercase;
                            letter-spacing:0.06em;margin-bottom:10px;">Description</div>
                <div style="color:#374151;font-size:14px;line-height:1.7;
                            white-space:pre-wrap;">${req.description.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
              </div>` : ''}

              <!-- Attachments note -->
              ${attachmentsHtml ? `
              <div style="background:#F0FDF4;border-radius:10px;
                          padding:14px 16px;border:1px solid #BBF7D0;
                          margin-bottom:24px;">
                <div style="color:#15803D;font-size:13px;">${attachmentsHtml}</div>
              </div>` : ''}

              <!-- CTA Button -->
              <div style="text-align:center;margin:32px 0 8px;">
                <a href="${portalUrl}/services"
                   style="background:linear-gradient(135deg,#1B3A6B,#2E5BA0);
                          color:white;text-decoration:none;
                          padding:14px 36px;border-radius:10px;
                          font-size:15px;font-weight:700;
                          display:inline-block;
                          box-shadow:0 4px 14px rgba(27,58,107,0.35);">
                  View Request in Portal
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F3F4F6;border-radius:0 0 16px 16px;
                        padding:20px 40px;text-align:center;">
              <p style="color:#9CA3AF;font-size:12px;margin:0 0 4px;">
                System Notification &ndash; Saudi Tabreed Portal
              </p>
              <p style="color:#D1D5DB;font-size:11px;margin:0;">
                This is an automated message. Please do not reply directly to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Send (or log) a service-request notification email.
 */
async function sendServiceRequestEmail(reqData) {
  const toEmail = deptEmails[reqData.department];

  const mailOptions = {
    from: `"Saudi Tabreed Portal" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: toEmail || 'admin@sauditabreed.com',
    cc: reqData.requesterEmail || undefined,
    subject: `[${reqData.priority}] New ${reqData.department} Request: ${reqData.summary}`,
    html: buildServiceRequestEmail(reqData),
  };

  const smtpConfigured =
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS;

  if (!smtpConfigured) {
    console.log('\n--- Service Request Email (SMTP not configured) ---');
    console.log('To:     ', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    console.log('ID:     ', reqData.id);
    console.log('---------------------------------------------------\n');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
  });

  await transporter.sendMail(mailOptions);
  console.log(`Service request email sent to ${mailOptions.to}`);
}

// GET /api/service-requests
app.get('/api/service-requests', (req, res) => {
  res.json(serviceRequests);
});

// POST /api/service-requests
app.post('/api/service-requests', upload.array('attachments', 5), async (req, res) => {
  try {
    const {
      department,
      service,
      priority = 'Normal',
      summary,
      description = '',
      requesterName = '',
      requesterEmail = '',
      requesterDepartment = '',
    } = req.body;

    if (!department || !service || !summary) {
      return res.status(400).json({ error: 'department, service, and summary are required.' });
    }

    const id = `SR-${Date.now()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const submittedAt = new Date().toISOString();

    const reqData = {
      id,
      department,
      service,
      priority,
      summary,
      description,
      requesterName,
      requesterEmail,
      requesterDepartment,
      attachments: (req.files || []).map(f => ({ originalname: f.originalname, path: f.path, size: f.size })),
      status: 'Pending',
      submittedAt,
    };

    serviceRequests.unshift(reqData);

    // Send email (non-blocking – failure does not fail the request)
    sendServiceRequestEmail(reqData).catch(err => {
      console.error('Email send error:', err.message);
    });

    res.status(201).json({ id, submittedAt, status: 'Pending' });
  } catch (err) {
    console.error('Service request error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Room Bookings ---
const todayDate = new Date().toISOString().split('T')[0];
const tomorrowDate = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
})();

const roomBookings = [
  {
    id: 1,
    roomId: 1,
    roomName: 'Al Rimal',
    date: todayDate,
    startTime: '09:00',
    endTime: '10:00',
    title: 'Engineering Review',
    attendees: 6,
    bookedBy: 'Ahmed Al-Qahtani',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    roomId: 2,
    roomName: 'Al Nakheel',
    date: todayDate,
    startTime: '14:00',
    endTime: '15:30',
    title: 'Finance Quarterly Update',
    attendees: 10,
    bookedBy: 'Sara Al-Malik',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    roomId: 3,
    roomName: 'Al Corniche',
    date: todayDate,
    startTime: '10:00',
    endTime: '11:00',
    title: 'Operations Standup',
    attendees: 4,
    bookedBy: 'Omar Almidani',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    roomId: 1,
    roomName: 'Al Rimal',
    date: tomorrowDate,
    startTime: '11:00',
    endTime: '12:00',
    title: 'Project Kick-off',
    attendees: 8,
    bookedBy: 'Mohammed Al-Shehri',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
];

app.get('/api/room-bookings', (req, res) => {
  const { date, roomId } = req.query;
  let filtered = roomBookings;
  if (date) filtered = filtered.filter(b => b.date === date);
  if (roomId) filtered = filtered.filter(b => b.roomId == roomId);
  res.json(filtered);
});

app.post('/api/room-bookings', (req, res) => {
  const booking = {
    id: roomBookings.length + 1,
    ...req.body,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  roomBookings.push(booking);
  res.status(201).json(booking);
});

app.delete('/api/room-bookings/:id', (req, res) => {
  const idx = roomBookings.findIndex(b => b.id == req.params.id);
  if (idx !== -1) roomBookings.splice(idx, 1);
  res.json({ message: 'Cancelled' });
});

// --- Policies Management ---
const policiesDir = path.join(__dirname, 'uploads', 'policies');
if (!require('fs').existsSync(policiesDir)) require('fs').mkdirSync(policiesDir, { recursive: true });

const policyStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, policiesDir),
  filename: (req, file, cb) => cb(null, `policy-${Date.now()}-${file.originalname}`),
});
const policyUpload = multer({ storage: policyStorage, limits: { fileSize: 50 * 1024 * 1024 } });

// In-memory policies store
let policies = [
  { id: 1, title: 'HSE Guidelines & Standards', category: 'HSE', date: '2026-01-15', pages: 45, fileUrl: '', description: 'Comprehensive health, safety and environment guidelines for all Saudi Tabreed operations and plants.' },
  { id: 2, title: 'IT Security Policy', category: 'IT', date: '2025-11-20', pages: 32, fileUrl: '', description: 'Information security policies covering data protection, access control, and cybersecurity measures.' },
  { id: 3, title: 'Employee Handbook 2026', category: 'HR', date: '2026-01-01', pages: 78, fileUrl: '', description: 'Complete employee handbook with company policies, benefits, code of conduct and workplace procedures.' },
  { id: 4, title: 'Emergency Response Procedures', category: 'HSE', date: '2025-09-10', pages: 28, fileUrl: '', description: 'Emergency evacuation and response procedures for all office locations and cooling plants.' },
  { id: 5, title: 'Data Protection & Privacy Policy', category: 'IT', date: '2025-12-05', pages: 22, fileUrl: '', description: 'Data privacy and protection policy in compliance with Saudi data protection regulations.' },
  { id: 6, title: 'Travel & Expense Policy', category: 'HR', date: '2025-08-15', pages: 18, fileUrl: '', description: 'Guidelines for business travel booking, expense claims, and reimbursement procedures.' },
  { id: 7, title: 'Code of Conduct', category: 'HR', date: '2025-06-01', pages: 15, fileUrl: '', description: 'Professional and ethical standards expected of all Saudi Tabreed employees.' },
  { id: 8, title: 'Work From Home Policy', category: 'HR', date: '2026-02-01', pages: 12, fileUrl: '', description: 'Remote work guidelines, eligibility criteria, and expectations for WFH arrangements.' },
  { id: 9, title: 'Operations & Maintenance Manual', category: 'Operations', date: '2025-10-20', pages: 95, fileUrl: '', description: 'Standard operating procedures for district cooling plant operations and maintenance.' },
  { id: 10, title: 'Risk Assessment Framework', category: 'Operations', date: '2025-07-15', pages: 54, fileUrl: '', description: 'Risk identification, assessment methodology and mitigation strategies for all projects.' },
];

app.get('/api/policies', (req, res) => {
  const { search, category } = req.query;
  let result = [...policies];
  if (category && category !== 'All') result = result.filter(p => p.category === category);
  if (search) {
    const s = String(search).toLowerCase();
    result = result.filter(p => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s) || p.category.toLowerCase().includes(s));
  }
  res.json(result);
});

app.get('/api/policies/:id', (req, res) => {
  const p = policies.find(p => p.id == req.params.id);
  p ? res.json(p) : res.status(404).json({ error: 'Not found' });
});

app.post('/api/policies', policyUpload.single('file'), (req, res) => {
  const maxId = policies.reduce((m, p) => Math.max(m, p.id), 0);
  const item = {
    id: maxId + 1,
    title: req.body.title || 'Untitled',
    category: req.body.category || 'General',
    date: new Date().toISOString().split('T')[0],
    pages: parseInt(req.body.pages) || 0,
    description: req.body.description || '',
    fileUrl: req.file ? `/uploads/policies/${req.file.filename}` : '',
  };
  policies.push(item);
  saveData();
  res.status(201).json(item);
});

app.put('/api/policies/:id', policyUpload.single('file'), (req, res) => {
  const idx = policies.findIndex(p => p.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  policies[idx] = {
    ...policies[idx],
    title: req.body.title || policies[idx].title,
    category: req.body.category || policies[idx].category,
    pages: parseInt(req.body.pages) || policies[idx].pages,
    description: req.body.description || policies[idx].description,
    fileUrl: req.file ? `/uploads/policies/${req.file.filename}` : policies[idx].fileUrl,
  };
  saveData();
  res.json(policies[idx]);
});

app.delete('/api/policies/:id', (req, res) => {
  policies = policies.filter(p => p.id != req.params.id);
  saveData();
  res.json({ message: 'Deleted' });
});

// Start
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Saudi Tabreed Portal API running on port ${PORT}`);
    console.log(`Database mode: ${useSQL ? 'SQL Server' : 'JSON fallback'}`);
  });
});
