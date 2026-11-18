function bookingStatusLabel(status) {
  if (status === 0 || status === 'Afventer') return 'Afventer'
  if (status === 1 || status === 'Accepteret') return 'Accepteret'
  if (status === 2 || status === 'Afvist') return 'Afvist'
  return String(status)
}

// Liste over bookinger. Chaufføren på turen kan acceptere eller afvise.
function BookingList({ bookings, trips, users, currentUser, onUpdate }) {
  return (
    <section className="panel wide">
      <h2>Bookinger</h2>
      {bookings.length === 0 ? <p className="empty">Ingen bookinger endnu.</p> : bookings.map((booking) => {
        const trip = trips.find((t) => t.id === booking.turId)
        const passenger = users.find((user) => user.id === booking.passagerId)
        const isDriver = currentUser && trip?.chauffoerId === currentUser.id
        return (
          <article className="booking" key={booking.id}>
            <span>{trip ? `${trip.startLokation} → ${trip.slutLokation}` : `Tur #${booking.turId}`} · Passager: {passenger?.navn ?? `#${booking.passagerId}`}</span>
            <strong>{bookingStatusLabel(booking.status)}</strong>
            {isDriver && (booking.status === 0 || booking.status === 'Afventer') && <div><button onClick={() => onUpdate(booking.id, 'accepter')}>Accepter</button><button className="danger" onClick={() => onUpdate(booking.id, 'afvis')}>Afvis</button></div>}
          </article>
        )
      })}
    </section>
  )
}

export default BookingList