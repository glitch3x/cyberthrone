/**
 * CYBERTHRONE: NEON GRID PROTOCOL
 * Full-featured Sliding Puzzle & Cyberpunk Game Engine
 */

// ============================================================================
// 1. CYBER AUDIO ENGINE (Web Audio API Synthesizer)
// ============================================================================
class CyberAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.ambientActive = false;
    this.ambientOsc1 = null;
    this.ambientOsc2 = null;
    this.ambientGain = null;
    this.masterGain = null;
    this.volume = 0.7;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.enabled = !this.enabled;
    if (this.ambientActive && !this.enabled) {
      this.stopAmbient();
    }
    return this.enabled;
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  playSlide() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      // Tech magnetic whoosh + click
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.06);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  playCorrectSnap() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  playReboot() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch (e) {}
  }

  playVictory() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Polyphonic victory arpeggio
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51]; // A major cyber chime
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.08;

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.01, startTime + 0.35);

        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + 0.45);
      });
    } catch (e) {}
  }

  toggleAmbient() {
    if (this.ambientActive) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  startAmbient() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.035, now + 1.5);

      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc1.type = 'sawtooth';
      this.ambientOsc1.frequency.setValueAtTime(55, now); // Low A1 drone

      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientOsc2.type = 'sine';
      this.ambientOsc2.frequency.setValueAtTime(110.5, now); // Slight detune A2

      // Low pass filter for warm analog cyber feel
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, now);

      this.ambientOsc1.connect(filter);
      this.ambientOsc2.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.masterGain);

      this.ambientOsc1.start(now);
      this.ambientOsc2.start(now);
      this.ambientActive = true;
    } catch (e) {}
  }

  stopAmbient() {
    if (!this.ambientActive || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      if (this.ambientGain) {
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      }
      setTimeout(() => {
        if (this.ambientOsc1) { this.ambientOsc1.stop(); this.ambientOsc1.disconnect(); }
        if (this.ambientOsc2) { this.ambientOsc2.stop(); this.ambientOsc2.disconnect(); }
        this.ambientActive = false;
      }, 550);
    } catch (e) {
      this.ambientActive = false;
    }
  }
}

// ============================================================================
// 2. CANVAS PARTICLE & NEON VFX ENGINE
// ============================================================================
class CyberVFX {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.sparks = [];
    this.mouseX = -1000;
    this.mouseY = -1000;
    this.themePrimary = '#00f0ff';
    this.themeSecondary = '#ffd700';

    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    this.initParticles();
    this.animate();
  }

  setTheme(primary, secondary) {
    this.themePrimary = primary;
    this.themeSecondary = secondary;
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  initParticles() {
    this.particles = [];
    const count = Math.min(65, Math.floor((this.width * this.height) / 18000));
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.3 ? this.themePrimary : this.themeSecondary
      });
    }
  }

  spawnTileSnapSpark(x, y) {
    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.5 + 1;
      this.sparks.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2.5 + 1.5,
        alpha: 1,
        decay: Math.random() * 0.03 + 0.02,
        color: Math.random() > 0.4 ? this.themePrimary : '#00ff88'
      });
    }
  }

  triggerVictoryConfetti() {
    for (let i = 0; i < 120; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2;
      this.sparks.push({
        x: this.width * 0.5 + (Math.random() - 0.5) * 200,
        y: this.height * 0.45 + (Math.random() - 0.5) * 150,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.01,
        color: [this.themePrimary, this.themeSecondary, '#ff007f', '#00ff88'][Math.floor(Math.random() * 4)],
        isConfetti: true
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Subtle perspective grid lines
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.035)';
    this.ctx.lineWidth = 1;
    const gridSize = 40;
    const offsetX = (Date.now() * 0.005) % gridSize;
    const offsetY = (Date.now() * 0.005) % gridSize;

    this.ctx.beginPath();
    for (let x = offsetX; x < this.width; x += gridSize) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
    }
    for (let y = offsetY; y < this.height; y += gridSize) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
    }
    this.ctx.stroke();

    // Floating particles with mouse interaction
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      // Mouse repulsion / attraction
      const dx = this.mouseX - p.x;
      const dy = this.mouseY - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 100) {
        p.x -= (dx / dist) * 1.5;
        p.y -= (dy / dist) * 1.5;
      }

      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();

      // Connecting lines between close particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const pDist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (pDist < 85) {
          this.ctx.strokeStyle = this.themePrimary;
          this.ctx.globalAlpha = (1 - pDist / 85) * 0.15;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }

    // Sparks & Snap Bursts
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.alpha -= s.decay;

      if (s.alpha <= 0) {
        this.sparks.splice(i, 1);
        continue;
      }

      this.ctx.fillStyle = s.color;
      this.ctx.globalAlpha = s.alpha;
      this.ctx.beginPath();
      if (s.isConfetti) {
        this.ctx.rect(s.x, s.y, s.size * 1.4, s.size * 0.9);
      } else {
        this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      }
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.animate());
  }
}

