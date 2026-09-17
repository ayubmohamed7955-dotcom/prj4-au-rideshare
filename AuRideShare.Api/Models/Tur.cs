namespace AuRideShare.Api.Models;

/// <summary>
/// Repræsenterer en køretur som en chauffør har oprettet, og som
/// passagerer kan booke sæder på ("Opret tur" / "Betjen tur").
/// </summary>
public class Tur
{
    public int Id { get; set; }
    public int ChauffoerId { get; set; }
    public string StartLokation { get; set; } = string.Empty;
    public string SlutLokation { get; set; } = string.Empty;
    public DateTime AfgangsTidspunkt { get; set; }
    public int AntalLedigeSaeder { get; set; }
}

public class OpretTurRequest
{
    public int ChauffoerId { get; set; }
    public string StartLokation { get; set; } = string.Empty;
    public string SlutLokation { get; set; } = string.Empty;
    public DateTime AfgangsTidspunkt { get; set; }
    public int AntalLedigeSaeder { get; set; }
}
