import Key from './Key';

const SCI_KEYS = [
  ['sin', 'sin('], ['cos', 'cos('], ['tan', 'tan('], ['ln', 'ln('], ['log', 'log('],
  ['asin', 'asin('], ['acos', 'acos('], ['atan', 'atan('], ['eˣ', 'exp('], ['|x|', 'abs('],
  ['√', 'sqrt('], ['∛', 'cbrt('], ['xʸ', '^'], ['n!', '!'], ['π', 'π'],
];

export default function Keypad({ calc, sci }) {
  const { press, equals, back, clear, toggleSign, paren, reciprocal, memOp } = calc;
  const digits = (row) =>
    row.map((d) => <Key key={d} label={d} onClick={() => press(d)} />);

  return (
    <>
      {/* Memory row */}
      <div className="grid grid-cols-4 gap-2 mb-2">
        {['MC', 'MR', 'M+', 'M−'].map((m) => (
          <button
            key={m}
            onClick={() => memOp(m === 'M−' ? 'M-' : m)}
            className="h-8 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {m}
          </button>
        ))}
      </div>

      {/* Scientific keys */}
      {sci && (
        <div className="grid grid-cols-5 gap-2 mb-2">
          {SCI_KEYS.map(([label, value]) => (
            <Key key={label} label={label} kind="fn" onClick={() => press(value)} />
          ))}
        </div>
      )}

      {/* Main keypad */}
      <div className="grid grid-cols-4 gap-2">
        <Key label="AC" kind="clr" onClick={clear} />
        <Key label="⌫" kind="fn" onClick={back} />
        <Key label="( )" kind="fn" onClick={paren} />
        <Key label="÷" kind="op" onClick={() => press('÷')} />

        {digits(['7', '8', '9'])}
        <Key label="×" kind="op" onClick={() => press('×')} />

        {digits(['4', '5', '6'])}
        <Key label="−" kind="op" onClick={() => press('−')} />

        {digits(['1', '2', '3'])}
        <Key label="+" kind="op" onClick={() => press('+')} />

        <Key label="±" kind="fn" onClick={toggleSign} />
        <Key label="0" onClick={() => press('0')} />
        <Key label="." onClick={() => press('.')} />
        <Key label="=" kind="eq" onClick={equals} />

        <Key label="%" kind="fn" onClick={() => press('%')} />
        <Key label="e" kind="fn" onClick={() => press('e')} />
        <Key label="1/x" kind="fn" onClick={reciprocal} />
        <Key label="x²" kind="fn" onClick={() => press('^2')} />
      </div>
    </>
  );
}