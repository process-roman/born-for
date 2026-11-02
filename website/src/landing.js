import { header, footer, likePanel, mountLikes } from "./common.js";
import { icon, portrait, sky, escape } from "./icons.js";
import data from "./generated/app-data.json";
const leo = data.signs.leo;
const attributes = Object.entries(leo.stats)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 6);
document.querySelector("#app").innerHTML = `${header()}
<main id="main">
<section class="hero wrap">
 <div class="hero-copy"><p class="eyebrow"><span class="tiny-star">✦</span> SOON ON THE APP STORE &amp; GOOGLE PLAY</p><h1>You were born<br>with <em>natural strengths.</em></h1><p class="hero-description">Discover the strengths your zodiac reveals—and explore careers where they can help you thrive.</p><a class="button button-primary" href="/discover/">Discover my strengths ${icon("arrow")}</a><p class="microcopy">A birthday. A little curiosity. A whole new perspective.</p></div>
 <div class="hero-visual">
  <span class="orbit orbit-one" aria-hidden="true"></span><span class="orbit orbit-two" aria-hidden="true"></span><span class="hero-spark" aria-hidden="true">✦</span>
  <div class="phone-frame" role="group" aria-label="Born For character preview">
   <div class="phone-screen">
    <div class="phone-status" aria-hidden="true"><span>9:41</span><span class="phone-island"></span><svg viewBox="0 0 59 14" fill="currentColor"><rect x="1" y="9" width="3" height="4" rx="1"/><rect x="6" y="6" width="3" height="7" rx="1"/><rect x="11" y="3" width="3" height="10" rx="1"/><path d="M20 5a10 10 0 0 1 14 0l-1.5 1.5a8 8 0 0 0-11 0ZM23 8a6 6 0 0 1 8 0l-1.5 1.5a4 4 0 0 0-5 0ZM26 11a2 2 0 0 1 2 0l-1 1.5Z"/><rect x="39" y="3" width="16" height="9" rx="2" fill="none" stroke="currentColor"/><rect x="41" y="5" width="12" height="5" rx="1"/><rect x="56" y="6" width="2" height="3" rx="1"/></svg></div>
    <div class="phone-app-header"><span class="phone-brand"><img class="phone-logo" src="/brand-logo.png" width="24" height="24" alt="" /> Born For</span><span class="phone-header-star" aria-hidden="true">✦</span></div>
    <div class="phone-art">${sky("phone-sky")}<div class="phone-character">${portrait("leo")}</div></div>
    <div class="phone-character-info"><span class="phone-sign">LEO · FIRE</span><h2>${escape(leo.archetype)}</h2><p>Made to create. Born to inspire.</p></div>
    <div class="phone-powers"><div class="phone-powers-heading"><h3>Starting attributes</h3><span>OUT OF 100</span></div><ul class="phone-attributes">${attributes.map(([id, value]) => `<li><div><span>${escape(data.labels[id])}</span><strong>${value}<span class="sr-only"> out of 100</span></strong></div><span class="phone-attribute-track" aria-hidden="true"><i style="--value:${value}%"></i></span></li>`).join("")}</ul></div>
    <div class="phone-home" aria-hidden="true"><span></span></div>
   </div>
  </div>
  <span class="sample-caption">ONE OF 12 CHARACTERS. YOURS IS WAITING.</span>
 </div>
</section>
<div class="horizon-strip"><span>12 archetypes</span><i>✧</i><span>16 inner strengths</span><i>✧</i><span>${data.careers.length} career paths</span><i>✧</i><span>One very <em>you</em> story</span></div>
<section class="section wrap" id="how-it-works"><div class="section-heading"><p class="eyebrow">FROM “WHO AM I?” TO “WHAT IF?”</p><h2>A little self-discovery.<br><em>A world of possibility.</em></h2><p>Your sign is a starting point. What you do with it is yours.</p></div><div class="steps-grid">
 <article class="story-step"><span class="step-art lavender">${icon("spark")}</span><span class="step-number">01 / YOUR NATURE</span><h3>Meet your natural strengths.</h3><p>Discover the traits your sign brings to the story—from a curious mind to a courageous heart. Keep what feels like you.</p></article>
 <article class="story-step"><span class="step-art peach">${icon("compass")}</span><span class="step-number">02 / YOUR POSSIBILITIES</span><h3>Follow your curiosity.</h3><p>Explore careers that draw on your strengths. The familiar ones, the unexpected ones, and the ones you haven’t imagined yet.</p></article>
 <article class="story-step"><span class="step-art gold">${icon("book")}</span><span class="step-number">03 / YOUR NEXT CHAPTER</span><h3>Live a life. Find your path.</h3><p>In the app, step into a possible future. Make choices, discover the trade-offs, and take small real-world quests to learn by doing.</p></article>
</div></section>
<section class="possibility-section"><div class="wrap possibility-grid"><div class="mini-scene">${sky("small-sky")}<span class="scene-caption">ONE CHOICE CAN OPEN A WHOLE NEW WORLD.</span></div><div class="possibility-copy"><p class="eyebrow">TRY ON A DIFFERENT TOMORROW</p><h2>What if your next chapter<br>felt more like <em>you?</em></h2><p>A designer who sees what others miss. A teacher who brings out the best in people. A founder with the courage to begin.</p><p>Born For connects who you are with what you could become. The app turns exploration into a little adventure—with choices, quests, and room to grow.</p><a class="text-arrow" href="/discover/">Take a peek at your story ${icon("arrow")}</a></div></div></section>
<section class="community-section wrap"><span class="community-star">✦</span><p class="eyebrow">A LITTLE SELF-DISCOVERY IS ALMOST HERE</p><h2>Coming very soon<br>to the <em>App Store &amp; Google Play.</em></h2><p>Ready to discover what comes naturally to you?<br class="desktop-only"> Tap below if you want Born For on your phone.</p>${likePanel()}<a class="text-link" href="/discover/">Or explore your character first →</a></section>
</main>${footer()}`;
mountLikes();
