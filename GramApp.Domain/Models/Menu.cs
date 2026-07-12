namespace GramApp.Domain.Models;

public class Menu
{
    public int Id { get; set; }
    public int MenuGroupId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public MenuGroup? MenuGroup { get; set; }
    public ICollection<MenuAccessMenu> MenuAccessMenus { get; set; } = new List<MenuAccessMenu>();
}
