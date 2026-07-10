using Microsoft.AspNetCore.Identity;

namespace GramApp.Domain.Models;

public class ApplicationUser : IdentityUser
{
    public int CompanyId { get; set; }
    public Company? Company { get; set; }
    public bool IsSuperAdmin { get; set; }
}
