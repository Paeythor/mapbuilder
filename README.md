# MapBuilder

Fantasy map builder web app built with React, Vite, and `tldraw`.

## Features

- infinite canvas world building
- terrain stamps for mountains, forests, water, deserts, hills, cities, rivers, and labels
- save/load locally via browser storage
- export/import map JSON
- grid toggle, center view, zoom-to-fit, and clear canvas

## Run locally

```bash
cd /Users/krypton/Desktop/mapbuilder
npm install
npm run dev
```

Open the local URL shown by Vite in your browser.

## Publish to GitHub

1. Create a new repository on GitHub under `https://github.com/Paeythor` named `mapbuilder`.
2. In this project folder, run:

```bash
git remote add origin https://github.com/Paeythor/mapbuilder.git
git branch -M main
git push -u origin main
```

If the remote already exists, update it with:

```bash
git remote set-url origin https://github.com/Paeythor/mapbuilder.git
```

## GitHub Pages deployment

This project now includes a GitHub Actions workflow to build and deploy the app automatically on every push to `main`.

If you want to host the app using GitHub Pages:

1. Set `base` in `vite.config.js` to `/mapbuilder/`.
2. Install dependencies if you have not already:

```bash
npm install
```

3. Build locally if needed:

```bash
npm run build
```

The workflow will automatically deploy the `dist` output after pushing to `main`.

Your site should then be available at `https://Paeythor.github.io/mapbuilder/`.

## Notes

- The local repository is already initialized and committed.
- The `origin` remote is configured to `https://github.com/Paeythor/mapbuilder.git`.
- If GitHub says the repository is missing, create it on GitHub first, then push.
