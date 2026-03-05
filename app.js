const platformDefs = [
  { key: "webUrl", label: "Web", icon: "🌐" },
  { key: "androidApkUrl", label: "Android", icon: "🤖" },
  { key: "iosUrl", label: "iOS", icon: "🍎" },
  { key: "windowsUrl", label: "Windows", icon: "🪟" },
  { key: "macUrl", label: "macOS", icon: "💻" }
];

const fallbackApps = [
  {
    id: "taskflow",
    name: "TaskFlow Planner",
    tagline: "Plan your day with less noise",
    description:
      "TaskFlow Planner helps individuals and teams manage recurring tasks, deadlines, and routines across web, mobile, and desktop.",
    category: "Productivity",
    pricing: "free",
    platforms: {
      webUrl: "https://apps.example.com/taskflow",
      androidApkUrl: "downloads/taskflow/taskflow-2.4.1.apk",
      iosUrl: "https://apps.apple.com/app/id0000000001",
      windowsUrl: "downloads/taskflow/taskflow-2.4.1-setup.exe",
      macUrl: "downloads/taskflow/taskflow-2.4.1.dmg"
    },
    version: "2.4.1",
    releaseDate: "2026-01-10",
    changelog: [
      "Added weekly focus dashboard",
      "Improved sync stability for offline edits",
      "Fixed duplicate reminder notifications"
    ],
    screenshots: [
      "https://via.placeholder.com/900x500/101a36/eef2ff?text=TaskFlow+Planner+1",
      "https://via.placeholder.com/900x500/101a36/eef2ff?text=TaskFlow+Planner+2",
      "https://via.placeholder.com/900x500/101a36/eef2ff?text=TaskFlow+Planner+3"
    ]
  },
  {
    id: "retaildesk",
    name: "RetailDesk POS",
    tagline: "Fast billing for local stores",
    description:
      "RetailDesk POS is an offline-first point-of-sale app for barcode billing, stock monitoring, and receipt printing.",
    category: "POS",
    pricing: "paid",
    platforms: {
      webUrl: "",
      androidApkUrl: "downloads/retaildesk/retaildesk-1.8.0.apk",
      iosUrl: "",
      windowsUrl: "downloads/retaildesk/retaildesk-1.8.0-setup.exe",
      macUrl: ""
    },
    version: "1.8.0",
    releaseDate: "2025-12-22",
    changelog: [
      "GST invoice customization",
      "Printer auto-reconnect logic",
      "Inventory import validation improvements"
    ],
    screenshots: [
      "https://via.placeholder.com/900x500/101a36/eef2ff?text=RetailDesk+POS+1",
      "https://via.placeholder.com/900x500/101a36/eef2ff?text=RetailDesk+POS+2"
    ]
  },
  {
    id: "quizforge",
    name: "QuizForge",
    tagline: "Create engaging quizzes in minutes",
    description:
      "QuizForge lets educators and creators build, publish, and track quiz sessions across classroom and remote environments.",
    category: "Quiz",
    pricing: "free",
    platforms: {
      webUrl: "https://apps.example.com/quizforge",
      androidApkUrl: "",
      iosUrl: "https://apps.apple.com/app/id0000000002",
      windowsUrl: "",
      macUrl: "downloads/quizforge/quizforge-3.2.0.dmg"
    },
    version: "3.2.0",
    releaseDate: "2026-01-17",
    changelog: [
      "Live leaderboard mode",
      "Added CSV question bank import",
      "Accessibility improvements for screen readers"
    ],
    screenshots: [
      "https://via.placeholder.com/900x500/101a36/eef2ff?text=QuizForge+1",
      "https://via.placeholder.com/900x500/101a36/eef2ff?text=QuizForge+2"
    ]
  }
];

const fallbackDownloads = {
  taskflow: {
    androidApkUrl: {
      latest: {
        fileName: "taskflow-2.4.1.apk",
        url: "downloads/taskflow/taskflow-2.4.1.apk",
        size: "31 MB",
        sha256: "9f4cb4a46fa80c0a1f3f17a89d48953650fbca8f6259e8bbbcdf039f63f2a1ef",
        releaseDate: "2026-01-10",
        notes: "Crash fixes and offline sync patch"
      },
      older: []
    }
  },
  retaildesk: {
    windowsUrl: {
      latest: {
        fileName: "retaildesk-1.8.0-setup.exe",
        url: "downloads/retaildesk/retaildesk-1.8.0-setup.exe",
        size: "73 MB",
        sha256: "53bd96fcd0f2ad89cab916e5b2826222089b4d2d6c7f0427ca8cf2c377a8ce66",
        releaseDate: "2025-12-22",
        notes: "Windows service resilience update"
      },
      older: []
    }
  },
  quizforge: {
    macUrl: {
      latest: {
        fileName: "quizforge-3.2.0.dmg",
        url: "downloads/quizforge/quizforge-3.2.0.dmg",
        size: "38 MB",
        sha256: "2f53a505ac8d3f26e96e9c8815ff3350f43f45ccfba4a2ce9dcaeb1026f307f7",
        releaseDate: "2026-01-17",
        notes: "Accessibility and quiz timer fixes"
      },
      older: []
    }
  }
};

