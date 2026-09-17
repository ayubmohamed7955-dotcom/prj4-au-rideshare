# AU RideShare – Backend API (trin 1–3)

Dette er en start-skabelon for backenden, der dækker jeres trin 1–3:

1. **C#-projekt sat op** – ASP.NET Core Web API med Controllers/Models/Services.
2. **Datamodeller** – `Bruger`, `Tur`, `Booking` i `Models/`.
3. **Endpoints mod in-memory data** – gemmer alt i hukommelsen via `Services/`,
   så I kan komme i gang uden en database. Når I senere sætter en rigtig
   database op, er det kun `Services`-klasserne der skal skiftes ud —
   controllerne rører I ikke.

## Sådan kører du det

Kræver [.NET 8 SDK](https://dotnet.microsoft.com/download).

```bash
cd AuRideShare.Api
dotnet restore
dotnet run
```

API'et starter typisk på `http://localhost:5000` (porten skrives i terminalen
når serveren starter). Test endpoints med curl-eksemplerne nedenfor, eller
åbn `requests.http` i VS Code (kræver "REST Client"-extensionen) og klik
"Send Request" over hver blok.

## Endpoints

### Brugere
| Metode | Route                              | Beskrivelse                          |
|--------|-------------------------------------|---------------------------------------|
| GET    | `/api/brugere`                     | Hent alle brugere                    |
| GET    | `/api/brugere/{id}`                | Hent én bruger                       |
| POST   | `/api/brugere`                     | Opret bruger                         |
| PATCH  | `/api/brugere/{id}/bliv-chauffoer` | Gør en bruger til chauffør           |

### Ture
| Metode | Route              | Beskrivelse                                         |
|--------|---------------------|------------------------------------------------------|
| GET    | `/api/ture`        | Hent alle ture                                       |
| GET    | `/api/ture/{id}`   | Hent én tur                                          |
| POST   | `/api/ture`        | Opret tur (kræver at brugeren er chauffør)           |

### Bookinger
| Metode | Route                          | Beskrivelse                          |
|--------|----------------------------------|----------------------------------------|
| GET    | `/api/bookings`                | Hent alle bookinger                  |
| POST   | `/api/bookings`                | Book en tur (opretter status "Afventer") |
| PATCH  | `/api/bookings/{id}/accepter`  | Chauffør accepterer en booking       |
| PATCH  | `/api/bookings/{id}/afvis`     | Chauffør afviser en booking          |

## Test med curl

```bash
# Opret en bruger
curl -X POST http://localhost:5000/api/brugere \
  -H "Content-Type: application/json" \
  -d '{"navn":"Anna","email":"anna@au.dk"}'

# Gør bruger 1 til chauffør
curl -X PATCH http://localhost:5000/api/brugere/1/bliv-chauffoer

# Opret en tur
curl -X POST http://localhost:5000/api/ture \
  -H "Content-Type: application/json" \
  -d '{"chauffoerId":1,"startLokation":"Aarhus","slutLokation":"Aalborg","afgangsTidspunkt":"2026-09-20T08:00:00","antalLedigeSaeder":3}'

# Book turen (som en anden bruger, fx id 2)
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"turId":1,"passagerId":2}'

# Chaufføren accepterer bookingen
curl -X PATCH http://localhost:5000/api/bookings/1/accepter
```

## Næste skridt (trin 4 og frem – tal med frontend-gruppen)

- Aftal request/response-format og fejlkoder med frontend.
- Sæt Git-repo og en simpel CI-pipeline op.
- Skriv et par tests på forretningslogikken (fx "kan ikke booke uden ledige sæder").
- Byt in-memory-repositories ud med en rigtig database (SQL/Mongo).
- Læg Auth og Maps til til sidst.
