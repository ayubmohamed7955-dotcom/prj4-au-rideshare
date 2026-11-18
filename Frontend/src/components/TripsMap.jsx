import { Fragment } from 'react'
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// Aarhus som midte for kortet: [breddegrad, længdegrad]
const AARHUS = [56.1629, 10.2039]

// Viser turene med koordinater som en linje fra start (grøn) til slut (rød).
// Nummeret ved startpunktet er det samme som turens nummer i listen.
function TripsMap({ trips }) {
  return (
    <MapContainer center={AARHUS} zoom={12} className="map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-bidragydere'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {trips.map((trip, index) => {
        if (trip.startBredde == null || trip.slutBredde == null) return null
        return (
          <Fragment key={trip.id}>
            <Polyline positions={[[trip.startBredde, trip.startLaengde], [trip.slutBredde, trip.slutLaengde]]} />
            <CircleMarker center={[trip.startBredde, trip.startLaengde]} radius={8} color="green">
              <Tooltip permanent direction="top">{index + 1}</Tooltip>
            </CircleMarker>
            <CircleMarker center={[trip.slutBredde, trip.slutLaengde]} radius={8} color="red" />
          </Fragment>
        )
      })}
    </MapContainer>
  )
}

export default TripsMap