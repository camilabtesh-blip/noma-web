import {createClient} from '@sanity/client'
import fs from 'fs'
import path from 'path'
import os from 'os'

const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config', 'sanity', 'config.json'), 'utf8'))
const client = createClient({
  projectId: 'xz8a6oqx',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: cfg.authToken,
  useCdn: false,
})

const SITE_ROOT = '/Users/CamilaBtesh/web noma'
const herData = JSON.parse(fs.readFileSync('/tmp/her_edits_projects.json', 'utf8'))

const AFFECTED = ['mendoza', 'fraga', 'mine', 'parana', 'cabrera', 'dormitorio-juanita']
const YEAR_FIXES = {'dormitorio-juanita': '2025'} // typo fix: she typed "205"

async function uploadImage(relPath) {
  const filePath = path.join(SITE_ROOT, relPath.replace(/^\//, ''))
  const buffer = fs.readFileSync(filePath)
  const asset = await client.assets.upload('image', buffer, {filename: path.basename(filePath)})
  return asset._id
}

async function main() {
  for (const slug of AFFECTED) {
    const p = herData.projects.find((x) => x.slug === slug)
    if (!p) continue
    console.log(`\n${slug}: updating with ${p.photos.length} photo entries`)

    const photos = []
    for (const ph of p.photos) {
      if (!ph.src) {
        console.log('  skipping malformed entry (no image attached)')
        continue
      }
      const assetId = await uploadImage(ph.src)
      photos.push({
        _type: 'photo',
        _key: Math.random().toString(36).slice(2, 10),
        image: {_type: 'image', asset: {_type: 'reference', _ref: assetId}},
        width: ph.width || 'full',
      })
      process.stdout.write('.')
    }

    await client.patch(`project-${slug}`).set({
      year: YEAR_FIXES[slug] || p.year || '',
      photographer: p.photographer || '',
      photos,
    }).commit()
    console.log(` -> project-${slug} updated`)
  }

  // upload the leftover files that were dragged into Decap's media library
  // but never attached to a project, so nothing gets lost.
  console.log('\nUploading unattached uploads as library assets...')
  const orphans = [
    '38_dsc2122-copia.jpg', '50_dsc2152-copia.jpg', '1_dsc2062-copia.jpg',
    '31_dsc2094-copia.jpg', '4_dsc2076-copia.jpg',
    'img_6863.heic', 'img_6868.heic', 'img_6878.heic', 'img_6880.heic',
  ]
  for (const f of orphans) {
    const fp = path.join(SITE_ROOT, 'assets/img/proyectos', f)
    if (!fs.existsSync(fp)) { console.log(`  missing: ${f}`); continue }
    await client.assets.upload('image', fs.readFileSync(fp), {filename: f})
    process.stdout.write('.')
  }
  console.log('\nDone.')
}

main().catch((err) => { console.error(err); process.exit(1) })
