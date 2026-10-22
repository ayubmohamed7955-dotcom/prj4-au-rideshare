using AuRideShare.Api.Models;
using AuRideShare.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace AuRideShare.Api.Services;

/// Lagring af brugere.
public interface IBrugerRepository
{
    IEnumerable<Bruger> HentAlle();
    Bruger? HentPaaId(int id);
    Bruger? HentPaaEmail(string email);
    Bruger Opret(Bruger bruger);
    bool GoerTilChauffoer(int id);
}

/// Databaseimplementering for brugere.
public class EfBrugerRepository : IBrugerRepository
{
    private readonly RideShareDbContext _db;

    public EfBrugerRepository(RideShareDbContext db) => _db = db;

    public IEnumerable<Bruger> HentAlle() => _db.Brugere.AsNoTracking().ToList();

    public Bruger? HentPaaId(int id) => _db.Brugere.Find(id);

    public Bruger? HentPaaEmail(string email) =>
        _db.Brugere.FirstOrDefault(b => b.Email == email);

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
