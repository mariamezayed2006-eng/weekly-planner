# Mariam’s Little Weekly Planner 🎀

A cozy, interactive weekly planner built with **React + Vite** and modern CSS —
pink-and-latte aesthetic, live dashboard stats, interactive checkboxes,
automatic `localStorage` persistence, per-day and full-week resets, and a
purpose-built mobile layout.

## Run it locally

```bash
npm install
npm run dev
```

Then open the printed URL (usually **http://localhost:5173**) in your browser.

Other commands:

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
npm test          # plain-Node tests for schedule data, progress math,
                  # localStorage persistence, and reset behavior
```

## Features

- **Welcome dashboard** with live date, weekly completion %, task counts,
  a weekly progress bar, the selected day’s %, and motivational messages
  that update with real progress.
- **7-day navigation** with a “Today” badge from the device’s local date,
  per-day mini progress bars, and horizontally scrolling tabs on mobile.
- **The full weekly schedule** — every entry (including meals, sleep, coffee
  and overlapping blocks) has its own checkbox and stable ID.
- **Persistence** — every checkbox change saves instantly to `localStorage`
  and is restored on reload. Progress stays on this device/browser and is
  *not* synced across devices.
- **Reset controls** — “Reset this day” (only the selected day) and
  “Reset all tasks” (the whole week), each with a confirmation dialog.
  Canceling leaves everything untouched.
- **Accessibility** — keyboard-navigable checkboxes/tabs/buttons, visible
  focus states, aria labels, status announcements, and support for the
  `prefers-reduced-motion` preference.

## Project structure

```
index.html              document entry point (fonts, meta, root div)
src/main.jsx            React entry point
src/App.jsx             main application, state, layout
src/styles.css          complete responsive styling
src/data/schedule.js    structured weekly schedule + progress/persistence logic
src/components/
  TaskRow.jsx           one checkbox task row
  ProgressBar.jsx       reusable animated progress bar
  ConfirmDialog.jsx     accessible confirmation modal
test/run-tests.mjs      plain-Node tests (npm test)
```

## Publishing

Any static host works — everything deploys from the built `dist/` folder:

- **Vercel / Netlify:** import the repo, framework preset “Vite”, build
  command `npm run build`, output directory `dist`.
- **GitHub Pages:** run `npm run build`, then publish `dist/` (e.g. with
  `npx gh-pages -d dist`). Because the app uses relative asset paths by
  default, set `base: "./"` in `vite.config.js` for subdirectory hosting.

Made with 🤍 for Mariam.
