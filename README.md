# Annuity

React + Vite app for exploring ordinary annuity future value: user-adjustable payment, rate, and period count drive computed totals and charts. Core logic and layout are in `Annuity.jsx`.

**Live site:** [https://content-interactives.github.io/annuity](https://content-interactives.github.io/annuity)

Curriculum alignment and placement: [Standards.md](Standards.md).

---

## Stack

| Layer | Notes |
|--------|--------|
| Build | Vite 6, `@vitejs/plugin-react` |
| UI | React 19 |
| Styling | Tailwind 3 |
| Icons | lucide-react |
| Deploy | `gh-pages -d dist`; `predeploy` runs `vite build` |

---

## Layout

```
vite.config.js          # base: '/annuity/'
src/
  main.jsx → App.jsx → components/Annuity.jsx
  components/ui/
```

---

## `vite.config.js`

`base: '/annuity/'` must match the GitHub Pages repository path.

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run deploy` | Build and push `dist/` to `gh-pages` |

---

## Embedding

Uses shared shell components; check `Annuity.jsx` for height and overflow when embedding.
