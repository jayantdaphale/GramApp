using System.ComponentModel.DataAnnotations;

namespace GramApp.Domain.DTOs;

public class RegisterUserDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    [Required]
    public int CompanyId { get; set; }
}
