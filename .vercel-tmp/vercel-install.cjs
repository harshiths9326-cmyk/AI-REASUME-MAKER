#!/usr/bin/env node
const { spawnSync } = require('child_process');
const os = require('os');
const isWindows = os.platform() === 'win32';
const ALLOWED_COMMANDS = new Set(['node', 'npm', 'pnpm', 'yarn', 'vercel']);
function log(msg) { console.error(msg); }
function commandExists(cmd) {
  if (!ALLOWED_COMMANDS.has(cmd)) throw new Error(`Command not in whitelist: ${cmd}`);
  try {
    if (isWindows) { const result = spawnSync('where', [cmd], { stdio: 'ignore' }); return result.status === 0; }
    else { const result = spawnSync('sh', ['-c', `command -v "$1"`, '--', cmd], { stdio: 'ignore' }); return result.status === 0; }
  } catch { return false; }
}
function getCommandOutput(cmd, args) {
  try { const result = spawnSync(cmd, args, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'], shell: isWindows }); return result.status === 0 ? (result.stdout || '').trim() : null; } catch { return null; }
}
if (!commandExists('node')) { log('Error: Node.js not installed'); process.exit(1); }
if (commandExists('vercel')) { log('Vercel CLI already installed: ' + (getCommandOutput('vercel', ['--version']) || 'unknown')); console.log(JSON.stringify({ status: 'already_installed' })); process.exit(0); }
const pkgManager = commandExists('npm') ? 'npm' : null;
if (!pkgManager) { log('Error: No package manager found'); process.exit(1); }
log('Installing Vercel CLI...');
const result = spawnSync('npm', ['install', '-g', 'vercel'], { stdio: 'inherit', shell: isWindows });
if (result.status !== 0) { log('Installation failed'); process.exit(1); }
log('Vercel CLI installed!');
console.log(JSON.stringify({ status: 'success' }));
