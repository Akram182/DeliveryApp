using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeliveryBackend.Migrations
{
    /// <inheritdoc />
    public partial class CourierFeatures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsAvailable",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "CourierEarnings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CourierId = table.Column<Guid>(type: "uuid", nullable: false),
                    OrderId = table.Column<Guid>(type: "uuid", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourierEarnings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourierEarnings_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CourierEarnings_Users_CourierId",
                        column: x => x.CourierId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CourierEarnings_CourierId",
                table: "CourierEarnings",
                column: "CourierId");

            migrationBuilder.CreateIndex(
                name: "IX_CourierEarnings_OrderId",
                table: "CourierEarnings",
                column: "OrderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CourierEarnings");

            migrationBuilder.DropColumn(
                name: "IsAvailable",
                table: "Users");
        }
    }
}
