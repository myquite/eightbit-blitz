# Druid Isle — Chiptune Studio

A browser-based retro music studio built with HTML, CSS, and vanilla JavaScript. No build step, backend, or API keys required.

## Features

- Four NES-inspired voices: lead, harmony, bass, and drums
- Seeded compositions and island mood presets
- Editable piano roll, chord changes, track mute and solo
- Tempo, scale, swing, crunch, and echo controls
- Sound-effect presets and custom synthesis
- WAV downloads and JSON song import/export
- Automatic song saving in browser local storage

## Run locally

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. Click Play or press Space to start audio. Choose a mood or compose a new tune; edit notes in the piano roll. Save song downloads a portable JSON backup; Render .wav exports audio.

## Project structure

- `index.html`: semantic page structure and controls
- `css/styles.css`: responsive pixel-art interface
- `js/app.js`: composition, Web Audio synthesis, canvas visuals, persistence, and exports
- `favicon.svg`: local site icon

## Hosting

Deploy the repository root with GitHub Pages from the `main` branch. All application asset paths are relative and support repository subpaths. `.nojekyll` disables Jekyll processing.

A modern browser with Web Audio and Canvas support is required. Fonts load from Google Fonts with local monospace fallbacks. Songs stay on the current browser/device unless exported. The piano roll currently uses pointer/touch input.
