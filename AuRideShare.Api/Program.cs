using AuRideShare.Api.Data;
using AuRideShare.Api.Models;
using AuRideShare.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var databaseConnectionString = GetDatabaseConnectionString(
    builder.Configuration.GetConnectionString("RideShare"));

builder.Services.AddScoped<IPasswordHasher<Bruger>, PasswordHasher<Bruger>>();

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("Jwt:Key mangler i konfigurationen.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });
builder.Services.AddAuthorization();

builder.Services.AddDbContext<RideShareDbContext>(options =>
    options.UseNpgsql(databaseConnectionString));

builder.Services.AddScoped<IBrugerRepository, EfBrugerRepository>();
builder.Services.AddScoped<ITurRepository, EfTurRepository>();
builder.Services.AddScoped<IBookingRepository, EfBookingRepository>();

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
    db.Database.Migrate();
}

app.UseCors("TillladFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

static string GetDatabaseConnectionString(string? configuredConnectionString)
{
    if (string.IsNullOrWhiteSpace(configuredConnectionString))
    {
        throw new InvalidOperationException(
            "ConnectionStrings:RideShare mangler i konfigurationen.");
    }

    if (!Uri.TryCreate(configuredConnectionString, UriKind.Absolute, out var databaseUri)
        || (databaseUri.Scheme != "postgres" && databaseUri.Scheme != "postgresql"))
    {
        return configuredConnectionString;
    }

    var userInfo = databaseUri.UserInfo.Split(':', 2);
    if (userInfo.Length != 2)
    {
        throw new InvalidOperationException(
            "ConnectionStrings:RideShare har et ugyldigt PostgreSQL-URL-format.");
    }

    var connectionStringBuilder = new NpgsqlConnectionStringBuilder
    {
        Host = databaseUri.Host,
        Port = databaseUri.Port > 0 ? databaseUri.Port : 5432,
        Database = databaseUri.AbsolutePath.TrimStart('/'),
        Username = Uri.UnescapeDataString(userInfo[0]),
        Password = Uri.UnescapeDataString(userInfo[1]),
        SslMode = SslMode.Require
    };

    return connectionStringBuilder.ConnectionString;
}
