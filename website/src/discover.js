import { header, footer, likePanel, mountLikes } from "./common.js";
import { icon, portrait, sky, escape } from "./icons.js";
import { signFromBirthday, isValidBirthDate } from "./generated/birthday.js";
import data from "./generated/app-data.json";
const app = document.querySelector("#app");
const state = {
  step: 0,
  sign: null,
  cusp: null,
  date: {},
  selected: [],
  active: null,
  filter: "all",
  search: "",
};
const titles = ["Birthday", "Character", "Paths", "Your story"];
const fill = (text) =>
  escape(
    text
      .replaceAll(
        "{archetype}",
        data.signs[state.sign].archetype.replace(/^The /, ""),
      )
      .replaceAll("{sign}", data.signs[state.sign].name)
      .replaceAll("{age}", "18"),
  );
function render(focus = true) {
  app.innerHTML = `${header(true)}<main id="main" class="discover-main wrap"><div class="preview-label"><span class="live-dot"></span> A LITTLE TASTE OF BORN FOR</div><ol class="progress" aria-label="Your discovery progress">${titles.map((title, i) => `<li ${state.step === i ? 'aria-current="step"' : ""} class="${state.step >= i ? "reached" : ""}"><span>${state.step > i ? icon("check") : i + 1}</span><b>${title}</b></li>`).join("")}</ol><div id="demo-content" tabindex="-1">${[birthday, character, careers, life][state.step]()}</div></main>${footer()}`;
  mountLikes();
  if (focus) {
    document.querySelector("#demo-content").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}
function birthday() {
  if (state.cusp)
    return `<section class="date-panel"><div class="small-orbit">${icon("moon")}</div><p class="eyebrow">A LITTLE OF BOTH WORLDS</p><h1>You’re on the <em>cusp.</em></h1><p>Your birthday is close to a sign change. Without a birth time and place, either could fit. Choose the one you identify with.</p><div class="cusp-options">${state.cusp.map((id) => `<button class="cusp-card" data-sign="${id}">${portrait(id)}<strong>${data.signs[id].name}</strong><span>${data.signs[id].archetype}</span>${icon("arrow")}</button>`).join("")}</div><button class="text-link" data-edit-date>${icon("back")} Change my birthday</button></section>`;
  return `<section class="date-panel"><div class="small-orbit">${icon("spark")}</div><p class="eyebrow">EVERY GOOD STORY HAS A BEGINNING</p><h1>When did yours <em>begin?</em></h1><p>Your birthday opens the first page.<br>Let’s meet the character your sign has in mind.</p><form id="birthday-form" novalidate><div class="date-fields"><label>Day<input name="day" type="number" inputmode="numeric" autocomplete="bday-day" min="1" max="31" placeholder="DD" value="${state.date.day || ""}" required /></label><label>Month<select name="month" aria-label="Month" autocomplete="bday-month" required><option value="">Month</option>${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => `<option value="${i + 1}" ${state.date.month === i + 1 ? "selected" : ""}>${m}</option>`).join("")}</select></label><label>Year<input name="year" type="number" inputmode="numeric" autocomplete="bday-year" min="1920" max="${new Date().getFullYear()}" placeholder="YYYY" value="${state.date.year || ""}" required /></label></div><p class="form-error" id="birthday-error" role="alert"></p><button class="button button-primary" type="submit">Reveal my character ${icon("arrow")}</button><p class="privacy-note">Your birthday stays in this tab. No account. No inbox.</p></form><p class="cosmic-footnote">Your sign sets the scene. You write the story.</p></section>`;
}
function character() {
  const sign = data.signs[state.sign];
  return `<section class="character-reveal"><div class="reveal-copy"><p class="eyebrow">${escape(sign.name)} · ${escape(sign.element)}</p><h1>Meet <em>${escape(sign.archetype.replace("The ", "the "))}.</em></h1><p class="lead">${escape(sign.revealLine)}</p><p>These are your sign’s starting strengths. Some might feel familiar. Others are yours to discover—or rewrite.</p><div class="reveal-portrait">${sky("portrait-sky")}${portrait(state.sign)}</div><button class="button button-primary" data-next>Find paths that spark something ${icon("arrow")}</button><button class="text-link" data-back>${icon("back")} Change my birthday</button></div><div class="stats-panel"><div class="panel-heading"><h2 class="eyebrow">YOUR STARTING STRENGTHS</h2><span class="mini-star">✦</span></div><div class="power-trio">${sign.signature
    .slice(0, 3)
    .map((a) => `<span>${icon("star")} ${escape(data.labels[a])}</span>`)
    .join(
      "",
    )}</div><div class="trait-families">${data.families.map((f) => `<section><h3>${f.name} <span>${f.blurb}</span></h3>${f.traits.map((a) => `<div class="trait"><div><span>${escape(data.labels[a])}</span><strong>${sign.stats[a]}</strong></div><span class="trait-track"><i style="--value:${sign.stats[a]}%"></i></span></div>`).join("")}</section>`).join("")}</div><p class="small-note">Character scores out of 100, inspired by your sign. They’re a starting point for reflection, not a skills assessment.</p></div></section>`;
}
function careers() {
  return `<section class="career-step"><div class="step-heading"><p class="eyebrow">CURIOSITY LOOKS GOOD ON YOU</p><h1>What could you <em>become?</em></h1><p>Choose up to three careers you’d like to explore.<br>Your sign opens possibilities. Your curiosity gets the final say.</p></div><div class="career-tools"><label class="search-label"><span class="sr-only">Search careers</span><input id="career-search" type="search" placeholder="A designer? A scientist? Something unexpected…" value="${escape(state.search)}" /></label><label class="world-filter"><span class="sr-only">Career world</span><select id="world-filter"><option value="all">Every world</option>${Object.entries(
    data.worlds,
  )
    .map(
      ([id, w]) =>
        `<option value="${id}" ${id === state.filter ? "selected" : ""}>${escape(w.name)}</option>`,
    )
    .join(
      "",
    )}</select></label></div><div id="career-grid" class="career-grid"></div><div class="career-actions"><button class="text-link" data-back>${icon("back")} My character</button><p id="selection-count" aria-live="polite"></p><button class="button button-primary" id="explore-lives" data-next>Imagine this life ${icon("arrow")}</button></div><p class="small-note centered">This preview is a taste. The app adds deeper trait confirmation, career exploration, and the full life simulator.</p></section>`;
}
function fillCareers() {
  const q = state.search.toLowerCase().trim();
  const filtered = data.careers.filter(
    (c) =>
      (state.filter === "all" || c.worlds.includes(state.filter)) &&
      `${c.name} ${c.oneLiner}`.toLowerCase().includes(q),
  );
  document.querySelector("#career-grid").innerHTML = filtered.length
    ? filtered
        .map(
          (c) =>
            `<button class="career-card ${state.selected.includes(c.id) ? "chosen" : ""}" data-career="${c.id}" aria-pressed="${state.selected.includes(c.id)}"><span class="career-card-top"><span class="eyebrow">${escape(data.worlds[c.worlds[0]].name)}</span><span class="choose-mark">${state.selected.includes(c.id) ? icon("check") : "+"}</span></span><h2>${escape(c.name)}</h2><p>${escape(c.oneLiner)}</p><span class="career-trait">${icon("spark")} ${escape(data.labels[c.requirements[0].attribute])}</span></button>`,
        )
        .join("")
    : `<div class="empty-state"><h2>No paths with that name yet.</h2><p>Try another word or explore a different world.</p><button class="text-link" data-clear-search>Show every career</button></div>`;
  document.querySelector("#selection-count").textContent =
    `${state.selected.length} of 3 paths chosen`;
  const next = document.querySelector("#explore-lives");
  next.disabled = !state.selected.length;
  next.firstChild.textContent =
    state.selected.length > 1 ? "Explore these lives " : "Imagine this life ";
  document
    .querySelectorAll("[data-career]")
    .forEach(
      (b) =>
        (b.disabled =
          state.selected.length === 3 &&
          !state.selected.includes(b.dataset.career)),
    );
}
function life() {
  const career = data.careers.find(
    (c) => c.id === (state.active || state.selected[0]),
  );
  state.active = career.id;
  const opening = career.opening;
  return `<section class="life-step"><div class="step-heading"><p class="eyebrow">A GLIMPSE INTO ANOTHER TOMORROW</p><h1>Your next chapter:<br><em>${escape(career.name)}.</em></h1><p>Your first chapter is waiting. Here’s a little peek.</p></div>${state.selected.length > 1 ? `<div class="life-tabs" role="group" aria-label="Selected careers">${state.selected.map((id) => `<button data-active-life="${id}" aria-pressed="${state.active === id}" class="${state.active === id ? "active" : ""}">${escape(data.careers.find((c) => c.id === id).name)}</button>`).join("")}</div>` : ""}<div class="life-preview"><div class="life-scenery">${sky("life-sky")}<span class="life-preview-tag">YOUR POSSIBLE FIRST CHAPTER</span></div><div class="life-narrative"><span class="eyebrow">${escape(data.signs[state.sign].archetype)} · ${escape(career.name)}</span><h2>${opening ? fill(opening.title) : "A different beginning"}</h2><p>${opening ? fill(opening.text) : escape(career.oneLiner)}</p><div class="life-choices">${(opening?.choices?.slice(0, 3) || [{ label: "Take the first step" }]).map((c) => `<button class="life-choice" data-open-gate><span><strong>${fill(c.label)}</strong>${c.hint ? `<small>${fill(c.hint)}</small>` : ""}</span>${icon("arrow")}</button>`).join("")}</div><p class="small-note">A preview of the story. Continue your choices in the app.</p></div></div><button class="text-link" data-back>${icon("back")} Explore other paths</button><dialog id="app-gate" class="app-gate" aria-labelledby="gate-title"><button class="dialog-close" data-close-gate aria-label="Close preview message">×</button><span class="gate-icon">${icon("star")}</span><p class="eyebrow">THIS IS JUST THE BEGINNING</p><h2 id="gate-title">The rest of this life<br>is in <em>your hands.</em></h2><p>In the Born For app, you’ll make the choices, live with the surprises, and discover what this career asks of you.</p><span class="coming-pill">THE FULL EXPERIENCE IS COMING TO THE APP</span>${likePanel()}<button class="text-link" data-close-gate>Keep exploring the preview</button></dialog></section>`;
}
function changeStep(step) {
  state.step = step;
  render();
  if (step === 2) fillCareers();
}
app.addEventListener("submit", (event) => {
  if (event.target.id !== "birthday-form") return;
  event.preventDefault();
  const form = new FormData(event.target);
  const date = Object.fromEntries(
    ["day", "month", "year"].map((k) => [k, Number(form.get(k))]),
  );
  const now = new Date();
  const future =
    Date.UTC(date.year, date.month - 1, date.day) >
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  if (!isValidBirthDate(date) || date.year < 1920 || future) {
    document.querySelector("#birthday-error").textContent =
      "Please enter a real birthday, from 1920 through today.";
    return;
  }
  state.date = date;
  const result = signFromBirthday(date);
  if (result.kind === "cusp") {
    state.cusp = result.signs;
    render();
  } else {
    state.sign = result.sign;
    changeStep(1);
  }
});
app.addEventListener("input", (event) => {
  if (event.target.id === "career-search") {
    state.search = event.target.value;
    fillCareers();
  }
});
app.addEventListener("change", (event) => {
  if (event.target.id === "world-filter") {
    state.filter = event.target.value;
    fillCareers();
  }
});
app.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;
  if (target.hasAttribute("data-edit-date")) {
    state.cusp = null;
    changeStep(0);
  }
  if (target.dataset.sign) {
    state.sign = target.dataset.sign;
    changeStep(1);
  }
  if (target.hasAttribute("data-back")) {
    if (state.step === 1) state.cusp = null;
    changeStep(Math.max(0, state.step - 1));
  }
  if (target.hasAttribute("data-next")) {
    if (state.step === 2 && !state.selected.length) return;
    changeStep(Math.min(3, state.step + 1));
  }
  if (target.dataset.career) {
    const id = target.dataset.career;
    state.selected = state.selected.includes(id)
      ? state.selected.filter((c) => c !== id)
      : state.selected.length < 3
        ? [...state.selected, id]
        : state.selected;
    if (!state.selected.includes(state.active)) state.active = null;
    fillCareers();
    document
      .querySelector(`[data-career="${id}"]`)
      ?.focus({ preventScroll: true });
  }
  if (target.dataset.activeLife) {
    state.active = target.dataset.activeLife;
    render();
  }
  if (target.hasAttribute("data-clear-search")) {
    state.search = "";
    state.filter = "all";
    render(false);
    fillCareers();
  }
  if (target.hasAttribute("data-open-gate")) {
    document.querySelector("#app-gate").showModal();
    mountLikes();
  }
  if (target.hasAttribute("data-close-gate"))
    document.querySelector("#app-gate")?.close();
});
render(false);
