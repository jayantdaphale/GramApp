using GramApp.Domain.Interface;

namespace GramApp.Domain.Services;

public class MenuAccessService : IMenuAccessService
{
    public IReadOnlyList<string> GetAllowedMenus(bool isSuperAdmin, IEnumerable<string>? roles = null)
    {
        if (isSuperAdmin)
        {
            return new[] { "Dashboard", "Companies", "Users", "Reports", "Settings" };
        }

        return Array.Empty<string>();
    }
}
