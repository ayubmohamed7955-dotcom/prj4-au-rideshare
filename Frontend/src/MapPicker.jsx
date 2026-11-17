import { MapContainer, TileLayer, CircleMarker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// Aarhus som midte for kortet: [breddegrad, længdegrad]
const AARHUS = [56.1629, 10.2039]

// Lytter efter klik på kortet og giver koordinaterne videre.
function ClickHandler({ onPick }) {
  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng)
    },
  })
  return null
}

// Kort hvor man klikker for at vælge start og slut.
// 1. klik = start, 2. klik = slut, 3. klik starter forfra.
// route = { start: {lat, lng} | null, slut: {lat, lng} | null }
function MapPicker({ route, onChange }) {
  function handlePick(lat, lng) {
    if (!route.start || route.slut) {
      onChange({ start: { lat, lng }, slut: null })
    } else {
      onChange({ start: route.start, slut: { lat, lng } })
    }
  }

  return (
    <div>
      <MapContainer center={AARHUS} zoom={12} className="map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-bidragydere'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onPick={handlePick} />
        {route.start && <CircleMarker center={[route.start.lat, route.start.lng]} radius={8} color="green" />}
        {route.slut && <CircleMarker center={[route.slut.lat, route.slut.lng]} radius={8} color="red" />}
      </MapContainer>
      <p className="hint">
        {!route.start && 'Klik på kortet for at vælge start (grøn).'}
        {route.start && !route.slut && 'Klik igen for at vælge slut (rød).'}
        {route.start && route.slut && 'Start og slut er valgt. Klik igen for at vælge forfra.'}
      </p>
    </div>
  )
}

export default MapPicker