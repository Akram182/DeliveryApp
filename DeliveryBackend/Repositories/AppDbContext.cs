using DeliveryBackend.Repositories.Models;
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
                entity.HasKey(o =>o.Id);
                entity.Property(o => o.Status).IsRequired().HasMaxLength(50);
                entity.Property(o => o.PickupAddress).IsRequired().HasMaxLength(200);
                entity.Property(o => o.DeliveryAddress).IsRequired().HasMaxLength(200);
                entity.Property(o => o.TotalAmount).IsRequired();
                entity.Property(o => o.DeliveryFee).IsRequired();

                entity.HasOne(o => o)


            }); 

        }
    }
}




