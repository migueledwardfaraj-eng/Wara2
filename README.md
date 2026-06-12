# Card Table

A small GitHub Pages site for tracking 400, Tarneeb, Likha, and Tawle scores
with login and game history — backed by a Google Sheet.

## Setup

1. **Google Sheet**: a sheet with two tabs:
   - `Users`: columns `username | firstName | lastName | password | phone | image | isAdmin`
   - `History`: columns `type | date | players | teams | rounds | totals | winningTeam | finalScore | recordedBy`

2. **Apps Script Web App**: deployed from the sheet (Extensions → Apps Script),
   handling `?action=getUsers`, `?action=getHistory` (GET) and `addGame` (POST).
   Deployed with access "Anyone".

3. **`common.js`**: `SHEET_API_URL` is set to your deployed Apps Script `/exec` URL.

4. **GitHub Pages**: push all files to a repo, enable Pages (Settings → Pages →
   deploy from `main`, root).

## Managing users

Add/edit rows in the `Users` tab of the Sheet — no redeploy needed. Set
`isAdmin` to `TRUE` for admin accounts (currently shows an extra "Admin" panel
on the games page pointing back to the Sheet).

⚠️ Passwords are stored in plain text in the Sheet — fine for a casual
private group sharing the Sheet, not for anything sensitive.

## How it works

- `index.html` — login, checks credentials via the Apps Script (`getUsers`)
- `app.html` — game picker + history list (via `getHistory`)
- `game.html?type=tarneeb|400|likha|tawle` — scoring / dice UI, saves via `addGame`
- `common.js` — shared session + Sheet API helpers
- `style.css` — shared styling

## Game rules implemented

- **Tarneeb**: 4 players (2 teams), ends when a team reaches 31+, scores can
  be added or subtracted per round.
- **400**: 4 players (2 teams), ends at 41+, +/- allowed.
- **Likha**: 4 players (2 teams), ends at 101+, add-only (no negative scores).
- **Tawle**: single player, dice roller (animated, with double detection),
  winner declared manually and saved to history.
