namespace GramApp.Domain.Models;

public class MenuGroup
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public ICollection<Menu> Menus { get; set; } = new List<Menu>();
}
