/* ═══════════════════════════════════════════
   script.js — Preachi's Birthday Website
═══════════════════════════════════════════ */

/* ══════════════════════════════
   PASSWORD
══════════════════════════════ */
const PASSWORD = "kiki";

// Spawn floating emojis on password page
(function spawnPwFloaters() {
  const container = document.getElementById("pw-floaters");
  const chars = ["🐒", "🍌", "🐒", "🍌", "🐒", "🍌"];
  for (let i = 0; i < 18; i++) {
    const el = document.createElement("div");
    el.className = "pw-float";
    el.textContent = chars[Math.floor(Math.random() * chars.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.animationDuration = (6 + Math.random() * 8) + "s";
    el.style.animationDelay = (Math.random() * 10) + "s";
    el.style.fontSize = (1 + Math.random() * 1.2) + "rem";
    container.appendChild(el);
  }
})();

document.getElementById("pw-btn").addEventListener("click", unlock);
document.getElementById("pw-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") unlock();
});

function unlock() {
  const val = document.getElementById("pw-input").value.trim();
  const errEl = document.getElementById("pw-error");
  if (val.toLowerCase() === PASSWORD) {
    document.getElementById("page-password").style.opacity = "0";
    document.getElementById("page-password").style.transition = "opacity 0.5s";
    setTimeout(() => {
      document.getElementById("page-password").style.display = "none";
      const shell = document.getElementById("app-shell");
      shell.classList.remove("hidden");
      shell.style.opacity = "0";
      shell.style.transition = "opacity 0.5s";
      requestAnimationFrame(() => { shell.style.opacity = "1"; });
    }, 500);
  } else {
    errEl.style.display = "block";
    const input = document.getElementById("pw-input");
    input.style.borderColor = "rgba(255,100,100,0.6)";
    input.value = "";
    setTimeout(() => {
      input.style.borderColor = "";
      errEl.style.display = "none";
    }, 2500);
  }
}

/* ══════════════════════════════
   NAVIGATION
══════════════════════════════ */
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".page-section");
const sidebar  = document.getElementById("sidebar");
const hamburger= document.getElementById("hamburger");
const overlay  = document.getElementById("nav-overlay");

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = link.dataset.page;
    navigateTo(target);
    closeSidebar();
    if (target === "music") initMusic();
    if (target === "timer") startTimer();
    if (target === "game") initCanvas();
  });
});

function navigateTo(pageId) {
  navLinks.forEach(l => l.classList.remove("active"));
  sections.forEach(s => s.classList.remove("active"));
  const activeLink = document.querySelector(`[data-page="${pageId}"]`);
  const activeSection = document.getElementById(`sec-${pageId}`);
  if (activeLink) activeLink.classList.add("active");
  if (activeSection) activeSection.classList.add("active");
  document.getElementById("main-content").scrollTop = 0;
  window.scrollTo(0, 0);
}

hamburger.addEventListener("click", () => {
  const isOpen = sidebar.classList.contains("open");
  if (isOpen) closeSidebar();
  else openSidebar();
});

overlay.addEventListener("click", closeSidebar);

function openSidebar() {
  sidebar.classList.add("open");
  hamburger.classList.add("open");
  overlay.classList.add("show");
}
function closeSidebar() {
  sidebar.classList.remove("open");
  hamburger.classList.remove("open");
  overlay.classList.remove("show");
}

/* ══════════════════════════════
   QUIZ
   ════════════════════════════════════════
   HOW TO EDIT:
   q   = question text
   opts= 4 options
   ans = index of correct answer (0–3)
   msg = shown after answering
   ════════════════════════════════════════
══════════════════════════════ */
const quizData = [
  {
    q: "--YOUR QUESTION 1-- (e.g. Where did we first meet?)",
    opts: ["--Option A--", "--Option B--", "--Option C--", "--Option D--"],
    ans: 0,
    msg: "--FEEDBACK-- (e.g. Yes! You remember! 😄)"
  },
  {
    q: "--YOUR QUESTION 2--",
    opts: ["--Option A--", "--Option B--", "--Option C--", "--Option D--"],
    ans: 1,
    msg: "--FEEDBACK--"
  },
  {
    q: "--YOUR QUESTION 3--",
    opts: ["--Option A--", "--Option B--", "--Option C--", "--Option D--"],
    ans: 2,
    msg: "--FEEDBACK--"
  },
  {
    q: "--YOUR QUESTION 4--",
    opts: ["--Option A--", "--Option B--", "--Option C--", "--Option D--"],
    ans: 0,
    msg: "--FEEDBACK--"
  },
  {
    q: "--YOUR QUESTION 5--",
    opts: ["--Option A--", "--Option B--", "--Option C--", "--Option D--"],
    ans: 3,
    msg: "--FEEDBACK--"
  },
];

