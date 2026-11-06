const base =
  'h-12 rounded-2xl text-lg font-medium select-none transition active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 '

const kinds = {
  num: 'bg-white text-slate-800 shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
  op: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:hover:bg-indigo-500/30',
  fn: 'bg-slate-200 text-slate-700 text-base hover:bg-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
  clr: 'bg-rose-100 text-rose-600 hover:bg-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:hover:bg-rose-500/30',
  eq: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30',
}

export default function Key({ label, onClick, kind = 'num', className = '', ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={base + (kinds[kind] ?? kinds.num) + ' ' + className}
    >
      {label}
    </button>
  )
}