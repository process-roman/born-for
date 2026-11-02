import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "./style.css";
import { icon } from "./icons.js";
const listeners = new Set();
let state = { count: 117, liked: false, ready: false, busy: false, error: "" };
let initial;
export function likePanel() {
  return `<div class="like-widget" data-like-widget><button class="like-button" type="button" data-like disabled>${icon("heart")}<span data-like-label>I want this app</span><span class="like-count" data-like-count>117</span></button><p class="like-status" data-like-status aria-live="polite">117 early supporters. Be the next.</p><button type="button" class="text-link like-retry" data-like-retry hidden>Retry live count</button></div>`;
}
function update() {
  for (const root of document.querySelectorAll("[data-like-widget]")) {
    const button = root.querySelector("[data-like]");
    button.disabled = !state.ready || state.busy || state.liked;
    button.classList.toggle("is-liked", state.liked);
    button.setAttribute("aria-pressed", String(state.liked));
    root.querySelector("[data-like-count]").textContent =
      state.count.toLocaleString("en");
    root.querySelector("[data-like-label]").textContent = state.liked
      ? "You’re counted!"
      : state.busy
        ? "Counting you in…"
        : "I want this app";
    root.querySelector("[data-like-status]").textContent =
      state.error ||
      (state.liked
        ? "You’re counted. Thanks for the support!"
        : "Tap the heart to show your support.");
    root.querySelector("[data-like-retry]").hidden = !state.error;
  }
  listeners.forEach((fn) => fn(state));
}
async function request(method = "GET") {
  const response = await fetch("/api/likes", {
    method,
    credentials: "same-origin",
    cache: "no-store",
    headers: method === "POST" ? { "Content-Type": "application/json" } : {},
    signal: AbortSignal.timeout(10000),
  });
  const body = await response.json();
  if (!response.ok || !Number.isSafeInteger(body.count) || body.count < 117)
    throw new Error("Live count unavailable. Please try again.");
  return body;
}
export function mountLikes() {
  update();
  initial ??= refreshLikes();
}
async function refreshLikes() {
  state.busy = true;
  update();
  try {
    state = { ...state, ...(await request()), ready: true, error: "" };
  } catch {
    state.error = "Live count unavailable. Please try again.";
  } finally {
    state.busy = false;
    update();
  }
}
document.addEventListener("click", async (event) => {
  if (event.target.closest("[data-like-retry]")) return refreshLikes();
  if (
    !event.target.closest("[data-like]") ||
    !state.ready ||
    state.liked ||
    state.busy
  )
    return;
  state.busy = true;
  state.error = "";
  update();
  try {
    state = { ...state, ...(await request("POST")), error: "" };
  } catch {
    state.error =
      "We couldn’t count your support. Tap retry to check your count.";
  } finally {
    state.busy = false;
    update();
  }
});
export function header(demo = false) {
  return `<header class="site-header"><a class="brand" href="/"><img class="brand-mark" src="/brand-logo.png" width="48" height="48" alt="" /><span>Born For<span class="brand-tag">KNOW YOUR NATURE</span></span></a><nav aria-label="Main navigation">${demo ? '<a class="nav-link" href="/">Back to the beginning</a>' : '<a class="nav-link" href="/#how-it-works">How it works</a><a class="nav-cta" href="/discover/">Meet your character ' + icon("arrow") + "</a>"}</nav></header>`;
}
export function footer() {
  return `<footer class="site-footer"><a class="footer-brand" href="/"><img class="footer-logo" src="/brand-logo.png" width="24" height="24" alt="" /> Born For</a><span>A little cosmic. Entirely your own.</span><button class="text-link" type="button" data-about>About this preview</button></footer><dialog class="about-dialog" id="about-dialog" aria-labelledby="about-title"><button class="dialog-close" type="button" data-close-about aria-label="Close">×</button><span class="eyebrow">A NOTE FROM BORN FOR</span><h2 id="about-title">Your story stays yours.</h2><p>Your birthday is used only in this browser tab to find your sign. It is not sent to our server or saved when you leave.</p><p>The heart button uses an anonymous browser cookie to remember your like. The shared count starts with 117 early sparks. Clearing cookies or using another browser can allow another like; this isn’t a count of verified people.</p><p>These character traits are playful starting points for reflection. Your choices, experience and growth shape who you become.</p></dialog>`;
}
document.addEventListener("click", (event) => {
  const dialog = document.querySelector("#about-dialog");
  if (event.target.closest("[data-about]")) dialog?.showModal();
  if (event.target.closest("[data-close-about]") || event.target === dialog)
    dialog?.close();
});
