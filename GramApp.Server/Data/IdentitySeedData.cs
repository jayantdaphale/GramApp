using GramApp.Domain.Models;
using Microsoft.AspNetCore.Identity;

namespace GramApp.Server.Data;

public static class IdentitySeedData
{
    public static async Task SeedAsync(IServiceProvider services, IConfiguration configuration)
    {
        var context = services.GetRequiredService<GramApp.Domain.Data.ApplicationDbContext>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

        await context.Database.EnsureCreatedAsync();

        await SeedMenusAsync(context);

        if (!context.Companies.Any())
        {
            var company = new Company
            {
                Name = "Super Company",
                Description = "Seed company for Gram Panchayat Karyalay Management",
                Location = "Head Office",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                IsActive = true
            };

            context.Companies.Add(company);
            await context.SaveChangesAsync();

            var seedPassword = configuration["SeedAdmin:Password"];
            if (string.IsNullOrWhiteSpace(seedPassword))
            {
                return;
            }

            var superAdmin = new ApplicationUser
            {
                UserName = "superadmin@gramapp.com",
                Email = "superadmin@gramapp.com",
                CompanyId = company.Id,
                IsSuperAdmin = true,
                EmailConfirmed = true
            };

            var createResult = await userManager.CreateAsync(superAdmin, seedPassword);
            if (createResult.Succeeded)
            {
                await roleManager.CreateAsync(new IdentityRole("SuperAdmin"));
                await userManager.AddToRoleAsync(superAdmin, "SuperAdmin");
            }
        }
    }

    private static async Task SeedMenusAsync(GramApp.Domain.Data.ApplicationDbContext context)
    {
        if (context.MenuGroups.Any()) return;

        var general = new MenuGroup { Name = "General", SortOrder = 1, IsActive = true };
        var administration = new MenuGroup { Name = "Administration", SortOrder = 2, IsActive = true };
        context.MenuGroups.AddRange(general, administration);
        context.Menus.AddRange(
            new Menu { MenuGroup = general, Name = "Dashboard", Code = "Dashboard", Icon = "🏠", SortOrder = 1, IsActive = true },
            new Menu { MenuGroup = administration, Name = "Companies", Code = "Companies", Icon = "🏢", SortOrder = 1, IsActive = true },
            new Menu { MenuGroup = administration, Name = "Users", Code = "Users", Icon = "👥", SortOrder = 2, IsActive = true },
            new Menu { MenuGroup = administration, Name = "Menu Groups", Code = "MenuGroups", Icon = "🗂️", SortOrder = 3, IsActive = true },
            new Menu { MenuGroup = administration, Name = "Menus", Code = "Menus", Icon = "📋", SortOrder = 4, IsActive = true },
            new Menu { MenuGroup = administration, Name = "Menu Access", Code = "MenuAccess", Icon = "🔐", SortOrder = 5, IsActive = true });
        await context.SaveChangesAsync();
    }
}
