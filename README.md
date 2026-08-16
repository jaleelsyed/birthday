# Atelier of Light — an interactive birthday celebration

A cinematic, luxury one-screen birthday experience. The room lights up,
balloons rise, a cake is presented, wishes float into the night, and the
sky fills with fireworks — each moment revealed by the person celebrating,
at their own pace.

Built with **React + Vite + Tailwind CSS + Framer Motion**, with HTML5
Canvas for the sparkles and fireworks and a Web Audio score so there is
beautiful sound out of the box.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (defaults to http://localhost:5188).

Build for production:

```bash
npm run build
npm run preview
```

## Publish it on GitHub Pages (free)

This is a static site once built, so GitHub can host it for free. A workflow
is already included at `.github/workflows/deploy.yml` — it builds and
publishes automatically.

1. Create a new repo on GitHub and push this folder to it:

   ```bash
   git init
   git add .
   git commit -m "Birthday celebration site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

2. On GitHub: **Settings → Pages → Build and deployment → Source →
   "GitHub Actions"**. (You only do this once.)

3. Every push to `main` now builds and deploys. Your site goes live at:

   ```
   https://<your-username>.github.io/<repo-name>/
   ```

   The Actions tab shows progress and the final URL.

> Prefer not to use Actions? Run `npm run build` locally and drop the
> contents of the `dist/` folder onto any static host (GitHub Pages via the
> `gh-pages` branch, Netlify, Vercel, Cloudflare Pages — all work).

## Make it yours

Everything you'd want to change lives in **one file**:

```
src/config/celebrationConfig.js
```

- `name` — who it's for
- `signature` — the closing line under HAPPY BIRTHDAY
- `stages.*` — the words spoken at each moment
- `wishes` — the wishes that float up from the cake
- `balloonColors` / `fireworkColors` — the palette of the celebration
- `music.src` — your own track (see below)

### Music

Out of the box the site plays a **music-box arrangement of "Happy Birthday"**
(traditional melody, public domain) synthesized live in the browser — with a
waltz accompaniment that swells as the celebration builds. No audio file is
shipped, which keeps the repo small and avoids any licensing question when
you publish it publicly on GitHub.

To use your own track instead, drop an MP3 at
`public/audio/birthday-celebration.mp3`. It's picked up automatically and
takes over from the synth. A mute / unmute control sits in the top-right.

## The flow

`Let's Start ✨ → Light Up the Room 💡 → Release the Balloons 🎈 →
Bring Out the Cake 🎂 → Make a Wish ✨ → the Wishes 💫 →
Light Up the Sky 🎆 → HAPPY BIRTHDAY ❤️`

Each stage waits for the celebrant to press the glowing button before
moving on.

## Components

| Component | Moment |
|-----------|--------|
| `BirthdayIntro` | The invitation & "Let's Start" |
| `RoomLighting` | The room wakes up, light by light |
| `BalloonRelease` | Balloons rise with natural drift |
| `BirthdayCake` | The cake is presented under a spotlight |
| `MakeAWish` | Candles go out, particles lift |
| `WishReveal` | Wishes float up as handwritten script |
| `Fireworks` | Night sky + the grand finale |
| `MusicController` | Mute / unmute the score |

Supporting pieces: `Cake`, `Balloon`, `ambient/SparkleField`,
`ambient/CornerFlorals`, `ui/StageButton`, `ui/SceneCopy`.

## Accessibility

Respects `prefers-reduced-motion` (animations settle instead of looping),
keyboard-focusable controls with visible focus rings, and semantic headings.
```
