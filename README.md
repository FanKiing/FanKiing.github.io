# fankiing.github.io

Personal portfolio of **Yassir Essayh**, full-stack developer (Laravel & React).

Live at **https://fankiing.github.io**

## Stack

- React 19 + Vite
- Tailwind CSS v4
- GSAP (ScrollTrigger, SplitText) + Lenis smooth scrolling
- Redux Toolkit: slices, `createAsyncThunk` and the Fetch API
- A WebGL shader for the ember backgrounds

## Editing content

All text lives in [`public/data/portfolio.json`](public/data/portfolio.json). The app fetches it at runtime, so content changes need no code changes.

Each stack group and principle can carry a `house` key (`targaryen`, `lannister`, `stark`, `tyrell`, `greyjoy`, `baratheon`, `martell`, `arryn`) that shows that house's sigil and words. Skill names map to logos in [`src/lib/techIcons.js`](src/lib/techIcons.js); unknown names get a lettered badge.

### Using your own sigil artwork

Put the image in `public/sigils/` and map the house to it in `portfolio.json`:

```json
"sigilImages": { "stark": "sigils/stark.png", "lannister": "sigils/lannister.png" }
```

The image then replaces the drawn charge on that house's shields and banners. PNG or SVG with a transparent background looks best. Only use artwork whose licence allows it, and credit the artist.

## Credits

- House sigils: [game-icons.net](https://game-icons.net), CC BY 3.0
- Technology logos: [Simple Icons](https://simpleicons.org), CC0

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
```

## Deployment

Every push to `main` builds the site and deploys it to GitHub Pages through `.github/workflows/deploy.yml`.
One-time setup: **Settings → Pages → Source: GitHub Actions**.