let currentQ = 0, quizScore = 0, quizAnswered = false;

function initQuiz() {
  if (document.getElementById("sec-quiz").classList.contains("_init")) return;
  document.getElementById("sec-quiz").classList.add("_init");
  loadQuestion();
}

// Auto-init when quiz section is first shown
const quizObserver = new MutationObserver(() => {
  if (document.getElementById("sec-quiz").classList.contains("active")) initQuiz();
});
quizObserver.observe(document.getElementById("sec-quiz"), { attributes: true });

function loadQuestion() {
  quizAnswered = false;
  const d = quizData[currentQ];
  document.getElementById("quiz-meta").textContent = `Question ${currentQ + 1} of ${quizData.length}`;
  document.getElementById("quiz-q").textContent = d.q;
  document.getElementById("quiz-feedback").textContent = "";
  document.getElementById("quiz-next").classList.add("hidden");

  const optsEl = document.getElementById("quiz-opts");
  optsEl.innerHTML = "";
  d.opts.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "quiz-opt";
    btn.textContent = opt;
    btn.addEventListener("click", () => selectAnswer(i, btn));
    optsEl.appendChild(btn);
  });
}

function selectAnswer(idx, btn) {
  if (quizAnswered) return;
  quizAnswered = true;
  const d = quizData[currentQ];
  document.querySelectorAll(".quiz-opt").forEach(b => b.style.pointerEvents = "none");
  if (idx === d.ans) {
    btn.classList.add("correct");
    quizScore++;
    document.getElementById("quiz-feedback").textContent = "✓ " + d.msg;
  } else {
    btn.classList.add("wrong");
    document.querySelectorAll(".quiz-opt")[d.ans].classList.add("correct");
    document.getElementById("quiz-feedback").textContent = "✗ " + d.msg;
  }
  document.getElementById("quiz-next").classList.remove("hidden");
}

document.getElementById("quiz-next").addEventListener("click", () => {
  currentQ++;
  if (currentQ < quizData.length) {
    loadQuestion();
  } else {
    showQuizResult();
  }
});

function showQuizResult() {
  document.getElementById("quiz-active").style.display = "none";
  const res = document.getElementById("quiz-result");
  res.classList.remove("hidden");
  document.getElementById("result-score").textContent = `${quizScore}/${quizData.length}`;
  const outcomes = [
    ["Yikes... 😂", "Shinchan is disappointed."],
    ["Yikes... 😂", "Shinchan is disappointed."],
    ["Not bad!", "You know some things at least."],
    ["Good job!", "Shinchan is mildly impressed."],
    ["Almost perfect!", "The monkey is learning."],
    ["PERFECT! 🎉", "Shinchan officially approves."],
  ];
  const [title, sub] = outcomes[Math.min(quizScore, outcomes.length - 1)];
  document.getElementById("result-title").textContent = title;
  document.getElementById("result-sub").textContent = sub;
}

function restartQuiz() {
  currentQ = 0; quizScore = 0; quizAnswered = false;
  document.getElementById("quiz-active").style.display = "block";
  document.getElementById("quiz-result").classList.add("hidden");
  loadQuestion();
}

/* ══════════════════════════════
   GAME — Bouncing Monkey Ball
   Hit it with the bar.
   Speed increases every 15 hits.
   At 43 hits → secret message.
══════════════════════════════ */
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
let gameRunning = false, animId;
let gScore = 0, gLevel = 1;
const WIN_HITS = 43;
const HITS_PER_LEVEL = 15;

// Ball
let ball = {};
// Bar
let bar = {};
let barTarget = 0;

function initCanvas() {
  const wrap = document.querySelector(".game-wrap");
  const w = Math.min(wrap.clientWidth - 32, 520);
  const h = Math.round(w * 0.6);
  canvas.width  = w;
  canvas.height = h;
  resetGame();
  drawIdle();
}

