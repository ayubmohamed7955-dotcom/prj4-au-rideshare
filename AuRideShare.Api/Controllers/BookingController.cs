using AuRideShare.Api.Models;
using AuRideShare.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AuRideShare.Api.Controllers;

[ApiController]
[Route("api/bookings")]
public class BookingController : ControllerBase
{
    private readonly IBookingRepository _bookingRepository;
    private readonly ITurRepository _turRepository;

    public BookingController(IBookingRepository bookingRepository, ITurRepository turRepository)
    {
        _bookingRepository = bookingRepository;
        _turRepository = turRepository;
    }

    // GET /api/bookings
    [HttpGet]
    public ActionResult<IEnumerable<Booking>> HentAlle()
    {
        return Ok(_bookingRepository.HentAlle());
    }

    // POST /api/bookings -> use case "Book tur"
    [HttpPost]
    public ActionResult<Booking> BookTur(OpretBookingRequest request)
    {
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

    // PATCH /api/bookings/5/accepter -> use case "Betjen tur" (chaufføren accepterer)
    [HttpPatch("{id}/accepter")]
    public IActionResult AccepterBooking(int id)
    {
        var booking = _bookingRepository.HentPaaId(id);
        if (booking is null) return NotFound();

        var saedeReserveret = _turRepository.NedsaetLedigeSaeder(booking.TurId);
        if (!saedeReserveret) return BadRequest("Der er ikke flere ledige sæder på turen.");

        _bookingRepository.OpdaterStatus(id, BookingStatus.Accepteret);
        return NoContent();
    }

    // PATCH /api/bookings/5/afvis -> use case "Betjen tur" (chaufføren afviser)
    [HttpPatch("{id}/afvis")]
    public IActionResult AfvisBooking(int id)
    {
        var lykkedes = _bookingRepository.OpdaterStatus(id, BookingStatus.Afvist);
        if (!lykkedes) return NotFound();

        return NoContent();
    }
}
