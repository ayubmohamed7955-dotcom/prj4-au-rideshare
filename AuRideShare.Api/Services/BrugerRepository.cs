using AuRideShare.Api.Models;
using AuRideShare.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace AuRideShare.Api.Services;

/// <summary>
/// Interface for hvordan vi gemmer og henter brugere. Controlleren kender
/// kun til dette interface - ikke til om data ligger i en liste i
/// hukommelsen eller i en rigtig database.
/// </summary>
public interface IBrugerRepository
{
    IEnumerable<Bruger> HentAlle();
    Bruger? HentPaaId(int id);
    Bruger Opret(Bruger bruger);
    bool GoerTilChauffoer(int id);
}

/// <summary>
/// Midlertidig implementering der gemmer data i en liste i hukommelsen.
/// Data forsvinder når API'et genstartes - det er meningen på dette
/// stadie. Udskiftes senere med en implementering der bruger
/// Entity Framework/MongoDB.
/// </summary>
public class EfBrugerRepository : IBrugerRepository
{
    private readonly RideShareDbContext _db;

    public EfBrugerRepository(RideShareDbContext db) => _db = db;

    public IEnumerable<Bruger> HentAlle() => _db.Brugere.AsNoTracking().ToList();

    public Bruger? HentPaaId(int id) => _db.Brugere.Find(id);

    public Bruger Opret(Bruger bruger)
    {
        _db.Brugere.Add(bruger);
        _db.SaveChanges();
        return bruger;
    }

    public bool GoerTilChauffoer(int id)
    {
        var bruger = _db.Brugere.Find(id);
        if (bruger is null) return false;

        bruger.ErChauffoer = true;
        _db.SaveChanges();
        return true;
    }
}
