using System.Text.Json.Serialization;

namespace AuRideShare.Api.Models;

/// En bruger kan være passager og chauffør.
public class Bruger
{
    public int Id { get; set; }
    public string Navn { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool ErChauffoer { get; set; } = false;
    [JsonIgnore]
    public string PasswordHash { get; set; } = string.Empty;
}

/// Data til oprettelse af en bruger.
public class OpretBrugerRequest
{
    public string Navn { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
