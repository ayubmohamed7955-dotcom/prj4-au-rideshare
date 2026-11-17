import { MapContainer, TileLayer, CircleMarker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// Aarhus som midte for kortet: [breddegrad, længdegrad]
const AARHUS = [56.1629, 10.2039]

// Slår koordinater op i Nominatim (OpenStreetMap) og returnerer et kort stednavn.
// Returnerer tom tekst, hvis opslaget fejler. Så kan brugeren selv skrive stedet.
async function findPlaceName(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=17&accept-language=da`,
    )
    if (!response.ok) return ''
    const data = await response.json()
    const address = data.address ?? {}
    const place = address.suburb || address.city || address.town || address.village
    return [address.road, place].filter(Boolean).join(', ') || data.display_name || ''
  } catch {
    return ''
  }
}

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
// onNameFound(felt, tekst) udfylder "Fra" (startLokation) eller "Til" (slutLokation).
function MapPicker({ route, onChange, onNameFound }) {
  async function fillName(field, lat, lng) {
    onNameFound(field, '')
    const name = await findPlaceName(lat, lng)
    if (name) onNameFound(field, name)
  }

function handlePick(exactLat, exactLng) {
    // Afrund til 3 decimaler (ca. 100 meter), så en privat adresse ikke gemmes præcist.
    const lat = Math.round(exactLat * 1000) / 1000
    const lng = Math.round(exactLng * 1000) / 1000
    if (!route.start || route.slut) {
      onChange({ start: { lat, lng }, slut: null })
      onNameFound('slutLokation', '')
      fillName('startLokation', lat, lng)
    } else {
      onChange({ start: route.start, slut: { lat, lng } })
      fillName('slutLokation', lat, lng)
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