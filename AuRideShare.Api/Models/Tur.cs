namespace AuRideShare.Api.Models;

/// En køretur med ledige sæder.
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
