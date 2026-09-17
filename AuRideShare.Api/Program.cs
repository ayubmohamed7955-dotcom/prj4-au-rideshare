using AuRideShare.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// --- Services ---
builder.Services.AddControllers();

// In-memory "database" for nu. Registreres som Singleton, så data bevares
// mellem requests (men forsvinder når serveren genstartes).
// Når I senere skifter til en rigtig database, er det KUN denne linje
// (og selve klassen bag den) I skal skifte ud - controllerne rører I ikke.
builder.Services.AddSingleton<IBrugerRepository, InMemoryBrugerRepository>();
builder.Services.AddSingleton<ITurRepository, InMemoryTurRepository>();
builder.Services.AddSingleton<IBookingRepository, InMemoryBookingRepository>();

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

// --- Middleware-pipeline ---
app.UseCors("TillladFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
