using AuRideShare.Api.Models;
using AuRideShare.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace AuRideShare.Api.Services;

public interface ITurRepository
{
    IEnumerable<Tur> HentAlle();
    Tur? HentPaaId(int id);
    Tur Opret(Tur tur);
    bool NedsaetLedigeSaeder(int turId);
}

public class EfTurRepository : ITurRepository
{
    private readonly RideShareDbContext _db;

    public EfTurRepository(RideShareDbContext db) => _db = db;

    public IEnumerable<Tur> HentAlle() => _db.Ture.AsNoTracking().ToList();

    public Tur? HentPaaId(int id) => _db.Ture.Find(id);

    public Tur Opret(Tur tur)
    {
        _db.Ture.Add(tur);
        _db.SaveChanges();
        return tur;
    }

    /// Trækker ét ledigt sæde fra.
    public bool NedsaetLedigeSaeder(int turId)
    {
        var tur = _db.Ture.Find(turId);
        if (tur is null || tur.AntalLedigeSaeder <= 0) return false;

        tur.AntalLedigeSaeder--;
        _db.SaveChanges();
        return true;
    }
}
