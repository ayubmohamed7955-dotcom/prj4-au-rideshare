import { Fragment } from 'react'
import { MapContainer, TileLayer, CircleMarker, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// Aarhus som midte for kortet: [breddegrad, længdegrad]
const AARHUS = [56.1629, 10.2039]

// Viser alle ture, der har koordinater, som en linje fra start (grøn) til slut (rød).
function TripsMap({ trips }) {
  const tripsWithCoordinates = trips.filter((trip) => trip.startBredde != null && trip.slutBredde != null)

  return (
    <MapContainer center={AARHUS} zoom={12} className="map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-bidragydere'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {tripsWithCoordinates.map((trip) => (
        <Fragment key={trip.id}>
          <Polyline positions={[[trip.startBredde, trip.startLaengde], [trip.slutBredde, trip.slutLaengde]]} />
          <CircleMarker center={[trip.startBredde, trip.startLaengde]} radius={8} color="green" />
          <CircleMarker center={[trip.slutBredde, trip.slutLaengde]} radius={8} color="red" />
        </Fragment>
      ))}
    </MapContainer>
  )
}

export default TripsMap