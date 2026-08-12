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
const projectsData = JSON.parse(fs.readFileSync(path.join(SITE_ROOT, 'content/projects.json'), 'utf8'))

async function uploadImage(relPath) {
  const filePath = path.join(SITE_ROOT, relPath.replace(/^\//, ''))
  const buffer = fs.readFileSync(filePath)
  const asset = await client.assets.upload('image', buffer, {filename: path.basename(filePath)})
  return asset._id
}

async function main() {
  console.log(`Migrating ${projectsData.projects.length} projects...`)
  for (let i = 0; i < projectsData.projects.length; i++) {
    const p = projectsData.projects[i]
    console.log(`\n[${i + 1}/${projectsData.projects.length}] ${p.slug} (${p.photos.length} photos)`)

    const photos = []
    for (const photo of p.photos) {
      const assetId = await uploadImage(photo.src)
      photos.push({
        _type: 'photo',
        _key: Math.random().toString(36).slice(2, 10),
        image: {_type: 'image', asset: {_type: 'reference', _ref: assetId}},
        width: photo.width,
      })
      process.stdout.write('.')
    }

    await client.createOrReplace({
      _id: `project-${p.slug}`,
      _type: 'project',
      name: p.name,
      slug: {_type: 'slug', current: p.slug},
      subtitle: p.subtitle,
      year: p.year || '',
      photographer: p.photographer || '',
      order: i,
      photos,
    })
    console.log(` -> saved project-${p.slug}`)
  }

  // upload broader candidate pools as loose assets (not attached to any document)
  // so they show up in Sanity's media library for picking later.
  console.log('\nUploading broader photo pools as library assets...')
  const projDir = path.join(SITE_ROOT, 'assets/img/proyectos')
  for (const slug of fs.readdirSync(projDir)) {
    const dir = path.join(projDir, slug)
    if (!fs.statSync(dir).isDirectory()) continue
    const pool = fs.readdirSync(dir).filter((f) => f.startsWith('pool-'))
    for (const f of pool) {
      const buffer = fs.readFileSync(path.join(dir, f))
      await client.assets.upload('image', buffer, {filename: `${slug}-${f}`})
      process.stdout.write('.')
    }
    if (pool.length) console.log(` ${slug}: ${pool.length} pool images uploaded`)
  }

  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