// ============================================================================
// 3. STORAGE & LEADERBOARD MANAGER
// ============================================================================
class CyberStorage {
  constructor() {
    this.keyPrefix = 'cyberthrone_';
  }

  getBest(size) {
    const raw = localStorage.getItem(`${this.keyPrefix}best_${size}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  saveScore(size, moves, seconds) {
    const current = this.getBest(size);
    let isNewBest = false;

    if (!current || moves < current.moves || (moves === current.moves && seconds < current.seconds)) {
      localStorage.setItem(`${this.keyPrefix}best_${size}`, JSON.stringify({ moves, seconds, date: new Date().toLocaleDateString() }));
      isNewBest = true;
    }
    return isNewBest;
  }

  getAllScores() {
    return {
      3: this.getBest(3),
      4: this.getBest(4),
      5: this.getBest(5)
    };
  }
}

// ============================================================================
// 4. MAIN GAME ENGINE
// ============================================================================
class CyberPuzzleEngine {
  constructor() {
    this.size = 3; // 3x3 default, 4x4, 5x5
    this.tiles = []; // maps board position index -> original tile value (0..N-1)
    this.emptyTileValue = 8; // value representing the blank tile
    this.emptyIndex = 8; // current position index of blank tile
    this.tileElements = new Map(); // tileValue -> HTMLElement
    this.emptySlotGuide = null;

    this.moves = 0;
    this.seconds = 0;
    this.timerInterval = null;
    this.isPlaying = false;
    this.isShuffling = false;
    this.showNumbers = true;
    this.isVictory = false;

    // Presets - Authentic CyberThrone Artwork Only
    this.blueprints = [
      { id: 'throne_king', name: 'CyberThrone King', url: 'assets/throne_king.png', type: 'image' },
      { id: 'gold_knight', name: 'Golden Knight', url: 'assets/gold_knight.png', type: 'image' },
      { id: 'cyber_duel', name: 'Neon City Duel', url: 'assets/cyber_duel_square.png', type: 'image' },
      { id: 'cyber_emblem', name: 'CyberThrone Emblem', url: 'assets/cyberthrone_logo.png', type: 'image' },
      { id: 'cyber_pantheon', name: 'Cyber Pantheon', url: 'assets/banner_square.png', type: 'image' }
    ];
    this.currentBlueprint = this.blueprints[0];

    // Modules
    this.audio = new CyberAudio();
    this.vfx = new CyberVFX('particle-canvas');
    this.storage = new CyberStorage();

    // DOM Caches
    this.boardEl = document.getElementById('puzzle-board');
    this.frameEl = document.getElementById('puzzle-frame');
    this.movesDisplay = document.getElementById('moves-display');
    this.timerDisplay = document.getElementById('timer-display');
    this.levelDisplay = document.getElementById('level-display');

    this.initEvents();
    this.setDifficulty(3, false);
  }

  initEvents() {
    // Unlock Audio Context on First User Gesture
    const unlockAudio = () => {
      this.audio.init();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    // Keyboard Controls (WASD / Arrows)
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));

    // Touch Swipe Controls
    let touchStartX = 0;
    let touchStartY = 0;
    this.boardEl.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    this.boardEl.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1 && !this.isVictory) {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const deltaY = e.changedTouches[0].clientY - touchStartY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (Math.max(absX, absY) > 30) {
          if (absX > absY) {
            // Horizontal swipe: moving tile into empty slot
            if (deltaX > 0) this.handleSwipe('RIGHT');
            else this.handleSwipe('LEFT');
          } else {
            // Vertical swipe
            if (deltaY > 0) this.handleSwipe('DOWN');
            else this.handleSwipe('UP');
          }
        }
      }
    }, { passive: true });

    // Custom Image Upload drag and drop
    const dropZone = document.getElementById('custom-upload-zone');
    const fileInput = document.getElementById('custom-file-input');

    if (dropZone && fileInput) {
      dropZone.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          this.loadCustomImage(e.target.files[0]);
        }
      });
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--theme-primary)';
      });
      dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'var(--border-cyan)';
      });
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border-cyan)';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.loadCustomImage(e.dataTransfer.files[0]);
        }
      });
    }

    // Sound volume slider
    const volSlider = document.getElementById('volume-slider');
    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        this.audio.setVolume(parseFloat(e.target.value));
      });
    }
  }

  loadCustomImage(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const customBlueprint = {
        id: 'custom',
        name: 'Custom Hologram',
        url: e.target.result,
        type: 'image'
      };
      this.setBlueprint(customBlueprint);
      this.closeModal('settings-modal');
    };
    reader.readAsDataURL(file);
  }

  setDifficulty(newSize, restart = true) {
    this.size = newSize;
    this.levelDisplay.innerText = `${newSize} x ${newSize}`;

    // Update Difficulty Buttons State
    document.querySelectorAll('.diff-btn').forEach(btn => {
      const btnSize = parseInt(btn.dataset.size, 10);
      if (btnSize === newSize) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (restart) {
      this.restartGame();
    } else {
      this.initBoardState();
    }
  }

  setBlueprint(blueprint) {
    this.currentBlueprint = blueprint;

    // Update preview thumbnail active ring
    document.querySelectorAll('.art-thumb-btn').forEach(btn => {
      if (btn.dataset.id === blueprint.id) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Blueprint Modal Image
    const previewImg = document.getElementById('blueprint-preview-img');
    const previewName = document.getElementById('blueprint-preview-name');
    if (previewImg && previewName) {
      previewName.innerText = blueprint.name.toUpperCase();
      if (blueprint.type === 'glyph') {
        previewImg.style.display = 'none';
        document.getElementById('blueprint-glyph-preview').style.display = 'flex';
      } else {
        previewImg.style.display = 'block';
        previewImg.src = blueprint.url;
        document.getElementById('blueprint-glyph-preview').style.display = 'none';
      }
    }

    // Refresh tile appearances
    this.renderTileGraphics();
  }

  initBoardState() {
    const totalTiles = this.size * this.size;
    this.emptyTileValue = totalTiles - 1;
    this.emptyIndex = totalTiles - 1;
    this.tiles = Array.from({ length: totalTiles }, (_, i) => i);
    this.isVictory = false;
    this.frameEl.classList.remove('solved-glow');

    this.resetTimer();
    this.buildDOMTiles();
    this.shuffle();
  }

  restartGame() {
    this.audio.playReboot();
    this.initBoardState();
  }

  resetTimer() {
    clearInterval(this.timerInterval);
    this.moves = 0;
    this.seconds = 0;
    this.isPlaying = false;
    this.movesDisplay.innerText = '0';
    this.timerDisplay.innerText = '00:00';
  }

  startTimer() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.timerInterval = setInterval(() => {
      this.seconds++;
      const mins = Math.floor(this.seconds / 60).toString().padStart(2, '0');
      const secs = (this.seconds % 60).toString().padStart(2, '0');
      this.timerDisplay.innerText = `${mins}:${secs}`;
    }, 1000);
  }

  buildDOMTiles() {
    this.boardEl.innerHTML = '';
    this.tileElements.clear();

    const totalTiles = this.size * this.size;
    const tileSizePercent = 100 / this.size;

    // Create Empty Slot Guide (Ghost Slot)
    this.emptySlotGuide = document.createElement('div');
    this.emptySlotGuide.className = 'empty-slot-guide';
    this.emptySlotGuide.style.width = `${tileSizePercent}%`;
    this.emptySlotGuide.style.height = `${tileSizePercent}%`;
    this.emptySlotGuide.innerHTML = `<div class="empty-slot-inner"><span>[ VACANT ]</span></div>`;
    this.boardEl.appendChild(this.emptySlotGuide);

    // Create Tile elements for values 0 .. totalTiles - 2
    for (let val = 0; val < totalTiles - 1; val++) {
      const tile = document.createElement('div');
      tile.className = 'puzzle-tile';
      tile.dataset.value = val;
      tile.style.width = `${tileSizePercent}%`;
      tile.style.height = `${tileSizePercent}%`;

      tile.addEventListener('click', () => {
        this.onTileClicked(val);
      });

      this.boardEl.appendChild(tile);
      this.tileElements.set(val, tile);
    }

    this.renderTileGraphics();
    this.updateAllTilePositions(false);
  }

  renderTileGraphics() {
    const totalTiles = this.size * this.size;

    for (let val = 0; val < totalTiles - 1; val++) {
      const tile = this.tileElements.get(val);
      if (!tile) continue;

      tile.innerHTML = '';
      const origRow = Math.floor(val / this.size);
      const origCol = val % this.size;

      if (this.currentBlueprint.type === 'glyph') {
        // Futuristic Cyber Matrix Glyphs
        const hex = (val + 1).toString(16).toUpperCase().padStart(2, '0');
        tile.innerHTML = `
          <div class="tile-inner glyph-tile-art">
            <span class="glyph-number">${val + 1}</span>
            <span class="glyph-sub">0x${hex}</span>
            <div class="tile-badge">${val + 1}</div>
          </div>
        `;
      } else {
        // Image Slice
        const bgSize = this.size * 100;
        const posX = (origCol / (this.size - 1)) * 100;
        const posY = (origRow / (this.size - 1)) * 100;

        tile.innerHTML = `
          <div class="tile-inner" style="
            background-image: url('${this.currentBlueprint.url}');
            background-size: ${bgSize}% ${bgSize}%;
            background-position: ${posX}% ${posY}%;
          ">
            <div class="tile-badge">${val + 1}</div>
          </div>
        `;
      }
    }
  }

  updateAllTilePositions(animated = true) {
    const tileSizePercent = 100 / this.size;

    this.tiles.forEach((tileVal, currentIdx) => {
      const row = Math.floor(currentIdx / this.size);
      const col = currentIdx % this.size;

      if (tileVal === this.emptyTileValue) {
        // Position empty slot guide
        this.emptySlotGuide.style.transform = `translate3d(${col * 100}%, ${row * 100}%, 0)`;
      } else {
        const el = this.tileElements.get(tileVal);
        if (el) {
          if (!animated) {
            el.style.transition = 'none';
          } else {
            el.style.transition = 'transform var(--transition-slide)';
          }

          el.style.transform = `translate3d(${col * 100}%, ${row * 100}%, 0)`;

          // Mark correctly placed tiles
          if (tileVal === currentIdx) {
            el.classList.add('is-correct');
          } else {
            el.classList.remove('is-correct');
          }

          if (!animated) {
            // Force reflow
            el.offsetHeight;
            el.style.transition = '';
          }
        }
      }
    });
  }

  // Guaranteed Solvable Shuffle via Random Valid Walks
  shuffle() {
    this.isShuffling = true;
    const shuffleSteps = this.size === 3 ? 120 : (this.size === 4 ? 240 : 360);
    let lastMovedVal = -1;

    for (let i = 0; i < shuffleSteps; i++) {
      const validIndices = this.getAdjacentIndices(this.emptyIndex);
      // Avoid immediately undoing the previous step
      const candidates = validIndices.filter(idx => this.tiles[idx] !== lastMovedVal);
      const chosenIdx = candidates.length > 0
        ? candidates[Math.floor(Math.random() * candidates.length)]
        : validIndices[Math.floor(Math.random() * validIndices.length)];

      lastMovedVal = this.tiles[chosenIdx];
      // Swap with empty slot
      this.tiles[this.emptyIndex] = this.tiles[chosenIdx];
      this.tiles[chosenIdx] = this.emptyTileValue;
      this.emptyIndex = chosenIdx;
    }

    // Ensure it's not already solved
    if (this.checkWin()) {
      const validIndices = this.getAdjacentIndices(this.emptyIndex);
      const swapIdx = validIndices[0];
      this.tiles[this.emptyIndex] = this.tiles[swapIdx];
      this.tiles[swapIdx] = this.emptyTileValue;
      this.emptyIndex = swapIdx;
    }

    this.updateAllTilePositions(false);
    this.isShuffling = false;
  }

  getAdjacentIndices(idx) {
    const row = Math.floor(idx / this.size);
    const col = idx % this.size;
    const neighbors = [];

    if (row > 0) neighbors.push(idx - this.size); // Up
    if (row < this.size - 1) neighbors.push(idx + this.size); // Down
    if (col > 0) neighbors.push(idx - 1); // Left
    if (col < this.size - 1) neighbors.push(idx + 1); // Right

    return neighbors;
  }

  onTileClicked(tileVal) {
    if (this.isVictory || this.isShuffling) return;

    const clickedIdx = this.tiles.indexOf(tileVal);
    if (clickedIdx === -1) return;

    this.attemptMove(clickedIdx);
  }

  // Multi-Tile Sliding Logic (Row or Column slide towards empty slot)
  attemptMove(targetIdx) {
    const targetRow = Math.floor(targetIdx / this.size);
    const targetCol = targetIdx % this.size;

    const emptyRow = Math.floor(this.emptyIndex / this.size);
    const emptyCol = this.emptyIndex % this.size;

    // Check if in same row or column
    const isSameRow = targetRow === emptyRow;
    const isSameCol = targetCol === emptyCol;

    if (!isSameRow && !isSameCol) return false;

    // Collect all indices that need to shift towards emptyIndex
    const shiftIndices = [];

    if (isSameRow) {
      const step = targetCol < emptyCol ? 1 : -1;
      for (let c = emptyCol - step; step > 0 ? c >= targetCol : c <= targetCol; c -= step) {
        shiftIndices.push(emptyRow * this.size + c);
      }
    } else if (isSameCol) {
      const step = targetRow < emptyRow ? 1 : -1;
      for (let r = emptyRow - step; step > 0 ? r >= targetRow : r <= targetRow; r -= step) {
        shiftIndices.push(r * this.size + emptyCol);
      }
    }

    if (shiftIndices.length === 0) return false;

    if (!this.isPlaying) this.startTimer();

    // Shift tiles sequentially towards empty slot
    let currentEmpty = this.emptyIndex;
    for (const tileIdx of shiftIndices) {
      const val = this.tiles[tileIdx];
      this.tiles[currentEmpty] = val;
      this.tiles[tileIdx] = this.emptyTileValue;
      currentEmpty = tileIdx;
    }
    this.emptyIndex = currentEmpty;

    this.moves++;
    this.movesDisplay.innerText = this.moves;

    this.audio.playSlide();
    this.updateAllTilePositions(true);

    // Visual snap spark if target tile landed into its solved position
    const newlyPlaced = this.tiles[targetIdx];
    if (newlyPlaced === targetIdx) {
      this.audio.playCorrectSnap();
      const tileEl = this.tileElements.get(newlyPlaced);
      if (tileEl) {
        const rect = tileEl.getBoundingClientRect();
        this.vfx.spawnTileSnapSpark(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    }

    // Check victory
    if (this.checkWin()) {
      this.triggerVictory();
    }

    return true;
  }

  handleKeyDown(e) {
    if (this.isVictory || this.isShuffling) return;

    const emptyRow = Math.floor(this.emptyIndex / this.size);
    const emptyCol = this.emptyIndex % this.size;
    let targetIdx = -1;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        // Move tile below empty slot UP into empty slot
        if (emptyRow < this.size - 1) targetIdx = (emptyRow + 1) * this.size + emptyCol;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        // Move tile above empty slot DOWN into empty slot
        if (emptyRow > 0) targetIdx = (emptyRow - 1) * this.size + emptyCol;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        // Move tile to the right of empty slot LEFT into empty slot
        if (emptyCol < this.size - 1) targetIdx = emptyRow * this.size + (emptyCol + 1);
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        // Move tile to the left of empty slot RIGHT into empty slot
        if (emptyCol > 0) targetIdx = emptyRow * this.size + (emptyCol - 1);
        break;
      case 'p':
      case 'P':
        this.toggleModal('blueprint-modal');
        break;
      case 'h':
      case 'H':
        this.showHint();
        break;
      default:
        return;
    }

    if (targetIdx !== -1) {
      e.preventDefault();
      this.attemptMove(targetIdx);
    }
  }

  handleSwipe(dir) {
    const emptyRow = Math.floor(this.emptyIndex / this.size);
    const emptyCol = this.emptyIndex % this.size;
    let targetIdx = -1;

    if (dir === 'UP' && emptyRow < this.size - 1) {
      targetIdx = (emptyRow + 1) * this.size + emptyCol;
    } else if (dir === 'DOWN' && emptyRow > 0) {
      targetIdx = (emptyRow - 1) * this.size + emptyCol;
    } else if (dir === 'LEFT' && emptyCol < this.size - 1) {
      targetIdx = emptyRow * this.size + (emptyCol + 1);
    } else if (dir === 'RIGHT' && emptyCol > 0) {
      targetIdx = emptyRow * this.size + (emptyCol - 1);
    }

    if (targetIdx !== -1) {
      this.attemptMove(targetIdx);
    }
  }

  checkWin() {
    for (let i = 0; i < this.tiles.length; i++) {
      if (this.tiles[i] !== i) return false;
    }
    return true;
  }

  triggerVictory() {
    this.isVictory = true;
    clearInterval(this.timerInterval);
    this.isPlaying = false;

    // Visual polish: Reveal the final missing tile!
    this.revealFinalMissingTile();
    this.frameEl.classList.add('solved-glow');

    // Audio & Confetti
    this.audio.playVictory();
    this.vfx.triggerVictoryConfetti();

    // Calculate rating & rank
    const mins = Math.floor(this.seconds / 60).toString().padStart(2, '0');
    const secs = (this.seconds % 60).toString().padStart(2, '0');
    const timeFormatted = `${mins}:${secs}`;

    const isNewRecord = this.storage.saveScore(this.size, this.moves, this.seconds);

    // Calculate Rank
    let rank = 'A';
    const benchmarkMoves = this.size === 3 ? 35 : (this.size === 4 ? 90 : 180);
    const benchmarkTime = this.size === 3 ? 40 : (this.size === 4 ? 120 : 260);

    if (this.moves <= benchmarkMoves * 0.7 && this.seconds <= benchmarkTime * 0.7) {
      rank = 'SSS - LEGENDARY OPERATIVE';
    } else if (this.moves <= benchmarkMoves && this.seconds <= benchmarkTime) {
      rank = 'S - CYBER ELITE';
    } else if (this.moves <= benchmarkMoves * 1.5) {
      rank = 'A - MATRIX MASTER';
    } else {
      rank = 'B - GRID ENFORCER';
    }

    document.getElementById('final-moves').innerText = this.moves;
    document.getElementById('final-time').innerText = timeFormatted;
    document.getElementById('final-rank').innerText = rank;
    document.getElementById('final-record-badge').style.display = isNewRecord ? 'inline-block' : 'none';

    setTimeout(() => {
      this.openModal('victory-modal');
    }, 700);
  }

  revealFinalMissingTile() {
    // Fill the empty slot with the final missing tile piece
    const lastIdx = this.size * this.size - 1;
    const finalTile = document.createElement('div');
    finalTile.className = 'puzzle-tile is-correct';
    finalTile.style.width = `${100 / this.size}%`;
    finalTile.style.height = `${100 / this.size}%`;
    finalTile.style.transform = `translate3d(${(lastIdx % this.size) * 100}%, ${Math.floor(lastIdx / this.size) * 100}%, 0)`;

    const origRow = Math.floor(lastIdx / this.size);
    const origCol = lastIdx % this.size;

    if (this.currentBlueprint.type === 'glyph') {
      finalTile.innerHTML = `
        <div class="tile-inner glyph-tile-art" style="border-color: var(--accent-gold);">
          <span class="glyph-number" style="color: var(--accent-gold);">${lastIdx + 1}</span>
          <span class="glyph-sub">COMPLETED</span>
        </div>
      `;
    } else {
      const bgSize = this.size * 100;
      const posX = (origCol / (this.size - 1)) * 100;
      const posY = (origRow / (this.size - 1)) * 100;
      finalTile.innerHTML = `
        <div class="tile-inner" style="
          background-image: url('${this.currentBlueprint.url}');
          background-size: ${bgSize}% ${bgSize}%;
          background-position: ${posX}% ${posY}%;
          border-color: var(--accent-gold);
        "></div>
      `;
    }

    this.boardEl.appendChild(finalTile);
  }

  showHint() {
    if (this.isVictory || this.isShuffling) return;

    // Find adjacent tiles and pick the one that reduces Manhattan distance or is a valid move
    const neighbors = this.getAdjacentIndices(this.emptyIndex);
    let bestMove = neighbors[0];
    let bestScore = 999999;

    neighbors.forEach(candIdx => {
      const val = this.tiles[candIdx];
      // Target position of val
      const targetR = Math.floor(val / this.size);
      const targetC = val % this.size;

      // Current pos
      const currR = Math.floor(candIdx / this.size);
      const currC = candIdx % this.size;

      // If moved to empty slot
      const nextR = Math.floor(this.emptyIndex / this.size);
      const nextC = this.emptyIndex % this.size;

      const currDist = Math.abs(currR - targetR) + Math.abs(currC - targetC);
      const nextDist = Math.abs(nextR - targetR) + Math.abs(nextC - targetC);

      const score = nextDist - currDist;
      if (score < bestScore) {
        bestScore = score;
        bestMove = candIdx;
      }
    });

    const hintVal = this.tiles[bestMove];
    const tileEl = this.tileElements.get(hintVal);
    if (tileEl) {
      tileEl.classList.add('hint-glow-tile');
      this.audio.playClick();
      setTimeout(() => {
        tileEl.classList.remove('hint-glow-tile');
      }, 1200);
    }
  }

  toggleNumberBadges() {
    this.showNumbers = !this.showNumbers;
    if (this.showNumbers) {
      this.boardEl.classList.remove('tiles-hide-numbers');
      document.getElementById('toggle-numbers-btn').classList.add('active');
    } else {
      this.boardEl.classList.add('tiles-hide-numbers');
      document.getElementById('toggle-numbers-btn').classList.remove('active');
    }
  }

  toggleSound() {
    const isEnabled = this.audio.toggleMute();
    const btn = document.getElementById('sound-toggle-btn');
    if (isEnabled) {
      btn.innerHTML = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>`;
      btn.classList.add('active');
    } else {
      btn.innerHTML = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path></svg>`;
      btn.classList.remove('active');
    }
  }

  toggleAmbientDrone() {
    const active = this.audio.toggleAmbient();
    const btn = document.getElementById('ambient-drone-btn');
    if (btn) {
      if (active) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  }

  setTheme(themeName) {
    document.body.dataset.theme = themeName;
    document.querySelectorAll('.theme-btn').forEach(btn => {
      if (btn.dataset.theme === themeName) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    // Update VFX colors
    if (themeName === 'synthwave') {
      this.vfx.setTheme('#ff007f', '#00f0ff');
    } else if (themeName === 'matrix') {
      this.vfx.setTheme('#00ff66', '#00f0ff');
    } else if (themeName === 'solar') {
      this.vfx.setTheme('#ffd700', '#ff7700');
    } else {
      this.vfx.setTheme('#00f0ff', '#ffd700');
    }
  }

  openModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.add('open');
  }

  closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.remove('open');
  }

  toggleModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) {
      if (m.classList.contains('open')) m.classList.remove('open');
      else m.classList.add('open');
    }
  }

  openLeaderboard() {
    const scores = this.storage.getAllScores();
    const tableBody = document.getElementById('leaderboard-body');
    if (tableBody) {
      tableBody.innerHTML = '';
      [3, 4, 5].forEach(sz => {
        const sc = scores[sz];
        const row = document.createElement('tr');
        if (sc) {
          const mins = Math.floor(sc.seconds / 60).toString().padStart(2, '0');
          const secs = (sc.seconds % 60).toString().padStart(2, '0');
          row.innerHTML = `
            <td style="color: var(--theme-primary);">${sz}x${sz}</td>
            <td style="color: var(--accent-gold); font-weight: 700;">${sc.moves}</td>
            <td style="color: var(--accent-pink);">${mins}:${secs}</td>
            <td style="color: var(--text-muted); font-size: 0.7rem;">${sc.date || '-'}</td>
          `;
        } else {
          row.innerHTML = `
            <td style="color: var(--theme-primary);">${sz}x${sz}</td>
            <td colspan="3" style="color: var(--text-muted); font-style: italic;">No records yet</td>
          `;
        }
        tableBody.appendChild(row);
      });
    }
    this.openModal('leaderboard-modal');
  }
}

// Global App Instance
let gameApp = null;
window.addEventListener('DOMContentLoaded', () => {
  gameApp = new CyberPuzzleEngine();
  window.app = gameApp; // Global access for inline event handlers
});
