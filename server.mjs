import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('./dist/', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const requested = decodeURIComponent(url.pathname);
    const filename = path.resolve(root, '.' + (requested.endsWith('/') ? requested + 'index.html' : requested));
    if (!filename.startsWith(path.resolve(root) + path.sep)) { res.writeHead(403); res.end('Forbidden'); return; }
    const bytes = await readFile(filename);
    res.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(bytes);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(4173, '127.0.0.1', () => console.log('MindGarden: http://127.0.0.1:4173'));
