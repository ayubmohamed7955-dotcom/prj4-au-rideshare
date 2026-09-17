using AuRideShare.Api.Models;
using AuRideShare.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AuRideShare.Api.Controllers;

[ApiController]
[Route("api/brugere")]
public class BrugerController : ControllerBase
{
    private readonly IBrugerRepository _brugerRepository;

    public BrugerController(IBrugerRepository brugerRepository)
    {
        _brugerRepository = brugerRepository;
    }

    // GET /api/brugere
    [HttpGet]
    public ActionResult<IEnumerable<Bruger>> HentAlle()
    {
        return Ok(_brugerRepository.HentAlle());
    }

    // GET /api/brugere/5
    [HttpGet("{id}")]
    public ActionResult<Bruger> HentPaaId(int id)
    {
        var bruger = _brugerRepository.HentPaaId(id);
        if (bruger is null) return NotFound();

        return Ok(bruger);
    }

    // POST /api/brugere  -> use case "Opret bruger"
    [HttpPost]
    public ActionResult<Bruger> OpretBruger(OpretBrugerRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Navn) ||
            string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest("Navn og email skal udfyldes.");
        }

        var bruger = new Bruger
        {
            Navn = request.Navn,
            Email = request.Email
        };

        var oprettetBruger = _brugerRepository.Opret(bruger);

        return CreatedAtAction(nameof(HentPaaId), new { id = oprettetBruger.Id }, oprettetBruger);
    }

    // PATCH /api/brugere/5/bliv-chauffoer -> use case "Bliv bilist"
    [HttpPatch("{id}/bliv-chauffoer")]
    public IActionResult BlivChauffoer(int id)
    {
        var lykkedes = _brugerRepository.GoerTilChauffoer(id);
        if (!lykkedes) return NotFound();

        return NoContent();
    }
}
