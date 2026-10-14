import { animate } from "motion";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const projects = {
  f1: {
    kicker: "Edge AI",
    title: "F1 Telemetry Edge AI",
    copy:
      "Gerçek zamanlı F1 telemetri anomali tespiti. PyTorch autoencoder → ONNX Runtime, Redis olay hattı ve Ollama Phi-3 ile offline Race Engineer RAG ajanı.",
    stack: "Python · FastAPI · ONNX · Ollama · Redis · Streamlit · Docker",
    href: "https://github.com/musa-ok/f1-telemetry-edge-ai",
  },
  aira: {
    kicker: "LangGraph",
    title: "AI-RA",
    copy: "Ham gereksinim metinlerini yapılandırılmış çıktılara dönüştüren LangGraph mimarili analiz aracı.",
    stack: "Django · FastAPI · Google Gemini · LangGraph",
    href: "https://github.com/musa-ok/ai-requirements-analyst",
  },
  scoutiq: {
    kicker: "Scout",
    title: "Scoutiq / Yetenek Avcısı",
    copy: "AI destekli video analiz ve oyuncu değerlendirme. Flutter istemci, FastAPI backend.",
    stack: "Flutter · FastAPI · PostgreSQL",
    href: "https://github.com/musa-ok/yetenek-avcisi-ai",
  },
  ner: {
    kicker: "NLP",
    title: "Türkçe NER",
    copy: "Hugging Face’te yayınlanan Türkçe varlık tanıma modeli. F1 %91.9.",
    stack: "XLM-RoBERTa · xlm_roberta_ner_musa",
    href: "https://huggingface.co/Musa-ok",
  },
  docs: {
    kicker: "RAG",
    title: "AskMyDocs",
    copy: "PDF ve metinle konuşan RAG asistanı. Destek hattı için ayrı it-bot-api.",
    stack: "FastAPI · Qdrant · DistilBERT",
    href: "https://github.com/musa-ok/AskMyDocs",
  },
  coach: {
    kicker: "Python",
    title: "Hybrid Coach",
    copy: "Antrenman / koçluk hattı üzerine açık kaynak deneme.",
    stack: "Python",
    href: "https://github.com/musa-ok/hybrid-coach",
  },
  nautiq: {
    kicker: "Flutter",
    title: "Nautiq",
    copy: "Dart ile mobil ürün deneyi.",
    stack: "Dart · Flutter",
    href: "https://github.com/musa-ok/Nautiq",
  },
};

function spring(opts = {}) {
  return { type: "spring", bounce: 0, duration: 0.4, ...opts };
}

function projectVelocity(v, d = 0.998) {
  return (v / 1000) * d / (1 - d);
}

function rubberband(overshoot, dimension, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

function historyVelocity(samples) {
  if (samples.length < 2) return 0;
  const a = samples[samples.length - 2];
  const b = samples[samples.length - 1];
  const dt = Math.max(1, b.t - a.t);
  return ((b.x - a.x) / dt) * 1000;
}

const progress = document.getElementById("progress");
window.addEventListener(
  "scroll",
  () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    progress.style.transform = `scaleX(${p})`;
  },
  { passive: true }
);

/* Press */
document.querySelectorAll("[data-press], .tile, .feature").forEach((el) => {
  el.addEventListener("pointerdown", () => {
    if (reduced) return;
    animate(el, { scale: 0.985 }, spring({ duration: 0.22 }));
  });
  const up = () => {
    if (reduced) return;
    animate(el, { scale: 1 }, spring({ duration: 0.38 }));
  };
  el.addEventListener("pointerup", up);
  el.addEventListener("pointercancel", up);
});

/* Keyboard: keys drop in, tilt toward the pointer, type on their own, and answer the real keyboard */
const stage = document.getElementById("kb-stage");
const kb = document.getElementById("kb");
const keys = [...kb.querySelectorAll(".key")];
if (!reduced) {
  keys.forEach((key, i) => {
    key.style.opacity = "0";
    animate(
      key,
      { opacity: [0, 1], y: [-60, 0] },
      { type: "spring", bounce: 0.5, duration: 0.7, delay: 0.15 + i * 0.06 }
    ).finished.then(() => {
      key.style.transform = "";
      key.style.opacity = "";
    });
  });
}

let lastInput = performance.now();
let pointer = null;
window.addEventListener("pointermove", (e) => {
  pointer = { x: e.clientX / innerWidth - 0.5, y: e.clientY / innerHeight - 0.5 };
  lastInput = performance.now();
});
document.documentElement.addEventListener("pointerleave", () => (pointer = null));

