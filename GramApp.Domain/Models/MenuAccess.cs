namespace GramApp.Domain.Models;

public class MenuAccess
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public ICollection<MenuAccessMenu> MenuAccessMenus { get; set; } = new List<MenuAccessMenu>();
    public ICollection<ApplicationUser> Users { get; set; } = new List<ApplicationUser>();
}
