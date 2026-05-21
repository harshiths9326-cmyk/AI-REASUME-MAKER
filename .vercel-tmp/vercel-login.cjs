#!/usr/bin/env node
const { spawnSync, spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const isWindows = os.platform() === 'win32';
const LOG_FILE = path.join(process.cwd(), '.vercel-tmp', 'login.log');
const ALLOWED_COMMANDS = new Set(['vercel']);
function log(msg) { console.error(msg); }
function commandExists(cmd) {
  if (!ALLOWED_COMMANDS.has(cmd)) throw new Error(`Command not in whitelist: ${cmd}`);
  try {
    if (isWindows) { const r = spawnSync('where', [cmd], { stdio: 'ignore' }); return r.status === 0; }
    else { const r = spawnSync('sh', ['-c', `command -v "$1"`, '--', cmd], { stdio: 'ignore' }); return r.status === 0; }
  } catch { return false; }
}
function getCommandOutput(cmd, args) {
  try { const r = spawnSync(cmd, args, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'], shell: isWindows }); return r.status === 0 ? (r.stdout || '').trim() : null; } catch { return null; }
}
if (!commandExists('vercel')) { log('Error: Vercel CLI not installed'); process.exit(1); }
try {
  const r = spawnSync('vercel', ['whoami'], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], shell: isWindows });
  const out = (r.stdout || '').trim();
  if (r.status === 0 && out && !out.includes('Error') && !out.includes('not logged in')) {
    log('Already logged in as: ' + out);
    console.log(JSON.stringify({ status: 'already_logged_in' }));
    process.exit(0);
  }
} catch {}
log('Starting login authorization...');
const logStream = fs.openSync(LOG_FILE, 'w');
const child = spawn('vercel', ['login'], { detached: true, stdio: ['ignore', logStream, logStream], shell: isWindows });
child.unref();
log(`Background login started (PID: ${child.pid})`);
async function waitForUrl() {
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      if (fs.existsSync(LOG_FILE)) {
        const content = fs.readFileSync(LOG_FILE, 'utf8');
        const m = content.match(/https:\/\/vercel\.com\/oauth\/device\?user_code=[A-Z0-9-]+(?=\s|$)/);
        if (m) return m[0];
      }
    } catch {}
  }
  return null;
}
(async () => {
  const url = await waitForUrl();
  if (url) {
    log('Authorization URL: ' + url);
    try {
      if (os.platform() === 'darwin') spawnSync('open', [url], { stdio: 'ignore' });
      else if (os.platform() === 'win32') spawnSync('powershell', ['-Command', `Start-Process '${url}'`], { stdio: 'ignore', windowsHide: true });
      else spawnSync('xdg-open', [url], { stdio: 'ignore' });
    } catch {}
    console.log(JSON.stringify({ status: 'needs_auth', auth_url: url }));
  } else {
    log('Failed to get auth URL');
    process.exit(1);
  }
})();
