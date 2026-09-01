/* Minimal static server for verifying the exported site locally: maps
   extension-less paths to their .html file the way Netlify, Vercel and
   CloudFront do, which python -m http.server does not. */
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, 'dist');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json',
  '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.mp4':'video/mp4', '.ico':'image/x-icon',
  '.svg':'image/svg+xml', '.txt':'text/plain', '.xml':'application/xml', '.ttf':'font/ttf' };
http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const tries = [path.join(ROOT, url), path.join(ROOT, url + '.html'), path.join(ROOT, url, 'index.html')];
  for (const f of tries) {
    if (fs.existsSync(f) && fs.statSync(f).isFile()) {
      res.writeHead(200, {
        'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream',
        /* Local verification only: without this the browser keeps serving a
           cached index.html that points at a previous bundle hash. */
        'Cache-Control': 'no-store, must-revalidate',
      });
      return fs.createReadStream(f).pipe(res);
    }
  }
  res.writeHead(404, { 'Content-Type': 'text/html' });
  fs.createReadStream(path.join(ROOT, '+not-found.html')).pipe(res);
}).listen(4174, () => console.log('serving dist on http://localhost:4174'));
