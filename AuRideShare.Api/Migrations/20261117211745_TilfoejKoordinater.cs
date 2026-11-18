using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuRideShare.Api.Migrations
{
    /// <inheritdoc />
    public partial class TilfoejKoordinater : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "SlutBredde",
                table: "Ture",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "SlutLaengde",
                table: "Ture",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "StartBredde",
                table: "Ture",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "StartLaengde",
                table: "Ture",
                type: "double precision",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SlutBredde",
                table: "Ture");

            migrationBuilder.DropColumn(
                name: "SlutLaengde",
                table: "Ture");

            migrationBuilder.DropColumn(
                name: "StartBredde",
                table: "Ture");

            migrationBuilder.DropColumn(
                name: "StartLaengde",
                table: "Ture");
        }
    }
}
