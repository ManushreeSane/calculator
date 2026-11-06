// src/hooks/useCalculator.js
import { useEffect, useMemo, useState } from 'react'
import {
  appendToken,
  backspace,
  closeParens,
  evaluate,
  formatNumber,
  toggleSignOf,
} from '../utils/calc'

const HISTORY_KEY = 'advanced-calculator-history'
// pressing one of these after "=" continues from the result instead of starting fresh
const CONTINUE_KEYS = ['+', '−', '×', '÷', '^', '%', '!', '^2']
const round = (n) => Number(n.toPrecision(12))

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function useCalculator() {
  const [expr, setExpr] = useState('')
  const [lastExpr, setLastExpr] = useState('')
  const [justEvaluated, setJustEvaluated] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState(loadHistory)
  const [memory, setMemory] = useState(0)
  const [angle, setAngle] = useState('deg')

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    } catch {
      /* storage unavailable: history just won't persist */
    }
  }, [history])

  // live result shown under the expression while typing
  const preview = useMemo(() => {
    if (justEvaluated || !expr) return ''
    try {
      const text = formatNumber(evaluate(expr, angle))
      return text === expr ? '' : text
    } catch {
      return ''
    }
  }, [expr, angle, justEvaluated])

  function press(v) {
    setError('')
    let base = expr
    if (justEvaluated) {
      base = CONTINUE_KEYS.includes(v) ? expr : ''
      setJustEvaluated(false)
    }
    setExpr(appendToken(base, v))
  }

  function equals() {
    if (!expr || justEvaluated) return
    try {
      const result = formatNumber(evaluate(expr, angle))
      const shown = closeParens(expr)
      setHistory((h) => [{ id: Date.now() + Math.random(), e: shown, r: result }, ...h].slice(0, 50))
      setLastExpr(shown)
      setExpr(result)
      setJustEvaluated(true)
      setError('')
    } catch (err) {
      setError(err.message || 'Error')
    }
  }

  function back() {
    setError('')
    if (justEvaluated) {
      setExpr('')
      setLastExpr('')
      setJustEvaluated(false)
      return
    }
    setExpr(backspace(expr))
  }

  function clear() {
    setExpr('')
    setLastExpr('')
    setJustEvaluated(false)
    setError('')
  }

  function toggleSign() {
    setError('')
    setJustEvaluated(false)
    setExpr(toggleSignOf(expr))
  }

  function paren() {
    setError('')
    const base = justEvaluated ? '' : expr
    setJustEvaluated(false)
    const open = (base.match(/\(/g) || []).length
    const close = (base.match(/\)/g) || []).length
    const canClose = open > close && /[\d)πe!%]$/.test(base)
    setExpr(base + (canClose ? ')' : '('))
  }

  function reciprocal() {
    if (!expr) return
    setError('')
    setJustEvaluated(false)
    setExpr(`1÷(${expr})`)
  }

  function memOp(op) {
    if (op === 'MC') {
      setMemory(0)
      return
    }

    if (op === 'MR') {
      setError('')
      let base = justEvaluated ? '' : expr
      setJustEvaluated(false)
      base = base.replace(/[\d.]+$/, '') // recall replaces the number being typed
      if (/[)πe!%]$/.test(base)) base += '×'
      const text = formatNumber(memory)
      setExpr(base + (text.startsWith('−') || text.includes('^') ? `(${text})` : text))
      return
    }

    // M+ and M-: add or subtract the current value
    let value
    try {
      value = evaluate(expr, angle)
    } catch {
      return
    }
    setMemory((m) => round(op === 'M+' ? m + value : m - value))
    setLastExpr(closeParens(expr))
    setExpr(formatNumber(value))
    setJustEvaluated(true)
  }

  function toggleAngle() {
    setAngle((a) => (a === 'deg' ? 'rad' : 'deg'))
  }

  function clearHistory() {
    setHistory([])
  }

  function selectHistory(item) {
    setError('')
    setExpr(item.r)
    setLastExpr(item.e)
    setJustEvaluated(true)
  }

  return {
    expr,
    lastExpr,
    justEvaluated,
    error,
    preview,
    history,
    memory,
    angle,
    press,
    equals,
    back,
    clear,
    toggleSign,
    paren,
    reciprocal,
    memOp,
    toggleAngle,
    clearHistory,
    selectHistory,
  }
}