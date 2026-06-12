# Card Table

A small GitHub Pages site for tracking 400, Tarneeb, Likha, and Tawle scores
with a simple login and game history.

## Setup

1. **Create a GitHub repo** (e.g. `card-table`) and push all these files to it.

2. **Enable GitHub Pages**: repo Settings → Pages → Source: deploy from
   branch `main`, root folder. Your site will be at
   `https://<username>.github.io/<repo>/`.

3. **Edit `common.js`**: set `GH_OWNER` and `GH_REPO` to your GitHub username
   and repo name (used to read/write `history.json`).

4. **Edit `users.json`**: add one entry per person who can log in —
   `username`, `firstName`, `lastName`, `password`, `phone`, `image` (a URL
   to an avatar image, or leave it and a placeholder will be generated).

   ⚠️ **Security note**: if this repo is public, `users.json` (including
   passwords) is publicly visible to anyone. Use throwaway passwords, or make
   the repo private (note: private repos require a paid plan for Pages, or
   you can host elsewhere and keep this as a private data source accessed via
   a token).

5. **GitHub token for saving history**: each user who wants to save game
   results needs a Personal Access Token (fine-grained, scoped to this repo,
   with "Contents: Read and write" permission). They paste it into the
   Settings box on the games page — it's stored only in their browser
   (`localStorage`), never committed.

   Create one at: GitHub → Settings → Developer settings → Personal access
   tokens → Fine-grained tokens.

## How it works

- `index.html` — login, checks credentials against `users.json`
- `app.html` — game picker + history list
- `game.html?type=tarneeb|400|likha|tawle` — scoring / dice UI
- `history.json` — appended to via the GitHub Contents API after each game
- `common.js` — shared session, auth, and GitHub API helpers
- `style.css` — shared styling

## Game rules implemented

- **Tarneeb**: 4 players (2 teams), ends when a team reaches 31+, scores can
  be added or subtracted per round.
- **400**: 4 players (2 teams), ends at 41+, +/- allowed.
- **Likha**: 4 players (2 teams), ends at 101+, add-only (no negative scores).
- **Tawle**: single player, dice roller (animated, with double detection),
  winner declared manually and saved to history.

## Notes / next steps

- Currently the GitHub token is a personal token stored per-browser. For a
  shared multi-user setup, consider a small serverless function (Cloudflare
  Worker, Vercel function, etc.) that holds a single repo token server-side
  and exposes a simple "append game" endpoint — then users never need their
  own token.
- `users.json` passwords are plain text. Fine for a casual private group,
  not for anything sensitive.
