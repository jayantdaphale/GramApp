namespace GramApp.Domain.Interface;

public interface IMenuAccessService
{
    IReadOnlyList<string> GetAllowedMenus(bool isSuperAdmin, IEnumerable<string>? roles = null);
}
