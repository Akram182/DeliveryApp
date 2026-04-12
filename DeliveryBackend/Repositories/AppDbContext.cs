using DeliveryBackend.Repositories.Models;
using Microsoft.AspNetCore.Mvc.RazorPages.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace DeliveryBackend.Repositories
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Email).HasMaxLength(254).IsUnicode().IsRequired();
                entity.Property(u => u.PasswordHash).IsRequired();
                entity.Property(u => u.Role).IsRequired();
                entity.Property(u => u.FirstName).HasMaxLength(100);
                entity.Property(u => u.LastName).HasMaxLength(100);
                entity.Property(u => u.Balance);
                entity.Property(u => u.Created_At);
            });

            modelBuilder.Entity<Address>(entity =>
            {
                entity.HasKey(a => a.Id);
                entity.Property(a => a.City).HasMaxLength(100);
                entity.Property(a => a.Street).HasMaxLength(50);
                entity.Property(a => a.Building).HasMaxLength(10);
                entity.Property(a => a.Apartament).HasMaxLength(5);
                entity.Property(a => a.Comment).HasMaxLength(300);
                entity.Property(a => a.LeaveAtDoor);

                entity.HasOne(a => a.User)
                .WithMany(u => u.Addresses)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(o => o.Id);
                entity.Property(o => o.Status).IsRequired().HasMaxLength(50);
                entity.Property(o => o.TotalAmount).IsRequired();
                entity.Property(o => o.DeliveryFee).IsRequired();
                entity.Property(o => o.CreatedAt).IsRequired();
                entity.Property(o => o.DeliveredAt);



                

                entity.HasOne(o => o.PickupAddress)
                .WithMany(a => a.PickUpOrders)
                .HasForeignKey(o => o.PickupAddressId)
                .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(o => o.DeliveryAddress)
                .WithMany(a => a.DeliveryOrders)
                .HasForeignKey(o => o.DeliveryAddressId)
                .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(o => o.Customer)
                .WithMany(c => c.OrdersAsCustomer)
                .HasForeignKey(o => o.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(o => o.Courier)
                .WithMany(c => c.OrdersAsCourier)
                .HasForeignKey(o => o.CourierId)
                .OnDelete(DeleteBehavior.Cascade);

            });

            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(ot => ot.Id);
                entity.Property(ot => ot.Quantity).HasMaxLength(6).IsRequired();
                entity.Property(ot => ot.CurrentPrice).IsRequired();

                entity.HasOne(ot => ot.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(ot => ot.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(ot => ot.Product)
                .WithMany(p => p.Items)
                .HasForeignKey(ot => ot.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Name).HasMaxLength(20).IsRequired();
                entity.Property(p => p.Price).HasMaxLength(25).IsRequired();
                entity.Property(p => p.Stock).HasMaxLength(6).IsRequired();
                entity.Property(p => p.IsActive).IsRequired();
                entity.Property(p => p.ImageUrl).IsRequired();

                entity.HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}




