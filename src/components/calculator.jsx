import { useEffect, useState } from 'react'
import Display from './Display'
import Keypad from './Keypad'
import History from './History'
import ThemeToggle from './ThemeToggle'
import useCalculator from '../hooks/useCalculator'

const chip =
  'rounded-full px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 '
const chipIdle =
  'bg-slate-900/5 text-slate-600 hover:bg-slate-900/10 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15 '
const chipActive = 'bg-indigo-600 text-white hover:bg-indigo-500 '

export default function Calculator() {
  const calc = useCalculator()
  // scientific keys start hidden on phones, visible on larger screens
  const [sci, setSci] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches,
  )
  const [showHistory, setShowHistory] = useState(false)

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
    <div className="flex w-full max-w-5xl flex-col items-center gap-4 md:flex-row md:items-start md:justify-center md:gap-6">
      <section className="w-full min-w-0 max-w-md rounded-3xl bg-white/70 p-3 shadow-[0_24px_60px_-24px_rgba(79,70,229,0.45)] ring-1 ring-white/70 backdrop-blur-xl sm:p-5 lg:max-w-lg dark:bg-slate-900/60 dark:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)] dark:ring-white/10">
        <header className="mb-3 flex flex-wrap items-center justify-between gap-2 sm:mb-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
            <h1 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Calculator
            </h1>
          </div>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
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
              className={chip + (sci ? chipActive : chipIdle)}
            >
              Sci
            </button>
            <button
              type="button"
              onClick={() => setShowHistory((s) => !s)}
              aria-pressed={showHistory}
              className={chip + (showHistory ? chipActive : chipIdle) + 'md:hidden'}
            >
              History
            </button>
          </div>
        </header>

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
        className={
          'w-full max-w-md md:w-64 md:max-w-none md:shrink-0 lg:w-72 ' +
          (showHistory ? '' : 'hidden md:block')
        }
        history={calc.history}
        onClear={calc.clearHistory}
        onSelect={calc.selectHistory}
      />
    </div>
  )
}