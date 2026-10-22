using AuRideShare.Api.Models;
using AuRideShare.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AuRideShare.Api.Controllers;

[ApiController]
[Route("api/bookings")]
public class BookingController : ControllerBase
{
    private readonly IBookingRepository _bookingRepository;
    private readonly ITurRepository _turRepository;
    private readonly IBrugerRepository _brugerRepository;

    public BookingController(
        IBookingRepository bookingRepository,
        ITurRepository turRepository,
        IBrugerRepository brugerRepository)
    {
        _bookingRepository = bookingRepository;
        _turRepository = turRepository;
        _brugerRepository = brugerRepository;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Booking>> HentAlle()
    {
        return Ok(_bookingRepository.HentAlle());
    }

    [HttpPost]
    [Authorize]
    public ActionResult<Booking> BookTur(OpretBookingRequest request)
    {
        var brugerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (brugerId != request.PassagerId) return Forbid();
        if (_brugerRepository.HentPaaId(request.PassagerId) is null)
        {
            return BadRequest("Passageren findes ikke.");
        }

        var tur = _turRepository.HentPaaId(request.TurId);
        if (tur is null) return BadRequest("Turen findes ikke.");
        if (tur.AntalLedigeSaeder <= 0) return BadRequest("Der er ikke flere ledige sæder på denne tur.");

        var booking = new Booking
        {
            TurId = request.TurId,
            PassagerId = request.PassagerId,
            Status = BookingStatus.Afventer
        };

        var oprettetBooking = _bookingRepository.Opret(booking);

        return CreatedAtAction(nameof(HentAlle), oprettetBooking);
    }

    [HttpPatch("{id}/accepter")]
    [Authorize]
    public IActionResult AccepterBooking(int id)
    {
        var booking = _bookingRepository.HentPaaId(id);
        if (booking is null) return NotFound();
        if (!ErTurensChauffoer(booking.TurId)) return Forbid();
        if (booking.Status != BookingStatus.Afventer)
        {
            return BadRequest("Bookingen er allerede behandlet.");
        }

        var saedeReserveret = _turRepository.NedsaetLedigeSaeder(booking.TurId);
        if (!saedeReserveret) return BadRequest("Der er ikke flere ledige sæder på turen.");

        _bookingRepository.OpdaterStatus(id, BookingStatus.Accepteret);
        return NoContent();
    }

    [HttpPatch("{id}/afvis")]
    [Authorize]
    public IActionResult AfvisBooking(int id)
    {
        var booking = _bookingRepository.HentPaaId(id);
        if (booking is null) return NotFound();
        if (!ErTurensChauffoer(booking.TurId)) return Forbid();
        if (booking.Status != BookingStatus.Afventer)
        {
            return BadRequest("Bookingen er allerede behandlet.");
        }

        var lykkedes = _bookingRepository.OpdaterStatus(id, BookingStatus.Afvist);
        if (!lykkedes) return NotFound();

        return NoContent();
    }

    private bool ErTurensChauffoer(int turId)
    {
        var tur = _turRepository.HentPaaId(turId);
        var brugerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return tur is not null && tur.ChauffoerId == brugerId;
    }
}
