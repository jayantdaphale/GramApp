using System.ComponentModel.DataAnnotations;

namespace GramApp.Domain.DTOs;

public class UpdateUserDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public int CompanyId { get; set; }

    public bool IsSuperAdmin { get; set; }
}
