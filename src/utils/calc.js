// src/utils/calc.js
// Expression parser plus editing helpers for the calculator.
// No eval(): a small recursive-descent parser evaluates everything.

const FUNC_NAMES = ['asin', 'acos', 'atan', 'sqrt', 'cbrt', 'sin', 'cos', 'tan', 'log', 'exp', 'abs', 'ln']

const OP_MAP = {
  '+': '+', '−': '-', '-': '-',
  '×': '*', '*': '*',
  '÷': '/', '/': '/',
  '^': '^', '!': '!', '%': '%',
  '(': '(', ')': ')',
}

// ---------- tokenizer ----------
function tokenize(src) {
  const s = src.toLowerCase()
  const tokens = []
  let i = 0
  while (i < s.length) {
    const c = s[i]
    if (c === ' ') { i++; continue }

    if (/[0-9.]/.test(c)) {
      let j = i
      while (j < s.length && /[0-9.]/.test(s[j])) j++
      const text = s.slice(i, j)
      if (text === '.' || text.split('.').length > 2) throw new Error('Invalid number')
      tokens.push({ type: 'num', value: parseFloat(text) })
      i = j
      continue
    }

    if (c === 'π') { tokens.push({ type: 'const', value: Math.PI }); i++; continue }

    // whole-word matching, so "exp(" is never confused with the constant e
    const fn = FUNC_NAMES.find((name) => s.startsWith(name, i))
    if (fn) { tokens.push({ type: 'func', value: fn }); i += fn.length; continue }

    if (c === 'e') { tokens.push({ type: 'const', value: Math.E }); i++; continue }

    if (OP_MAP[c]) { tokens.push({ type: 'op', value: OP_MAP[c] }); i++; continue }

    throw new Error('Invalid character')
  }
  return tokens
}

