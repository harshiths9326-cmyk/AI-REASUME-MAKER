#!/usr/bin/env node
const { spawnSync } = require('child_process');
const os = require('os');
const isWindows = os.platform() === 'win32';
function log(msg) { console.error(msg); }
log('Deploying to Vercel production...');
log('');
const args = ['--prod', '--yes'];
const result = spawnSync('vercel.cmd', args, {
  cwd: process.cwd(),
  encoding: 'utf8',
  stdio: ['inherit', 'pipe', 'pipe'],
  timeout: 300000,
  shell: false
});
const output = (result.stdout || '') + (result.stderr || '');
log(output);
if (result.status !== 0) {
  log('Deploy failed');
  process.exit(1);
}
const aliasedMatch = output.match(/Aliased:\s*(https:\/\/[a-zA-Z0-9.-]+\.vercel\.app)/i);
const deployMatch = output.match(/Production:\s*(https:\/\/[a-zA-Z0-9.-]+\.vercel\.app)/i);
const finalUrl = aliasedMatch ? aliasedMatch[1] : (deployMatch ? deployMatch[1] : null);
if (finalUrl) {
  log('Deployment successful!');
  console.log(JSON.stringify({ status: 'success', url: finalUrl }));
} else {
  console.log(JSON.stringify({ status: 'success', message: 'Deployed' }));
}
