using AuRideShare.Api.Data;
using AuRideShare.Api.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --- Services ---
builder.Services.AddControllers();

builder.Services.AddDbContext<RideShareDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("RideShare")));

builder.Services.AddScoped<IBrugerRepository, EfBrugerRepository>();
builder.Services.AddScoped<ITurRepository, EfTurRepository>();
builder.Services.AddScoped<IBookingRepository, EfBookingRepository>();

// CORS: tillader frontend (React, som typisk kører på en anden port under
// udvikling) at kalde API'et. Stram gerne origin-listen til senere.
builder.Services.AddCors(options =>
{
    options.AddPolicy("TillladFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<RideShareDbContext>();
    db.Database.EnsureCreated();
}

// --- Middleware-pipeline ---
app.UseCors("TillladFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
