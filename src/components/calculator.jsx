import { useEffect, useState } from 'react'
import Display from './Display'
import Keypad from './Keypad'
import History from './History'
import useCalculator from '../hooks/useCalculator'

const chip =
  'rounded-lg px-3 py-1 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 '
const chipIdle =
  'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 '

export default function Calculator() {
  const calc = useCalculator()
  const [sci, setSci] = useState(true)
  const [showHistory, setShowHistory] = useState(false)
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {
      /* storage unavailable: theme just won't be remembered */
    }
  }

  // keyboard support
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const k = e.key
      let handled = true
      if (/^[0-9]$/.test(k)) calc.press(k)
      else if (k === '.') calc.press('.')
      else if (k === '+') calc.press('+')
      else if (k === '-') calc.press('−')
      else if (k === '*' || k === 'x' || k === 'X') calc.press('×')
      else if (k === '/') calc.press('÷')
      else if (k === '^') calc.press('^')
      else if (k === '%') calc.press('%')
      else if (k === '!') calc.press('!')
      else if (k === '(' || k === ')') calc.paren()
      else if (k === 'Enter' || k === '=') calc.equals()
      else if (k === 'Backspace') calc.back()
      else if (k === 'Escape' || k === 'Delete') calc.clear()
      else handled = false
      if (handled) e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [calc])

  const expression = calc.justEvaluated
    ? `${calc.lastExpr} =`
    : calc.preview
      ? `= ${calc.preview}`
      : ''

  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-4 md:flex-row md:items-start md:justify-center">
      <section className="w-full max-w-md rounded-3xl bg-white p-4 shadow-xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-white/10">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="font-semibold text-slate-700 dark:text-slate-200">Calculator</h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className={chip + chipIdle}
              aria-label="Switch between light and dark theme"
            >
              {dark ? 'Light' : 'Dark'}
            </button>
            <button
              type="button"
              onClick={calc.toggleAngle}
              className={chip + chipIdle}
              aria-label="Switch between degrees and radians"
            >
              {calc.angle === 'deg' ? 'DEG' : 'RAD'}
            </button>
            <button
              type="button"
              onClick={() => setSci((s) => !s)}
              aria-pressed={sci}
              className={chip + (sci ? 'bg-indigo-600 text-white hover:bg-indigo-500' : chipIdle)}
            >
              Sci
            </button>
            <button
              type="button"
              onClick={() => setShowHistory((s) => !s)}
              className={chip + chipIdle + 'md:hidden'}
            >
              History
            </button>
          </div>
        </div>

        <Display
          expression={expression}
          result={calc.error || calc.expr || '0'}
          isError={!!calc.error}
          hasMemory={calc.memory !== 0}
          angle={calc.angle}
        />
        <Keypad calc={calc} sci={sci} />
      </section>

      <History
        className={'w-full max-w-md md:w-64 ' + (showHistory ? '' : 'hidden md:block')}
        history={calc.history}
        onClear={calc.clearHistory}
        onSelect={calc.selectHistory}
      />
    </div>
  )
}