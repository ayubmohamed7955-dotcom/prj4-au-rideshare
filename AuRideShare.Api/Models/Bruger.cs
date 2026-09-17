namespace AuRideShare.Api.Models;

/// <summary>
/// Repræsenterer en bruger af systemet. En bruger kan både være passager
/// og chauffør - ErChauffoer styrer om personen må oprette ture (use case
/// "Bliv bilist").
/// </summary>
public class Bruger
{
    public int Id { get; set; }
    public string Navn { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool ErChauffoer { get; set; } = false;
}

/// <summary>
/// Data klienten sender når en ny bruger oprettes ("Opret bruger").
/// Et separat DTO betyder at klienten ikke selv kan sætte Id eller
/// ErChauffoer ved oprettelse.
/// </summary>
public class OpretBrugerRequest
{
    public string Navn { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
