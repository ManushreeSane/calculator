import Calculator from './components/Calculator'

export default function App() {
  return (
    <main className="flex min-h-dvh items-start justify-center px-3 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-center sm:px-6 sm:pt-[max(2rem,env(safe-area-inset-top))] sm:pb-[max(2rem,env(safe-area-inset-bottom))]">
      <Calculator />
    </main>
  )
}