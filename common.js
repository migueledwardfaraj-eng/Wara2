// ---- Config ----
// Fill these in once: your GitHub username/org and repo name where
// users.json and history.json live (this same repo, typically).
const GH_OWNER = "YOUR_GITHUB_USERNAME";
const GH_REPO = "YOUR_REPO_NAME";
const GH_BRANCH = "main";

// ---- Session helpers ----
function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem("cg_session") || "null");
  } catch { return null; }
}

function requireLogin() {
  const s = getSession();
  if (!s) {
    window.location.href = "index.html";
    return null;
  }
  return s;
}

function logout() {
  sessionStorage.removeItem("cg_session");
  window.location.href = "index.html";
}

function renderUserChip(user) {
  const el = document.getElementById("userChip");
  if (!el) return;
  el.innerHTML = `
    <img src="${user.image || ('https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(user.firstName))}" alt="">
    <span>${user.firstName} ${user.lastName}</span>
    <a href="#" class="logout-link" id="logoutLink">Log out</a>
  `;
  document.getElementById("logoutLink").addEventListener("click", (e) => {
    e.preventDefault();
    logout();
  });
}

// ---- GitHub token (stored client-side only, for read/write history.json) ----
function getToken() {
  return localStorage.getItem("cg_gh_token") || "";
}
function setToken(t) {
  if (t) localStorage.setItem("cg_gh_token", t);
  else localStorage.removeItem("cg_gh_token");
}

// ---- Fetch JSON file from repo (works even without token, via raw or contents API) ----
async function fetchJsonFile(path) {
  // Try contents API first (works for private repos too, if token present)
  const token = getToken();
  const headers = { "Accept": "application/vnd.github+json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const url = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${path}?ref=${GH_BRANCH}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Failed to load ${path}: ${res.status}`);
  }
  const data = await res.json();
  const content = decodeURIComponent(escape(atob(data.content)));
  return { json: JSON.parse(content), sha: data.sha };
}

// ---- Write JSON file back to repo (requires token with repo write access) ----
async function writeJsonFile(path, jsonObj, sha, message) {
  const token = getToken();
  if (!token) {
    throw new Error("No GitHub token set. Add one in Settings to save history.");
  }
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(jsonObj, null, 2))));
  const url = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${path}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: message || `Update ${path}`,
      content,
      sha,
      branch: GH_BRANCH
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Failed to write ${path}: ${res.status} ${err.message || ""}`);
  }
  return res.json();
}

// ---- Append a game to history.json ----
async function appendGameToHistory(gameRecord) {
  const { json, sha } = await fetchJsonFile("history.json");
  json.games = json.games || [];
  json.games.push(gameRecord);
  await writeJsonFile("history.json", json, sha, `Add ${gameRecord.type} game result`);
  return json;
}
