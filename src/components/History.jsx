export default function History({ history = [], onClear, onSelect, className = '' }) {
  return (
    <div
      className={
        'rounded-3xl p-4 bg-slate-100 ring-1 ring-slate-200 shadow-xl dark:bg-slate-950 dark:ring-white/10 ' +
        className
      }
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-slate-700 dark:text-slate-200">History</h2>
        {history.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-rose-500 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {history.length === 0 && (
        <p className="text-sm text-slate-400">No calculations yet.</p>
      )}

      <ul className="space-y-2 max-h-[34rem] overflow-y-auto">
        {history.map((h, i) => (
          <li key={h.id ?? i}>
            <button
              type="button"
              onClick={() => onSelect?.(h)}
              className="w-full text-right rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <div className="text-xs text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap">
                {h.e}
              </div>
              <div className="text-lg font-semibold text-slate-800 dark:text-slate-100 overflow-x-auto whitespace-nowrap">
                {h.r}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}