let rx = 22;
let ry = 0;
function tiltLoop(t) {
  let tx;
  let ty;
  if (pointer && performance.now() - lastInput < 2500) {
    tx = 22 - pointer.y * 16;
    ty = pointer.x * 22;
  } else {
    // idle: a slow sway so it never sits still
    tx = 22 + Math.sin(t / 1400) * 4;
    ty = Math.sin(t / 2100) * 9;
  }
  rx += (tx - rx) * 0.07;
  ry += (ty - ry) * 0.07;
  kb.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
  kb.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
  requestAnimationFrame(tiltLoop);
}
if (!reduced) requestAnimationFrame(tiltLoop);

function press(key, ms = 140) {
  key.classList.add("is-down");
  setTimeout(() => key.classList.remove("is-down"), ms);
}

const palette = ["#f59bc4", "#a9a8f7", "#8ee0b1", "#ffbe73", "#ffd43b", "#63b0f7", "#bd8af3", "#ff9152", "#9fdc5e"];
function confetti() {
  if (reduced) return;
  for (let i = 0; i < 36; i++) {
    const bit = document.createElement("span");
    bit.className = "confetti";
    bit.style.background = palette[i % palette.length];
    stage.append(bit);
    const angle = Math.random() * Math.PI * 2;
    const dist = 140 + Math.random() * 220;
    animate(
      bit,
      {
        x: [0, Math.cos(angle) * dist],
        y: [0, Math.sin(angle) * dist * 0.7 - 120, Math.sin(angle) * dist * 0.7 + 160],
        rotate: [0, (Math.random() - 0.5) * 720],
        opacity: [1, 1, 0],
      },
      { duration: 1.3 + Math.random() * 0.5, ease: "easeOut" }
    ).finished.then(() => bit.remove());
  }
}

/* Types PORTFOLYO↵ by itself while nobody is touching it */
const order = keys.filter((k) => k !== kb.querySelector(".key-enter"));
order.push(kb.querySelector(".key-enter"));
let typing = false;
async function autoType() {
  if (typing || reduced) return;
  typing = true;
  for (const key of order) {
    press(key, 120);
    await new Promise((r) => setTimeout(r, 130));
  }
  typing = false;
}
setTimeout(autoType, 1800);
setInterval(() => {
  if (performance.now() - lastInput > 6000 && !document.hidden) autoType();
}, 9000);

const cycle = {};
function keyFor(name) {
  const matches = keys.filter((k) => k.dataset.key === name);
  if (matches.length < 2) return matches[0];
  cycle[name] = ((cycle[name] ?? -1) + 1) % matches.length;
  return matches[cycle[name]];
}
let typed = "";
document.addEventListener("keydown", (e) => {
  if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
  lastInput = performance.now();
  const name = e.key === "Enter" ? "enter" : e.key.toLocaleLowerCase("tr");
  if (name === "p") delete cycle.o; // start the O's over for each new word
  const key = keyFor(name);
  if (!key) {
    typed = "";
    return;
  }
  press(key);
  typed = (typed + name).slice(-9);
  if (typed === "portfolyo") {
    typed = "";
    confetti();
  }
});
kb.querySelector(".key-enter").addEventListener("click", confetti);

/* Reveal */
if (!reduced) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        animate(e.target, { opacity: [0, 1], y: [18, 0] }, spring({ duration: 0.55 }));
        io.unobserve(e.target);
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".feature, .tile, .path li, .craft > div, .edu-card, .facts > *, .cert-card").forEach((el) => {
    el.style.opacity = "0";
    io.observe(el);
  });
}

/* Carousel */
const track = document.getElementById("track");
const carousel = document.getElementById("carousel");
let x = 0;
let dragging = false;
let grab = 0;
let samples = [];
let animating = false;
let moved = 0;

function minX() {
  return Math.min(0, carousel.clientWidth - track.scrollWidth);
}
function applyX(next) {
  const min = minX();
  if (next > 0) next = rubberband(next, carousel.clientWidth);
  else if (next < min) next = min - rubberband(min - next, carousel.clientWidth);
  x = next;
  track.style.transform = `translate3d(${x}px,0,0)`;
}

carousel.addEventListener("pointerdown", (e) => {
  dragging = true;
  animating = false;
  carousel.setPointerCapture(e.pointerId);
  grab = e.clientX - x;
  moved = 0;
  samples = [{ x: e.clientX, t: performance.now() }];
});
carousel.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  samples.push({ x: e.clientX, t: performance.now() });
  if (samples.length > 5) samples.shift();
  const next = e.clientX - grab;
  moved = Math.max(moved, Math.abs(next - x));
  applyX(next);
});
function settleCarousel(vx) {
  const min = minX();
  const projected = x + projectVelocity(vx);
  const target = Math.max(min, Math.min(0, projected));
  if (reduced) {
    x = target;
    track.style.transform = `translate3d(${x}px,0,0)`;
    return;
  }
  animating = true;
  animate(x, target, {
    ...spring({ bounce: Math.abs(vx) > 400 ? 0.18 : 0, duration: 0.4 }),
    velocity: vx,
    onUpdate: (latest) => {
      if (!animating) return;
      x = latest;
      track.style.transform = `translate3d(${x}px,0,0)`;
    },
  });
}
carousel.addEventListener("pointerup", () => {
  if (!dragging) return;
  dragging = false;
  settleCarousel(historyVelocity(samples));
});
carousel.addEventListener("pointercancel", () => {
  dragging = false;
  settleCarousel(0);
});

