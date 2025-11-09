const STORAGE_KEY = "theme";  
const CUSTOM_EVENT = "theme:toggle";

// Decide initial theme
function detectInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dark" || saved === "light") return saved;

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
}

function applyTheme(theme) {
  const dark = theme === "dark";
  document.body.classList.toggle("dark-mode", dark);
  localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");

  const input = document.getElementById("theme-input");
  if (input) input.checked = dark;
}

function initTheme() {
  applyTheme(detectInitialTheme());
}

function setupCustomEventRelay() {
  const relayRoot = document.getElementById("theme-toggle");
  const input = document.getElementById("theme-input");
  if (!relayRoot || !input) return;

  relayRoot.addEventListener("change", (ev) => {
    ev.stopPropagation();

    const checked = ev.target?.checked === true;
    relayRoot.dispatchEvent(
      new CustomEvent(CUSTOM_EVENT, {
        bubbles: true,
        detail: { checked },
      })
    );
  });
}

function setupBodyListener() {
  // document.body.addEventListener(CUSTOM_EVENT, (ev) => {
  //   const checked = !!ev.detail?.checked;
  //   applyTheme(checked ? "dark" : "light");
  // });
  document.body.addEventListener("darkmode:toggle", (e) => {
    const { checked } = e.detail || {};
    document.body.classList.toggle("dark-mode", !!checked);
  });
}

initTheme();
setupCustomEventRelay();
setupBodyListener();
