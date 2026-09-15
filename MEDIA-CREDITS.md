# Media credits

Harriscom's own project photography is used throughout `/projects` and for the
construction and renovation service cards. Those images are the company's and
are **not** interchangeable with stock — they are presented as work Harriscom
actually delivered.

Where no suitable in-house asset existed, licensed stock was used instead. All
of it is free for commercial use with no attribution required; it is credited
here anyway so the provenance of every asset is traceable.

## Hero video — Pexels License

Rendered to `public/video/` by `npm run videos`
(see `scripts/generate-videos.mjs` for the exact trim and grade).

| Clip | Subject | Source |
|---|---|---|
| `hero-build` | Aerial view of the Nairobi skyline | [Pexels 35672574](https://www.pexels.com/video/aerial-view-of-nairobi-modern-skyline-35672574/) |
| `hero-structure` | Aerial view of a building under construction | [Pexels 38588308](https://www.pexels.com/video/aerial-view-of-building-construction-site-38588308/) |
| `hero-ontime` | Nairobi cityscape at dusk, Westlands | [Pexels 15556119](https://www.pexels.com/video/timelapse-of-african-city-scape-kenya-westland-15556119/) |
| `hero-finish` | Sunset over the Nairobi cityscape | [Pexels 29069413](https://www.pexels.com/video/sunset-over-nairobi-cityscape-aerial-view-29069413/) |
| `hero-supply` | Crew placing concrete on a slab | [Pexels 13921040](https://www.pexels.com/video/men-working-on-construction-site-13921040/) |

Three of the five are Nairobi itself. The two work clips are location-neutral —
Pexels had no construction-site footage with a visibly Kenyan crew that was
usable at hero scale, so those shots keep the work in frame rather than faces.
**Replacing them with Harriscom's own site footage would be a straight upgrade**
— phone video of a live site beats any stock library here. Drop the files into
`.media-cache/` as `hero-<name>.src.mp4` and run `npm run videos -- --force`.

## Service photography — Unsplash License

| File | Subject | Source |
|---|---|---|
| `public/images/service-electrical.jpg` | Electrician wiring a distribution point | [Unsplash, Emmanuel Ikwuegbu](https://unsplash.com/photos/_2AlIm-F6pw) |
| `public/images/service-supplies.jpg` | Site worker stacking concrete blocks | [Unsplash](https://unsplash.com/photos/-SYOWCWxH3Q) |
| `public/images/service-interior.jpg` | Finished modern interior | [Unsplash](https://unsplash.com/photos/jBS68jawjm8) |

These three replaced images that did not match their service at all — the
General Supplies card was previously a photograph of computer monitors.

## Licences

- [Pexels License](https://www.pexels.com/license/) — free for commercial use, no attribution required.
- [Unsplash License](https://unsplash.com/license) — free for commercial use, no permission needed.