/* Sheet */
const sheet = document.getElementById("sheet");
const scrim = document.getElementById("scrim");
const kickerEl = document.getElementById("sheet-kicker");
const titleEl = document.getElementById("sheet-title");
const copyEl = document.getElementById("sheet-copy");
const stackEl = document.getElementById("sheet-stack");
const linkEl = document.getElementById("sheet-link");

let sheetY = 0;
let sheetOpen = false;
let sheetDrag = false;
let sheetGrab = 0;
let sheetSamples = [];

function setSheetY(y) {
  sheetY = y;
  sheet.style.transform = `translateX(-50%) translate3d(0,${y}px,0)`;
}

function openSheet(id) {
  const p = projects[id];
  if (!p) return;
  kickerEl.textContent = p.kicker;
  titleEl.textContent = p.title;
  copyEl.textContent = p.copy;
  stackEl.textContent = p.stack;
  if (p.href) {
    linkEl.hidden = false;
    linkEl.href = p.href;
  } else linkEl.hidden = true;
  sheet.hidden = false;
  scrim.hidden = false;
  sheetOpen = true;
  const h = sheet.getBoundingClientRect().height;
  if (reduced) {
    setSheetY(0);
    scrim.style.opacity = "1";
    return;
  }
  setSheetY(h);
  animate(h, 0, { ...spring({ bounce: 0.12, duration: 0.35 }), onUpdate: setSheetY });
  animate(scrim, { opacity: [0, 1] }, { duration: 0.25 });
}

function closeSheet(velocity = 0) {
  if (!sheetOpen) return;
  sheetOpen = false;
  const h = sheet.getBoundingClientRect().height;
  const finish = () => {
    sheet.hidden = true;
    scrim.hidden = true;
    setSheetY(0);
  };
  if (reduced) return finish();
  animate(sheetY, h + 24, {
    ...spring({ bounce: 0, duration: 0.32 }),
    velocity,
    onUpdate: setSheetY,
  }).finished.then(finish);
  animate(scrim, { opacity: 0 }, { duration: 0.25 });
}

document.querySelectorAll("[data-project]").forEach((el) => {
  const go = (e) => {
    if (moved > 10 && el.classList.contains("tile")) {
      e.preventDefault();
      return;
    }
    openSheet(el.dataset.project);
  };
  el.addEventListener("click", go);
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openSheet(el.dataset.project);
    }
  });
});

document.getElementById("sheet-close").addEventListener("click", () => closeSheet());
scrim.addEventListener("click", () => closeSheet());

sheet.addEventListener("pointerdown", (e) => {
  if (e.target.closest("a,button") && e.target !== sheet) return;
  sheetDrag = true;
  sheet.setPointerCapture(e.pointerId);
  sheetGrab = e.clientY - sheetY;
  sheetSamples = [{ x: e.clientY, t: performance.now() }];
});
sheet.addEventListener("pointermove", (e) => {
  if (!sheetDrag) return;
  sheetSamples.push({ x: e.clientY, t: performance.now() });
  if (sheetSamples.length > 5) sheetSamples.shift();
  let next = e.clientY - sheetGrab;
  if (next < 0) next = -rubberband(-next, sheet.clientHeight, 0.45);
  setSheetY(next);
});
sheet.addEventListener("pointerup", () => {
  if (!sheetDrag) return;
  sheetDrag = false;
  const vy = historyVelocity(sheetSamples);
  const projected = sheetY + projectVelocity(vy);
  if (vy > 400 || projected > sheet.clientHeight * 0.35) closeSheet(vy);
  else {
    animate(sheetY, 0, {
      ...spring({ bounce: 0.15, duration: 0.32 }),
      velocity: vy,
      onUpdate: setSheetY,
    });
  }
});

const viewer = document.getElementById("viewer");
const viewerImg = document.getElementById("viewer-img");

function openViewer(src, alt) {
  viewerImg.src = src;
  viewerImg.alt = alt || "";
  viewer.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeViewer() {
  viewer.classList.remove("is-open");
  viewerImg.removeAttribute("src");
  document.body.style.overflow = "";
}

document.querySelectorAll(".cert-card").forEach((btn) => {
  btn.addEventListener("click", () => {
    const img = btn.querySelector("img");
    openViewer(img.src, img.alt);
  });
});

document.getElementById("viewer-close").addEventListener("click", (e) => {
  e.stopPropagation();
  closeViewer();
});
viewer.addEventListener("click", closeViewer);
viewerImg.addEventListener("click", (e) => e.stopPropagation());
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeViewer();
});
