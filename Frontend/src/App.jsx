import { useState } from 'react'

function App() {
  const [view, setView] = useState('bilist')

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '50px' }}>
      {/* Menu knapper */}
      <nav style={{ marginBottom: '30px' }}>
        <button
          onClick={() => setView('bilist')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            cursor: 'pointer',
            fontWeight: view === 'bilist' ? 'bold' : 'normal',
            backgroundColor: view === 'bilist' ? '#2563eb' : '#e5e7eb',
            color: view === 'bilist' ? '#ffffff' : '#000000',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Bilist
        </button>

        <button
          onClick={() => setView('passager')}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            fontWeight: view === 'passager' ? 'bold' : 'normal',
            backgroundColor: view === 'passager' ? '#2563eb' : '#e5e7eb',
            color: view === 'passager' ? '#ffffff' : '#000000',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Passager
        </button>
      </nav>

      <hr style={{ maxWidth: '300px', margin: '0 auto 30px' }} />

      {/* Indhold afhængigt af valgt side */}
      <main>
        {view === 'bilist' ? (
          <div>
            <h1>Bilist</h1>
            <p>Opret en tur eller administrer dine ledige pladser.</p>
          </div>
        ) : (
          <div>
            <h1>Passager</h1>
            <p>Find et lift og reserver en plads.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App