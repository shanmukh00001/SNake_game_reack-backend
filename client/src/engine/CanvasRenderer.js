import { DIRECTIONS, GRID_SIZE } from "./Constants.js";

/**
 * @typedef {Object} Particle
 * @property {number} x
 * @property {number} y
 * @property {number} vx
 * @property {number} vy
 * @property {number} radius
 * @property {number} alpha
 * @property {number} decay
 * @property {string} color
 */

/**
 * @typedef {Object} FloatingScore
 * @property {number} x
 * @property {number} y
 * @property {string} text
 * @property {number} alpha
 * @property {number} vy
 */

/**
 * High-performance, devicePixelRatio-aware Canvas 2D Renderer for Snake Game.
 * Decoupled from React lifecycle to eliminate Virtual DOM rerenders during gameplay.
 */
export class CanvasRenderer {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas 2D Context could not be initialized");
    }
    this.ctx = context;
    this.dpr =
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    /** @type {Particle[]} */
    this.particles = [];
    /** @type {FloatingScore[]} */
    this.floatingScores = [];
    this.logicalSize = 400;
    this.cellSize = 25;
    this.prefersReducedMotion = false;

    if (typeof window !== "undefined" && window.matchMedia) {
      this.prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    }
  }

  /**
   * Resizes physical and logical canvas with devicePixelRatio scaling
   * @param {number} logicalSize
   */
  resize(logicalSize) {
    this.logicalSize = logicalSize;
    this.cellSize = logicalSize / GRID_SIZE;

    this.canvas.width = Math.floor(logicalSize * this.dpr);
    this.canvas.height = Math.floor(logicalSize * this.dpr);
    this.canvas.style.width = `${logicalSize}px`;
    this.canvas.style.height = `${logicalSize}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);
  }

  /**
   * Particle burst and score popup on eating food
   * @param {import('./Types').Coordinate} gridPos
   * @param {number} [points=10]
   */
  addEatEffect(gridPos, points = 10) {
    if (this.prefersReducedMotion) return;
    const px = (gridPos.x + 0.5) * this.cellSize;
    const py = (gridPos.y + 0.5) * this.cellSize;

    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.5;
      const speed = 1.5 + Math.random() * 2.5;
      this.particles.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 2.5,
        alpha: 1,
        decay: 0.03 + Math.random() * 0.02,
        color: "#10b981", // Emerald accent
      });
    }

    this.floatingScores.push({
      x: px,
      y: py - 6,
      text: `+${points}`,
      alpha: 1,
      vy: -1.2,
    });
  }

  /**
   * Particle burst on collision/game over
   * @param {import('./Types').Coordinate} gridPos
   */
  addDeathEffect(gridPos) {
    if (this.prefersReducedMotion) return;
    const px = (gridPos.x + 0.5) * this.cellSize;
    const py = (gridPos.y + 0.5) * this.cellSize;

    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3.5;
      this.particles.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2.5 + Math.random() * 2.5,
        alpha: 1,
        decay: 0.025 + Math.random() * 0.02,
        color: i % 2 === 0 ? "#10b981" : "#ef4444",
      });
    }
  }

  /**
   * Main render method executing every animation frame
   * @param {import('./Types').GameState} gameState
   */
  render(gameState) {
    if (!this.ctx || !this.logicalSize) return;

    const ctx = this.ctx;
    const size = this.logicalSize;
    const cell = this.cellSize;

    // 1. Base Dark Playfield with subtle alternating grid cell tint for distinct cell readability
    ctx.fillStyle = "#0c0e12";
    ctx.fillRect(0, 0, size, size);

    // Subtle checkerboard pattern to clearly distinguish individual cells
    ctx.fillStyle = "rgba(255, 255, 255, 0.015)";
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if ((row + col) % 2 === 0) {
          ctx.fillRect(col * cell, row * cell, cell, cell);
        }
      }
    }

    // 2. Clear Cell Grid Matrix lines
    ctx.strokeStyle = "rgba(71, 85, 105, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i < GRID_SIZE; i++) {
      const pos = Math.floor(i * cell) + 0.5;
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, size);
      ctx.moveTo(0, pos);
      ctx.lineTo(size, pos);
    }
    ctx.stroke();

    // 2b. High-contrast, sharp outer arena boundary wall / border
    ctx.strokeStyle = "rgba(16, 185, 129, 0.6)"; // Emerald-tinted glowing boundary line
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, size - 2, size - 2);

    // Inner subtle guide border
    ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
    ctx.lineWidth = 1;
    ctx.strokeRect(3, 3, size - 6, size - 6);

    // 3. Draw Target / Food (Terracotta #c45643 with inner bevel highlight)
    if (gameState.food) {
      const fx = gameState.food.x * cell + 2.5;
      const fy = gameState.food.y * cell + 2.5;
      const fSize = cell - 5;
      const pulse = this.prefersReducedMotion
        ? 1
        : 1 + Math.sin(Date.now() / 180) * 0.04;

      ctx.save();
      ctx.fillStyle = "#c45643"; // Rich terracotta pellet
      this.roundRect(ctx, fx, fy, fSize, fSize, 4);
      ctx.fill();

      // Tactile top inner bevel highlight
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(fx + 2, fy + 2);
      ctx.lineTo(fx + fSize - 2, fy + 2);
      ctx.stroke();

      // Amber center core
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(
        fx + fSize / 2,
        fy + fSize / 2,
        Math.max(1.5, fSize * 0.18 * pulse),
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();
    }

    // 4. Draw Snake
    const snake = gameState.snake;
    if (snake && snake.length > 0) {
      // Body Segments: Interlocking emerald segments (#10b981 to #059669)
      for (let i = snake.length - 1; i > 0; i--) {
        const seg = snake[i];
        const sx = seg.x * cell + 1.5;
        const sy = seg.y * cell + 1.5;
        const sSize = cell - 3;
        const radius = 3.5;

        const progress = i / snake.length;
        // High-contrast emerald phosphor gradient
        const gVal = Math.floor(185 - progress * 40);
        ctx.fillStyle = `rgb(16, ${gVal}, 129)`;

        this.roundRect(ctx, sx, sy, sSize, sSize, radius);
        ctx.fill();

        // 1px top highlight bevel for tactile tile depth
        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        ctx.fillRect(sx + 1, sy + 1, sSize - 2, 1);
      }

      // Snake Head: Laser Emerald (#34d399 / #10b981)
      const head = snake[0];
      const hx = head.x * cell + 1;
      const hy = head.y * cell + 1;
      const hSize = cell - 2;

      ctx.save();
      ctx.fillStyle = "#10b981"; // Laser Emerald
      this.roundRect(ctx, hx, hy, hSize, hSize, 4.5);
      ctx.fill();

      // Tactile top highlight
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillRect(hx + 1.5, hy + 1.5, hSize - 3, 1);
      ctx.restore();

      // Tactical Heading Eyes
      const dir = DIRECTIONS[gameState.direction] || { x: 1, y: 0 };
      const eyeRadius = Math.max(1.8, cell * 0.11);
      const eyeOffset = cell * 0.26;

      let eye1X, eye1Y, eye2X, eye2Y;
      const centerX = (head.x + 0.5) * cell;
      const centerY = (head.y + 0.5) * cell;

      if (dir.x !== 0) {
        eye1X = centerX + dir.x * (cell * 0.22);
        eye1Y = centerY - eyeOffset;
        eye2X = centerX + dir.x * (cell * 0.22);
        eye2Y = centerY + eyeOffset;
      } else {
        eye1X = centerX - eyeOffset;
        eye1Y = centerY + dir.y * (cell * 0.22);
        eye2X = centerX + eyeOffset;
        eye2Y = centerY + dir.y * (cell * 0.22);
      }

      // High-contrast Pupil
      ctx.fillStyle = "#090a0c";
      ctx.beginPath();
      ctx.arc(eye1X, eye1Y, eyeRadius, 0, Math.PI * 2);
      ctx.arc(eye2X, eye2Y, eyeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Phosphor Eye Glint
      ctx.fillStyle = "#a7f3d0";
      ctx.beginPath();
      ctx.arc(eye1X - 0.5, eye1Y - 0.5, eyeRadius * 0.4, 0, Math.PI * 2);
      ctx.arc(eye2X - 0.5, eye2Y - 0.5, eyeRadius * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Update & draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.95;
      p.vy *= 0.95;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, p.radius * p.alpha), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 6. Update & draw floating score notifications
    for (let i = this.floatingScores.length - 1; i >= 0; i--) {
      const s = this.floatingScores[i];
      s.y += s.vy;
      s.alpha -= 0.025;

      if (s.alpha <= 0) {
        this.floatingScores.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, s.alpha);
      ctx.fillStyle = "#34d399";
      ctx.font = "bold 13px Inter, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(s.text, s.x, s.y);
      ctx.restore();
    }
  }

  /**
   * Helper to draw rounded rectangle on 2D context
   */
  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}
