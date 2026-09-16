import { useEffect, useRef } from "react";
import { CanvasRenderer } from "../../engine/CanvasRenderer.js";

/**
 * High-performance, responsive HTML5 Canvas Game Board.
 * Runs 60Hz rendering loop decoupled from React state to eliminate re-rendering overhead.
 *
 * @param {Object} props
 * @param {import('../../engine/SnakeEngine').SnakeEngine|null} props.engine
 */
export default function CanvasBoard({ engine }) {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const animFrameIdRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new CanvasRenderer(canvasRef.current);
    rendererRef.current = renderer;

    const updateSize = () => {
      if (!canvasRef.current) return;
      const container = canvasRef.current.parentElement;
      if (!container) return;
      // Precise responsive clamping between 280px and 480px
      const width = Math.min(480, Math.max(280, container.clientWidth - 16));
      renderer.resize(width);
    };

    updateSize();

    let resizeObserver = null;
    if (typeof ResizeObserver !== "undefined" && canvasRef.current.parentElement) {
      resizeObserver = new ResizeObserver(() => {
        updateSize();
      });
      resizeObserver.observe(canvasRef.current.parentElement);
    } else {
      window.addEventListener("resize", updateSize);
    }

    // Set up engine event hooks for particles & effects
    if (engine) {
      const originalEvents = engine.events || {};
      engine.setEventListeners({
        ...originalEvents,
        onEat: (pos, score) => {
          if (rendererRef.current) {
            rendererRef.current.addEatEffect(pos, 10);
          }
          if (originalEvents.onEat) {
            originalEvents.onEat(pos, score);
          }
        },
        onDie: (stats) => {
          if (rendererRef.current && engine.snake[0]) {
            rendererRef.current.addDeathEffect(engine.snake[0]);
          }
          if (originalEvents.onDie) {
            originalEvents.onDie(stats);
          }
        },
      });
    }

    const renderLoop = () => {
      if (rendererRef.current && engine) {
        rendererRef.current.render(engine.getState());
      }
      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", updateSize);
      }
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [engine]);

  return (
    <div className="flex justify-center items-center w-full">
      <canvas
        ref={canvasRef}
        className="block outline-none cursor-crosshair rounded-xl shadow-2xl shadow-emerald-950/40 border-2 border-emerald-500/40 bg-[#0c0e12] ring-1 ring-white/10"
        role="application"
        aria-label="Snake Game Arena"
        tabIndex={0}
      />
    </div>
  );
}
