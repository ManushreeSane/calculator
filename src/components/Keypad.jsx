import Key from './Key'

const SCI_KEYS = [
  ['sin', 'sin('], ['cos', 'cos('], ['tan', 'tan('], ['ln', 'ln('], ['log', 'log('],
  ['asin', 'asin('], ['acos', 'acos('], ['atan', 'atan('], ['eˣ', 'exp('], ['|x|', 'abs('],
  ['√', 'sqrt('], ['∛', 'cbrt('], ['xʸ', '^'], ['n!', '!'], ['π', 'π'],
]

const memBtn =
  'h-8 rounded-lg text-[11px] sm:text-xs font-semibold tracking-wide text-slate-500 transition hover:bg-slate-900/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:text-slate-400 dark:hover:bg-white/10'

export default function Keypad({ calc, sci }) {
  const { press, equals, back, clear, toggleSign, paren, reciprocal, memOp } = calc
  const digits = (row) =>
    row.map((d) => <Key key={d} label={d} onClick={() => press(d)} />)

  return (
    <div className="space-y-2 sm:space-y-2.5">
      {/* Memory row */}
      <div className="grid grid-cols-4 gap-1">
        {['MC', 'MR', 'M+', 'M−'].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => memOp(m === 'M−' ? 'M-' : m)}
            className={memBtn}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Scientific keys */}
      {sci && (
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {SCI_KEYS.map(([label, value]) => (
            <Key key={label} label={label} kind="fn" onClick={() => press(value)} />
          ))}
        </div>
      )}

      {/* Main keypad */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5">
        <Key label="%" kind="fn" onClick={() => press('%')} ariaLabel="percent" />
        <Key label="e" kind="fn" onClick={() => press('e')} ariaLabel="Euler's number" />
        <Key label="1/x" kind="fn" onClick={reciprocal} ariaLabel="reciprocal" />
        <Key label="x²" kind="fn" onClick={() => press('^2')} ariaLabel="square" />

        <Key label="AC" kind="clr" onClick={clear} ariaLabel="all clear" />
        <Key label="⌫" kind="fn" onClick={back} ariaLabel="backspace" />
        <Key label="( )" kind="fn" onClick={paren} ariaLabel="parentheses" />
        <Key label="÷" kind="op" onClick={() => press('÷')} ariaLabel="divide" />

        {digits(['7', '8', '9'])}
        <Key label="×" kind="op" onClick={() => press('×')} ariaLabel="multiply" />

        {digits(['4', '5', '6'])}
        <Key label="−" kind="op" onClick={() => press('−')} ariaLabel="subtract" />

        {digits(['1', '2', '3'])}
        <Key label="+" kind="op" onClick={() => press('+')} ariaLabel="add" />

        <Key label="±" kind="fn" onClick={toggleSign} ariaLabel="change sign" />
        <Key label="0" onClick={() => press('0')} />
        <Key label="." onClick={() => press('.')} ariaLabel="decimal point" />
        <Key label="=" kind="eq" onClick={equals} ariaLabel="equals" />
      </div>
    </div>
  )
}