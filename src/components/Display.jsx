// src/components/Display.jsx
export default function Display({ expression, result, isError = false, hasMemory = false, angle = 'deg' }) {
  const size =
    result.length <= 10 ? 'text-4xl' : result.length <= 16 ? 'text-3xl' : 'text-xl'

  return (
    <div className="mb-4 rounded-2xl bg-slate-200/70 p-4 text-right dark:bg-black/30">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span>
          {hasMemory ? 'M  ' : ''}
          {angle.toUpperCase()}
        </span>
        <span className="ml-3 min-h-4 max-w-full overflow-x-auto whitespace-nowrap font-normal">
          {expression}
        </span>
      </div>
      <div
        className={
          'mt-2 min-h-12 break-all font-semibold ' +
          size +
          (isError ? ' text-rose-500 !text-xl' : ' text-slate-900 dark:text-white')
        }
      >
        {result}
      </div>
    </div>
  )
}
