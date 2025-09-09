const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.LOCAL_DOCS_PORT || 4010;
const DOCS_DIR = path.join(__dirname);

// Helper function to clean HTML content
function cleanHtml(html) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Extract title from HTML
function extractTitle(html) {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : null;
}

// Load README mapping
function loadReadmeMapping() {
  const readmePath = path.join(DOCS_DIR, 'README.md');
  const mapping = {};
  
  if (fs.existsSync(readmePath)) {
    const content = fs.readFileSync(readmePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach(line => {
      const match = line.match(/^- (doc_\d{3}\.html) — (.+?) — (.+?)$/);
      if (match) {
        mapping[match[1]] = {
          subject: match[2],
          url: match[3]
        };
      }
    });
  }
  
  return mapping;
}

// Get list of documentation files
function getDocsList() {
  const files = fs.readdirSync(DOCS_DIR)
    .filter(file => file.match(/^doc_\d{3}\.html$/))
    .sort();
  
  const mapping = loadReadmeMapping();
  const items = [];
  
  files.forEach(file => {
    const filePath = path.join(DOCS_DIR, file);
    const stats = fs.statSync(filePath);
    const html = fs.readFileSync(filePath, 'utf8');
    const title = extractTitle(html) || file.replace('.html', '');
    
    const item = {
      id: file.replace('.html', ''),
      file: file,
      title: title,
      sizeBytes: stats.size
    };
    
    if (mapping[file]) {
      item.subject = mapping[file].subject;
      item.url = mapping[file].url;
    }
    
    items.push(item);
  });
  
  return {
    total: items.length,
    items: items
  };
}

// Get document content
function getDocument(id, mode = 'text') {
  if (!id.match(/^doc_\d{3}$/)) {
    return null;
  }
  
  const filePath = path.join(DOCS_DIR, `${id}.html`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const html = fs.readFileSync(filePath, 'utf8');
  
  if (mode === 'html') {
    return { content_html: html };
  } else {
    return { content_text: cleanHtml(html) };
  }
}

// Search in documents
function searchDocuments(query) {
  if (!query) return [];
  
  const files = fs.readdirSync(DOCS_DIR)
    .filter(file => file.match(/^doc_\d{3}\.html$/));
  
  const results = [];
  const queryLower = query.toLowerCase();
  
  files.forEach(file => {
    const filePath = path.join(DOCS_DIR, file);
    const html = fs.readFileSync(filePath, 'utf8');
    const text = cleanHtml(html);
    const textLower = text.toLowerCase();
    
    const index = textLower.indexOf(queryLower);
    if (index !== -1) {
      const title = extractTitle(html) || file.replace('.html', '');
      
      // Create snippet around the match
      const start = Math.max(0, index - 120);
      const end = Math.min(text.length, index + 120);
      let snippet = text.substring(start, end);
      
      if (start > 0) snippet = '...' + snippet;
      if (end < text.length) snippet = snippet + '...';
      
      results.push({
        id: file.replace('.html', ''),
        file: file,
        title: title,
        score: 1, // Simple scoring
        snippet: snippet
      });
    }
  });
  
  return results.slice(0, 10); // Top 10 results
}

// HTTP Server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  try {
    if (pathname === '/list') {
      const result = getDocsList();
      res.writeHead(200);
      res.end(JSON.stringify(result, null, 2));
      
    } else if (pathname === '/get') {
      const id = query.id;
      const mode = query.mode || 'text';
      
      if (!id) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Missing id parameter' }));
        return;
      }
      
      const result = getDocument(id, mode);
      if (!result) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Document not found' }));
        return;
      }
      
      res.writeHead(200);
      res.end(JSON.stringify(result, null, 2));
      
    } else if (pathname === '/search') {
      const q = query.q;
      
      if (!q) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Missing q parameter' }));
        return;
      }
      
      const results = searchDocuments(q);
      res.writeHead(200);
      res.end(JSON.stringify(results, null, 2));
      
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not found' }));
    }
    
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

server.listen(PORT, () => {
  console.log(`📚 Documentation server running on http://localhost:${PORT}`);
  console.log(`📋 Endpoints:`);
  console.log(`   GET /list - List all documents`);
  console.log(`   GET /get?id=doc_XXX[&mode=html|text] - Get document content`);
  console.log(`   GET /search?q=query - Search documents`);
});

module.exports = server;
