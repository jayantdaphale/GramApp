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
}
