using AuRideShare.Api.Models;

namespace AuRideShare.Api.Services;

public interface IBookingRepository
{
    IEnumerable<Booking> HentAlle();
    Booking? HentPaaId(int id);
    Booking Opret(Booking booking);
    bool OpdaterStatus(int id, BookingStatus nyStatus);
}

public class InMemoryBookingRepository : IBookingRepository
{
    private readonly List<Booking> _bookinger = new();
    private int _naesteId = 1;

    public IEnumerable<Booking> HentAlle() => _bookinger;

    public Booking? HentPaaId(int id) =>
        _bookinger.FirstOrDefault(b => b.Id == id);

    public Booking Opret(Booking booking)
    {
        booking.Id = _naesteId++;
        _bookinger.Add(booking);
        return booking;
    }

    public bool OpdaterStatus(int id, BookingStatus nyStatus)
    {
        var booking = HentPaaId(id);
        if (booking is null) return false;

        booking.Status = nyStatus;
        return true;
    }
}
