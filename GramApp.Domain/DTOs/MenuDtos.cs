using System.ComponentModel.DataAnnotations;

namespace GramApp.Domain.DTOs;

public class MenuGroupDto
{
    public int Id { get; set; }
    [Required, MaxLength(100)] public string Name { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class MenuDto
{
    public int Id { get; set; }
    [Range(1, int.MaxValue)] public int MenuGroupId { get; set; }
    public string MenuGroupName { get; set; } = string.Empty;
    [Required, MaxLength(100)] public string Name { get; set; } = string.Empty;
    [Required, MaxLength(50), RegularExpression("^[A-Za-z][A-Za-z0-9]*$")]
    public string Code { get; set; } = string.Empty;
    [MaxLength(30)] public string? Icon { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class MenuAccessDto
{
    public int Id { get; set; }
    [Required, MaxLength(100)] public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public List<int> MenuIds { get; set; } = new();
}

public class NavigationMenuDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public int SortOrder { get; set; }
    public int MenuGroupId { get; set; }
    public string MenuGroupName { get; set; } = string.Empty;
    public int MenuGroupSortOrder { get; set; }
}
