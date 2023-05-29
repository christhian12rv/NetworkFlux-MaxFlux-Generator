import { useState } from 'react'
import { ReactFlowProvider } from 'reactflow'
import './App.css'
import { NetworkFlux } from './pages/NetworkFlux'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ReactFlowProvider>
        <NetworkFlux/>
      </ReactFlowProvider>
    </>
  )
}

export default App
