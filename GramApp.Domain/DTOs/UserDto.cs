using System;

namespace GramApp.Domain.DTOs;

public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public int? MenuAccessId { get; set; }
    public string? MenuAccessName { get; set; }
    public bool IsSuperAdmin { get; set; }
}
