import { createFileRoute } from '@tanstack/react-router'
import MathGame from '../components/MathGame'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return <MathGame />
}
