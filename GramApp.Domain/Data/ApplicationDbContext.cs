using GramApp.Domain.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GramApp.Domain.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Company> Companies => Set<Company>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<MenuGroup> MenuGroups => Set<MenuGroup>();
    public DbSet<Menu> Menus => Set<Menu>();
    public DbSet<MenuAccess> MenuAccesses => Set<MenuAccess>();
    public DbSet<MenuAccessMenu> MenuAccessMenus => Set<MenuAccessMenu>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Company>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(150);
            entity.Property(x => x.Description).HasMaxLength(500);
            entity.Property(x => x.Location).HasMaxLength(250);
        });

        builder.Entity<ApplicationUser>(entity =>
        {
            entity.HasOne(x => x.Company)
                .WithMany(x => x.Users)
                .HasForeignKey(x => x.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.MenuAccess)
                .WithMany(x => x.Users)
                .HasForeignKey(x => x.MenuAccessId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<MenuGroup>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(100);
            entity.HasIndex(x => x.Name).IsUnique();
        });

        builder.Entity<Menu>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(100);
            entity.Property(x => x.Code).IsRequired().HasMaxLength(50);
            entity.Property(x => x.Icon).HasMaxLength(30);
            entity.HasIndex(x => x.Code).IsUnique();
            entity.HasOne(x => x.MenuGroup)
                .WithMany(x => x.Menus)
                .HasForeignKey(x => x.MenuGroupId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<MenuAccess>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(100);
            entity.HasIndex(x => x.Name).IsUnique();
        });

        builder.Entity<MenuAccessMenu>(entity =>
        {
            entity.HasKey(x => new { x.MenuAccessId, x.MenuId });
            entity.HasOne(x => x.MenuAccess)
                .WithMany(x => x.MenuAccessMenus)
                .HasForeignKey(x => x.MenuAccessId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(x => x.Menu)
                .WithMany(x => x.MenuAccessMenus)
                .HasForeignKey(x => x.MenuId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
