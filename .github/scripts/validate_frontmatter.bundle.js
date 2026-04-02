#!/usr/bin/env node
// Dependency-free frontmatter validator bundle
// Scans `agents/` and `skills/` markdown files and ensures YAML frontmatter
// exists and includes non-empty `name` and `description` keys.

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')

const FRONT_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/

function walkDir(dir) {
  const results = []
  if (!fs.existsSync(dir)) return results
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...walkDir(full))
    } else if (entry.isFile() && full.endsWith('.md')) {
      results.push(full)
    }
  }
  return results
}

function collectTargets() {
  const targets = []
  const agentsDir = path.join(ROOT, 'agents')
  const skillsDir = path.join(ROOT, 'skills')
  if (fs.existsSync(agentsDir)) targets.push(...walkDir(agentsDir))
  if (fs.existsSync(skillsDir)) targets.push(...walkDir(skillsDir))
  return targets
}

function parseFrontmatter(text) {
  const m = FRONT_RE.exec(text)
  if (!m) return null
  const block = m[1]
  const data = {}
  // Very small YAML-like parser: parse top-level `key: value` pairs only.
  const lines = block.split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line || line.startsWith('#')) continue
    const kv = line.match(/^([A-Za-z0-9_\-]+):\s*(.*)$/)
    if (kv) {
      const k = kv[1]
      let v = kv[2]
      // handle simple quoted values
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1)
      }
      data[k] = v
    }
    // ignore other YAML constructs (blocks, lists) — keep validator simple and robust
  }
  return data
}

function validateFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8')
  const front = parseFrontmatter(text)
  if (!front) return { ok: false, reason: 'missing YAML frontmatter' }
  const name = front.name
  const desc = front.description
  if (!name || String(name).trim() === '') return { ok: false, reason: 'missing or empty `name`' }
  if (!desc || String(desc).trim() === '') return { ok: false, reason: 'missing or empty `description`' }
  return { ok: true }
}

function main() {
  const files = collectTargets()
  if (files.length === 0) {
    console.log('No agent or skill markdown files found to validate.')
    return 0
  }
  const errors = []
  for (const f of files.sort()) {
    const res = validateFile(f)
    if (!res.ok) errors.push(`${path.relative(ROOT, f)}: ${res.reason}`)
  }
  if (errors.length) {
    console.error('Frontmatter validation failed:')
    for (const e of errors) console.error('- ' + e)
    process.exitCode = 1
    return 1
  }
  console.log('All agent and skill frontmatter OK (bundle validator)')
  return 0
}

if (require.main === module) main()
