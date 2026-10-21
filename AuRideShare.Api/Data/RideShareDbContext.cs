using AuRideShare.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AuRideShare.Api.Data;

public class RideShareDbContext : DbContext
{
    public RideShareDbContext(DbContextOptions<RideShareDbContext> options)
        : base(options)
    {
    }

    public DbSet<Bruger> Brugere => Set<Bruger>();
    public DbSet<Tur> Ture => Set<Tur>();
    public DbSet<Booking> Bookinger => Set<Booking>();
}