function resetGame() {
  const w = canvas.width, h = canvas.height;
  const speed = 3.2;
  const angle = (Math.random() * 60 + 30) * (Math.PI / 180);
  ball = {
    x: w / 2, y: h / 2,
    r: Math.round(w * 0.044),
    vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
    vy: -Math.abs(Math.sin(angle) * speed),
    emoji: "🐒",
  };
  bar = {
    w: Math.round(w * 0.22),
    h: Math.round(h * 0.028),
    x: w / 2,
    y: h - Math.round(h * 0.07),
  };
  barTarget = bar.x;
  gScore = 0; gLevel = 1;
  updateHUD();
}

function drawIdle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#07180e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(93,214,138,0.6)";
  ctx.font = `bold ${Math.round(canvas.width * 0.034)}px 'DM Sans', sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("Hit Start to play!", canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = `${Math.round(canvas.width * 0.028)}px 'DM Sans', sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillText("Move mouse / finger to control the bar", canvas.width / 2, canvas.height / 2 + 22);
  ctx.textAlign = "left";
}

// Mouse control
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  barTarget = (e.clientX - rect.left) * (canvas.width / rect.width);
});

// Touch control
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  barTarget = (e.touches[0].clientX - rect.left) * (canvas.width / rect.width);
}, { passive: false });

function startGame() {
  if (animId) cancelAnimationFrame(animId);
  initCanvas();
  gScore = 0; gLevel = 1;
  updateHUD();
  document.getElementById("game-secret").classList.add("hidden");
  document.getElementById("game-start-btn").textContent = "Restart";
  gameRunning = true;
  loop();
}

function loop() {
  if (!gameRunning) return;
  update();
  draw();
  animId = requestAnimationFrame(loop);
}

function getBaseSpeed() {
  return 3.2 + (gLevel - 1) * 0.6;
}

function update() {
  const w = canvas.width, h = canvas.height;

  // Smooth bar movement
  bar.x += (barTarget - bar.x) * 0.18;
  bar.x = Math.max(0, Math.min(w - bar.w, bar.x));

  ball.x += ball.vx;
  ball.y += ball.vy;

  // Wall bounce (left/right)
  if (ball.x - ball.r < 0) { ball.x = ball.r; ball.vx = Math.abs(ball.vx); }
  if (ball.x + ball.r > w) { ball.x = w - ball.r; ball.vx = -Math.abs(ball.vx); }

  // Ceiling bounce
  if (ball.y - ball.r < 0) { ball.y = ball.r; ball.vy = Math.abs(ball.vy); }

  // Bar hit
  if (
    ball.vy > 0 &&
    ball.y + ball.r >= bar.y &&
    ball.y + ball.r <= bar.y + bar.h + Math.abs(ball.vy) + 2 &&
    ball.x >= bar.x - 4 &&
    ball.x <= bar.x + bar.w + 4
  ) {
    ball.vy = -Math.abs(ball.vy);
    ball.y = bar.y - ball.r;

    // Add slight angle variation based on hit position
    const hitPos = (ball.x - (bar.x + bar.w / 2)) / (bar.w / 2);
    ball.vx += hitPos * 1.2;

    // Clamp speed
    const spd = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
    const targetSpd = getBaseSpeed();
    ball.vx = (ball.vx / spd) * targetSpd;
    ball.vy = (ball.vy / spd) * targetSpd;

    gScore++;
    if (gScore % HITS_PER_LEVEL === 0) {
      gLevel++;
    }
    updateHUD();

    if (gScore >= WIN_HITS) {
      endGame(true);
      return;
    }
  }

  // Ball falls off bottom
  if (ball.y - ball.r > h) {
    endGame(false);
  }
}

function draw() {
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#07180e";
  ctx.fillRect(0, 0, w, h);

  // Subtle grid
  ctx.strokeStyle = "rgba(45,143,90,0.07)";
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

  // Bar
  ctx.fillStyle = "#2d8f5a";
  ctx.beginPath();
  ctx.roundRect(bar.x, bar.y, bar.w, bar.h, 6);
  ctx.fill();
  // Bar shine
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.beginPath();
  ctx.roundRect(bar.x + 4, bar.y + 2, bar.w - 8, bar.h / 2, 4);
  ctx.fill();

  // Ball (emoji)
  ctx.font = (ball.r * 2) + "px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(ball.emoji, ball.x, ball.y);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
}

