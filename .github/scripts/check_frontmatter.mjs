import fs from 'fs/promises'
import path from 'path'

async function findMd(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  let files = []
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) files = files.concat(await findMd(p))
    else if (e.isFile() && e.name.endsWith('.md')) files.push(p)
  }
  return files
}

function hasFrontmatter(content) {
  if (!content.startsWith('---')) return false
  const end = content.indexOf('\n---', 3)
  if (end === -1) return false
  const block = content.slice(3, end)
  return /\n?name:\s*.+/m.test(block) && /\n?description:\s*.+/m.test(block)
}

async function main() {
  const root = path.resolve(process.cwd(), 'skills')
  const files = await findMd(root)
  let ok = true
  for (const f of files) {
    const c = await fs.readFile(f, 'utf8')
    if (!hasFrontmatter(c)) {
      console.error('Missing/frontmatter keys in', f)
      ok = false
    }
  }
  if (!ok) process.exit(2)
  console.log('Frontmatter check passed for', files.length, 'markdown files')
}

main().catch(err=>{console.error(err); process.exit(1)})
