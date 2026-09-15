/**
 * Builds the hero carousel clips from real stock footage.
 *
 * These used to be Ken Burns moves rendered off still photographs, which read
 * as a slideshow rather than film. They are now genuine video: three
 * establishing shots of Nairobi (the company's own city) and two of live
 * construction work.
 *
 * Sources are Pexels, used under the Pexels License (free for commercial use,
 * no attribution required — credited in public/video/CREDITS.md anyway). The
 * large originals are NOT committed; this script downloads them on demand and
 * commits only the graded, web-sized output.
 *
 *   npm run videos            # only missing clips
 *   npm run videos -- --force # re-encode everything
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { createWriteStream, existsSync } from 'node:fs'
import { mkdir, stat } from 'node:fs/promises'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import path from 'node:path'

let ffmpeg
try {
  ffmpeg = (await import('ffmpeg-static')).default
} catch {
  console.error('ffmpeg-static is not installed. Run: npm install ffmpeg-static')
  process.exit(1)
}

const run = promisify(execFile)
const root = path.resolve(import.meta.dirname, '..')
const OUT = path.join(root, 'public', 'video')
const CACHE = path.join(root, '.media-cache')
const force = process.argv.includes('--force')

const FPS = 30
const WIDTH = 1920
const HEIGHT = 1080

/**
 * `start`/`duration` pick the most usable seconds out of each source: the part
 * with the steadiest camera move and no hard cuts.
 */
const CLIPS = [
  {
    name: 'hero-build',
    credit: 'Aerial view of the Nairobi skyline — Pexels 35672574',
    url: 'https://videos.pexels.com/video-files/35672574/15119564_1920_1080_30fps.mp4',
    start: 1,
    duration: 10,
  },
  {
    name: 'hero-structure',
    credit: 'Aerial view of a building under construction — Pexels 38588308',
    url: 'https://videos.pexels.com/video-files/38588308/16389165_2560_1440_25fps.mp4',
    start: 2,
    duration: 10,
  },
  {
    name: 'hero-ontime',
    credit: 'Nairobi cityscape at dusk, Westlands — Pexels 15556119',
    url: 'https://videos.pexels.com/video-files/15556119/15556119-hd_1920_1080_30fps.mp4',
    start: 0,
    duration: 7,
  },
  {
    name: 'hero-finish',
    credit: 'Sunset over the Nairobi cityscape — Pexels 29069413',
    url: 'https://videos.pexels.com/video-files/29069413/12564030_1920_1080_60fps.mp4',
    start: 0,
    duration: 8,
  },
  {
    name: 'hero-supply',
    credit: 'Crew placing concrete on a slab — Pexels 13921040',
    url: 'https://videos.pexels.com/video-files/13921040/13921040-hd_1920_1080_30fps.mp4',
    start: 3,
    duration: 10,
  },
]

/**
 * One grade across every clip so the carousel reads as a single sequence rather
 * than five unrelated stock videos.
 */
function filterChain() {
  return [
    `scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=increase:flags=lanczos`,
    `crop=${WIDTH}:${HEIGHT}`,
    `fps=${FPS}`,
    'eq=contrast=1.06:saturation=0.94:brightness=-0.015',
    'colorbalance=rs=-0.015:bs=0.035',
    'vignette=PI/5',
    'format=yuv420p',
  ].join(',')
}

async function download(url, dest) {
  if (existsSync(dest) && (await stat(dest)).size > 0) return
  console.log(`  downloading ${path.basename(dest)}`)
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${response.status} fetching ${url}`)
  await pipeline(Readable.fromWeb(response.body), createWriteStream(dest))
}

async function encode(clip) {
  const mp4 = path.join(OUT, `${clip.name}.mp4`)
  const poster = path.join(OUT, `${clip.name}.jpg`)

  if (!force && existsSync(mp4) && existsSync(poster)) {
    console.log(`· ${clip.name} — already rendered, skipping`)
    return
  }

  console.log(`▸ ${clip.name}`)
  const source = path.join(CACHE, `${clip.name}.src.mp4`)
  await download(clip.url, source)

  await run(
    ffmpeg,
    [
      '-y',
      // -ss before -i seeks fast; the re-encode below makes it frame-accurate.
      '-ss', String(clip.start),
      '-t', String(clip.duration),
      '-i', source,
      '-vf', filterChain(),
      // Capped bitrate, not just CRF: these play behind a dark scrim and
      // headline text, so fidelity matters far less than the data cost to a
      // visitor on a Kenyan mobile connection.
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '30',
      '-maxrate', '1800k', '-bufsize', '3600k',
      '-profile:v', 'high', '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      '-an',
      mp4,
    ],
    { maxBuffer: 1 << 26 },
  )

  // The poster is the clip's own first frame, so there is no visible jump when
  // playback starts.
  await run(ffmpeg, ['-y', '-i', mp4, '-frames:v', '1', '-q:v', '4', poster], {
    maxBuffer: 1 << 26,
  })
}

await mkdir(OUT, { recursive: true })
await mkdir(CACHE, { recursive: true })
for (const clip of CLIPS) {
  await encode(clip)
}

console.log('\nDone — clips in public/video/')
console.log('Credits:')
for (const clip of CLIPS) console.log(`  ${clip.name}: ${clip.credit}`)
