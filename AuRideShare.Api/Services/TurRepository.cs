using AuRideShare.Api.Models;

namespace AuRideShare.Api.Services;

public interface ITurRepository
{
    IEnumerable<Tur> HentAlle();
    Tur? HentPaaId(int id);
    Tur Opret(Tur tur);
    bool NedsaetLedigeSaeder(int turId);
}

public class InMemoryTurRepository : ITurRepository
{
    private readonly List<Tur> _ture = new();
    private int _naesteId = 1;

    public IEnumerable<Tur> HentAlle() => _ture;

    public Tur? HentPaaId(int id) =>
        _ture.FirstOrDefault(t => t.Id == id);

    public Tur Opret(Tur tur)
    {
        tur.Id = _naesteId++;
        _ture.Add(tur);
        return tur;
    }

    /// <summary>
    /// Trækker ét ledigt sæde fra. Bruges når en booking accepteres.
    /// Returnerer false hvis der ikke var flere ledige sæder.
    /// </summary>
    public bool NedsaetLedigeSaeder(int turId)
    {
        var tur = HentPaaId(turId);
        if (tur is null || tur.AntalLedigeSaeder <= 0) return false;

        tur.AntalLedigeSaeder--;
        return true;
    }
}
