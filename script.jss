  /* ══════════════════════════════
     PASSWORD
  ══════════════════════════════ */
  const PASSWORD = "kiki";
  let toastTimer;

  function showToast(text) {
    let toast = document.getElementById('floating-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'floating-toast';
      toast.className = 'floating-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1500);
  }

  function checkPassword() {
    const input = document.getElementById('lock-input');
    const val = input.value;
    if (val.toLowerCase() === PASSWORD) {
      document.getElementById('page-lock').style.display = 'none';
      document.getElementById('main-nav').style.display = 'flex';
      const msg = document.getElementById('page-message');
      msg.style.display = 'block';
      msg.classList.add('active');
      spawnEmojis();
      showToast('Unlocked 🎉');
    } else {
      document.getElementById('lock-error').style.display = 'block';
      input.classList.remove('shake');
      void input.offsetWidth;
      input.classList.add('shake');
    }
  }

  document.getElementById('lock-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') checkPassword();
  });

  /* ══════════════════════════════
     NAVIGATION
  ══════════════════════════════ */
  function showPage(name, btn) {
    document.querySelectorAll('.page').forEach(p => {
      p.style.display = 'none';
      p.classList.remove('active');
    });
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    const target = document.getElementById('page-' + name);
    target.style.display = 'block';
    target.classList.add('active');
    btn.classList.add('active');
    if (name === 'message') spawnEmojis();
    if (name === 'quiz') initQuiz();
    showToast(`Now viewing: ${name.toUpperCase()}`);
  }

  /* ══════════════════════════════
     FLOATING EMOJIS (monkeys, bananas, hearts)
  ══════════════════════════════ */
  function spawnEmojis() {
    const bg = document.getElementById('emoji-bg');
    if (!bg) return;
    bg.innerHTML = '';
    const emojis = ['🐒','🍌','🐒','🍌','💚','🐵','🍌','🐒','😋','💛','🐒','🍌'];
    for (let i = 0; i < 22; i++) {
      const el = document.createElement('div');
      el.className = 'emoji-particle';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = Math.random() * 100 + 'vw';
      el.style.bottom = '-60px';
      el.style.animationDuration = (7 + Math.random() * 9) + 's';
      el.style.animationDelay = (Math.random() * 9) + 's';
      el.style.fontSize = (0.9 + Math.random() * 1.4) + 'rem';
      bg.appendChild(el);
    }
  }

  /* ══════════════════════════════
     QUIZ DATA
     ════════════════════════════════════════
     HOW TO EDIT:
     - q: question text
     - opts: 4 answer choices
     - ans: index of correct answer (0, 1, 2, or 3)
     - msg: fun message shown after answering
     ════════════════════════════════════════
  ══════════════════════════════ */
  const quizData = [
    {
      q: "--YOUR QUESTION 1-- (e.g. Where did we go on our first date?)",
      opts: ["--Option A--", "--Option B--", "--Option C--", "--Option D--"],
      ans: 0,
      msg: "--FEEDBACK-- (e.g. Correct! See, you do pay attention sometimes 🐒)"
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

  let currentQ = 0, score = 0, answered = false;

  function initQuiz() {
    currentQ = 0; score = 0;
    document.getElementById('quiz-body').style.display = 'block';
    document.getElementById('quiz-score').style.display = 'none';
    loadQuestion();
  }

  function loadQuestion() {
    answered = false;
    const data = quizData[currentQ];
    document.getElementById('quiz-progress').textContent = `Question ${currentQ + 1} of ${quizData.length}`;
    document.getElementById('quiz-question').textContent = data.q;
    document.getElementById('quiz-feedback').textContent = '';
    document.getElementById('quiz-next').style.display = 'none';

    const opts = document.getElementById('quiz-options');
    opts.innerHTML = '';
    data.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.onclick = () => selectAnswer(i, btn);
      opts.appendChild(btn);
    });
  }

  function selectAnswer(idx, btn) {
    if (answered) return;
    answered = true;
    const data = quizData[currentQ];
    const allBtns = document.querySelectorAll('.quiz-option');
    allBtns.forEach(b => b.style.pointerEvents = 'none');
    if (idx === data.ans) {
      btn.classList.add('correct');
      score++;
      document.getElementById('quiz-feedback').textContent = '✅ ' + data.msg;
    } else {
      btn.classList.add('wrong');
      allBtns[data.ans].classList.add('correct');
      document.getElementById('quiz-feedback').textContent = '❌ ' + data.msg;
    }
    document.getElementById('quiz-next').style.display = 'inline-block';
  }

  function nextQuestion() {
    currentQ++;
    if (currentQ < quizData.length) {
      loadQuestion();
    } else {
      showScore();
    }
  }

  function showScore() {
    document.getElementById('quiz-body').style.display = 'none';
    const s = document.getElementById('quiz-score');
    s.style.display = 'block';
    document.getElementById('score-display').textContent = `${score}/${quizData.length}`;

    let msg, sub;
    if (score === quizData.length) {
      msg = "Perfect score! 🎉 The monkey knows everything!";
      sub = "Shinchan is impressed. That means a lot, trust me 🔵";
    } else if (score >= quizData.length - 1) {
      msg = "Almost perfect! 😄 Not bad for a monkey!";
      sub = "Shinchan gives you a reluctant thumbs up 👍";
    } else if (score >= Math.floor(quizData.length / 2)) {
      msg = "Decent! 🐒 Could be worse!";
      sub = "Like Shinchan always says — passing is enough 😋";
    } else {
      msg = "Hmm… we need to have a talk 😂";
      sub = "Even Shinchan scored higher and he doesn't try 💚";
    }
    document.getElementById('score-msg').textContent = msg;
    document.getElementById('score-sub').textContent = sub;
  }

  function restartQuiz() { initQuiz(); }

  /* ══════════════════════════════
     GAME — Feed the Monkey
     Catch bananas ✅  |  Dodge monkeys 🚫
  ══════════════════════════════ */
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');

  let items = [], gameRunning = false;
  let gameScore = 0, gameLives = 3;
  const WIN_SCORE = 25, MAX_LIVES = 3;
  let animId, frameCount = 0, speed_mult = 1;

  const BASKET_W = 68, BASKET_H = 20;
  let basket = { x: canvas.width / 2 - BASKET_W / 2, y: canvas.height - 34 };

  canvas.addEventListener('mousemove', e => {
    if (!gameRunning) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    basket.x = Math.max(0, Math.min((e.clientX - rect.left) * scaleX - BASKET_W / 2, canvas.width - BASKET_W));
  });
  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!gameRunning) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    basket.x = Math.max(0, Math.min((e.touches[0].clientX - rect.left) * scaleX - BASKET_W / 2, canvas.width - BASKET_W));
  }, { passive: false });

  function spawnItem() {
    // 65% banana, 35% monkey (monkey = bad)
    const isBanana = Math.random() < 0.65;
    items.push({
      x: Math.random() * (canvas.width - 36) + 18,
      y: -28,
      speed: (2.2 + Math.random() * 2.8) * speed_mult,
      size: isBanana ? 26 : 28,
      type: isBanana ? 'banana' : 'monkey',
      char: isBanana ? '🍌' : '🐒',
      wobble: Math.random() * Math.PI * 2,  // horizontal sway
      wobbleSpeed: (Math.random() - 0.5) * 0.06
    });
  }

  function drawBasket() {
    // Draw shinchan basket label
    ctx.fillStyle = '#3aaa6e';
    ctx.beginPath();
    ctx.roundRect(basket.x, basket.y, BASKET_W, BASKET_H, 10);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 11px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🔵 Shinchan', basket.x + BASKET_W / 2, basket.y + 14);
    ctx.textAlign = 'left';
  }

  function drawItem(it) {
    ctx.font = it.size + 'px serif';
    ctx.fillText(it.char, it.x, it.y);
  }

  function drawLives() {
    ctx.font = '16px serif';
    ctx.textAlign = 'right';
    ctx.fillText('❤️'.repeat(gameLives), canvas.width - 8, 26);
    ctx.textAlign = 'left';
  }

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#060f08';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    frameCount++;
    // Spawn more frequently as score grows — gets harder
    const spawnRate = Math.max(28, 55 - Math.floor(gameScore * 0.8));
    if (frameCount % spawnRate === 0) spawnItem();

    // Increase speed every 5 bananas
    speed_mult = 1 + Math.floor(gameScore / 5) * 0.18;

    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      it.y += it.speed;
      it.wobble += it.wobbleSpeed;
      const drawX = it.x + Math.sin(it.wobble) * 10;
      ctx.font = it.size + 'px serif';
      ctx.fillText(it.char, drawX, it.y);

      // Catch check
      if (it.y + it.size * 0.6 > basket.y && drawX > basket.x - 10 && drawX < basket.x + BASKET_W + 10) {
        items.splice(i, 1);
        if (it.type === 'banana') {
          gameScore++;
          document.getElementById('game-score').textContent = gameScore;
          if (gameScore >= WIN_SCORE) { endGame(true); return; }
        } else {
          // Hit a monkey — lose a life
          gameLives--;
          document.getElementById('game-lives').textContent = gameLives;
          if (gameLives <= 0) { endGame(false); return; }
        }
        continue;
      }
      // Missed banana (fell off screen)
      if (it.y > canvas.height + 20) {
        items.splice(i, 1);
        if (it.type === 'banana') {
          gameLives--;
          document.getElementById('game-lives').textContent = gameLives;
          if (gameLives <= 0) { endGame(false); return; }
        }
      }
    }

    drawBasket();
    drawLives();
    animId = requestAnimationFrame(gameLoop);
  }

  function startGame() {
    items = [];
    gameScore = 0; gameLives = MAX_LIVES; frameCount = 0; speed_mult = 1;
    document.getElementById('game-score').textContent = 0;
    document.getElementById('game-lives').textContent = MAX_LIVES;
    document.getElementById('game-over-msg').style.display = 'none';
    document.getElementById('game-btn').textContent = 'Restart 🔄';
    if (animId) cancelAnimationFrame(animId);
    gameRunning = true;
    gameLoop();
  }

  function endGame(won) {
    cancelAnimationFrame(animId);
    gameRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#060f08';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = won ? '#5ecf8e' : '#e74c3c';
    ctx.font = 'bold 26px Playfair Display, serif';
    ctx.textAlign = 'center';
    ctx.fillText(won ? '🎉 The monkey is fed!' : '💔 Game Over!', canvas.width / 2, canvas.height / 2 - 16);
    ctx.font = 'bold 15px Nunito, sans-serif';
    ctx.fillStyle = '#aadcbc';
    ctx.fillText(
      won ? 'Shinchan is proud of you 🔵' : `You got ${gameScore} bananas. Try again! 🍌`,
      canvas.width / 2, canvas.height / 2 + 20
    );
    ctx.textAlign = 'left';
    if (won) document.getElementById('game-over-msg').style.display = 'block';
  }

  // Idle screen
  ctx.fillStyle = '#060f08';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#5ecf8e';
  ctx.font = 'bold 17px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🍌 Catch bananas, dodge monkeys! 🐒', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = '#7ab890';
  ctx.font = 'bold 13px Nunito, sans-serif';
  ctx.fillText('Press Start to play!', canvas.width / 2, canvas.height / 2 + 20);
  ctx.textAlign = 'left';
