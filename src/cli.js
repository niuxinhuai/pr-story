#!/usr/bin/env node
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`pr-story

Usage:
  pr-story [--base HEAD] [--staged] [--json]

Turns a git diff into a reviewer-friendly change story.`);
  process.exit(0);
}

function git(params) {
  return execFileSync('git', params, { encoding: 'utf8' }).trim();
}

const baseIndex = args.indexOf('--base');
const base = baseIndex >= 0 ? args[baseIndex + 1] : 'HEAD';
const staged = args.includes('--staged');
const json = args.includes('--json');
const diffArgs = staged ? ['diff', '--cached'] : ['diff', base];

let nameStatus = '';
let stat = '';
try {
  nameStatus = git([...diffArgs, '--name-status']);
  stat = git([...diffArgs, '--stat']);
} catch (error) {
  console.error('pr-story must be run inside a git repository.');
  process.exit(1);
}

const files = nameStatus.split('\n').filter(Boolean).map((line) => {
  const [status, ...rest] = line.split(/\s+/);
  return { status, path: rest.join(' ') };
});

const risky = files.filter((file) => /lock|config|migration|schema|auth|security|payment|delete|remove/i.test(file.path) || file.status.startsWith('D'));
const tests = files.filter((file) => /test|spec|__tests__/i.test(file.path));
const docs = files.filter((file) => /README|docs?\//i.test(file.path));
const source = files.filter((file) => !tests.includes(file) && !docs.includes(file));
const result = {
  base,
  staged,
  filesChanged: files.length,
  sourceFiles: source.map((file) => file.path),
  testFiles: tests.map((file) => file.path),
  docFiles: docs.map((file) => file.path),
  riskFiles: risky.map((file) => file.path),
  stat
};

if (json) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

console.log(`# PR Story

## What changed
${source.length ? source.map((file) => `- ${file.status} ${file.path}`).join('\n') : '- No source changes detected.'}

## Tests touched
${tests.length ? tests.map((file) => `- ${file.path}`).join('\n') : '- No test files detected.'}

## Docs touched
${docs.length ? docs.map((file) => `- ${file.path}`).join('\n') : '- No docs detected.'}

## Risk notes
${risky.length ? risky.map((file) => `- Review carefully: ${file.path}`).join('\n') : '- No obvious high-risk files detected.'}

## Suggested verification
- Run the project test suite.
- Manually exercise changed user paths.
${risky.length ? '- Add targeted checks for config/schema/security-sensitive paths.' : '- Skim the diff for behavior changes that are not covered by tests.'}

## Diff stat
${stat || 'No diff.'}
`);