const el = (selector) => document.querySelector(selector);

async function fetchJson(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return response.json();
  } catch (error) {
    if (path.includes("apps.json")) return fallbackApps;
    if (path.includes("downloads.json")) return fallbackDownloads;
    throw error;
  }
}

function detectPlatformKey() {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("android")) return "androidApkUrl";
  if (/iphone|ipad|ipod/.test(ua)) return "iosUrl";
  if (ua.includes("windows")) return "windowsUrl";
  if (ua.includes("mac")) return "macUrl";
  return "webUrl";
}

function hasPlatform(app, platformKey) {
  return Boolean(app.platforms?.[platformKey]);
}

function initHomePage(apps) {
  const grid = el("#appsGrid");
  const searchInput = el("#searchInput");
  const platformFilter = el("#platformFilter");
  const categoryFilter = el("#categoryFilter");
  const pricingFilter = el("#pricingFilter");

  const categories = [...new Set(apps.map((app) => app.category))];
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.append(option);
  });

  function renderCards() {
    const term = searchInput.value.trim().toLowerCase();
    const selectedPlatform = platformFilter.value;
    const selectedCategory = categoryFilter.value;
    const selectedPricing = pricingFilter.value;

    const filtered = apps.filter((app) => {
      const matchesSearch = [app.name, app.tagline, app.description].join(" ").toLowerCase().includes(term);
      const matchesPlatform = selectedPlatform === "all" || hasPlatform(app, selectedPlatform);
      const matchesCategory = selectedCategory === "all" || app.category === selectedCategory;
      const matchesPricing = selectedPricing === "all" || app.pricing === selectedPricing;
      return matchesSearch && matchesPlatform && matchesCategory && matchesPricing;
    });

    grid.innerHTML = "";
    if (!filtered.length) {
      grid.innerHTML = '<p class="card">No apps matched your filters.</p>';
      return;
    }

    filtered.forEach((app) => {
      const card = document.createElement("article");
      card.className = "card";
      const platformBadges = platformDefs
        .filter((p) => hasPlatform(app, p.key))
        .map((p) => `<span class="badge">${p.icon} ${p.label}</span>`)
        .join("");

      card.innerHTML = `
        <h3>${app.name}</h3>
        <p class="tagline">${app.tagline}</p>
        <div class="badges">${platformBadges || '<span class="badge">Coming soon</span>'}</div>
        <p><span class="badge">${app.category}</span> <span class="badge">${app.pricing}</span></p>
        <a class="btn btn-primary" href="app.html?id=${encodeURIComponent(app.id)}">View</a>
      `;
      grid.append(card);
    });
  }

  [searchInput, platformFilter, categoryFilter, pricingFilter].forEach((input) =>
    input.addEventListener("input", renderCards)
  );

  renderCards();
  const year = el("#year");
  if (year) year.textContent = new Date().getFullYear().toString();
}

function initReleaseNotesModal(changelog = []) {
  const modal = el("#releaseNotesModal");
  const openBtn = el("#openReleaseNotes");
  const closeBtn = el("#closeModalBtn");
  const list = el("#releaseNotesList");
  if (!modal || !openBtn || !closeBtn || !list) return;

  list.innerHTML = changelog.map((item) => `<li>${item}</li>`).join("");

  const close = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  };

  openBtn.addEventListener("click", () => {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  });

  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });
}

function createPlatformButtons(app, recommended) {
  return platformDefs
    .map(({ key, label, icon }) => {
      const url = app.platforms?.[key];
      const recommendedClass = recommended === key ? "recommend" : "";
      if (!url) {
        return `<button class="btn btn-secondary disabled" disabled>${icon} ${label} (Coming soon)</button>`;
      }
      return `<a class="btn btn-secondary ${recommendedClass}" href="${url}" target="_blank" rel="noopener noreferrer">${icon} Install ${label}</a>`;
    })
    .join("");
}

function createAssetBlock(platformKey, releaseInfo, appVersion) {
  if (!releaseInfo) return "";
  const platformName = platformDefs.find((item) => item.key === platformKey)?.label ?? platformKey;
  const latest = releaseInfo.latest;
  const older = releaseInfo.older || [];
  if (!latest) return "";

  const olderId = `older-${platformKey}`;

  return `
    <section class="download-section">
      <h3>${platformName} downloads</h3>
      <h4>Latest version ${appVersion}</h4>
      ${renderAssetItem(latest)}
      <button class="btn btn-secondary toggle-older" data-target="${olderId}">${older.length ? "Show older versions" : "No older versions"}</button>
      <div id="${olderId}" hidden>
        <h4>Older versions</h4>
        <div class="asset-list">
          ${older.length ? older.map(renderAssetItem).join("") : "<p class='asset-item'>No archived builds.</p>"}
        </div>
      </div>
    </section>
  `;
}

