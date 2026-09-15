/**
 * Generates the hero carousel clips.
 *
 * Harriscom has no stock footage, only site photography, so each clip is a
 * cinematic Ken Burns move rendered off one of their own project photos —
 * real .mp4 files, not a CSS animation pretending to be video.
 *
 *   npm run videos            # only missing clips
 *   npm run videos -- --force # re-encode everything
 *
 * ffmpeg-static is an optional dependency: the rendered clips are committed, so
 * a deployment build never needs the 80MB binary and must not fail if the
 * download is unavailable.
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
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
const IMAGES = path.join(root, 'public', 'images')
const OUT = path.join(root, 'public', 'video')
const force = process.argv.includes('--force')

const FPS = 25
const SECONDS = 9
const FRAMES = FPS * SECONDS
// Render the pan on an oversized canvas so the crop never reveals soft pixels.
const CANVAS = { w: 2560, h: 1440 }
const OUTPUT = { w: 1920, h: 1080 }

/** zoompan expressions per move. `on` is the output frame index. */
const MOVES = {
  pushIn: {
    z: `min(1+0.20*on/${FRAMES},1.20)`,
    x: '(iw-iw/zoom)/2',
    y: '(ih-ih/zoom)/2',
  },
  pullOut: {
    z: `max(1.20-0.20*on/${FRAMES},1)`,
    x: '(iw-iw/zoom)/2',
    y: '(ih-ih/zoom)/2',
  },
  panRight: {
    z: '1.16',
    x: `(iw-iw/zoom)*on/${FRAMES}`,
    y: '(ih-ih/zoom)/2',
  },
  panLeft: {
    z: '1.16',
    x: `(iw-iw/zoom)*(1-on/${FRAMES})`,
    y: '(ih-ih/zoom)/2',
  },
  craneUp: {
    z: `min(1+0.14*on/${FRAMES},1.14)`,
    x: '(iw-iw/zoom)/2',
    y: `(ih-ih/zoom)*(1-on/${FRAMES})`,
  },
}

const CLIPS = [
  { name: 'hero-build', source: 'hero-5.jpg', move: 'pushIn' },
  { name: 'hero-skyline', source: 'hero-6.jpg', move: 'panRight' },
  { name: 'hero-roads', source: 'hero-2.jpg', move: 'craneUp' },
  { name: 'hero-finish', source: 'hero-7.jpg', move: 'pullOut' },
  { name: 'hero-supply', source: 'service-4.jpg', move: 'panLeft' },
]

function filterChain(move) {
  const m = MOVES[move]
  return [
    // Cover the canvas whatever the source aspect ratio is.
    `scale=${CANVAS.w}:${CANVAS.h}:force_original_aspect_ratio=increase:flags=lanczos`,
    `crop=${CANVAS.w}:${CANVAS.h}`,
    // Cinematic grade: a touch cooler, richer and slightly contrastier than the
    // raw phone photos, so the clips sit together as one sequence.
    'eq=contrast=1.08:saturation=1.06:brightness=-0.015',
    'colorbalance=rs=-0.02:bs=0.04',
    `zoompan=z='${m.z}':x='${m.x}':y='${m.y}':d=1:s=${OUTPUT.w}x${OUTPUT.h}:fps=${FPS}`,
    'vignette=PI/5',
    'format=yuv420p',
  ].join(',')
}

async function encode(clip) {
  const src = path.join(IMAGES, clip.source)
  if (!existsSync(src)) throw new Error(`missing source image: ${clip.source}`)

  const mp4 = path.join(OUT, `${clip.name}.mp4`)
  const poster = path.join(OUT, `${clip.name}.jpg`)

  if (!force && existsSync(mp4) && existsSync(poster)) {
    console.log(`· ${clip.name} — already rendered, skipping`)
    return
  }

  console.log(`▸ ${clip.name} — ${clip.move} on ${clip.source}`)
  await run(ffmpeg, [
    '-y', '-loop', '1', '-framerate', String(FPS), '-i', src,
    '-frames:v', String(FRAMES),
    '-vf', filterChain(clip.move),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '27',
    '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', '-an',
    mp4,
  ], { maxBuffer: 1 << 26 })

  // The poster is the clip's own first frame, so there is no visible jump
  // between the lazy-loaded placeholder and playback starting.
  await run(ffmpeg, [
    '-y', '-i', mp4, '-frames:v', '1', '-q:v', '4', poster,
  ], { maxBuffer: 1 << 26 })
}

await mkdir(OUT, { recursive: true })
for (const clip of CLIPS) {
  await encode(clip)
}
console.log('\nDone — clips in public/video/')
