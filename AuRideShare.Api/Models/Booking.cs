namespace AuRideShare.Api.Models;

public enum BookingStatus
{
    Afventer,
    Accepteret,
    Afvist
}

/// En passagers booking på en tur.
public class Booking
{
    public int Id { get; set; }
    public int TurId { get; set; }
    public int PassagerId { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Afventer;
}

public class OpretBookingRequest
{
    public int TurId { get; set; }
    public int PassagerId { get; set; }
}
