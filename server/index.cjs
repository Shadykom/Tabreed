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

// Start
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Saudi Tabreed Portal API running on port ${PORT}`);
    console.log(`Database mode: ${useSQL ? 'SQL Server' : 'JSON fallback'}`);
  });
});
