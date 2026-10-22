using AuRideShare.Api.Models;
using AuRideShare.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AuRideShare.Api.Controllers;

[ApiController]
[Route("api/brugere")]
public class BrugerController : ControllerBase
{
    private readonly IBrugerRepository _brugerRepository;
    private readonly IPasswordHasher<Bruger> _passwordHasher;

    public BrugerController(
        IBrugerRepository brugerRepository,
        IPasswordHasher<Bruger> passwordHasher)
    {
        _brugerRepository = brugerRepository;
        _passwordHasher = passwordHasher;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Bruger>> HentAlle()
    {
        return Ok(_brugerRepository.HentAlle());
    }

    [HttpGet("{id}")]
    public ActionResult<Bruger> HentPaaId(int id)
    {
        var bruger = _brugerRepository.HentPaaId(id);
        if (bruger is null) return NotFound();

        return Ok(bruger);
    }

    [HttpPost]
    public ActionResult<Bruger> OpretBruger(OpretBrugerRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Navn) ||
            string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest("Navn, email og password skal udfyldes.");
        }

        var bruger = new Bruger
        {
            Navn = request.Navn,
            Email = request.Email
        };
        bruger.PasswordHash = _passwordHasher.HashPassword(bruger, request.Password);

        var oprettetBruger = _brugerRepository.Opret(bruger);

        return CreatedAtAction(nameof(HentPaaId), new { id = oprettetBruger.Id }, oprettetBruger);
    }

    [HttpPatch("{id}/bliv-chauffoer")]
    public IActionResult BlivChauffoer(int id)
    {
        var lykkedes = _brugerRepository.GoerTilChauffoer(id);
        if (!lykkedes) return NotFound();

        return NoContent();
    }
}
