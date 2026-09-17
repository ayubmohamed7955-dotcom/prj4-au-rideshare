namespace AuRideShare.Api.Models;

public enum BookingStatus
{
    Afventer,
    Accepteret,
    Afvist
}

/// <summary>
/// En passagers anmodning om et sæde på en given tur ("Book tur").
/// Status håndteres af chaufføren via "Betjen tur".
/// </summary>
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