function renderAssetItem(asset) {
  return `
    <article class="asset-item">
      <strong>${asset.fileName}</strong>
      <p>Size: ${asset.size} · Release date: ${asset.releaseDate}</p>
      <p>SHA256: <code>${asset.sha256}</code></p>
      <p>Notes: ${asset.notes}</p>
      <p>
        <a class="btn btn-primary" href="${asset.url}">Download</a>
        <button class="btn btn-secondary copy-sha" data-sha="${asset.sha256}">Copy SHA256</button>
      </p>
    </article>
  `;
}

function setupCopyButtons(root = document) {
  root.querySelectorAll(".copy-sha").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const hash = btn.getAttribute("data-sha") || "";
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(hash);
      } else {
        const input = document.createElement("input");
        input.value = hash;
        document.body.append(input);
        input.select();
        document.execCommand("copy");
        input.remove();
      }
      btn.textContent = "Copied";
      setTimeout(() => {
        btn.textContent = "Copy SHA256";
      }, 1200);
    });
  });
}

function setupOlderToggles(root = document) {
  root.querySelectorAll(".toggle-older").forEach((btn) => {
    if (btn.textContent.includes("No older")) return;
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.getAttribute("data-target"));
      if (!target) return;
      const willShow = target.hidden;
      target.hidden = !willShow;
      btn.textContent = willShow ? "Hide older versions" : "Show older versions";
    });
  });
}

function initCarousel(screenshots = []) {
  if (!screenshots.length) return "<p class='card'>Screenshots coming soon.</p>";
  const imgId = "screenshotImage";
  return `
    <div class="carousel">
      <img id="${imgId}" src="${screenshots[0]}" alt="App screenshot 1" loading="lazy" />
    </div>
    <div class="carousel-controls">
      <button class="btn btn-secondary" id="prevShot">Previous</button>
      <button class="btn btn-secondary" id="nextShot">Next</button>
    </div>
  `;
}

function setupCarousel(screenshots = []) {
  if (screenshots.length < 2) return;
  let current = 0;
  const image = el("#screenshotImage");
  const prev = el("#prevShot");
  const next = el("#nextShot");
  if (!image || !prev || !next) return;

  const update = () => {
    image.src = screenshots[current];
    image.alt = `App screenshot ${current + 1}`;
  };

  prev.addEventListener("click", () => {
    current = (current - 1 + screenshots.length) % screenshots.length;
    update();
  });

  next.addEventListener("click", () => {
    current = (current + 1) % screenshots.length;
    update();
  });
}

async function initAppPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const container = el("#appDetail");
  if (!container) return;

  if (!id) {
    container.innerHTML = '<p class="card">Missing app id. <a href="index.html#apps">Back to apps</a>.</p>';
    return;
  }

  const [apps, downloads] = await Promise.all([fetchJson("data/apps.json"), fetchJson("data/downloads.json")]);
  const app = apps.find((item) => item.id === id);

  if (!app) {
    container.innerHTML = '<p class="card">App not found. <a href="index.html#apps">Back to apps</a>.</p>';
    return;
  }

  const recommended = detectPlatformKey();
  const releaseSections = Object.entries(downloads[id] || {})
    .map(([platformKey, releaseInfo]) => createAssetBlock(platformKey, releaseInfo, app.version))
    .join("");

  container.innerHTML = `
    <article class="card">
      <div class="app-header">
        <div>
          <h1>${app.name}</h1>
          <p class="tagline">${app.tagline}</p>
        </div>
        <p class="app-meta">Version ${app.version} · ${app.releaseDate} · ${app.category} · ${app.pricing}</p>
      </div>

      <p>${app.description}</p>

      <h2>Screenshots</h2>
      ${initCarousel(app.screenshots)}

      <h2>Install</h2>
      <p class="app-meta">Recommended for your OS is highlighted.</p>
      <div class="platform-buttons">${createPlatformButtons(app, recommended)}</div>

      <h2>Release notes</h2>
      <button class="btn btn-primary" id="openReleaseNotes">View release notes</button>

      <h2>Safety & verification</h2>
      <ul>
        <li>Signed builds are provided where supported.</li>
        <li>Verify file integrity before installing using SHA256.</li>
        <li>Security updates are prioritized and reflected in release notes.</li>
      </ul>

      <p><a href="security.html">Read full verification guide</a></p>
      ${releaseSections || "<p class='card'>Release assets will be published soon.</p>"}
    </article>
  `;

  initReleaseNotesModal(app.changelog);
  setupCarousel(app.screenshots);
  setupCopyButtons(container);
  setupOlderToggles(container);
}

(async function boot() {
  try {
    const page = document.body.dataset.page;
    if (page === "home") {
      const apps = await fetchJson("data/apps.json");
      initHomePage(apps);
    }
    if (page === "app") {
      await initAppPage();
    }
  } catch (error) {
    const root = el("#appsGrid") || el("#appDetail") || document.body;
    root.insertAdjacentHTML("beforeend", `<p class="card" role="alert">${error.message}</p>`);
  }
})();
