import { Component } from 'react'
import Calculator from './components/calculator'

class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <pre className="m-4 whitespace-pre-wrap rounded-xl bg-rose-100 p-4 text-sm text-rose-800">
          {String(this.state.error.stack || this.state.error)}
        </pre>
      )
    }
    return this.props.children
  }
}

function App() {
  return (
    <ErrorBoundary>
      <main className="min-h-screen flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950">
        <Calculator />
      </main>
    </ErrorBoundary>
  )
}

export default App