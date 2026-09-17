using AuRideShare.Api.Models;

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
public class InMemoryBrugerRepository : IBrugerRepository
{
    private readonly List<Bruger> _brugere = new();
    private int _naesteId = 1;

    public IEnumerable<Bruger> HentAlle() => _brugere;

    public Bruger? HentPaaId(int id) =>
        _brugere.FirstOrDefault(b => b.Id == id);

    public Bruger Opret(Bruger bruger)
    {
        bruger.Id = _naesteId++;
        _brugere.Add(bruger);
        return bruger;
    }

    public bool GoerTilChauffoer(int id)
    {
        var bruger = HentPaaId(id);
        if (bruger is null) return false;

        bruger.ErChauffoer = true;
        return true;
    }
}
