#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const skillsDir = path.join(__dirname, '..', 'skills')

function listSkillPaths(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => path.join(dir, d.name, 'SKILL.md'))
}

function readFrontmatter(file) {
  if (!fs.existsSync(file)) return null
  const content = fs.readFileSync(file, 'utf8')
  const m = content.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return null
  const fm = {}
  const body = m[1]
  body.split(/\n/).forEach(line => {
    const kv = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/)
    if (kv) {
      const key = kv[1]
      let val = kv[2].trim()
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1)
      fm[key] = val
    }
  })
  return fm
}

function validate() {
  const paths = listSkillPaths(skillsDir)
  const results = []
  for (const p of paths) {
    const dir = path.basename(path.dirname(p))
    const fm = readFrontmatter(p)
    const entry = { file: p, dir, ok: true, issues: [] }
    if (!fm) {
      entry.ok = false
      entry.issues.push('Missing or invalid YAML frontmatter')
    } else {
      if (!fm.name) {
        entry.ok = false
        entry.issues.push('Missing `name` in frontmatter')
      } else if (fm.name !== dir) {
        entry.ok = false
        entry.issues.push(`name '${fm.name}' does not match directory '${dir}'`)
      }
      if (!fm.description) {
        entry.ok = false
        entry.issues.push('Missing `description` in frontmatter')
      } else if (fm.description.length > 1024) {
        entry.issues.push('description longer than 1024 chars')
      }
    }
    results.push(entry)
  }
  return results
}

function main() {
  const res = validate()
  let fail = 0
  for (const r of res) {
    if (!r.ok) {
      fail++
      console.log('ERROR:', r.file)
      for (const i of r.issues) console.log('  -', i)
    }
  }
  console.log('\nSummary:', res.length, 'skills scanned,', fail, 'issues')
  if (fail > 0) process.exitCode = 2
}

main()
