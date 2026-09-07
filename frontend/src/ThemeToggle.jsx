import { useEffect, useState } from "react";

// The two themes declared in index.css.
const LIGHT = "cupcake";
const DARK = "dracula";
const STORAGE_KEY = "cheetsheet-theme";

// A stored choice wins. Failing that, follow the system - which is also what
// daisyUI does on its own before this component mounts, so the first paint and
// the first render agree and the page does not flash the wrong theme.
function initialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === LIGHT || saved === DARK) return saved;
  } catch {
    // Safari in private mode throws on localStorage rather than returning null.
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? DARK : LIGHT;
}

function ThemeToggle() {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Not being able to remember the choice is not a reason to not apply it.
    }
  }, [theme]);

  const dark = theme === DARK;

  return (
    <button
      type="button"
      className="btn btn-ghost btn-circle"
      aria-pressed={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      onClick={() => setTheme(dark ? LIGHT : DARK)}
    >
      {dark ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round"
                d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6l1.4 1.4m10 10l1.4 1.4m0-12.8l-1.4 1.4m-10 10l-1.4 1.4" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;