function factorial(n) {
  if (!Number.isInteger(n) || n < 0) throw new Error('Invalid input')
  if (n > 170) throw new Error('Result too large')
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

// ---------- evaluator ----------
export function evaluate(src, angle = 'deg') {
  const tokens = tokenize(String(src))
  if (tokens.length === 0) throw new Error('Empty expression')
  let pos = 0

  const peek = () => tokens[pos]
  const isOp = (v) => peek() && peek().type === 'op' && peek().value === v
  const toRad = (x) => (angle === 'deg' ? (x * Math.PI) / 180 : x)
  const fromRad = (x) => (angle === 'deg' ? (x * 180) / Math.PI : x)
  const clean = (x) => (Math.abs(x) < 1e-12 ? 0 : x)

  const fns = {
    sin: (x) => clean(Math.sin(toRad(x))),
    cos: (x) => clean(Math.cos(toRad(x))),
    tan: (x) => {
      if (angle === 'deg' && (((x % 180) + 180) % 180) === 90) throw new Error('Undefined')
      return clean(Math.tan(toRad(x)))
    },
    asin: (x) => { if (Math.abs(x) > 1) throw new Error('Invalid input'); return fromRad(Math.asin(x)) },
    acos: (x) => { if (Math.abs(x) > 1) throw new Error('Invalid input'); return fromRad(Math.acos(x)) },
    atan: (x) => fromRad(Math.atan(x)),
    ln: (x) => { if (x <= 0) throw new Error('Invalid input'); return Math.log(x) },
    log: (x) => { if (x <= 0) throw new Error('Invalid input'); return Math.log10(x) },
    exp: (x) => Math.exp(x),
    abs: (x) => Math.abs(x),
    sqrt: (x) => { if (x < 0) throw new Error('Invalid input'); return Math.sqrt(x) },
    cbrt: (x) => Math.cbrt(x),
  }

  const startsOperand = () => {
    const t = peek()
    return !!t && (t.type === 'num' || t.type === 'const' || t.type === 'func' || (t.type === 'op' && t.value === '('))
  }

  // a missing ")" at the very end is closed automatically
  const closeParen = () => {
    if (pos >= tokens.length) return
    if (isOp(')')) { pos++; return }
    throw new Error('Invalid expression')
  }

  function parseExpr() {
    let v = parseTerm()
    while (isOp('+') || isOp('-')) {
      const op = tokens[pos++].value
      const r = parseTerm()
      v = op === '+' ? v + r : v - r
    }
    return v
  }

  function parseTerm() {
    let v = parseUnary()
    for (;;) {
      if (isOp('*')) { pos++; v *= parseUnary() }
      else if (isOp('/')) {
        pos++
        const d = parseUnary()
        if (d === 0) throw new Error('Cannot divide by zero')
        v /= d
      } else if (startsOperand()) {
        v *= parseUnary() // implicit multiplication: 2π, 3(4), 2sin(30)
      } else return v
    }
  }

  function parseUnary() {
    if (isOp('-')) { pos++; return -parseUnary() }
    if (isOp('+')) { pos++; return parseUnary() }
    return parsePower()
  }

  function parsePower() {
    const base = parsePostfix()
    if (isOp('^')) {
      pos++
      return Math.pow(base, parseUnary()) // right-associative
    }
    return base
  }

  function parsePostfix() {
    let v = parsePrimary()
    while (isOp('!') || isOp('%')) {
      const op = tokens[pos++].value
      v = op === '!' ? factorial(v) : v / 100
    }
    return v
  }

  function parsePrimary() {
    const t = tokens[pos++]
    if (!t) throw new Error('Incomplete expression')
    if (t.type === 'num' || t.type === 'const') return t.value
    if (t.type === 'func') {
      if (!isOp('(')) throw new Error('Invalid expression')
      pos++
      const arg = parseExpr()
      closeParen()
      return fns[t.value](arg)
    }
    if (t.type === 'op' && t.value === '(') {
      const v = parseExpr()
      closeParen()
      return v
    }
    throw new Error('Invalid expression')
  }

  const value = parseExpr()
  if (pos < tokens.length) throw new Error('Invalid expression')
  if (!Number.isFinite(value)) throw new Error('Math error')
  return value
}

// ---------- output formatting ----------
export function formatNumber(n) {
  if (n === 0 || Object.is(n, -0)) return '0'
  const abs = Math.abs(n)
  let out
  if (abs >= 1e15 || abs < 1e-6) {
    // written as 1.5×10^21 so the result can be typed back into an expression
    const [mant, exp] = n.toExponential(10).split('e')
    out = `${parseFloat(mant)}×10^${parseInt(exp, 10)}`
  } else {
    out = String(parseFloat(n.toPrecision(12)))
  }
  return out.replace(/-/g, '−')
}

export function closeParens(expr) {
  const open = (expr.match(/\(/g) || []).length
  const close = (expr.match(/\)/g) || []).length
  return expr + ')'.repeat(Math.max(0, open - close))
}

// ---------- editing helpers ----------
const BIN_OPS = ['+', '−', '×', '÷', '^']
const ENDS_OPERAND = /[\d)πe]$/

export function appendToken(expr, v) {
  if (expr.length > 150) return expr

  if (/^\d$/.test(v)) return expr + v

  if (v === '.') {
    const seg = expr.match(/[\d.]*$/)[0]
    if (seg.includes('.')) return expr
    return expr + (seg === '' ? '0.' : '.')
  }

  if (BIN_OPS.includes(v)) {
    if (v === '−') {
      if (/[+−]$/.test(expr)) return expr.slice(0, -1) + '−'
      return expr + '−' // also allows 5×−3 and a leading minus
    }
    const base = expr.replace(/[+−×÷^]+$/, '')
    if (base === '' || base.endsWith('(')) return expr
    return base + v
  }

  if (v === '%' || v === '!' || v === '^2') {
    return ENDS_OPERAND.test(expr) || /[%!]$/.test(expr) ? expr + v : expr
  }

  // digits, constants, functions, parentheses
  return expr + v
}

export function backspace(expr) {
  // removes a whole "sin(" at once, otherwise one character
  return expr.replace(/(asin|acos|atan|sqrt|cbrt|sin|cos|tan|log|exp|abs|ln)\($|.$/, '')
}

export function toggleSignOf(expr) {
  const m = expr.match(/(^|[(+−×÷^])(−?)(\d+\.?\d*|\.\d+|π|e)$/)
  if (!m) return expr
  const start = m.index + m[1].length
  return expr.slice(0, start) + (m[2] ? '' : '−') + m[3]
}
