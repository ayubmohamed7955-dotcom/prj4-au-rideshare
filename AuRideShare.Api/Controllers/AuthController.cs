using AuRideShare.Api.Models;
using AuRideShare.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AuRideShare.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IBrugerRepository _brugerRepository;
    private readonly IPasswordHasher<Bruger> _passwordHasher;
    private readonly IConfiguration _configuration;

    public AuthController(
        IBrugerRepository brugerRepository,
        IPasswordHasher<Bruger> passwordHasher,
        IConfiguration configuration)
    {
        _brugerRepository = brugerRepository;
        _passwordHasher = passwordHasher;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public ActionResult<LoginResponse> Login(LoginRequest request)
    {
        var bruger = _brugerRepository.HentPaaEmail(request.Email);
        if (bruger is null || string.IsNullOrWhiteSpace(bruger.PasswordHash))
        {
            return Unauthorized("Forkert email eller password.");
        }

        var passwordResult = _passwordHasher.VerifyHashedPassword(
            bruger,
            bruger.PasswordHash,
            request.Password);

        if (passwordResult == PasswordVerificationResult.Failed)
        {
            return Unauthorized("Forkert email eller password.");
        }

        return Ok(new LoginResponse(CreateToken(bruger), bruger));
    }

    private string CreateToken(Bruger bruger)
    {
        var key = _configuration["Jwt:Key"]!;
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, bruger.Id.ToString()),
            new Claim(ClaimTypes.Name, bruger.Navn),
            new Claim(ClaimTypes.Email, bruger.Email),
            new Claim(ClaimTypes.Role, bruger.ErChauffoer ? "Chauffeur" : "Passager")
        };

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public record LoginRequest(string Email, string Password);
public record LoginResponse(string Token, Bruger User);