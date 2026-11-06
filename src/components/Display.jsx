import { useEffect, useRef } from 'react'

function sizeFor(len) {
  if (len <= 8) return 'text-4xl sm:text-5xl'
  if (len <= 12) return 'text-3xl sm:text-4xl'
  if (len <= 18) return 'text-2xl sm:text-3xl'
  return 'text-lg sm:text-xl'
}

const pill =
  'rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-300'

export default function Display({
  expression,
  result,
  isError = false,
  hasMemory = false,
  angle = 'deg',
}) {
  const exprRef = useRef(null)

  // keep the newest part of a long expression in view
  useEffect(() => {
    const el = exprRef.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [expression])

  return (
    <div className="mb-3 rounded-2xl bg-gradient-to-br from-white to-indigo-50/80 p-3 text-right ring-1 ring-indigo-100 sm:mb-4 sm:p-4 dark:from-white/[0.07] dark:to-white/[0.02] dark:ring-white/10">
      <div className="flex items-center gap-2">
        <div className="flex shrink-0 gap-1.5">
          <span className={pill}>{angle.toUpperCase()}</span>
          {hasMemory && <span className={pill}>M</span>}
        </div>
        <div
          ref={exprRef}
          className="thin-scroll min-h-5 flex-1 overflow-x-auto whitespace-nowrap text-right text-xs text-slate-500 sm:text-sm dark:text-slate-400"
        >
          {expression}
        </div>
      </div>
      <div
        aria-live="polite"
        className={
          'mt-1 min-h-12 break-all font-semibold tabular-nums leading-tight ' +
          (isError
            ? 'text-lg text-rose-500 sm:text-xl dark:text-rose-400'
            : sizeFor(result.length) + ' text-slate-900 dark:text-white')
        }
      >
        {result}
      </div>
    </div>
  )
}