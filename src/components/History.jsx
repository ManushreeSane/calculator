export default function History({ history = [], onClear, onSelect, className = '' }) {
  return (
    <aside
      aria-label="History"
      className={
        'rounded-3xl bg-white/70 p-4 shadow-[0_24px_60px_-28px_rgba(79,70,229,0.4)] ring-1 ring-white/70 backdrop-blur-xl dark:bg-slate-900/60 dark:shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)] dark:ring-white/10 ' +
        className
      }
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">History</h2>
        {history.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-md px-2 py-1 text-xs font-medium text-rose-500 transition hover:bg-rose-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            Clear
          </button>
        )}
      </div>

      {history.length === 0 && (
        <p className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
          No calculations yet.
        </p>
      )}

      <ul className="thin-scroll max-h-64 space-y-1.5 overflow-y-auto md:max-h-[28rem]">
        {history.map((h, i) => (
          <li key={h.id ?? i}>
            <button
              type="button"
              onClick={() => onSelect?.(h)}
              className="w-full rounded-xl px-3 py-2 text-right transition hover:bg-indigo-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <div className="thin-scroll overflow-x-auto whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                {h.e}
              </div>
              <div className="thin-scroll overflow-x-auto whitespace-nowrap text-base font-semibold tabular-nums text-slate-800 dark:text-slate-100">
                {h.r}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}