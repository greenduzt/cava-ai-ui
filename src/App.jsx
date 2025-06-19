import { useState } from 'react'
import './App.css'
import LiveKitModal from './components/LiveKitModal';
import icon from './assets/CAVA_logo_yellow.png'

function App() {
  const [showSupport, setShowSupport] = useState(false)

  const handleSupportClick = () => {
    setShowSupport(true);   
  }

  return (
    <div>
      <header className="header">
        <img src={icon} alt="Cafe AI" className="logo-icon" />
        
      </header>
      <main>
        <section className='hero'>
          <h1>5th Coffee is <i>FREE</i></h1>
          <p>Use our AI voice assistant to check your loyalty points.</p>
            <button className='support-button' onClick={handleSupportClick}>
              Talk to CAVA
            </button>
        </section>
        
      </main>
      {showSupport && <LiveKitModal setShowSupport={setShowSupport} />}
    </div>
  )
}

export default App
