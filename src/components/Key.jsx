const base =
  'h-11 sm:h-12 lg:h-14 rounded-xl sm:rounded-2xl text-base sm:text-lg font-medium select-none touch-manipulation transition duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 '

const kinds = {
  num: 'bg-white text-slate-800 shadow-[0_1px_0_rgba(15,23,42,0.06),0_8px_16px_-10px_rgba(15,23,42,0.3)] hover:bg-slate-50 dark:bg-white/[0.07] dark:text-slate-100 dark:shadow-none dark:ring-1 dark:ring-white/5 dark:hover:bg-white/[0.12]',
  op: 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100 hover:bg-indigo-100 dark:bg-indigo-400/15 dark:text-indigo-300 dark:ring-indigo-300/10 dark:hover:bg-indigo-400/25',
  fn: 'bg-slate-100 text-sm sm:text-base text-slate-600 hover:bg-slate-200 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.09]',
  clr: 'bg-rose-50 text-rose-600 ring-1 ring-rose-100 hover:bg-rose-100 dark:bg-rose-400/15 dark:text-rose-300 dark:ring-rose-300/10 dark:hover:bg-rose-400/25',
  eq: 'bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30 hover:brightness-110',
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