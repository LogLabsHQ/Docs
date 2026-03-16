/* =========================================
   LogLabs Docs — main.js
   Search · Sidebar · Language toggle
   ========================================= */

// ── Search Index ──────────────────────────
const SEARCH_INDEX = [
  // LogLabs
  {
    title: "LogLabs Docs",
    title_en: "LogLabs Docs",
    desc: "Portal principal de documentación de LogLabs.",
    desc_en: "Main LogLabs documentation portal.",
    path: "../index.html",
    tags: ["loglabs", "docs", "inicio", "home"]
  },
  // ZER0
  {
    title: "ZER0 — Introducción",
    title_en: "ZER0 — Overview",
    desc: "Qué es ZER0, características y primeros pasos.",
    desc_en: "What is ZER0, features, and getting started.",
    path: "../zer0/index.html",
    tags: ["zer0", "overview", "intro", "repl", "alias"]
  },
  {
    title: "ZER0 — Instalación",
    title_en: "ZER0 — Installation",
    desc: "Cómo instalar ZER0 en Arch Linux usando install.sh.",
    desc_en: "How to install ZER0 on Arch Linux using install.sh.",
    path: "../zer0/install.html",
    tags: ["install", "instalacion", "arch", "bash", "python", "install.sh"]
  },
  {
    title: "ZER0 — Comandos",
    title_en: "ZER0 — Commands",
    desc: "Referencia completa de todos los comandos y atajos de ZER0.",
    desc_en: "Full reference of all ZER0 commands and shortcuts.",
    path: "../zer0/commands.html",
    tags: ["comandos", "commands", "alias", "shortcuts", "referencia", "repl"]
  },
  {
    title: "ZER0 — Configuración",
    title_en: "ZER0 — Configuration",
    desc: "Personaliza ZER0: agregar alias, editar config y más.",
    desc_en: "Customize ZER0: add aliases, edit config, and more.",
    path: "../zer0/config.html",
    tags: ["config", "configuracion", "custom", "alias", "yaml"]
  },
  {
    title: "ZER0 — FAQ",
    title_en: "ZER0 — FAQ",
    desc: "Preguntas frecuentes y solución de problemas.",
    desc_en: "Frequently asked questions and troubleshooting.",
    path: "../zer0/faq.html",
    tags: ["faq", "troubleshooting", "errores", "errors", "ayuda", "help"]
  }
];

// ── State ─────────────────────────────────
let currentLang = localStorage.getItem("docs-lang") || "es";

// ── Lang toggle ───────────────────────────
function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("docs-lang", lang);
  document.documentElement.setAttribute("data-lang", lang);

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

// ── Sidebar ───────────────────────────────
function initSidebar() {
  // Collapsible sections
  document.querySelectorAll(".nav-section-header").forEach(header => {
    header.addEventListener("click", () => {
      const section = header.closest(".nav-section");
      section.classList.toggle("open");
    });
  });

  // Auto-open section containing active link
  const activeLink = document.querySelector(".nav-link.active");
  if (activeLink) {
    const section = activeLink.closest(".nav-section");
    if (section) section.classList.add("open");
  } else {
    // Open first section by default
    const first = document.querySelector(".nav-section");
    if (first) first.classList.add("open");
  }

  // Mobile hamburger
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      overlay.classList.toggle("open");
    });
  }
  if (overlay) {
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("open");
    });
  }
}

// ── Search ────────────────────────────────
function initSearch() {
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");
  if (!input || !results) return;

  let debounceTimer;

  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => runSearch(input.value.trim()), 120);
  });

  input.addEventListener("focus", () => {
    if (input.value.trim()) runSearch(input.value.trim());
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrapper")) {
      results.classList.remove("active");
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      results.classList.remove("active");
      input.blur();
    }
  });
}

function runSearch(query) {
  const results = document.getElementById("search-results");
  if (!query) { results.classList.remove("active"); return; }

  const q = query.toLowerCase();
  const matches = SEARCH_INDEX.filter(item => {
    return item.title.toLowerCase().includes(q)
        || item.title_en.toLowerCase().includes(q)
        || item.desc.toLowerCase().includes(q)
        || item.desc_en.toLowerCase().includes(q)
        || item.tags.some(t => t.includes(q));
  });

  results.classList.add("active");

  if (matches.length === 0) {
    results.innerHTML = `<div class="search-empty">
      <span class="es-only">Sin resultados para "<strong>${query}</strong>"</span>
      <span class="en-only">No results for "<strong>${query}</strong>"</span>
    </div>`;
    applyLang();
    return;
  }

  results.innerHTML = matches.map(item => `
    <div class="search-result-item" onclick="location.href='${item.path}'">
      <div class="search-result-title es-only">${item.title}</div>
      <div class="search-result-title en-only">${item.title_en}</div>
      <div class="search-result-desc es-only">${item.desc}</div>
      <div class="search-result-desc en-only">${item.desc_en}</div>
      <div class="search-result-path">${item.path.replace('../', '')}</div>
    </div>
  `).join("");
  applyLang();
}

// ── Copy buttons ──────────────────────────
function initCopyButtons() {
  document.querySelectorAll("pre").forEach(pre => {
    const wrapper = document.createElement("div");
    wrapper.className = "code-wrapper";
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.textContent = "copy";
    btn.addEventListener("click", () => {
      const code = pre.querySelector("code") || pre;
      navigator.clipboard.writeText(code.innerText).then(() => {
        btn.textContent = "✓ copied";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = "copy";
          btn.classList.remove("copied");
        }, 2000);
      });
    });
    wrapper.appendChild(btn);
  });
}

// ── Apply lang ────────────────────────────
function applyLang() {
  document.documentElement.setAttribute("data-lang", currentLang);
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });
}

// ── Init ──────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  applyLang();
  initSidebar();
  initSearch();
  initCopyButtons();

  // Lang button events
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
});
