import { useEffect, useRef, useState } from "react";
import "./timer.css";
import duck from "./assets/duck.gif";

// A pomodoro is 25 minutes of work and a 5 minute break. Both are here rather
// than inline so the lengths are easy to change.
const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

function format(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Three short beeps, synthesised rather than shipped as an audio file. The
// point of a pomodoro is being told when it ends, and you are by definition
// looking at something else when that happens.
function chime() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    [0, 0.22, 0.44].forEach((at) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      // Ramp instead of a hard stop, which clicks.
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + at);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + at + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + 0.18);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + at);
      osc.stop(ctx.currentTime + at + 0.2);
    });
    setTimeout(() => ctx.close(), 1200);
  } catch {
    // No audio available. The heading and the tab title still change.
  }
}

function Timer() {
  const [onBreak, setOnBreak] = useState(false);
  const [remaining, setRemaining] = useState(WORK_SECONDS);
  const [running, setRunning] = useState(false);

  const total = onBreak ? BREAK_SECONDS : WORK_SECONDS;

  // Count down off a wall-clock deadline rather than by subtracting one per
  // tick: setInterval drifts, and browsers throttle it hard in a background
  // tab, so a plain counter loses minutes while you are working in another tab.
  const deadlineRef = useRef(null);

  useEffect(() => {
    if (!running) return undefined;

    deadlineRef.current = Date.now() + remaining * 1000;

    const id = setInterval(() => {
      const left = Math.round((deadlineRef.current - Date.now()) / 1000);
      if (left <= 0) {
        setRemaining(0);
        setRunning(false);
        chime();
      } else {
        setRemaining(left);
      }
    }, 250);

    return () => clearInterval(id);
    // remaining is deliberately not a dependency - it changes every tick, and
    // including it would tear down and rebuild the interval each time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  // Switching between work and break resets the clock to the new length.
  function toggleBreak(event) {
    const next = event.target.checked;
    setOnBreak(next);
    setRunning(false);
    setRemaining(next ? BREAK_SECONDS : WORK_SECONDS);
  }

  function reset() {
    setRunning(false);
    setRemaining(total);
  }

  const done = remaining === 0;

  // The tab title, so a pomodoro that ends behind another window still says so.
  useEffect(() => {
    document.title = done
      ? (onBreak ? "Break over - CheetSheet" : "Pomodoro done - CheetSheet")
      : "CheetSheet";
    return () => {
      document.title = "CheetSheet";
    };
  }, [done, onBreak]);

  return (
    <div className="container">
      <h1 className={done ? "title is-done" : "title"}>
        {done ? "TIME!" : format(remaining)}
      </h1>
      <div className="button-holder">
        <button
          className="cool-button"
          type="button"
          onClick={() => setRunning((r) => !r)}
          disabled={done}
        >
          {running ? "PAUSE" : "START"}
        </button>
        <button className="cool-button" type="button" onClick={reset}>
          RESET
        </button>
        <label className="break-toggle">
          <input type="checkbox" checked={onBreak} onChange={toggleBreak} />
          BREAK
        </label>
      </div>
      <img
        className="duck"
        src={duck}
        alt=""
        style={{ width: "80px", height: "90px", marginLeft: "70px", marginTop: "-20px" }}
      />
    </div>
  );
}

export default Timer;