function updateHUD() {
  document.getElementById("g-score").textContent = gScore;
  document.getElementById("g-level").textContent = gLevel;
  const nextLvl = HITS_PER_LEVEL - (gScore % HITS_PER_LEVEL);
  document.getElementById("g-next").textContent = nextLvl === HITS_PER_LEVEL ? 0 : nextLvl;
}

function endGame(won) {
  gameRunning = false;
  cancelAnimationFrame(animId);

  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#07180e";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = won ? "#f5c842" : "#e74c3c";
  ctx.font = `bold ${Math.round(w * 0.046)}px 'DM Sans', sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(won ? "You did it!! 🎉" : "Monkey escaped! Try again!", w / 2, h / 2 - 12);
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = `${Math.round(w * 0.032)}px 'DM Sans', sans-serif`;
  ctx.fillText(`Hits: ${gScore}`, w / 2, h / 2 + 22);
  ctx.textAlign = "left";

  if (won) {
    document.getElementById("game-secret").classList.remove("hidden");
  }
  document.getElementById("game-start-btn").textContent = "Play Again";
}

window.startGame = startGame;

/* ══════════════════════════════
   MUSIC PLAYER
══════════════════════════════ */
let currentTrack = 0;
let musicInited = false;
const audio = document.getElementById("audio-player");

function initMusic() {
  if (musicInited) return;
  musicInited = true;

  const tracks = document.querySelectorAll(".track-item");
  tracks.forEach((item) => {
    item.addEventListener("click", () => {
      const idx = parseInt(item.dataset.index);
      loadTrack(idx);
      audio.play().catch(() => {});
      document.getElementById("play-btn").textContent = "Pause";
      document.getElementById("vinyl").classList.add("playing");
    });
  });

  loadTrack(0);
  // Autoplay on page open
  audio.play().then(() => {
    document.getElementById("play-btn").textContent = "Pause";
    document.getElementById("vinyl").classList.add("playing");
  }).catch(() => {
    // Autoplay blocked by browser — user must press Play
    document.getElementById("play-btn").textContent = "Play";
  });

  audio.addEventListener("ended", nextTrack);
}

function loadTrack(idx) {
  const tracks = document.querySelectorAll(".track-item");
  if (!tracks[idx]) return;
  currentTrack = idx;

  const item = tracks[idx];
  const src  = item.dataset.src;
  const title = item.querySelector(".track-title").textContent;
  const artist = item.querySelector(".track-artist").textContent;

  audio.src = src;
  document.getElementById("np-title").textContent = title;
  document.getElementById("np-artist").textContent = artist;

  tracks.forEach(t => t.classList.remove("active"));
  item.classList.add("active");
}

function togglePlay() {
  if (audio.paused) {
    audio.play().catch(() => {});
    document.getElementById("play-btn").textContent = "Pause";
    document.getElementById("vinyl").classList.add("playing");
  } else {
    audio.pause();
    document.getElementById("play-btn").textContent = "Play";
    document.getElementById("vinyl").classList.remove("playing");
  }
}

function nextTrack() {
  const tracks = document.querySelectorAll(".track-item");
  const next = (currentTrack + 1) % tracks.length;
  loadTrack(next);
  audio.play().catch(() => {});
  document.getElementById("play-btn").textContent = "Pause";
  document.getElementById("vinyl").classList.add("playing");
}

function prevTrack() {
  const tracks = document.querySelectorAll(".track-item");
  const prev = (currentTrack - 1 + tracks.length) % tracks.length;
  loadTrack(prev);
  audio.play().catch(() => {});
  document.getElementById("play-btn").textContent = "Pause";
  document.getElementById("vinyl").classList.add("playing");
}

window.togglePlay = togglePlay;
window.nextTrack = nextTrack;
window.prevTrack = prevTrack;

/* ══════════════════════════════
   COUNTDOWN TIMER
   Since 1 September 2024
══════════════════════════════ */
let timerStarted = false;

function startTimer() {
  if (timerStarted) return;
  timerStarted = true;
  updateTimer();
  setInterval(updateTimer, 1000);
}

function updateTimer() {
  const start = new Date("2024-09-01T00:00:00");
  const now   = new Date();
  const diff  = Math.max(0, now - start);

  const secs  = Math.floor(diff / 1000);
  const mins  = Math.floor(secs / 60);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);

  document.getElementById("t-days").textContent  = days;
  document.getElementById("t-hours").textContent = hours % 24;
  document.getElementById("t-mins").textContent  = mins % 60;
  document.getElementById("t-secs").textContent  = secs % 60;
}

/* ══════════════════════════════
   RESIZE HANDLER for game
══════════════════════════════ */
window.addEventListener("resize", () => {
  if (!gameRunning && document.getElementById("sec-game").classList.contains("active")) {
    initCanvas();
  }
});

/* ═══════════════════════════════════════════
   WHY I LOVE YOU — FLIP CARD LOGIC
   Add this to the bottom of script.js
═══════════════════════════════════════════ */

function flipCard(card) {
  card.classList.toggle("flipped");
  updateLoveProgress();
}

function updateLoveProgress() {
  const total   = document.querySelectorAll(".flip-card").length;
  const flipped = document.querySelectorAll(".flip-card.flipped").length;

  document.getElementById("love-flipped").textContent = flipped;
  document.getElementById("love-total").textContent   = total;

  const pct = total > 0 ? (flipped / total) * 100 : 0;
  document.getElementById("love-fill").style.width = pct + "%";
}

/* Also expose flipCard globally so onclick= works */
window.flipCard = flipCard;

/* ═══════════════════════════════════════════
   PROPOSAL PAGE — Running "No" Button
   Paste this at the bottom of script.js
═══════════════════════════════════════════ */

// Position the No button initially when proposal page loads
function initNoButton() {
  const btn = document.getElementById("btn-no");
  if (!btn) return;

  // Place it at a sensible starting position
  const rect = btn.getBoundingClientRect();
  btn.style.left = rect.left + "px";
  btn.style.top  = rect.top  + "px";
}

// Called on mouseover AND touchstart
function runAway(btn) {
  const margin = 40;
  const btnW   = btn.offsetWidth;
  const btnH   = btn.offsetHeight;

  const maxX = window.innerWidth  - btnW - margin;
  const maxY = window.innerHeight - btnH - margin;
  const minX = margin;
  const minY = margin;

  let newX = Math.random() * (maxX - minX) + minX;
  let newY = Math.random() * (maxY - minY) + minY;

  const yesBtn = document.querySelector(".btn-yes");
  if (yesBtn) {
    const yr = yesBtn.getBoundingClientRect();
    const tooClose =
      newX < yr.right + 40 &&
      newX + btnW > yr.left - 40 &&
      newY < yr.bottom + 40 &&
      newY + btnH > yr.top - 40;

    if (tooClose) {
      newX = newX > window.innerWidth / 2 ? newX - 160 : newX + 160;
      newX = Math.max(minX, Math.min(maxX, newX));
    }
  }

  btn.style.left = newX + "px";
  btn.style.top  = newY + "px";

  const taunts = [
    "Nahi!",
    "Maar khayegi!",
    "Bilkul nahi!",
    "Mai baat nahi karunga!",
    "Humare baccho ka toh soch!",
    "Kabhi nahi!",
    "Nahinaaa yaar",
    "China trip ka kya?",
  ];
  btn.textContent = taunts[Math.floor(Math.random() * taunts.length)];
}
function handleYes() {
  // Hide the buttons area, show the yes message
  document.querySelector(".proposal-buttons").style.display = "none";
  document.getElementById("proposal-yes-msg").classList.remove("hidden");

  // Hide the No button (it might be floating anywhere on screen)
  const noBtn = document.getElementById("btn-no");
  if (noBtn) noBtn.style.display = "none";
}

// Init button position when proposal section becomes active
const proposalObserver = new MutationObserver(() => {
  const sec = document.getElementById("sec-proposal");
  if (sec && sec.classList.contains("active")) {
    setTimeout(initNoButton, 100);
  }
});

const proposalSec = document.getElementById("sec-proposal");
if (proposalSec) {
  proposalObserver.observe(proposalSec, { attributes: true });
}

window.runAway    = runAway;
window.handleYes  = handleYes;
