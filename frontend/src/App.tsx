import './App.css'
import { Board } from './components/Board'

function App() {
  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Miniplace</h1>

      <div className='container'>
        <Board />
      </div>
    </>
  )
}

export default App
