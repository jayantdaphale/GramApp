namespace GramApp.Domain.Helpers;

public static class MenuAccessHelper
{
    public static IReadOnlyList<string> GetAllowedMenus(bool isSuperAdmin)
    {
        if (isSuperAdmin)
        {
            return new[]
            {
                "Dashboard",
                "Companies",
                "Users",
                "Reports",
                "Settings"
            };
        }

        return Array.Empty<string>();
    }
}
