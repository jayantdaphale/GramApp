namespace GramApp.Domain.Models;

public class MenuAccessMenu
{
    public int MenuAccessId { get; set; }
    public int MenuId { get; set; }
    public MenuAccess? MenuAccess { get; set; }
    public Menu? Menu { get; set; }
}
