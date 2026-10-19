import content from "./content.js";
import page from "./page.js";

const editor = document.getElementById("codeEditor"),
  nums = document.getElementById("lineNums"),
  preview = document.getElementById("preview"),
  langLabel = document.getElementById("languageLabel"),
  langFoot = document.getElementById("languageFooter"),
  cursorInfo = document.getElementById("cursorInfo"),
  toast = document.getElementById("toast");
let lang = "html",
  saved = { ...content },
  toastTimer;
try {
  const cache = JSON.parse(
    localStorage.getItem("markup-studio-code") || "null",
  );
  if (cache && typeof cache.html === "string" && typeof cache.css === "string")
    saved = cache;
} catch { }
// Normalize both starter code and any older version saved in localStorage.
saved.html = saved.html.trimStart();
saved.css = saved.css.trimStart();
function updateLines() {
  const n = editor.value.split("\n").length;
  nums.innerHTML = Array.from({ length: n }, (_, i) => i + 1).join("<br>");
  nums.scrollTop = editor.scrollTop;
}
function setLang(next) {
  saved[lang] = editor.value;
  lang = next;
  document.querySelectorAll(".tab").forEach((t) => {
    const active = t.dataset.lang === lang;
    t.setAttribute("aria-selected", String(active));
    t.tabIndex = active ? 0 : -1;
  });
  editor.value = saved[lang];
  editor.setAttribute("aria-label", `${lang.toUpperCase()} code editor`);
  langLabel.textContent = lang.toUpperCase();
  langFoot.textContent = lang.toUpperCase();
  updateLines();
  editor.focus();
}
function run() {
  saved[lang] = editor.value;
  const doc = page(saved);
  preview.srcdoc = doc;
  try {
    localStorage.setItem("markup-studio-code", JSON.stringify(saved));
  } catch { }
}
function say(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1900);
}
document
  .querySelectorAll(".tab")
  .forEach((t) => t.addEventListener("click", () => setLang(t.dataset.lang)));
function setWorkspace(view) {
  const source = document.getElementById("panel-source"),
    previewPanel = document.getElementById("panel-preview");
  source.hidden = view !== "source";
  previewPanel.hidden = view !== "preview";
  if (view === "preview") run();
}
document
  .getElementById("showPreviewBtn")
  .addEventListener("click", () => setWorkspace("preview"));
document
  .getElementById("showSourceBtn")
  .addEventListener("click", () => setWorkspace("source"));
document.querySelector(".tabs").addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    e.preventDefault();
    setLang(lang === "html" ? "css" : "html");
    document.getElementById(`tab-${lang}`).focus();
  }
});
editor.addEventListener("input", () => {
  saved[lang] = editor.value;
  updateLines();
  try {
    localStorage.setItem("markup-studio-code", JSON.stringify(saved));
  } catch { }
  clearTimeout(window.playgroundTimer);
  window.playgroundTimer = setTimeout(run, 350);
});
editor.addEventListener("scroll", () => (nums.scrollTop = editor.scrollTop));
const updateCursor = () => {
  const before = editor.value.slice(0, editor.selectionStart).split("\n");
  cursorInfo.textContent =
    "Ln " + before.length + ", Col " + (before[before.length - 1].length + 1);
};
editor.addEventListener("click", updateCursor);
editor.addEventListener("keyup", updateCursor);
document.getElementById("refreshBtn").addEventListener("click", run);
document.getElementById("copyBtn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(editor.value);
    say("Code copied");
  } catch {
    editor.select();
    document.execCommand("copy");
    say("Code copied");
  }
});
document.getElementById("resetBtn").addEventListener("click", () => {
  saved = { ...content };
  editor.value = saved[lang];
  try {
    localStorage.removeItem("markup-studio-code");
  } catch { }
  updateLines();
  run();
  say("Starter code restored");
});
document.querySelectorAll(".device button").forEach((b) =>
  b.addEventListener("click", () => {
    document
      .querySelectorAll(".device button")
      .forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    preview.style.width = b.dataset.width;
    preview.style.margin = "0 auto";
    document.getElementById("viewportLabel").textContent =
      `Responsive · ${b.dataset.width}`;
  }),
);
document.getElementById("downloadBtn").addEventListener("click", () => {
  saved[lang] = editor.value;
  const full = `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>My Playground</title>\n<style>\n${saved.css}\n</style>\n</head>\n<body>\n${saved.html}\n</body>\n</html>`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([full], { type: "text/html" }));
  a.download = "playground.html";
  a.click();
  URL.revokeObjectURL(a.href);
  say("HTML file exported");
});
editor.value = saved.html;
updateLines();
run();
