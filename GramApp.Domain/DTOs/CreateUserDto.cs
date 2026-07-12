using System.ComponentModel.DataAnnotations;

namespace GramApp.Domain.DTOs;

public class CreateUserDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    [Required]
    public int CompanyId { get; set; }

    public int? MenuAccessId { get; set; }

    public bool IsSuperAdmin { get; set; }
}
