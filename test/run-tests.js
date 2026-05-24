import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(root, 'src', 'cli.js');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pr-story-'));

function git(args) {
  return execFileSync('git', args, { cwd: tmp, encoding: 'utf8' });
}

function run(args = []) {
  return execFileSync(process.execPath, [cli, ...args], { cwd: tmp, encoding: 'utf8' });
}

git(['init', '-b', 'main']);
git(['config', 'user.email', 'test@example.com']);
git(['config', 'user.name', 'Test User']);
fs.mkdirSync(path.join(tmp, 'src'));
fs.writeFileSync(path.join(tmp, 'src', 'app.js'), 'console.log("v1");\n');
fs.writeFileSync(path.join(tmp, 'README.md'), '# Demo\n');
git(['add', '.']);
git(['commit', '-m', 'initial']);

fs.writeFileSync(path.join(tmp, 'src', 'app.js'), 'console.log("v2");\n');
fs.writeFileSync(path.join(tmp, 'README.md'), '# Demo\n\nUpdated docs.\n');

const story = run();
assert.match(story, /# PR Story/);
assert.match(story, /src\/app\.js/);
assert.match(story, /README\.md/);
assert.match(story, /Suggested verification/);

console.log('pr-story tests passed');
