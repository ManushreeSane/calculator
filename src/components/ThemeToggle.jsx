import { useState } from 'react'

function applyTheme(dark) {
  document.documentElement.classList.toggle('dark', dark)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', dark ? '#070b1a' : '#eef2ff')
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark'),
  )

  const toggle = () => {
    const next = !dark
    setDark(next)
    applyTheme(next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {
      /* storage unavailable: the choice just won't be remembered */
    }
  }

  const label = dark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid h-8 w-8 place-items-center rounded-full bg-slate-900/5 text-slate-600 transition hover:bg-slate-900/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:bg-white/10 dark:text-amber-300 dark:hover:bg-white/15"
    >
      {dark ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}