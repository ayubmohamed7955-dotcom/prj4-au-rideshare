using AuRideShare.Api.Models;
using AuRideShare.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace AuRideShare.Api.Services;

public interface IBookingRepository
{
    IEnumerable<Booking> HentAlle();
    Booking? HentPaaId(int id);
    bool HarAktivBooking(int turId, int passagerId);
    Booking Opret(Booking booking);
    bool OpdaterStatus(int id, BookingStatus nyStatus);
}

public class EfBookingRepository : IBookingRepository
{
    private readonly RideShareDbContext _db;

    public EfBookingRepository(RideShareDbContext db) => _db = db;

    public IEnumerable<Booking> HentAlle() => _db.Bookinger.AsNoTracking().ToList();

    public Booking? HentPaaId(int id) => _db.Bookinger.Find(id);
    
    public bool HarAktivBooking(int turId, int passagerId) =>
    _db.Bookinger.Any(b => b.TurId == turId
        && b.PassagerId == passagerId
        && b.Status != BookingStatus.Afvist);

    public Booking Opret(Booking booking)
    {
        _db.Bookinger.Add(booking);
        _db.SaveChanges();
        return booking;
    }

    public bool OpdaterStatus(int id, BookingStatus nyStatus)
    {
        var booking = _db.Bookinger.Find(id);
        if (booking is null) return false;

        booking.Status = nyStatus;
        _db.SaveChanges();
        return true;
    }
}
