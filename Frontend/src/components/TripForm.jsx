import { useState } from 'react'
import MapPicker from './MapPicker.jsx'

const emptyTrip = { startLokation: '', slutLokation: '', afgangsTidspunkt: '', antalLedigeSaeder: 3 }
const emptyRoute = { start: null, slut: null }

// Formular til at oprette en tur, med kort til at vælge start og slut.
function TripForm({ currentUser, onCreateTrip, onBecomeDriver }) {
  const [tripForm, setTripForm] = useState(emptyTrip)
  const [route, setRoute] = useState(emptyRoute)

  async function submit(event) {
    event.preventDefault()
    if (!currentUser) return
    const created = await onCreateTrip({
      chauffoerId: currentUser.id,
      ...tripForm,
      startBredde: route.start?.lat ?? null,
      startLaengde: route.start?.lng ?? null,
      slutBredde: route.slut?.lat ?? null,
      slutLaengde: route.slut?.lng ?? null,
      afgangsTidspunkt: new Date(tripForm.afgangsTidspunkt).toISOString(),
      antalLedigeSaeder: Number(tripForm.antalLedigeSaeder),
    })
    if (created) {
      setTripForm(emptyTrip)
      setRoute(emptyRoute)
    }
  }

  return (
    <section className="panel narrow">
      <h2>Opret en tur</h2>
      <form onSubmit={submit}>
        <input required placeholder="Fra" value={tripForm.startLokation} onChange={(event) => setTripForm({ ...tripForm, startLokation: event.target.value })} />
        <input required placeholder="Til" value={tripForm.slutLokation} onChange={(event) => setTripForm({ ...tripForm, slutLokation: event.target.value })} />
        <input required type="datetime-local" value={tripForm.afgangsTidspunkt} onChange={(event) => setTripForm({ ...tripForm, afgangsTidspunkt: event.target.value })} />
        <input required min="1" type="number" placeholder="Ledige sæder" value={tripForm.antalLedigeSaeder} onChange={(event) => setTripForm({ ...tripForm, antalLedigeSaeder: event.target.value })} />
        <MapPicker route={route} onChange={setRoute} onNameFound={(field, name) => setTripForm((form) => ({ ...form, [field]: name }))} />
        <button type="submit" disabled={!currentUser?.erChauffoer}>Opret tur</button>
      </form>
      {currentUser && !currentUser.erChauffoer && (
        <>
          <p className="hint">Du skal være chauffør for at oprette ture.</p>
          <button onClick={onBecomeDriver}>Bliv chauffør</button>
        </>
      )}
    </section>
  )
}

export default TripForm