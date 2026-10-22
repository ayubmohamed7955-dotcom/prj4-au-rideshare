using AuRideShare.Api.Models;
using AuRideShare.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AuRideShare.Api.Controllers;

[ApiController]
[Route("api/ture")]
public class TurController : ControllerBase
{
    private readonly ITurRepository _turRepository;
    private readonly IBrugerRepository _brugerRepository;

    public TurController(ITurRepository turRepository, IBrugerRepository brugerRepository)
    {
        _turRepository = turRepository;
        _brugerRepository = brugerRepository;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Tur>> HentAlle()
    {
        return Ok(_turRepository.HentAlle());
    }

    [HttpGet("{id}")]
    public ActionResult<Tur> HentPaaId(int id)
    {
        var tur = _turRepository.HentPaaId(id);
        if (tur is null) return NotFound();

        return Ok(tur);
    }

    [HttpPost]
    [Authorize]
    public ActionResult<Tur> OpretTur(OpretTurRequest request)
    {
        var brugerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (brugerId != request.ChauffoerId) return Forbid();

        var chauffoer = _brugerRepository.HentPaaId(request.ChauffoerId);
        if (chauffoer is null)
        {
            return BadRequest("Chaufføren findes ikke.");
        }
        if (!chauffoer.ErChauffoer)
        {
            return BadRequest("Brugeren er ikke registreret som chauffør. Kald 'bliv-chauffoer' først.");
        }
        if (request.AntalLedigeSaeder <= 0)
        {
            return BadRequest("Der skal være mindst ét ledigt sæde.");
        }

        var tur = new Tur
        {
            ChauffoerId = request.ChauffoerId,
            StartLokation = request.StartLokation,
            SlutLokation = request.SlutLokation,
            AfgangsTidspunkt = request.AfgangsTidspunkt,
            AntalLedigeSaeder = request.AntalLedigeSaeder
        };

        var oprettetTur = _turRepository.Opret(tur);

        return CreatedAtAction(nameof(HentPaaId), new { id = oprettetTur.Id }, oprettetTur);
    }
}
