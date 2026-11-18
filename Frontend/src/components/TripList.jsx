import TripsMap from './TripsMap.jsx'

// Kort og liste over kommende ture.
function TripList({ trips, currentUser, onBook, onRefresh }) {
  // Kun ture der ikke er afgået endnu, sorteret efter afgangstidspunkt.
  const upcomingTrips = trips
    .filter((trip) => new Date(trip.afgangsTidspunkt) > new Date())
    .sort((a, b) => new Date(a.afgangsTidspunkt) - new Date(b.afgangsTidspunkt))

  return (
    <section className="panel wide">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Live fra API'et</p>
          <h2>Ledige ture</h2>
        </div>
        <button className="secondary" onClick={onRefresh}>Opdater</button>
      </div>
      <TripsMap trips={upcomingTrips} />
      <p className="hint">Linjen viser luftlinjen mellem start og slut.</p>
      {upcomingTrips.length === 0 ? <p className="empty">Der er ingen kommende ture.</p> : (
        <div className="trip-list">
          {upcomingTrips.map((trip, index) => (
            <article className="trip" key={trip.id}>
              <div><strong>{index + 1}. {trip.startLokation} → {trip.slutLokation}</strong><span>{new Date(trip.afgangsTidspunkt).toLocaleString('da-DK')}</span>{trip.startBredde == null && <span className="badge">Ikke på kortet</span>}</div>
              <div><span>{trip.antalLedigeSaeder} ledige sæder</span>{currentUser?.id === trip.chauffoerId ? <span>Din tur</span> : <button onClick={() => onBook(trip.id)} disabled={!currentUser}>Book tur</button>}</div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default TripList