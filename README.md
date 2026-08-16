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

## Publish it on GitHub Pages

The built site is committed at the repo root, so GitHub Pages serves it with
the default **"Deploy from a branch → main / (root)"** setting. Nothing to
configure.

After changing anything, rebuild and push:

```bash
npm run pages
```

```bash
git add -A && git commit -m "Update celebration" && git push
```

Live at `https://<your-username>.github.io/<repo-name>/`.

### Why the source lives in `app/`

Pages serves the repo root, so the root must hold the *built* `index.html`
and `assets/`. Vite's source entry would otherwise sit at the root too, and
Pages would serve that instead — it points at `/src/main.jsx`, raw JSX that
no browser can run (a 404 for `main.jsx`, blank page). So:

```text
app/        source — index.html + src/   (what you edit)
assets/     built JS + CSS               (generated, committed)
index.html  built entry                  (generated, committed)
```

`npm run pages` builds `app/` and copies the output to the root. Don't hand-
edit the root `index.html` or `assets/` — they're overwritten on every build.

If you'd rather keep build output out of git, switch Pages to
**Settings → Pages → Source → "GitHub Actions"**; the included
`.github/workflows/deploy.yml` builds and deploys on every push, and you can
then delete the root `index.html`, `assets/`, `favicon.svg` and `audio/`.

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
