using System.ComponentModel.DataAnnotations;

namespace GramApp.Domain.DTOs;

public class CreateCompanyDto
{
    [Required]
    [StringLength(150)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [StringLength(250)]
    public string? Location { get; set; }
}
