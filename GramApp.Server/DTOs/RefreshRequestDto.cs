using System.ComponentModel.DataAnnotations;

namespace GramApp.Server.DTOs;

public class RefreshRequestDto
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}
