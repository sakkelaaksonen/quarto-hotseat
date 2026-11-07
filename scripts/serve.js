// Dev server: serves the project folder with caching turned off, so every
// reload, on any device, gets the current files. No dependencies.
//
//   npm run serve            http://localhost:8000
//   PORT=9000 npm run serve
//
// Listens on all network interfaces, so a phone or tablet on the same
// network can open http://<this computer's IP>:8000. For that reason it
// refuses paths outside the project and hidden files/folders (.git etc.).

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const port = Number(process.env.PORT) || 8000;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

createServer(async (req, res) => {
  const send = (status, body, type = 'text/plain; charset=utf-8') => {
    res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    res.end(body);
  };

  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = resolve(root, `.${normalize(pathname)}`);
    const inside = file === root || file.startsWith(root + sep);
    const hidden = file.slice(root.length).split(sep).some((part) => part.startsWith('.'));
    if (!inside || hidden) {
      send(403, 'Forbidden');
      return;
    }
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    send(200, await readFile(file), types[extname(file)] ?? 'application/octet-stream');
  } catch (err) {
    if (err.code === 'ENOENT') send(404, 'Not found');
    else send(500, 'Server error');
  }
}).listen(port, () => {
  console.log(`Serving ${root} on http://localhost:${port} (caching off)`);
});
